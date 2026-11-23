using Portfolio.Domain.Enums;

namespace Portfolio.UnitTests;

public class LanguagesTests
{
    [Theory]
    [InlineData("tr", Language.Tr)]
    [InlineData("EN", Language.En)]
    [InlineData(" en ", Language.En)]
    public void Parses_supported_codes(string code, Language expected)
    {
        Assert.True(Languages.TryParse(code, out var language));
        Assert.Equal(expected, language);
    }

    [Theory]
    [InlineData("de")]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("tr-TR")]
    public void Rejects_unsupported_codes(string? code)
    {
        Assert.False(Languages.TryParse(code, out var language));
        Assert.Equal(Languages.Default, language);
    }

    [Fact]
    public void Code_round_trips()
    {
        foreach (var language in Enum.GetValues<Language>())
        {
            Assert.True(Languages.TryParse(language.Code(), out var parsed));
            Assert.Equal(language, parsed);
        }
    }
}
