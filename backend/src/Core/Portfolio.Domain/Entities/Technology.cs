using Portfolio.Domain.Common;
using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Entities;

public class Technology : TranslatableEntity<TechnologyTranslation>
{
    public required string Name { get; set; }
    public TechCategory Category { get; set; }
    public string? Link { get; set; }
    public int SortOrder { get; set; }
}

public class TechnologyTranslation : ITranslation
{
    public long TechnologyId { get; set; }
    public Language Language { get; set; }
    public required string Description { get; set; }
}
