using Portfolio.Domain.Enums;

namespace Portfolio.Application.DTO.Admin;

// Admin paneli kayıtları iki dildeki metinleriyle birlikte görür ve gönderir.
// Dilden bağımsız alanlar kökte, dile bağlı metinler "tr" ve "en" altındadır.

public sealed record SocialLinkAdmin(SocialKind Kind, string Label, string Url);

public sealed record ProfileText(
    string Greeting,
    string Role,
    string Company,
    string Description,
    string PortraitAlt,
    string Location,
    string ContactTitle,
    string ContactText);

public sealed record ProfileAdmin(
    string Name,
    string Email,
    IReadOnlyList<SocialLinkAdmin> Socials,
    ProfileText Tr,
    ProfileText En);

public sealed record ProjectText(string? Description);

public sealed record ProjectAdmin(
    long Id,
    string Name,
    string Year,
    ProjectStatus Status,
    IReadOnlyList<string> TechStack,
    string? GithubUrl,
    string? LiveUrl,
    string? Image,
    bool Current,
    ProjectText Tr,
    ProjectText En);

public sealed record JourneyText(string Title, string Place, string Period, string Description);

public sealed record JourneyAdmin(
    long Id,
    JourneyKind Kind,
    string? Link,
    string? Image,
    bool Current,
    JourneyText Tr,
    JourneyText En);

public sealed record TechnologyText(string Description);

public sealed record TechnologyAdmin(
    long Id,
    string Name,
    TechCategory Category,
    string? Link,
    TechnologyText Tr,
    TechnologyText En);

public sealed record SchoolText(
    string Title,
    string Period,
    string Description,
    IReadOnlyList<string> Highlights,
    string? Reflection);

public sealed record SchoolAdmin(
    long Id,
    string? Link,
    string? Image,
    SchoolText Tr,
    SchoolText En);

/// <summary>Müzik parçası. "Youtube" alanına bağlantı ya da video kimliği yazılabilir.</summary>
public sealed record MusicTrackAdmin(long Id, string Title, string Artist, string Youtube);

/// <summary>Sıralanabilir içerik koleksiyonları</summary>
public enum ContentSection
{
    Projects,
    Journey,
    Technologies,
    School,
    Tracks,
}

public sealed record ReorderRequest(IReadOnlyList<long> Ids);

public sealed record UploadResponse(string Path);

public sealed record AdminUser(string Login, string? Name, string? AvatarUrl);
