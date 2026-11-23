using Portfolio.Application.Exceptions;
using Portfolio.Application.Mappings;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;

namespace Portfolio.UnitTests;

public class ContentMappingsTests
{
    private static JourneyEntry Journey(params (Language Language, string Title)[] texts) => new()
    {
        Kind = JourneyKind.Work,
        Translations =
        [
            .. texts.Select(t => new JourneyEntryTranslation
            {
                Language = t.Language,
                Title = t.Title,
                Place = "place",
                Period = "2025",
                Description = "description",
            }),
        ],
    };

    [Fact]
    public void Uses_the_requested_language_when_it_exists()
    {
        var entry = Journey((Language.Tr, "Geliştirici"), (Language.En, "Developer"));

        Assert.Equal("Developer", entry.ToResponse(Language.En).Title);
        Assert.Equal("Geliştirici", entry.ToResponse(Language.Tr).Title);
    }

    [Fact]
    public void Falls_back_to_the_default_language_when_a_translation_is_missing()
    {
        var entry = Journey((Language.Tr, "Geliştirici"));

        Assert.Equal("Geliştirici", entry.ToResponse(Language.En).Title);
    }

    [Fact]
    public void Throws_when_no_translation_exists_at_all()
    {
        var entry = Journey();

        var error = Assert.Throws<AppException>(() => entry.ToResponse(Language.En));
        Assert.Equal(ErrorCodes.InternalError, error.Code);
    }

    [Fact]
    public void Project_without_translation_keeps_language_independent_fields()
    {
        var project = new Project { Name = "Workflow", Year = "2025", Status = ProjectStatus.Production, TechStack = ["Electron.js"] };

        var response = project.ToResponse(Language.En);

        Assert.Equal("Workflow", response.Name);
        Assert.Null(response.Description);
        Assert.Equal(["Electron.js"], response.TechStack);
    }
}
