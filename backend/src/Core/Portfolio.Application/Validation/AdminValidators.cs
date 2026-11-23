using Portfolio.Application.DTO.Admin;
using Portfolio.Application.Media;

namespace Portfolio.Application.Validation;

/// <summary>Admin kayıtlarının alan kuralları; sınırlar veritabanı sütun uzunluklarıyla aynıdır</summary>
public static class AdminValidators
{
    public static void Validate(ProfileAdmin p)
    {
        var v = new FieldValidator()
            .Required("name", p.Name, 120)
            .Email("email", p.Email);
        if (p.Socials.Count > 10) v.Add("socials", FieldErrors.TooMany);
        for (var i = 0; i < p.Socials.Count; i++)
        {
            v.Required($"socials[{i}].label", p.Socials[i].Label, 60).Url($"socials[{i}].url", p.Socials[i].Url, required: true);
        }
        foreach (var (lang, t) in new[] { ("tr", p.Tr), ("en", p.En) })
        {
            v.Required($"{lang}.greeting", t.Greeting, 200)
                .Required($"{lang}.role", t.Role, 200)
                .Required($"{lang}.company", t.Company, 200)
                .Required($"{lang}.description", t.Description, 2000)
                .Required($"{lang}.portraitAlt", t.PortraitAlt, 200)
                .Required($"{lang}.location", t.Location, 200)
                .Required($"{lang}.contactTitle", t.ContactTitle, 200)
                .Required($"{lang}.contactText", t.ContactText, 2000);
        }
        v.ThrowIfInvalid();
    }

    public static void Validate(ProjectAdmin p) =>
        new FieldValidator()
            .Required("name", p.Name, 120)
            .Required("year", p.Year, 20)
            .Items("techStack", p.TechStack, 30, 60)
            .Url("githubUrl", p.GithubUrl)
            .Url("liveUrl", p.LiveUrl)
            .ImagePath("image", p.Image)
            .Optional("tr.description", p.Tr.Description, 4000)
            .Optional("en.description", p.En.Description, 4000)
            .ThrowIfInvalid();

    public static void Validate(JourneyAdmin j)
    {
        var v = new FieldValidator().Url("link", j.Link).ImagePath("image", j.Image);
        foreach (var (lang, t) in new[] { ("tr", j.Tr), ("en", j.En) })
        {
            v.Required($"{lang}.title", t.Title, 200)
                .Required($"{lang}.place", t.Place, 200)
                .Required($"{lang}.period", t.Period, 60)
                .Required($"{lang}.description", t.Description, 4000);
        }
        v.ThrowIfInvalid();
    }

    public static void Validate(TechnologyAdmin t) =>
        new FieldValidator()
            .Required("name", t.Name, 80)
            .Url("link", t.Link)
            .Required("tr.description", t.Tr.Description, 1000)
            .Required("en.description", t.En.Description, 1000)
            .ThrowIfInvalid();

    public static void Validate(MusicTrackAdmin t)
    {
        var v = new FieldValidator().Required("title", t.Title, 200).Required("artist", t.Artist, 120);
        if (!YouTubeVideoId.TryParse(t.Youtube, out _)) v.Add("youtube", FieldErrors.InvalidYoutube);
        v.ThrowIfInvalid();
    }

    public static void Validate(SchoolAdmin s)
    {
        var v = new FieldValidator().Url("link", s.Link).ImagePath("image", s.Image);
        foreach (var (lang, t) in new[] { ("tr", s.Tr), ("en", s.En) })
        {
            v.Required($"{lang}.title", t.Title, 200)
                .Required($"{lang}.period", t.Period, 60)
                .Required($"{lang}.description", t.Description, 4000)
                .Items($"{lang}.highlights", t.Highlights, 20, 500)
                .Optional($"{lang}.reflection", t.Reflection, 4000);
        }
        v.ThrowIfInvalid();
    }
}
