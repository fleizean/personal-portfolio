using Portfolio.Application.Media;

namespace Portfolio.UnitTests;

public class YouTubeVideoIdTests
{
    [Theory]
    [InlineData("NQCUZTCRgsM")]
    [InlineData("https://www.youtube.com/watch?v=NQCUZTCRgsM")]
    [InlineData("https://www.youtube.com/watch?v=NQCUZTCRgsM&list=RD3-yphcPu3WE&index=4")]
    [InlineData("https://youtu.be/NQCUZTCRgsM")]
    [InlineData("https://m.youtube.com/watch?v=NQCUZTCRgsM")]
    [InlineData("https://music.youtube.com/watch?v=NQCUZTCRgsM")]
    [InlineData("https://www.youtube.com/embed/NQCUZTCRgsM")]
    [InlineData("https://www.youtube.com/shorts/NQCUZTCRgsM")]
    [InlineData("  https://www.youtube.com/watch?v=NQCUZTCRgsM  ")]
    public void Extracts_the_video_id(string input)
    {
        Assert.True(YouTubeVideoId.TryParse(input, out var id));
        Assert.Equal("NQCUZTCRgsM", id);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("short")]
    [InlineData("https://evil.example/watch?v=NQCUZTCRgsM")]
    [InlineData("javascript:alert(1)")]
    [InlineData("https://www.youtube.com/watch?v=bad")]
    [InlineData("https://www.youtube.com/channel/NQCUZTCRgsM")]
    public void Rejects_anything_else(string? input)
    {
        Assert.False(YouTubeVideoId.TryParse(input, out _));
    }
}
