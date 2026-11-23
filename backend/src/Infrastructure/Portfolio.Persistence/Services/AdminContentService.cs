using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTO.Admin;
using Portfolio.Application.Exceptions;
using Portfolio.Application.Mappings;
using Portfolio.Application.Services;
using Portfolio.Application.Validation;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;
using Portfolio.Persistence.Context;

namespace Portfolio.Persistence.Services;

/// <summary>
/// Admin yazma işlemleri. Dört koleksiyon için aynı kaydet/sil/sırala akışını generic olarak
/// kullandığı için repository yerine aynı katmandaki DbContext ile doğrudan çalışır.
/// </summary>
public class AdminContentService(PortfolioDbContext context) : IAdminContentService
{
    private IQueryable<T> Query<T>(bool tracking = false) where T : BaseEntity =>
        tracking ? context.Set<T>() : context.Set<T>().AsNoTracking();

    // --- Profil (tek kayıt) ---

    public async Task<ProfileAdmin> GetProfileAsync(CancellationToken cancellationToken = default) =>
        (await LoadProfileAsync(tracking: false, cancellationToken)).ToAdmin();

    public async Task<ProfileAdmin> UpdateProfileAsync(ProfileAdmin profile, CancellationToken cancellationToken = default)
    {
        AdminValidators.Validate(profile);
        var entity = await LoadProfileAsync(tracking: true, cancellationToken);
        entity.Apply(profile);
        await context.SaveChangesAsync(cancellationToken);
        return entity.ToAdmin();
    }

    private async Task<Profile> LoadProfileAsync(bool tracking, CancellationToken cancellationToken) =>
        await Query<Profile>(tracking).FirstOrDefaultAsync(cancellationToken)
        ?? throw AppException.NotFound("Profile");

    // --- Koleksiyonlar ---

    public Task<IReadOnlyList<ProjectAdmin>> ListProjectsAsync(CancellationToken cancellationToken = default) =>
        ListAsync<Project, ProjectAdmin>(p => p.SortOrder, p => p.ToAdmin(), cancellationToken);

    public Task<ProjectAdmin> SaveProjectAsync(long? id, ProjectAdmin project, CancellationToken cancellationToken = default) =>
        SaveAsync(id, project, AdminValidators.Validate,
            () => new Project { Name = project.Name, Year = project.Year },
            (e, a) => e.Apply(a), e => e.ToAdmin(), (e, order) => e.SortOrder = order, e => e.SortOrder, cancellationToken);

    public Task<IReadOnlyList<JourneyAdmin>> ListJourneyAsync(CancellationToken cancellationToken = default) =>
        ListAsync<JourneyEntry, JourneyAdmin>(j => j.SortOrder, j => j.ToAdmin(), cancellationToken);

    public Task<JourneyAdmin> SaveJourneyAsync(long? id, JourneyAdmin entry, CancellationToken cancellationToken = default) =>
        SaveAsync(id, entry, AdminValidators.Validate, () => new JourneyEntry(),
            (e, a) => e.Apply(a), e => e.ToAdmin(), (e, order) => e.SortOrder = order, e => e.SortOrder, cancellationToken);

    public Task<IReadOnlyList<TechnologyAdmin>> ListTechnologiesAsync(CancellationToken cancellationToken = default) =>
        ListAsync<Technology, TechnologyAdmin>(t => t.SortOrder, t => t.ToAdmin(), cancellationToken);

    public Task<TechnologyAdmin> SaveTechnologyAsync(long? id, TechnologyAdmin technology, CancellationToken cancellationToken = default) =>
        SaveAsync(id, technology, AdminValidators.Validate, () => new Technology { Name = technology.Name },
            (e, a) => e.Apply(a), e => e.ToAdmin(), (e, order) => e.SortOrder = order, e => e.SortOrder, cancellationToken);

    public Task<IReadOnlyList<SchoolAdmin>> ListSchoolAsync(CancellationToken cancellationToken = default) =>
        ListAsync<SchoolExperience, SchoolAdmin>(s => s.SortOrder, s => s.ToAdmin(), cancellationToken);

    public Task<SchoolAdmin> SaveSchoolAsync(long? id, SchoolAdmin school, CancellationToken cancellationToken = default) =>
        SaveAsync(id, school, AdminValidators.Validate, () => new SchoolExperience(),
            (e, a) => e.Apply(a), e => e.ToAdmin(), (e, order) => e.SortOrder = order, e => e.SortOrder, cancellationToken);

    public Task<IReadOnlyList<MusicTrackAdmin>> ListTracksAsync(CancellationToken cancellationToken = default) =>
        ListAsync<MusicTrack, MusicTrackAdmin>(t => t.SortOrder, t => t.ToAdmin(), cancellationToken);

    public Task<MusicTrackAdmin> SaveTrackAsync(long? id, MusicTrackAdmin track, CancellationToken cancellationToken = default) =>
        SaveAsync(id, track, AdminValidators.Validate,
            () => new MusicTrack { Title = track.Title, Artist = track.Artist, VideoId = string.Empty },
            (e, a) => e.Apply(a), e => e.ToAdmin(), (e, order) => e.SortOrder = order, e => e.SortOrder, cancellationToken);

    public Task DeleteAsync(ContentSection section, long id, CancellationToken cancellationToken = default) =>
        section switch
        {
            ContentSection.Projects => DeleteAsync<Project>(id, cancellationToken),
            ContentSection.Journey => DeleteAsync<JourneyEntry>(id, cancellationToken),
            ContentSection.Technologies => DeleteAsync<Technology>(id, cancellationToken),
            ContentSection.School => DeleteAsync<SchoolExperience>(id, cancellationToken),
            ContentSection.Tracks => DeleteAsync<MusicTrack>(id, cancellationToken),
            _ => throw AppException.NotFound("Section"),
        };

    public Task ReorderAsync(ContentSection section, IReadOnlyList<long> ids, CancellationToken cancellationToken = default) =>
        section switch
        {
            ContentSection.Projects => ReorderAsync<Project>(ids, (e, i) => e.SortOrder = i, cancellationToken),
            ContentSection.Journey => ReorderAsync<JourneyEntry>(ids, (e, i) => e.SortOrder = i, cancellationToken),
            ContentSection.Technologies => ReorderAsync<Technology>(ids, (e, i) => e.SortOrder = i, cancellationToken),
            ContentSection.School => ReorderAsync<SchoolExperience>(ids, (e, i) => e.SortOrder = i, cancellationToken),
            ContentSection.Tracks => ReorderAsync<MusicTrack>(ids, (e, i) => e.SortOrder = i, cancellationToken),
            _ => throw AppException.NotFound("Section"),
        };

    // --- Ortak işlemler ---

    private async Task<IReadOnlyList<TAdmin>> ListAsync<TEntity, TAdmin>(
        System.Linq.Expressions.Expression<Func<TEntity, int>> order,
        Func<TEntity, TAdmin> map,
        CancellationToken cancellationToken)
        where TEntity : BaseEntity
    {
        var items = await Query<TEntity>().OrderBy(order).ToListAsync(cancellationToken);
        return [.. items.Select(map)];
    }

    private async Task<TAdmin> SaveAsync<TEntity, TAdmin>(
        long? id,
        TAdmin input,
        Action<TAdmin> validate,
        Func<TEntity> create,
        Action<TEntity, TAdmin> apply,
        Func<TEntity, TAdmin> map,
        Action<TEntity, int> setOrder,
        System.Linq.Expressions.Expression<Func<TEntity, int>> order,
        CancellationToken cancellationToken)
        where TEntity : BaseEntity
    {
        validate(input);
        TEntity entity;
        if (id is { } existingId)
        {
            entity = await Query<TEntity>(tracking: true).FirstOrDefaultAsync(e => e.Id == existingId, cancellationToken)
                ?? throw AppException.NotFound(typeof(TEntity).Name);
        }
        else
        {
            // Yeni kayıt listenin sonuna eklenir
            var last = await Query<TEntity>().Select(order).OrderDescending().Cast<int?>().FirstOrDefaultAsync(cancellationToken);
            entity = create();
            setOrder(entity, (last ?? -1) + 1);
            await context.Set<TEntity>().AddAsync(entity, cancellationToken);
        }
        apply(entity, input);
        await context.SaveChangesAsync(cancellationToken);
        return map(entity);
    }

    private async Task DeleteAsync<TEntity>(long id, CancellationToken cancellationToken) where TEntity : BaseEntity
    {
        var entity = await Query<TEntity>(tracking: true).FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            ?? throw AppException.NotFound(typeof(TEntity).Name);
        context.Set<TEntity>().Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task ReorderAsync<TEntity>(IReadOnlyList<long> ids, Action<TEntity, int> setOrder, CancellationToken cancellationToken)
        where TEntity : BaseEntity
    {
        var entities = await Query<TEntity>(tracking: true).ToListAsync(cancellationToken);
        var sameSet = ids.Count == entities.Count && ids.Distinct().Count() == ids.Count && entities.All(e => ids.Contains(e.Id));
        if (!sameSet)
        {
            throw AppException.Validation("ids", "MUST_LIST_EVERY_ITEM_ONCE");
        }
        var position = ids.Select((id, index) => (id, index)).ToDictionary(x => x.id, x => x.index);
        foreach (var entity in entities)
        {
            setOrder(entity, position[entity.Id]);
        }
        await context.SaveChangesAsync(cancellationToken);
    }
}
