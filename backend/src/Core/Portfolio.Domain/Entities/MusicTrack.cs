using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>Müzik çalardaki parça; YouTube'un gömülü oynatıcısıyla çalınır (dosya barındırılmaz)</summary>
public class MusicTrack : BaseEntity
{
    public required string Title { get; set; }
    public required string Artist { get; set; }

    /// <summary>11 karakterlik YouTube video kimliği</summary>
    public required string VideoId { get; set; }

    public int SortOrder { get; set; }
}
