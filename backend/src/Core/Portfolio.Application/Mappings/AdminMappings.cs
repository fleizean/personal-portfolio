using Portfolio.Application.DTO.Admin;
using Portfolio.Application.Media;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;

namespace Portfolio.Application.Mappings;

/// <summary>
/// Varlık ↔ admin kaydı dönüşümleri. Çeviriler yerinde güncellenir (varsa değiştirilir,
/// yoksa eklenir); böylece EF aynı anahtarlı ikinci bir kayıt izlemeye çalışmaz.
/// </summary>
public static class AdminMappings
{
    private static TTranslation Text<TTranslation>(TranslatableEntity<TTranslation> entity, Language language)
        where TTranslation : ITranslation =>
        entity.Translations.FirstOrDefault(t => t.Language == language)
        ?? entity.Translations.FirstOrDefault(t => t.Language == Languages.Default)
        ?? throw new InvalidOperationException($"{typeof(TTranslation).Name} for entity {entity.Id} is missing.");

    private static void Upsert<TTranslation>(
        List<TTranslation> translations,
        Language language,
        Func<TTranslation> create,
        Action<TTranslation> apply)
        where TTranslation : ITranslation
    {
        var existing = translations.FirstOrDefault(t => t.Language == language);
        if (existing is null)
        {
            existing = create();
            translations.Add(existing);
        }
        apply(existing);
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static List<string> CleanItems(IEnumerable<string>? items) =>
        [.. (items ?? []).Select(i => i.Trim()).Where(i => i.Length > 0)];

    // --- Profil ---

    public static ProfileAdmin ToAdmin(this Profile p)
    {
        static ProfileText Map(ProfileTranslation t) =>
            new(t.Greeting, t.Role, t.Company, t.Description, t.PortraitAlt, t.Location, t.ContactTitle, t.ContactText);
        return new ProfileAdmin(
            p.Name,
            p.Email,
            [.. p.Socials.OrderBy(s => s.SortOrder).Select(s => new SocialLinkAdmin(s.Kind, s.Label, s.Url))],
            Map(Text(p, Language.Tr)),
            Map(Text(p, Language.En)));
    }

    public static void Apply(this Profile p, ProfileAdmin a)
    {
        p.Name = a.Name.Trim();
        p.Email = a.Email.Trim();
        p.Socials.Clear();
        p.Socials.AddRange(a.Socials.Select((s, i) => new SocialLink { Kind = s.Kind, Label = s.Label.Trim(), Url = s.Url.Trim(), SortOrder = i }));
        foreach (var (language, text) in new[] { (Language.Tr, a.Tr), (Language.En, a.En) })
        {
            Upsert(p.Translations, language,
                () => new ProfileTranslation
                {
                    Language = language, Greeting = "", Role = "", Company = "", Description = "",
                    PortraitAlt = "", Location = "", ContactTitle = "", ContactText = "",
                },
                t =>
                {
                    t.Greeting = text.Greeting.Trim();
                    t.Role = text.Role.Trim();
                    t.Company = text.Company.Trim();
                    t.Description = text.Description.Trim();
                    t.PortraitAlt = text.PortraitAlt.Trim();
                    t.Location = text.Location.Trim();
                    t.ContactTitle = text.ContactTitle.Trim();
                    t.ContactText = text.ContactText.Trim();
                });
        }
    }

    // --- Proje ---

    public static ProjectAdmin ToAdmin(this Project p) =>
        new(p.Id, p.Name, p.Year, p.Status, p.TechStack, p.GithubUrl, p.LiveUrl, p.ImagePath, p.IsCurrent,
            new ProjectText(p.Translations.FirstOrDefault(t => t.Language == Language.Tr)?.Description),
            new ProjectText(p.Translations.FirstOrDefault(t => t.Language == Language.En)?.Description));

    public static void Apply(this Project p, ProjectAdmin a)
    {
        p.Name = a.Name.Trim();
        p.Year = a.Year.Trim();
        p.Status = a.Status;
        p.TechStack = CleanItems(a.TechStack);
        p.GithubUrl = Clean(a.GithubUrl);
        p.LiveUrl = Clean(a.LiveUrl);
        p.ImagePath = Clean(a.Image);
        p.IsCurrent = a.Current;
        foreach (var (language, text) in new[] { (Language.Tr, a.Tr), (Language.En, a.En) })
        {
            Upsert(p.Translations, language, () => new ProjectTranslation { Language = language },
                t => t.Description = Clean(text.Description));
        }
    }

    // --- Yolculuk ---

    public static JourneyAdmin ToAdmin(this JourneyEntry j)
    {
        static JourneyText Map(JourneyEntryTranslation t) => new(t.Title, t.Place, t.Period, t.Description);
        return new JourneyAdmin(j.Id, j.Kind, j.Link, j.ImagePath, j.IsCurrent, Map(Text(j, Language.Tr)), Map(Text(j, Language.En)));
    }

    public static void Apply(this JourneyEntry j, JourneyAdmin a)
    {
        j.Kind = a.Kind;
        j.Link = Clean(a.Link);
        j.ImagePath = Clean(a.Image);
        j.IsCurrent = a.Current;
        foreach (var (language, text) in new[] { (Language.Tr, a.Tr), (Language.En, a.En) })
        {
            Upsert(j.Translations, language,
                () => new JourneyEntryTranslation { Language = language, Title = "", Place = "", Period = "", Description = "" },
                t =>
                {
                    t.Title = text.Title.Trim();
                    t.Place = text.Place.Trim();
                    t.Period = text.Period.Trim();
                    t.Description = text.Description.Trim();
                });
        }
    }

    // --- Teknoloji ---

    public static TechnologyAdmin ToAdmin(this Technology t) =>
        new(t.Id, t.Name, t.Category, t.Link,
            new TechnologyText(Text(t, Language.Tr).Description),
            new TechnologyText(Text(t, Language.En).Description));

    public static void Apply(this Technology t, TechnologyAdmin a)
    {
        t.Name = a.Name.Trim();
        t.Category = a.Category;
        t.Link = Clean(a.Link);
        foreach (var (language, text) in new[] { (Language.Tr, a.Tr), (Language.En, a.En) })
        {
            Upsert(t.Translations, language, () => new TechnologyTranslation { Language = language, Description = "" },
                tr => tr.Description = text.Description.Trim());
        }
    }

    // --- Müzik ---

    public static MusicTrackAdmin ToAdmin(this MusicTrack t) => new(t.Id, t.Title, t.Artist, YouTubeVideoId.WatchUrl(t.VideoId));

    /// <summary>Doğrulamadan geçmiş kayıt uygulanır; YouTube bağlantısı kimliğe çevrilir</summary>
    public static void Apply(this MusicTrack t, MusicTrackAdmin a)
    {
        t.Title = a.Title.Trim();
        t.Artist = a.Artist.Trim();
        t.VideoId = YouTubeVideoId.TryParse(a.Youtube, out var id) ? id : t.VideoId;
    }

    // --- Okul ---

    public static SchoolAdmin ToAdmin(this SchoolExperience s)
    {
        static SchoolText Map(SchoolExperienceTranslation t) => new(t.Title, t.Period, t.Description, t.Highlights, t.Reflection);
        return new SchoolAdmin(s.Id, s.Link, s.ImagePath, Map(Text(s, Language.Tr)), Map(Text(s, Language.En)));
    }

    public static void Apply(this SchoolExperience s, SchoolAdmin a)
    {
        s.Link = Clean(a.Link);
        s.ImagePath = Clean(a.Image);
        foreach (var (language, text) in new[] { (Language.Tr, a.Tr), (Language.En, a.En) })
        {
            Upsert(s.Translations, language,
                () => new SchoolExperienceTranslation { Language = language, Title = "", Period = "", Description = "" },
                t =>
                {
                    t.Title = text.Title.Trim();
                    t.Period = text.Period.Trim();
                    t.Description = text.Description.Trim();
                    t.Highlights = CleanItems(text.Highlights);
                    t.Reflection = Clean(text.Reflection);
                });
        }
    }
}
