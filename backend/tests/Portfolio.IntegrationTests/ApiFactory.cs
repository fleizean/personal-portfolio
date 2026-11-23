using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Testcontainers.PostgreSql;

[assembly: AssemblyFixture(typeof(Portfolio.IntegrationTests.ApiFactory))]

namespace Portfolio.IntegrationTests;

/// <summary>
/// Gerçek bir PostgreSQL 19 container'ı açar; API ilk istekte migration ve seed'i
/// kendisi çalıştırır. Tüm test sınıfları aynı örneği paylaşır.
/// </summary>
public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _database = new PostgreSqlBuilder("postgres:19-alpine").Build();

    public async ValueTask InitializeAsync()
    {
        await _database.StartAsync();
        // Program bağlantı cümlesini oluşturulurken okuduğu için ortam değişkeni olarak verilir
        Environment.SetEnvironmentVariable("ConnectionStrings__Default", _database.GetConnectionString());
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder) => builder.UseEnvironment("Testing");

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        await _database.DisposeAsync();
    }
}
