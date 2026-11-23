using Portfolio.Application.DTO.Content;
using Portfolio.Application.Exceptions;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;

namespace Portfolio.Application.Mappings;

/// <summary>Varlıklardan dile özgü yanıtlara dönüşüm; çevirisi eksik kayıtlar varsayılan dile düşer</summary>
public static class ContentMappings
{
    public static ProfileResponse ToResponse(this Profile profile, Language language)
    {
        var t = profile.TranslationFor(language) ?? throw MissingTranslation(nameof(Profile), profile.Id);
        return new ProfileResponse(
            profile.Name,
            t.Greeting,
            t.Role,
            t.Company,
            t.Description,
            t.PortraitAlt,
            profile.Email,
            t.Location,
            t.ContactTitle,
            t.ContactText,
            [.. profile.Socials.OrderBy(s => s.SortOrder).Select(s => new SocialLinkResponse(s.Kind, s.Label, s.Url))]);
    }

    public static ProjectResponse ToResponse(this Project project, Language language) =>
        new(
            project.Name,
            project.Year,
            project.Status,
            project.TranslationFor(language)?.Description,
            project.TechStack,
            project.GithubUrl,
            project.LiveUrl,
            project.ImagePath,
            project.IsCurrent);

    public static JourneyEntryResponse ToResponse(this JourneyEntry entry, Language language)
    {
        var t = entry.TranslationFor(language) ?? throw MissingTranslation(nameof(JourneyEntry), entry.Id);
        return new JourneyEntryResponse(t.Title, t.Place, t.Period, t.Description, entry.Kind, entry.Link, entry.ImagePath, entry.IsCurrent);
    }

    public static TechnologyResponse ToResponse(this Technology technology, Language language) =>
        new(technology.Name, technology.Category, technology.TranslationFor(language)?.Description ?? string.Empty, technology.Link);

    public static SchoolExperienceResponse ToResponse(this SchoolExperience school, Language language)
    {
        var t = school.TranslationFor(language) ?? throw MissingTranslation(nameof(SchoolExperience), school.Id);
        return new SchoolExperienceResponse(t.Title, t.Period, t.Description, t.Highlights, t.Reflection, school.Link, school.ImagePath);
    }

    private static AppException MissingTranslation(string entity, long id) =>
        new(ErrorCodes.InternalError, $"{entity} {id} has no translation.");
}
