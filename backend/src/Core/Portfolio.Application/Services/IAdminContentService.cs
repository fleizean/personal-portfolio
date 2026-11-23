using Portfolio.Application.DTO.Admin;

namespace Portfolio.Application.Services;

/// <summary>Admin panelinin içerik işlemleri. Yazma işlemleri doğrulamadan geçer.</summary>
public interface IAdminContentService
{
    Task<ProfileAdmin> GetProfileAsync(CancellationToken cancellationToken = default);
    Task<ProfileAdmin> UpdateProfileAsync(ProfileAdmin profile, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProjectAdmin>> ListProjectsAsync(CancellationToken cancellationToken = default);
    Task<ProjectAdmin> SaveProjectAsync(long? id, ProjectAdmin project, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<JourneyAdmin>> ListJourneyAsync(CancellationToken cancellationToken = default);
    Task<JourneyAdmin> SaveJourneyAsync(long? id, JourneyAdmin entry, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TechnologyAdmin>> ListTechnologiesAsync(CancellationToken cancellationToken = default);
    Task<TechnologyAdmin> SaveTechnologyAsync(long? id, TechnologyAdmin technology, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<SchoolAdmin>> ListSchoolAsync(CancellationToken cancellationToken = default);
    Task<SchoolAdmin> SaveSchoolAsync(long? id, SchoolAdmin school, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MusicTrackAdmin>> ListTracksAsync(CancellationToken cancellationToken = default);
    Task<MusicTrackAdmin> SaveTrackAsync(long? id, MusicTrackAdmin track, CancellationToken cancellationToken = default);

    Task DeleteAsync(ContentSection section, long id, CancellationToken cancellationToken = default);

    /// <summary>Verilen id sırası koleksiyonun yeni sırası olur; eksik ya da fazla id kabul edilmez</summary>
    Task ReorderAsync(ContentSection section, IReadOnlyList<long> ids, CancellationToken cancellationToken = default);
}
