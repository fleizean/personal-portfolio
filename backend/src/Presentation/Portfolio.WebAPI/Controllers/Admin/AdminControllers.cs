using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Abstractions;
using Portfolio.Application.DTO.Admin;
using Portfolio.Application.Exceptions;
using Portfolio.Application.Services;
using Portfolio.WebAPI.Extensions;
using Portfolio.WebAPI.Filters;

namespace Portfolio.WebAPI.Controllers.Admin;

/// <summary>Tüm admin uçlarının ortak kuralları: yalnızca admin, yazmalarda CSRF başlığı ve önbellek temizliği</summary>
[ApiController]
[Authorize(Policy = AuthExtensions.AdminPolicy)]
[AdminMutation]
public abstract class AdminControllerBase : ControllerBase;

[Route("api/admin/profile")]
public sealed class AdminProfileController(IAdminContentService service) : AdminControllerBase
{
    [HttpGet]
    public Task<ProfileAdmin> Get(CancellationToken cancellationToken) => service.GetProfileAsync(cancellationToken);

    [HttpPut]
    public Task<ProfileAdmin> Update([FromBody] ProfileAdmin profile, CancellationToken cancellationToken) =>
        service.UpdateProfileAsync(profile, cancellationToken);
}

/// <summary>Listele, ekle, güncelle, sil, sırala: dört koleksiyon için aynı uçlar</summary>
public abstract class AdminCollectionController<TItem>(IAdminContentService service) : AdminControllerBase
{
    protected IAdminContentService Service { get; } = service;
    protected abstract ContentSection Section { get; }
    protected abstract Task<IReadOnlyList<TItem>> ListAsync(CancellationToken cancellationToken);
    protected abstract Task<TItem> SaveAsync(long? id, TItem item, CancellationToken cancellationToken);

    [HttpGet]
    public Task<IReadOnlyList<TItem>> List(CancellationToken cancellationToken) => ListAsync(cancellationToken);

    [HttpPost]
    public async Task<ActionResult<TItem>> Create([FromBody] TItem item, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await SaveAsync(null, item, cancellationToken));

    [HttpPut("{id:long}")]
    public Task<TItem> Update(long id, [FromBody] TItem item, CancellationToken cancellationToken) =>
        SaveAsync(id, item, cancellationToken);

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await Service.DeleteAsync(Section, id, cancellationToken);
        return NoContent();
    }

    [HttpPut("order")]
    public async Task<IActionResult> Reorder([FromBody] ReorderRequest request, CancellationToken cancellationToken)
    {
        await Service.ReorderAsync(Section, request.Ids, cancellationToken);
        return NoContent();
    }
}

[Route("api/admin/projects")]
public sealed class AdminProjectsController(IAdminContentService service) : AdminCollectionController<ProjectAdmin>(service)
{
    protected override ContentSection Section => ContentSection.Projects;
    protected override Task<IReadOnlyList<ProjectAdmin>> ListAsync(CancellationToken cancellationToken) => Service.ListProjectsAsync(cancellationToken);
    protected override Task<ProjectAdmin> SaveAsync(long? id, ProjectAdmin item, CancellationToken cancellationToken) =>
        Service.SaveProjectAsync(id, item, cancellationToken);
}

[Route("api/admin/journey")]
public sealed class AdminJourneyController(IAdminContentService service) : AdminCollectionController<JourneyAdmin>(service)
{
    protected override ContentSection Section => ContentSection.Journey;
    protected override Task<IReadOnlyList<JourneyAdmin>> ListAsync(CancellationToken cancellationToken) => Service.ListJourneyAsync(cancellationToken);
    protected override Task<JourneyAdmin> SaveAsync(long? id, JourneyAdmin item, CancellationToken cancellationToken) =>
        Service.SaveJourneyAsync(id, item, cancellationToken);
}

[Route("api/admin/technologies")]
public sealed class AdminTechnologiesController(IAdminContentService service) : AdminCollectionController<TechnologyAdmin>(service)
{
    protected override ContentSection Section => ContentSection.Technologies;
    protected override Task<IReadOnlyList<TechnologyAdmin>> ListAsync(CancellationToken cancellationToken) => Service.ListTechnologiesAsync(cancellationToken);
    protected override Task<TechnologyAdmin> SaveAsync(long? id, TechnologyAdmin item, CancellationToken cancellationToken) =>
        Service.SaveTechnologyAsync(id, item, cancellationToken);
}

[Route("api/admin/school")]
public sealed class AdminSchoolController(IAdminContentService service) : AdminCollectionController<SchoolAdmin>(service)
{
    protected override ContentSection Section => ContentSection.School;
    protected override Task<IReadOnlyList<SchoolAdmin>> ListAsync(CancellationToken cancellationToken) => Service.ListSchoolAsync(cancellationToken);
    protected override Task<SchoolAdmin> SaveAsync(long? id, SchoolAdmin item, CancellationToken cancellationToken) =>
        Service.SaveSchoolAsync(id, item, cancellationToken);
}

[Route("api/admin/tracks")]
public sealed class AdminTracksController(IAdminContentService service) : AdminCollectionController<MusicTrackAdmin>(service)
{
    protected override ContentSection Section => ContentSection.Tracks;
    protected override Task<IReadOnlyList<MusicTrackAdmin>> ListAsync(CancellationToken cancellationToken) =>
        Service.ListTracksAsync(cancellationToken);
    protected override Task<MusicTrackAdmin> SaveAsync(long? id, MusicTrackAdmin item, CancellationToken cancellationToken) =>
        Service.SaveTrackAsync(id, item, cancellationToken);
}

[Route("api/admin/uploads")]
public sealed class AdminUploadsController(IImageStorage storage) : AdminControllerBase
{
    /// <summary>PNG, JPEG ya da WebP; en fazla 2 MB. Dönen yol kayıtların görsel alanına yazılır.</summary>
    [HttpPost]
    [RequestSizeLimit(3 * 1024 * 1024)]
    public async Task<ActionResult<UploadResponse>> Upload(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file is null)
        {
            throw AppException.Validation("file", "REQUIRED");
        }
        await using var stream = file.OpenReadStream();
        var path = await storage.SaveAsync(stream, file.Length, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, new UploadResponse(path));
    }
}
