using Portfolio.Application.DTO.Content;
using Portfolio.Domain.Enums;

namespace Portfolio.Application.Services;

public interface IContentService
{
    /// <summary>Sitenin bir dildeki tüm içeriği</summary>
    Task<PortfolioContentResponse> GetAsync(Language language, CancellationToken cancellationToken = default);
}
