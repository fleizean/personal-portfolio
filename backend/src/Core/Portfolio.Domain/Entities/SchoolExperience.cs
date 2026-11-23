using Portfolio.Domain.Common;
using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Entities;

public class SchoolExperience : TranslatableEntity<SchoolExperienceTranslation>
{
    public string? Link { get; set; }
    public string? ImagePath { get; set; }
    public int SortOrder { get; set; }
}

public class SchoolExperienceTranslation : ITranslation
{
    public long SchoolExperienceId { get; set; }
    public Language Language { get; set; }
    public required string Title { get; set; }
    public required string Period { get; set; }
    public required string Description { get; set; }
    public List<string> Highlights { get; set; } = [];
    public string? Reflection { get; set; }
}
