using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;
using Portfolio.Persistence.Context;

namespace Portfolio.Persistence.Seed;

/// <summary>
/// Veritabanı boşsa, frontend'in statik içeriğiyle aynı biçimdeki gömülü JSON dosyalarını yükler.
/// İki dildeki kayıtlar sıralarına göre eşleştirilir; dilden bağımsız alanlar (durum, teknoloji
/// listesi, bağlantılar) varsayılan dilden (TR) alınır.
/// </summary>
public sealed partial class ContentSeeder(PortfolioDbContext context, ILogger<ContentSeeder> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
    };

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        // Parçalar sonradan eklendi: içerik zaten yüklü olsa bile parça tablosu boşsa doldurulur
        if (!await context.MusicTracks.AnyAsync(cancellationToken))
        {
            var tracks = Load(Language.Tr).Tracks ?? [];
            context.MusicTracks.AddRange(tracks.Select((t, i) =>
                new MusicTrack { Title = t.Title, Artist = t.Artist, VideoId = t.VideoId, SortOrder = i }));
            await context.SaveChangesAsync(cancellationToken);
        }

        if (await context.Profiles.AnyAsync(cancellationToken))
        {
            LogSkipped(logger);
            return;
        }

        var tr = Load(Language.Tr);
        var en = Load(Language.En);

        context.Profiles.Add(BuildProfile(tr.Profile, en.Profile));
        context.Projects.AddRange(tr.Projects.Select((p, i) => BuildProject(p, en.Projects.ElementAtOrDefault(i), i)));
        context.JourneyEntries.AddRange(tr.Journey.Select((j, i) => BuildJourney(j, en.Journey.ElementAtOrDefault(i), i)));
        context.Technologies.AddRange(tr.Technologies.Select((t, i) => BuildTechnology(t, en.Technologies.ElementAtOrDefault(i), i)));
        context.SchoolExperiences.AddRange(tr.School.Select((s, i) => BuildSchool(s, en.School.ElementAtOrDefault(i), i)));

        await context.SaveChangesAsync(cancellationToken);
        LogSeeded(logger, tr.Projects.Count, tr.Journey.Count, tr.Technologies.Count, tr.School.Count);
    }

    [LoggerMessage(Level = LogLevel.Debug, Message = "Content already present, seeding skipped.")]
    private static partial void LogSkipped(ILogger logger);

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "Seeded content: {Projects} projects, {Journey} journey entries, {Tech} technologies, {School} school entries.")]
    private static partial void LogSeeded(ILogger logger, int projects, int journey, int tech, int school);

    private static SeedContent Load(Language language)
    {
        var name = $"Portfolio.Persistence.Seed.content.{language.Code()}.json";
        using var stream = typeof(ContentSeeder).Assembly.GetManifestResourceStream(name)
            ?? throw new InvalidOperationException($"Embedded seed resource '{name}' not found.");
        return JsonSerializer.Deserialize<SeedContent>(stream, JsonOptions)
            ?? throw new InvalidOperationException($"Seed resource '{name}' is empty.");
    }

    private static Profile BuildProfile(SeedProfile tr, SeedProfile en) => new()
    {
        Name = tr.Name,
        Email = tr.Email,
        Socials = [.. tr.Socials.Select((s, i) => new SocialLink { Kind = s.Kind, Label = s.Label, Url = s.Url, SortOrder = i })],
        Translations = [ProfileText(Language.Tr, tr), ProfileText(Language.En, en)],
    };

    private static ProfileTranslation ProfileText(Language language, SeedProfile p) => new()
    {
        Language = language,
        Greeting = p.Greeting,
        Role = p.Role,
        Company = p.Company,
        Description = p.Description,
        PortraitAlt = p.PortraitAlt,
        Location = p.Location,
        ContactTitle = p.ContactTitle,
        ContactText = p.ContactText,
    };

    private static Project BuildProject(SeedProject tr, SeedProject? en, int order) => new()
    {
        Name = tr.Name,
        Year = tr.Year,
        Status = tr.Status,
        TechStack = tr.TechStack,
        GithubUrl = tr.GithubUrl,
        LiveUrl = tr.LiveUrl,
        ImagePath = tr.Image,
        IsCurrent = tr.Current,
        SortOrder = order,
        Translations =
        [
            new ProjectTranslation { Language = Language.Tr, Description = tr.Description },
            .. en is null ? [] : new[] { new ProjectTranslation { Language = Language.En, Description = en.Description } },
        ],
    };

    private static JourneyEntry BuildJourney(SeedJourney tr, SeedJourney? en, int order) => new()
    {
        Kind = tr.Kind,
        Link = tr.Link,
        ImagePath = tr.Image,
        IsCurrent = tr.Current,
        SortOrder = order,
        Translations = [JourneyText(Language.Tr, tr), .. en is null ? [] : new[] { JourneyText(Language.En, en) }],
    };

    private static JourneyEntryTranslation JourneyText(Language language, SeedJourney j) => new()
    {
        Language = language,
        Title = j.Title,
        Place = j.Place,
        Period = j.Period,
        Description = j.Description,
    };

    private static Technology BuildTechnology(SeedTechnology tr, SeedTechnology? en, int order) => new()
    {
        Name = tr.Name,
        Category = tr.Category,
        Link = tr.Link,
        SortOrder = order,
        Translations =
        [
            new TechnologyTranslation { Language = Language.Tr, Description = tr.Description },
            .. en is null ? [] : new[] { new TechnologyTranslation { Language = Language.En, Description = en.Description } },
        ],
    };

    private static SchoolExperience BuildSchool(SeedSchool tr, SeedSchool? en, int order) => new()
    {
        Link = tr.Link,
        ImagePath = tr.Image,
        SortOrder = order,
        Translations = [SchoolText(Language.Tr, tr), .. en is null ? [] : new[] { SchoolText(Language.En, en) }],
    };

    private static SchoolExperienceTranslation SchoolText(Language language, SeedSchool s) => new()
    {
        Language = language,
        Title = s.Title,
        Period = s.Period,
        Description = s.Description,
        Highlights = s.Highlights,
        Reflection = s.Reflection,
    };

    // Gömülü JSON'un biçimi (frontend/src/app/data/static/content.*.json ile aynı)

    private sealed record SeedContent(
        SeedProfile Profile,
        List<SeedProject> Projects,
        List<SeedJourney> Journey,
        List<SeedTechnology> Technologies,
        List<SeedSchool> School,
        List<SeedTrack>? Tracks);

    private sealed record SeedTrack(string Title, string Artist, string VideoId);

    private sealed record SeedSocial(SocialKind Kind, string Label, string Url);

    private sealed record SeedProfile(
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
        List<SeedSocial> Socials);

    private sealed record SeedProject(
        string Name,
        string Year,
        ProjectStatus Status,
        string? Description,
        List<string> TechStack,
        string? GithubUrl,
        string? LiveUrl,
        string? Image,
        bool Current);

    private sealed record SeedJourney(
        string Title,
        string Place,
        string Period,
        string Description,
        JourneyKind Kind,
        string? Link,
        string? Image,
        bool Current);

    private sealed record SeedTechnology(string Name, TechCategory Category, string Description, string? Link);

    private sealed record SeedSchool(
        string Title,
        string Period,
        string Description,
        List<string> Highlights,
        string? Reflection,
        string? Link,
        string? Image);
}
