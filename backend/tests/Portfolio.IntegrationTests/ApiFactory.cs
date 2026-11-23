using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;

[assembly: AssemblyFixture(typeof(Portfolio.IntegrationTests.ApiFactory))]
// Testler aynı veritabanını paylaşır; içerik sayımları admin testlerinin eklemeleriyle karışmasın
[assembly: CollectionBehavior(CollectionBehavior.CollectionPerAssembly)]

namespace Portfolio.IntegrationTests;

/// <summary>
/// Gerçek bir PostgreSQL 19 container'ı açar; API ilk istekte migration ve seed'i
/// kendisi çalıştırır. Tüm test sınıfları aynı örneği paylaşır.
/// </summary>
public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string AdminId = "424242";
    private readonly PostgreSqlContainer _database = new PostgreSqlBuilder("postgres:19-alpine").Build();
    private readonly string _uploads = Path.Combine(Path.GetTempPath(), $"portfolio-uploads-{Guid.NewGuid():N}");

    public async ValueTask InitializeAsync()
    {
        await _database.StartAsync();
        // Program yapılandırmayı oluşturulurken okuduğu için ortam değişkeni olarak verilir
        Environment.SetEnvironmentVariable("ConnectionStrings__Default", _database.GetConnectionString());
        Environment.SetEnvironmentVariable("ADMIN_GITHUB_ID", AdminId);
        Environment.SetEnvironmentVariable("UPLOADS_DIR", _uploads);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        // GitHub'a gidilemeyeceği için kimlik, test başlığından okunur
        builder.ConfigureTestServices(services =>
        {
            services.AddAuthentication().AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, _ => { });
            services.PostConfigure<AuthenticationOptions>(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                options.DefaultForbidScheme = TestAuthHandler.SchemeName;
            });
        });
    }

    /// <summary>Verilen GitHub kimliğiyle giriş yapmış bir istemci</summary>
    public HttpClient CreateClientAs(string gitHubId, bool withAdminHeader = true)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Add(TestAuthHandler.Header, gitHubId);
        if (withAdminHeader) client.DefaultRequestHeaders.Add("X-Portfolio-Admin", "1");
        return client;
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        await _database.DisposeAsync();
        if (Directory.Exists(_uploads)) Directory.Delete(_uploads, recursive: true);
    }
}

/// <summary>İstekteki X-Test-GitHub-Id başlığını giriş yapmış kullanıcı sayar</summary>
public sealed class TestAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "Test";
    public const string Header = "X-Test-GitHub-Id";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(Header, out var id))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }
        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, id.ToString()), new Claim(ClaimTypes.Name, "tester")],
            SchemeName);
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName)));
    }
}
