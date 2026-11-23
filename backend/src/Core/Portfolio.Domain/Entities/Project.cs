using Portfolio.Domain.Common;
using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Entities;

public class Project : TranslatableEntity<ProjectTranslation>
{
    public required string Name { get; set; }
    public required string Year { get; set; }
    public ProjectStatus Status { get; set; }
    public List<string> TechStack { get; set; } = [];
    public string? GithubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string? ImagePath { get; set; }

    /// <summary>Şu an üzerinde çalışılan proje mi, arşiv mi</summary>
    public bool IsCurrent { get; set; }

    public int SortOrder { get; set; }
}

public class ProjectTranslation : ITranslation
{
    public long ProjectId { get; set; }
    public Language Language { get; set; }
    public string? Description { get; set; }
}
