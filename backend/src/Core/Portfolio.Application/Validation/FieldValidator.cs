using Portfolio.Application.Exceptions;

namespace Portfolio.Application.Validation;

public static class FieldErrors
{
    public const string Required = "REQUIRED";
    public const string TooLong = "TOO_LONG";
    public const string InvalidUrl = "INVALID_URL";
    public const string InvalidPath = "INVALID_PATH";
    public const string InvalidEmail = "INVALID_EMAIL";
    public const string TooMany = "TOO_MANY";
    public const string InvalidYoutube = "INVALID_YOUTUBE";
}

/// <summary>Alan hatalarını toplar; hepsi tek seferde istemciye döner</summary>
public sealed class FieldValidator
{
    private readonly Dictionary<string, string> _errors = [];

    public FieldValidator Required(string field, string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value)) return Add(field, FieldErrors.Required);
        return value.Length > maxLength ? Add(field, FieldErrors.TooLong) : this;
    }

    public FieldValidator Optional(string field, string? value, int maxLength) =>
        value is not null && value.Length > maxLength ? Add(field, FieldErrors.TooLong) : this;

    /// <summary>
    /// Yalnızca mutlak http/https adresleri. Bağlantılar sitede href olarak basıldığı için
    /// javascript:, data: gibi şemalar kabul edilmez.
    /// </summary>
    public FieldValidator Url(string field, string? value, bool required = false)
    {
        if (string.IsNullOrWhiteSpace(value)) return required ? Add(field, FieldErrors.Required) : this;
        if (value.Length > 500) return Add(field, FieldErrors.TooLong);
        var ok = Uri.TryCreate(value, UriKind.Absolute, out var uri)
            && (uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp);
        return ok ? this : Add(field, FieldErrors.InvalidUrl);
    }

    /// <summary>Site içi görsel yolu: "/" ile başlar, üst dizine çıkmaz, sorgu ya da şema içermez</summary>
    public FieldValidator ImagePath(string field, string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return this;
        var ok = value.Length <= 300
            && value.StartsWith('/')
            && !value.StartsWith("//", StringComparison.Ordinal)
            && !value.Contains("..", StringComparison.Ordinal)
            && !value.Contains(':', StringComparison.Ordinal)
            && !value.Contains('?', StringComparison.Ordinal)
            && !value.Contains('\\', StringComparison.Ordinal);
        return ok ? this : Add(field, FieldErrors.InvalidPath);
    }

    public FieldValidator Email(string field, string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return Add(field, FieldErrors.Required);
        var at = value.IndexOf('@', StringComparison.Ordinal);
        var ok = value.Length <= 254 && at > 0 && at < value.Length - 3 && !value.Contains(' ', StringComparison.Ordinal);
        return ok ? this : Add(field, FieldErrors.InvalidEmail);
    }

    public FieldValidator Items(string field, IReadOnlyList<string>? items, int maxCount, int maxLength)
    {
        if (items is null) return this;
        if (items.Count > maxCount) return Add(field, FieldErrors.TooMany);
        for (var i = 0; i < items.Count; i++)
        {
            Required($"{field}[{i}]", items[i], maxLength);
        }
        return this;
    }

    public FieldValidator Add(string field, string error)
    {
        _errors.TryAdd(field, error);
        return this;
    }

    public void ThrowIfInvalid()
    {
        if (_errors.Count > 0)
        {
            throw new AppException(ErrorCodes.ValidationError, "Some fields are invalid.", _errors);
        }
    }
}
