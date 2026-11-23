using Portfolio.Domain.Enums;

namespace Portfolio.Application.DTO.Content;

// Alan adları frontend'deki domain/models/portfolio-content.ts ile birebir eşleşir.

public sealed record PortfolioContentResponse(
    ProfileResponse Profile,
    IReadOnlyList<ProjectResponse> Projects,
    IReadOnlyList<JourneyEntryResponse> Journey,
    IReadOnlyList<TechnologyResponse> Technologies,
    IReadOnlyList<SchoolExperienceResponse> School);

public sealed record SocialLinkResponse(SocialKind Kind, string Label, string Url);

public sealed record ProfileResponse(
    string Name,
    string Greeting,
    string Role,
    string Company,
    string Description,
    string PortraitAlt,
    string Email,
    string Location,
    string ContactTitle,
    string ContactText,
    IReadOnlyList<SocialLinkResponse> Socials);

public sealed record ProjectResponse(
    string Name,
    string Year,
    ProjectStatus Status,
    string? Description,
    IReadOnlyList<string> TechStack,
    string? GithubUrl,
    string? LiveUrl,
    string? Image,
    bool Current);

public sealed record JourneyEntryResponse(
    string Title,
    string Place,
    string Period,
    string Description,
    JourneyKind Kind,
    string? Link,
    string? Image,
    bool Current);

public sealed record TechnologyResponse(
    string Name,
    TechCategory Category,
    string Description,
    string? Link);

public sealed record SchoolExperienceResponse(
    string Title,
    string Period,
    string Description,
    IReadOnlyList<string> Highlights,
    string? Reflection,
    string? Link,
    string? Image);
