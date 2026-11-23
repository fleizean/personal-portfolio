using System.Security.Claims;
using System.Threading.RateLimiting;
using AspNet.Security.OAuth.GitHub;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;

namespace Portfolio.WebAPI.Extensions;

/// <summary>Giriş GitHub ile yapılır; yalnızca ADMIN_GITHUB_ID ile eşleşen hesap kabul edilir.</summary>
public sealed record AdminAuthSettings(string? AdminGitHubId, bool LoginAvailable);

public static class AuthExtensions
{
    public const string CookieScheme = "admin";
    public const string AdminPolicy = "admin";
    public const string AuthRateLimitPolicy = "auth";
    public const string AvatarClaim = "urn:github:avatar";
    public const string DisplayNameClaim = "urn:github:name";

    public static IServiceCollection AddAdminAuthentication(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        var adminId = configuration["ADMIN_GITHUB_ID"];
        var clientId = configuration["GITHUB_CLIENT_ID"];
        var clientSecret = configuration["GITHUB_CLIENT_SECRET"];
        var loginAvailable = !string.IsNullOrWhiteSpace(adminId)
            && !string.IsNullOrWhiteSpace(clientId)
            && !string.IsNullOrWhiteSpace(clientSecret);

        // Oturum çerezlerini imzalayan anahtarlar volume'da tutulur; yoksa her yeniden başlatmada
        // oturumlar düşer.
        var dataProtection = services.AddDataProtection().SetApplicationName("fleizean-portfolio");
        var keysDirectory = configuration["DATA_PROTECTION_DIR"];
        if (!string.IsNullOrWhiteSpace(keysDirectory))
        {
            dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keysDirectory));
        }

        var authentication = services.AddAuthentication(CookieScheme).AddCookie(CookieScheme, options =>
        {
            // __Host- öneki: yalnızca HTTPS, yalnızca bu alan adı, yol "/". Geliştirmede HTTP olduğu için öneksiz.
            options.Cookie.Name = environment.IsProduction() ? "__Host-portfolio-admin" : "portfolio-admin";
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = environment.IsProduction() ? CookieSecurePolicy.Always : CookieSecurePolicy.SameAsRequest;
            options.Cookie.SameSite = SameSiteMode.Strict;
            options.Cookie.Path = "/";
            options.ExpireTimeSpan = TimeSpan.FromHours(8);
            options.SlidingExpiration = true;
            // API'de yönlendirme yok: oturum yoksa 401, yetki yoksa 403
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };
            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        if (loginAvailable)
        {
            authentication.AddGitHub(options =>
            {
                options.ClientId = clientId!;
                options.ClientSecret = clientSecret!;
                options.CallbackPath = "/api/auth/github/callback";
                options.SignInScheme = CookieScheme;
                // Yalnızca herkese açık profil okunur; ek izin istenmez, erişim jetonu saklanmaz
                options.Scope.Clear();
                options.SaveTokens = false;
                options.ClaimActions.MapJsonKey(AvatarClaim, "avatar_url");
                options.Events.OnCreatingTicket = context =>
                {
                    if (context.Identity?.FindFirst(ClaimTypes.NameIdentifier)?.Value != adminId)
                    {
                        context.Fail("This GitHub account is not allowed.");
                    }
                    return Task.CompletedTask;
                };
                options.Events.OnRemoteFailure = context =>
                {
                    context.Response.Redirect("/admin?login=denied");
                    context.HandleResponse();
                    return Task.CompletedTask;
                };
            });
        }

        services.AddSingleton(new AdminAuthSettings(adminId, loginAvailable));

        // Çerez tek başına yetmez: kimlik yine ADMIN_GITHUB_ID ile karşılaştırılır.
        // ADMIN_GITHUB_ID tanımlı değilse kimse admin olamaz.
        services.AddAuthorizationBuilder().AddPolicy(AdminPolicy, policy => policy
            .RequireAuthenticatedUser()
            .RequireAssertion(context =>
                !string.IsNullOrWhiteSpace(adminId)
                && context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value == adminId));

        // Giriş uçlarına IP başına dakikada 10 istek
        services.Configure<Microsoft.AspNetCore.RateLimiting.RateLimiterOptions>(options =>
            options.AddPolicy(AuthRateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 })));

        return services;
    }
}
