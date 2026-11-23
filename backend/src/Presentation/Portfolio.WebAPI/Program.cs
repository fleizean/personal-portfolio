using Microsoft.Extensions.FileProviders;
using Microsoft.Net.Http.Headers;
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

// Admin panelinden yüklenen görseller (prod'da docker volume)
var uploadsDirectory = Path.GetFullPath(builder.Configuration["UPLOADS_DIR"] ?? Path.Combine(AppContext.BaseDirectory, "uploads"));
Directory.CreateDirectory(uploadsDirectory);

builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
    options.Limits.MaxRequestBodySize = 1 * 1024 * 1024;
});

builder.Services.AddPersistence(connectionString);
builder.Services.AddInfrastructure(uploadsDirectory);
builder.Services.AddPlatform();
builder.Services.AddAdminAuthentication(builder.Configuration, builder.Environment);
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

// Yüklenen görseller: adları rastgele ve değişmez, uzun süre önbelleklenebilir
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsDirectory),
    RequestPath = "/api/uploads",
    ServeUnknownFileTypes = false,
    OnPrepareResponse = context =>
        context.Context.Response.Headers[HeaderNames.CacheControl] = "public, max-age=31536000, immutable",
});

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();
app.MapControllers();

app.Run();

/// <summary>Entegrasyon testlerinde WebApplicationFactory için</summary>
public partial class Program;
