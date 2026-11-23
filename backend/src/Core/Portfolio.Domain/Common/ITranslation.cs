using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Common;

/// <summary>Bir varlığın tek dildeki metinleri</summary>
public interface ITranslation
{
    Language Language { get; }
}
