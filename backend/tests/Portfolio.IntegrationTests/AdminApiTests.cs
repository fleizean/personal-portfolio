using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Portfolio.IntegrationTests;

public class AdminApiTests(ApiFactory factory)
{
    private static CancellationToken Token => TestContext.Current.CancellationToken;

    private static object NewProject(string name, string? githubUrl = null) => new
    {
        id = 0,
        name,
        year = "2026",
        status = "development",
        techStack = new[] { "Angular", ".NET" },
        githubUrl,
        liveUrl = (string?)null,
        image = (string?)null,
        current = true,
        tr = new { description = "Türkçe açıklama" },
        en = new { description = "English description" },
    };

    private static async Task<JsonElement> ErrorOf(HttpResponseMessage response) =>
        (await response.Content.ReadFromJsonAsync<JsonElement>(Token)).GetProperty("error");

    [Fact]
    public async Task Admin_endpoints_require_login()
    {
        var response = await factory.CreateClient().GetAsync("/api/admin/projects", Token);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("UNAUTHORIZED", (await ErrorOf(response)).GetProperty("code").GetString());
    }

    [Fact]
    public async Task Other_github_accounts_are_forbidden()
    {
        var response = await factory.CreateClientAs("999").GetAsync("/api/admin/projects", Token);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Writes_without_the_admin_header_are_rejected()
    {
        var client = factory.CreateClientAs(ApiFactory.AdminId, withAdminHeader: false);

        var response = await client.PostAsJsonAsync("/api/admin/projects", NewProject("Csrf"), Token);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Created_project_shows_up_on_the_site_immediately_and_can_be_deleted()
    {
        var site = factory.CreateClient();
        var admin = factory.CreateClientAs(ApiFactory.AdminId);
        // İçerik önbelleğe girsin
        var before = await site.GetFromJsonAsync<JsonElement>("/api/content/en", Token);

        var created = await admin.PostAsJsonAsync("/api/admin/projects", NewProject("Admin Panel", "https://github.com/fleizean"), Token);
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var id = (await created.Content.ReadFromJsonAsync<JsonElement>(Token)).GetProperty("id").GetInt64();

        var after = await site.GetFromJsonAsync<JsonElement>("/api/content/en", Token);
        Assert.Equal(before.GetProperty("projects").GetArrayLength() + 1, after.GetProperty("projects").GetArrayLength());
        var last = after.GetProperty("projects").EnumerateArray().Last();
        Assert.Equal("Admin Panel", last.GetProperty("name").GetString());
        Assert.Equal("English description", last.GetProperty("description").GetString());

        var deleted = await admin.DeleteAsync($"/api/admin/projects/{id}", Token);
        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        var final = await site.GetFromJsonAsync<JsonElement>("/api/content/en", Token);
        Assert.Equal(before.GetProperty("projects").GetArrayLength(), final.GetProperty("projects").GetArrayLength());
    }

    [Fact]
    public async Task Rejects_script_urls_and_missing_fields()
    {
        var admin = factory.CreateClientAs(ApiFactory.AdminId);

        var response = await admin.PostAsJsonAsync("/api/admin/projects", NewProject(" ", "javascript:alert(1)"), Token);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var fields = (await ErrorOf(response)).GetProperty("fields");
        Assert.Equal("INVALID_URL", fields.GetProperty("githubUrl").GetString());
        Assert.Equal("REQUIRED", fields.GetProperty("name").GetString());
    }

    [Fact]
    public async Task Reorder_must_list_every_item_once()
    {
        var admin = factory.CreateClientAs(ApiFactory.AdminId);
        var items = await admin.GetFromJsonAsync<JsonElement>("/api/admin/technologies", Token);
        var ids = items.EnumerateArray().Select(i => i.GetProperty("id").GetInt64()).ToList();

        var partial = await admin.PutAsJsonAsync("/api/admin/technologies/order", new { ids = ids.Skip(1) }, Token);
        Assert.Equal(HttpStatusCode.BadRequest, partial.StatusCode);

        ids.Reverse();
        var reversed = await admin.PutAsJsonAsync("/api/admin/technologies/order", new { ids }, Token);
        Assert.Equal(HttpStatusCode.NoContent, reversed.StatusCode);
        var reordered = await admin.GetFromJsonAsync<JsonElement>("/api/admin/technologies", Token);
        Assert.Equal(ids[0], reordered[0].GetProperty("id").GetInt64());

        ids.Reverse();
        await admin.PutAsJsonAsync("/api/admin/technologies/order", new { ids }, Token);
    }

    [Fact]
    public async Task Profile_round_trips()
    {
        var admin = factory.CreateClientAs(ApiFactory.AdminId);
        var profile = await admin.GetFromJsonAsync<JsonElement>("/api/admin/profile", Token);
        Assert.Equal("Merhaba, ben Enes.", profile.GetProperty("tr").GetProperty("greeting").GetString());

        var response = await admin.PutAsJsonAsync("/api/admin/profile", profile, Token);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Uploads_accept_real_images_only()
    {
        var admin = factory.CreateClientAs(ApiFactory.AdminId);
        byte[] png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0x0D, 0x49, 0x48, 0x44, 0x52];

        using var image = new MultipartFormDataContent { { new ByteArrayContent(png), "file", "x.png" } };
        var uploaded = await admin.PostAsync("/api/admin/uploads", image, Token);
        Assert.Equal(HttpStatusCode.Created, uploaded.StatusCode);
        var path = (await uploaded.Content.ReadFromJsonAsync<JsonElement>(Token)).GetProperty("path").GetString();
        Assert.Matches("^/api/uploads/[0-9a-f]{32}\\.png$", path);
        var served = await factory.CreateClient().GetAsync(path, Token);
        Assert.Equal(HttpStatusCode.OK, served.StatusCode);
        Assert.Equal("image/png", served.Content.Headers.ContentType?.MediaType);

        var svg = new ByteArrayContent("<svg onload=alert(1)></svg>"u8.ToArray());
        svg.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        using var fake = new MultipartFormDataContent { { svg, "file", "evil.png" } };
        var rejected = await admin.PostAsync("/api/admin/uploads", fake, Token);
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        Assert.Equal("TYPE_NOT_ALLOWED", (await ErrorOf(rejected)).GetProperty("fields").GetProperty("file").GetString());
    }

    [Fact]
    public async Task Tracks_accept_youtube_links_and_reach_the_site()
    {
        var admin = factory.CreateClientAs(ApiFactory.AdminId);
        var link = "https://www.youtube.com/watch?v=NQCUZTCRgsM&list=RD3-yphcPu3WE&index=4";

        var created = await admin.PostAsJsonAsync("/api/admin/tracks", new { id = 0, title = "Test", artist = "Tester", youtube = link }, Token);
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var id = (await created.Content.ReadFromJsonAsync<JsonElement>(Token)).GetProperty("id").GetInt64();

        var content = await factory.CreateClient().GetFromJsonAsync<JsonElement>("/api/content/tr", Token);
        var track = content.GetProperty("tracks").EnumerateArray().Last();
        Assert.Equal("NQCUZTCRgsM", track.GetProperty("videoId").GetString());

        var invalid = await admin.PostAsJsonAsync("/api/admin/tracks", new { id = 0, title = "x", artist = "y", youtube = "https://evil.example/watch?v=NQCUZTCRgsM" }, Token);
        Assert.Equal("INVALID_YOUTUBE", (await ErrorOf(invalid)).GetProperty("fields").GetProperty("youtube").GetString());

        await admin.DeleteAsync($"/api/admin/tracks/{id}", Token);
    }

    [Fact]
    public async Task Login_reports_when_github_is_not_configured()
    {
        var client = factory.CreateClient();

        var status = await client.GetFromJsonAsync<JsonElement>("/api/auth/status", Token);
        Assert.False(status.GetProperty("loginAvailable").GetBoolean());

        var login = await client.GetAsync("/api/auth/login", Token);
        Assert.Equal(HttpStatusCode.ServiceUnavailable, login.StatusCode);
        Assert.Equal("NOT_CONFIGURED", (await ErrorOf(login)).GetProperty("code").GetString());
    }
}
