namespace Portfolio.Domain.Enums;

public enum Language
{
    Tr,
    En,
}

public static class Languages
{
    public const Language Default = Language.Tr;

    public static string Code(this Language language) => language switch
    {
        Language.Tr => "tr",
        Language.En => "en",
        _ => throw new ArgumentOutOfRangeException(nameof(language)),
    };

    public static bool TryParse(string? code, out Language language)
    {
        switch (code?.Trim().ToLowerInvariant())
        {
            case "tr":
                language = Language.Tr;
                return true;
            case "en":
                language = Language.En;
                return true;
            default:
                language = Default;
                return false;
        }
    }
}
