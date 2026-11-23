using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Repositories;
using Portfolio.Application.Services;
using Portfolio.Persistence.Context;
using Portfolio.Persistence.Repositories;
using Portfolio.Persistence.Seed;
using Portfolio.Persistence.Services;

namespace Portfolio.Persistence;

public static class ServiceRegistration
{
    public static void ConfigureDbContext(DbContextOptionsBuilder options, string connectionString) =>
        options
            .UseNpgsql(connectionString, npgsql => npgsql.MigrationsHistoryTable("__ef_migrations_history"))
            .UseSnakeCaseNamingConvention();

    public static IServiceCollection AddPersistence(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<PortfolioDbContext>(options => ConfigureDbContext(options, connectionString));

        // Varlık başına repository sınıfı yerine açık generic kayıt
        services.AddScoped(typeof(IReadRepository<>), typeof(ReadRepository<>));
        services.AddScoped(typeof(IWriteRepository<>), typeof(WriteRepository<>));

        services.AddScoped<IContentService, ContentService>();
        services.AddScoped<ContentSeeder>();
        return services;
    }

    /// <summary>Bekleyen migration'ları uygular ve gerekirse içeriği yükler</summary>
    public static async Task InitializeDatabaseAsync(
        this IServiceProvider services,
        bool migrate,
        bool seed,
        CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        if (migrate)
        {
            await scope.ServiceProvider.GetRequiredService<PortfolioDbContext>().Database.MigrateAsync(cancellationToken);
        }
        if (seed)
        {
            await scope.ServiceProvider.GetRequiredService<ContentSeeder>().SeedAsync(cancellationToken);
        }
    }
}
