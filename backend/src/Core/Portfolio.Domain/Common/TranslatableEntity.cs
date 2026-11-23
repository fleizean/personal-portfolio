using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Common;

/// <summary>Dilden bağımsız alanları kendinde, dile bağlı metinleri <typeparamref name="TTranslation"/> içinde tutan varlık</summary>
public abstract class TranslatableEntity<TTranslation> : BaseEntity
    where TTranslation : ITranslation
{
    public List<TTranslation> Translations { get; set; } = [];

    /// <summary>İstenen dildeki çeviri; yoksa varsayılan dile düşer</summary>
    public TTranslation? TranslationFor(Language language) =>
        Translations.FirstOrDefault(t => t.Language == language)
        ?? Translations.FirstOrDefault(t => t.Language == Languages.Default);
}
