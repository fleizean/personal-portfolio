using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Portfolio.IntegrationTests;

public class ContentApiTests(ApiFactory factory)
{
    private readonly HttpClient _client = factory.CreateClient();
    private static CancellationToken Token => TestContext.Current.CancellationToken;

    private async Task<JsonElement> GetJsonAsync(string url, HttpStatusCode expected)
    {
        var response = await _client.GetAsync(url, Token);
        Assert.Equal(expected, response.StatusCode);
        return await response.Content.ReadFromJsonAsync<JsonElement>(Token);
    }

    [Fact]
    public async Task Returns_seeded_turkish_content()
    {
        var content = await GetJsonAsync("/api/content/tr", HttpStatusCode.OK);

        Assert.Equal("Merhaba, ben Enes.", content.GetProperty("profile").GetProperty("greeting").GetString());
        Assert.Equal(9, content.GetProperty("projects").GetArrayLength());
        Assert.Equal(10, content.GetProperty("journey").GetArrayLength());
        Assert.Equal(18, content.GetProperty("technologies").GetArrayLength());
        Assert.Equal(1, content.GetProperty("school").GetArrayLength());
    }

    [Fact]
    public async Task Returns_english_texts_with_the_same_language_independent_fields()
    {
        var tr = await GetJsonAsync("/api/content/tr", HttpStatusCode.OK);
        var en = await GetJsonAsync("/api/content/en", HttpStatusCode.OK);

        Assert.Equal("Hi, I'm Enes.", en.GetProperty("profile").GetProperty("greeting").GetString());
        var trProject = tr.GetProperty("projects")[0];
        var enProject = en.GetProperty("projects")[0];
        Assert.Equal(trProject.GetProperty("name").GetString(), enProject.GetProperty("name").GetString());
        Assert.NotEqual(trProject.GetProperty("description").GetString(), enProject.GetProperty("description").GetString());
    }

    [Fact]
    public async Task Serializes_enums_and_omits_nulls_like_the_frontend_model()
    {
        var content = await GetJsonAsync("/api/content/en", HttpStatusCode.OK);

        var project = content.GetProperty("projects")[0];
        Assert.Equal("production", project.GetProperty("status").GetString());
        Assert.True(project.GetProperty("current").GetBoolean());
        Assert.Contains(
            content.GetProperty("profile").GetProperty("socials").EnumerateArray(),
            s => s.GetProperty("kind").GetString() == "intra42");
        Assert.Contains(
            content.GetProperty("technologies").EnumerateArray(),
            t => t.GetProperty("category").GetString() == "devops");
        Assert.Contains(
            content.GetProperty("projects").EnumerateArray(),
            p => !p.TryGetProperty("liveUrl", out _));
    }

    [Fact]
    public async Task Rejects_unsupported_language_with_error_envelope()
    {
        var body = await GetJsonAsync("/api/content/de", HttpStatusCode.BadRequest);

        var error = body.GetProperty("error");
        Assert.Equal("VALIDATION_ERROR", error.GetProperty("code").GetString());
        Assert.Equal("UNSUPPORTED_LANGUAGE", error.GetProperty("fields").GetProperty("lang").GetString());
    }

    [Fact]
    public async Task Unknown_route_returns_not_found_envelope()
    {
        var body = await GetJsonAsync("/api/does-not-exist", HttpStatusCode.NotFound);

        Assert.Equal("NOT_FOUND", body.GetProperty("error").GetProperty("code").GetString());
    }

    [Fact]
    public async Task Health_reports_database_connectivity()
    {
        var body = await GetJsonAsync("/api/health", HttpStatusCode.OK);

        Assert.Equal("ok", body.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Sends_security_headers_and_hides_server_details()
    {
        var response = await _client.GetAsync("/api/content/tr", Token);

        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
        Assert.False(response.Headers.Contains("Server"));
    }
}
