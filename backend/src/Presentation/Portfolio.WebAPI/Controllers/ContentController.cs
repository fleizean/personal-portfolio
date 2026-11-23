using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Portfolio.Application.DTO.Content;
using Portfolio.Application.Exceptions;
using Portfolio.Application.Services;
using Portfolio.Domain.Enums;
using Portfolio.WebAPI.Extensions;

namespace Portfolio.WebAPI.Controllers;

[ApiController]
[Route("api/content")]
public sealed class ContentController(IContentService contentService) : ControllerBase
{
    /// <summary>Sitenin bir dildeki tüm içeriği (frontend'in PortfolioContent modeli)</summary>
    [HttpGet("{lang}")]
    [OutputCache(PolicyName = PlatformExtensions.ContentCachePolicy)]
    [ProducesResponseType<PortfolioContentResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorEnvelope>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PortfolioContentResponse>> Get(string lang, CancellationToken cancellationToken)
    {
        if (!Languages.TryParse(lang, out var language))
        {
            throw AppException.Validation("lang", "UNSUPPORTED_LANGUAGE");
        }
        return await contentService.GetAsync(language, cancellationToken);
    }
}
