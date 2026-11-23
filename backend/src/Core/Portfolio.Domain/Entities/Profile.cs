using Portfolio.Domain.Common;
using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Entities;

/// <summary>Site sahibinin tanıtım bilgileri (tek kayıt)</summary>
public class Profile : TranslatableEntity<ProfileTranslation>
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public List<SocialLink> Socials { get; set; } = [];
}

public class ProfileTranslation : ITranslation
{
    public long ProfileId { get; set; }
    public Language Language { get; set; }
    public required string Greeting { get; set; }
    public required string Role { get; set; }
    public required string Company { get; set; }
    public required string Description { get; set; }
    public required string PortraitAlt { get; set; }
    public required string Location { get; set; }
    public required string ContactTitle { get; set; }
    public required string ContactText { get; set; }
}

public class SocialLink : BaseEntity
{
    public long ProfileId { get; set; }
    public SocialKind Kind { get; set; }
    public required string Label { get; set; }
    public required string Url { get; set; }
    public int SortOrder { get; set; }
}
