using System.Security.Claims;
using AspNet.Security.OAuth.GitHub;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Application.DTO.Admin;
using Portfolio.Application.Exceptions;
using Portfolio.WebAPI.Extensions;
using Portfolio.WebAPI.Filters;

namespace Portfolio.WebAPI.Controllers;

[ApiController]
[Route("api/auth")]
[EnableRateLimiting(AuthExtensions.AuthRateLimitPolicy)]
public sealed class AuthController(AdminAuthSettings settings) : ControllerBase
{
    /// <summary>Panelin giriş düğmesini gösterip göstermeyeceği</summary>
    [HttpGet("status")]
    public IActionResult Status() => Ok(new { loginAvailable = settings.LoginAvailable });

    /// <summary>GitHub'a yönlendirir; dönüşte /admin açılır (dönüş adresi sabit, dışarıdan verilemez)</summary>
    [HttpGet("login")]
    public IActionResult Login()
    {
        if (!settings.LoginAvailable)
        {
            throw new AppException(ErrorCodes.NotConfigured, "Admin login is not configured on this server.");
        }
        return Challenge(new AuthenticationProperties { RedirectUri = "/admin" }, GitHubAuthenticationDefaults.AuthenticationScheme);
    }

    [HttpGet("me")]
    [Authorize(Policy = AuthExtensions.AdminPolicy)]
    public AdminUser Me() => new(
        User.Identity?.Name ?? "admin",
        User.FindFirstValue(AuthExtensions.DisplayNameClaim),
        User.FindFirstValue(AuthExtensions.AvatarClaim));

    [HttpPost("logout")]
    [Authorize(Policy = AuthExtensions.AdminPolicy)]
    [AdminMutation]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(AuthExtensions.CookieScheme);
        return NoContent();
    }
}
