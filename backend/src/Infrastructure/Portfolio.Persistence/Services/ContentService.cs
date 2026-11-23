using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTO.Content;
using Portfolio.Application.Exceptions;
using Portfolio.Application.Mappings;
using Portfolio.Application.Repositories;
using Portfolio.Application.Services;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;

namespace Portfolio.Persistence.Services;

public class ContentService(
    IReadRepository<Profile> profiles,
    IReadRepository<Project> projects,
    IReadRepository<JourneyEntry> journey,
    IReadRepository<Technology> technologies,
    IReadRepository<SchoolExperience> school,
    IReadRepository<MusicTrack> tracks) : IContentService
{
    public async Task<PortfolioContentResponse> GetAsync(Language language, CancellationToken cancellationToken = default)
    {
        // Sorgular aynı DbContext örneğini paylaştığı için sırayla çalışır
        var profile = await profiles.GetAll().FirstOrDefaultAsync(cancellationToken)
            ?? throw AppException.NotFound("Profile");
        var projectList = await projects.GetAll().OrderBy(p => p.SortOrder).ToListAsync(cancellationToken);
        var journeyList = await journey.GetAll().OrderBy(j => j.SortOrder).ToListAsync(cancellationToken);
        var techList = await technologies.GetAll().OrderBy(t => t.SortOrder).ToListAsync(cancellationToken);
        var schoolList = await school.GetAll().OrderBy(s => s.SortOrder).ToListAsync(cancellationToken);
        var trackList = await tracks.GetAll().OrderBy(t => t.SortOrder).ToListAsync(cancellationToken);

        return new PortfolioContentResponse(
            profile.ToResponse(language),
            [.. projectList.Select(p => p.ToResponse(language))],
            [.. journeyList.Select(j => j.ToResponse(language))],
            [.. techList.Select(t => t.ToResponse(language))],
            [.. schoolList.Select(s => s.ToResponse(language))],
            [.. trackList.Select(t => t.ToResponse())]);
    }
}
