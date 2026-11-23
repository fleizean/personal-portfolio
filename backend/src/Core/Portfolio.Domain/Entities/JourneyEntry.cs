using Portfolio.Domain.Common;
using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Entities;

public class JourneyEntry : TranslatableEntity<JourneyEntryTranslation>
{
    public JourneyKind Kind { get; set; }
    public string? Link { get; set; }
    public string? ImagePath { get; set; }
    public bool IsCurrent { get; set; }
    public int SortOrder { get; set; }
}

public class JourneyEntryTranslation : ITranslation
{
    public long JourneyEntryId { get; set; }
    public Language Language { get; set; }
    public required string Title { get; set; }
    public required string Place { get; set; }
    public required string Period { get; set; }
    public required string Description { get; set; }
}
