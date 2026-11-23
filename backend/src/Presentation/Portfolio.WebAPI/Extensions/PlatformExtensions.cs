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

    private static readonly System.Net.IPNetwork[] InternalNetworks =
        [.. TrustedProxyNetworks.Select(System.Net.IPNetwork.Parse)];

    /// <summary>
    /// İstek docker ağı içinden mi geliyor (ör. SSR yapan web container'ı). nginx üzerinden gelen
    /// isteklerde UseForwardedHeaders sonrası RemoteIpAddress gerçek istemci IP'sidir; nginx bu IP'yi
    /// zincirin sonuna eklediği ve yalnızca son değer okunduğu için sahte başlıkla iç IP taklit edilemez.
    /// </summary>
    public static bool IsInternal(IPAddress? address) =>
        address is not null
        && InternalNetworks.Any(network => network.Contains(address.IsIPv4MappedToIPv6 ? address.MapToIPv4() : address));

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

        // İstemci IP'si başına dakikada 120 istek. SSR'ın iç istekleri tüm ziyaretçiler adına
        // geldiği için sınırlanmaz; yoksa yoğun bir dakikada site statik içeriğe düşerdi.
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                IsInternal(context.Connection.RemoteIpAddress)
                ? RateLimitPartition.GetNoLimiter("internal")
                : RateLimitPartition.GetFixedWindowLimiter(
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
