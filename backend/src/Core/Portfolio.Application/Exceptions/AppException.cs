namespace Portfolio.Application.Exceptions;

public static class ErrorCodes
{
    public const string ValidationError = "VALIDATION_ERROR";
    public const string BadRequest = "BAD_REQUEST";
    public const string Unauthorized = "UNAUTHORIZED";
    public const string Forbidden = "FORBIDDEN";
    public const string NotFound = "NOT_FOUND";
    public const string NotConfigured = "NOT_CONFIGURED";
    public const string RateLimited = "RATE_LIMITED";
    public const string InternalError = "INTERNAL_ERROR";
}

/// <summary>İstemciye kodu ve mesajıyla dönülen beklenen hata</summary>
public class AppException(string code, string message, IReadOnlyDictionary<string, string>? fields = null)
    : Exception(message)
{
    public string Code { get; } = code;
    public IReadOnlyDictionary<string, string>? Fields { get; } = fields;

    public static AppException NotFound(string what) => new(ErrorCodes.NotFound, $"{what} not found.");

    public static AppException Forbidden(string message) => new(ErrorCodes.Forbidden, message);

    public static AppException Validation(string field, string error) =>
        new(ErrorCodes.ValidationError, "Some fields are invalid.", new Dictionary<string, string> { [field] = error });
}
