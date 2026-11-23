using Portfolio.Infrastructure;
using Portfolio.Persistence;
using Portfolio.WebAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Bağlantı cümlesi yalnızca ortam değişkeninden gelir (ConnectionStrings__Default); repoda yer almaz
var connectionString = builder.Configuration.GetConnectionString("Default");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("ConnectionStrings__Default environment variable is not set.");
}

builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
    options.Limits.MaxRequestBodySize = 1 * 1024 * 1024;
});

builder.Services.AddPersistence(connectionString);
builder.Services.AddInfrastructure();
builder.Services.AddPlatform();
builder.Services.AddControllers()
    .AddJsonOptions(options => PlatformExtensions.ConfigureJson(options.JsonSerializerOptions))
    .AddErrorEnvelope();

var app = builder.Build();

await app.Services.InitializeDatabaseAsync(
    migrate: builder.Configuration.GetValue("MIGRATE_ON_STARTUP", true),
    seed: builder.Configuration.GetValue("SEED_ON_STARTUP", true));

app.UseForwardedHeaders();
app.UseSecurityHeaders();
app.UseErrorEnvelope();
app.UseRateLimiter();
app.UseOutputCache();
app.MapControllers();

app.Run();

/// <summary>Entegrasyon testlerinde WebApplicationFactory için</summary>
public partial class Program;
