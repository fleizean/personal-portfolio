using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Portfolio.Application.Exceptions;

namespace Portfolio.WebAPI.Extensions;

public static class PlatformExtensions
{
    public const string ContentCachePolicy = "content";
    public const string ContentCacheTag = "content";

    /// <summary>X-Forwarded-* başlıklarına güvenilen ağlar: loopback, docker ve özel ağlar</summary>
    private static readonly string[] TrustedProxyNetworks =
        ["127.0.0.0/8", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "::1/128"];

    /// <summary>Enum'lar "production", "intra42" gibi küçük harfli metin olarak; boş alanlar hiç yazılmaz</summary>
    public static void ConfigureJson(JsonSerializerOptions options)
    {
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    }

    public static IServiceCollection AddPlatform(this IServiceCollection services)
    {
        services.ConfigureHttpJsonOptions(options => ConfigureJson(options.SerializerOptions));

        // Uygulama nginx'in arkasında çalışır. X-Forwarded-* başlıklarına yalnızca
        // yerel/özel ağlardan (host nginx, docker ağı) gelirse güvenilir; dışarıdan sahte IP verilemez.
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.ForwardLimit = 1;
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
            foreach (var network in TrustedProxyNetworks)
            {
                options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse(network));
            }
        });

        // İstemci IP'si başına dakikada 120 istek
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? IPAddress.None.ToString(),
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = 120, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
            options.OnRejected = async (context, cancellationToken) =>
                await context.HttpContext.Response.WriteAsJsonAsync(
                    new ErrorEnvelope(new ErrorBody(ErrorCodes.RateLimited, "Too many requests. Try again later.")),
                    cancellationToken);
        });

        // İçerik nadiren değişir: 5 dakika önbellek. Admin düzenlemeleri ileride bu etiketi temizleyecek.
        services.AddOutputCache(options =>
            options.AddPolicy(ContentCachePolicy, policy => policy
                .Expire(TimeSpan.FromMinutes(5))
                .SetVaryByRouteValue("lang")
                .Tag(ContentCacheTag)));

        return services;
    }

    /// <summary>API yanıtları tarayıcıda çalıştırılacak içerik değildir; buna göre başlıklar</summary>
    public static WebApplication UseSecurityHeaders(this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            var headers = context.Response.Headers;
            headers.XContentTypeOptions = "nosniff";
            headers.XFrameOptions = "DENY";
            headers["Referrer-Policy"] = "no-referrer";
            headers.ContentSecurityPolicy = "default-src 'none'; frame-ancestors 'none'";
            await next();
        });
        return app;
    }
}
