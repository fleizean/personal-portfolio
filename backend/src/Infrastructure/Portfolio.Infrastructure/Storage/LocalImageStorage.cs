using Portfolio.Application.Abstractions;
using Portfolio.Application.Exceptions;

namespace Portfolio.Infrastructure.Storage;

/// <summary>
/// Görselleri yerel diske (docker volume) yazar. Dosya türüne uzantıdan ya da istemcinin
/// bildirdiği içerik türünden değil, ilk baytlardan karar verilir. SVG bilinçli olarak
/// desteklenmez: içine script gömülebilir.
/// </summary>
public sealed class LocalImageStorage(string directory) : IImageStorage
{
    public const long MaxBytes = 2 * 1024 * 1024;
    public const string PublicPrefix = "/api/uploads/";

    public async Task<string> SaveAsync(Stream content, long length, CancellationToken cancellationToken = default)
    {
        if (length <= 0 || length > MaxBytes)
        {
            throw AppException.Validation("file", "SIZE_NOT_ALLOWED");
        }

        using var buffer = new MemoryStream();
        await content.CopyToAsync(buffer, cancellationToken);
        if (buffer.Length != length || buffer.Length > MaxBytes)
        {
            throw AppException.Validation("file", "SIZE_NOT_ALLOWED");
        }

        var extension = DetectExtension(buffer.GetBuffer().AsSpan(0, (int)buffer.Length))
            ?? throw AppException.Validation("file", "TYPE_NOT_ALLOWED");

        Directory.CreateDirectory(directory);
        var name = $"{Guid.NewGuid():N}{extension}";
        await using (var file = new FileStream(Path.Combine(directory, name), FileMode.CreateNew, FileAccess.Write))
        {
            buffer.Position = 0;
            await buffer.CopyToAsync(file, cancellationToken);
        }
        return PublicPrefix + name;
    }

    private static string? DetectExtension(ReadOnlySpan<byte> data)
    {
        ReadOnlySpan<byte> png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        ReadOnlySpan<byte> jpeg = [0xFF, 0xD8, 0xFF];
        ReadOnlySpan<byte> riff = "RIFF"u8;
        ReadOnlySpan<byte> webp = "WEBP"u8;

        if (data.StartsWith(png)) return ".png";
        if (data.StartsWith(jpeg)) return ".jpg";
        if (data.Length >= 12 && data[..4].SequenceEqual(riff) && data.Slice(8, 4).SequenceEqual(webp)) return ".webp";
        return null;
    }
}
