using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Persistence.Context;

namespace Portfolio.WebAPI.Controllers;

[ApiController]
[Route("api/health")]
[DisableRateLimiting]
public sealed class HealthController(PortfolioDbContext db) : ControllerBase
{
    /// <summary>Container sağlık kontrolü: uygulama ayakta ve veritabanına ulaşabiliyor mu</summary>
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken) =>
        await db.Database.CanConnectAsync(cancellationToken)
            ? Ok(new { status = "ok" })
            : StatusCode(StatusCodes.Status503ServiceUnavailable, new { status = "database_unavailable" });
}
