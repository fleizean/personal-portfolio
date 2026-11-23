using System.Text.RegularExpressions;

namespace Portfolio.Application.Media;

/// <summary>YouTube bağlantısından ya da doğrudan kimlikten 11 karakterlik video kimliğini çıkarır</summary>
public static partial class YouTubeVideoId
{
    [GeneratedRegex("^[A-Za-z0-9_-]{11}$")]
    private static partial Regex IdPattern();

    private static readonly string[] Hosts =
        ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com"];

    public static bool TryParse(string? input, out string videoId)
    {
        videoId = string.Empty;
        var value = input?.Trim();
        if (string.IsNullOrEmpty(value)) return false;

        if (IdPattern().IsMatch(value))
        {
            videoId = value;
            return true;
        }

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri)
            || uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp
            || !Hosts.Contains(uri.Host, StringComparer.OrdinalIgnoreCase))
        {
            return false;
        }

        string? candidate = null;
        if (uri.Host.Equals("youtu.be", StringComparison.OrdinalIgnoreCase))
        {
            candidate = uri.AbsolutePath.Trim('/');
        }
        else if (uri.AbsolutePath is "/watch")
        {
            candidate = System.Web.HttpUtility.ParseQueryString(uri.Query)["v"];
        }
        else
        {
            // /embed/ID, /shorts/ID, /live/ID
            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (segments.Length == 2 && segments[0] is "embed" or "shorts" or "live") candidate = segments[1];
        }

        if (candidate is null || !IdPattern().IsMatch(candidate)) return false;
        videoId = candidate;
        return true;
    }

    public static string WatchUrl(string videoId) => $"https://www.youtube.com/watch?v={videoId}";
}
