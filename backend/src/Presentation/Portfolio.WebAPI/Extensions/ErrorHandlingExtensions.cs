using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Exceptions;

namespace Portfolio.WebAPI.Extensions;

/// <summary>Tüm hatalar aynı zarfla döner: { "error": { "code", "message", "fields"? } }</summary>
public sealed record ErrorEnvelope(ErrorBody Error);

public sealed record ErrorBody(string Code, string Message, IReadOnlyDictionary<string, string>? Fields = null);

public static partial class ErrorHandlingExtensions
{
    [LoggerMessage(Level = LogLevel.Error, Message = "Unhandled error on {Method} {Path}")]
    private static partial void LogUnhandled(ILogger logger, Exception? exception, string method, PathString path);

    private static readonly Dictionary<string, int> StatusByCode = new()
    {
        [ErrorCodes.ValidationError] = StatusCodes.Status400BadRequest,
        [ErrorCodes.BadRequest] = StatusCodes.Status400BadRequest,
        [ErrorCodes.Unauthorized] = StatusCodes.Status401Unauthorized,
        [ErrorCodes.Forbidden] = StatusCodes.Status403Forbidden,
        [ErrorCodes.NotFound] = StatusCodes.Status404NotFound,
        [ErrorCodes.NotConfigured] = StatusCodes.Status503ServiceUnavailable,
        [ErrorCodes.RateLimited] = StatusCodes.Status429TooManyRequests,
        [ErrorCodes.InternalError] = StatusCodes.Status500InternalServerError,
    };

    private static readonly Dictionary<int, ErrorBody> DefaultByStatus = new()
    {
        [StatusCodes.Status400BadRequest] = new(ErrorCodes.BadRequest, "The request is malformed."),
        [StatusCodes.Status401Unauthorized] = new(ErrorCodes.Unauthorized, "Authentication is required."),
        [StatusCodes.Status403Forbidden] = new(ErrorCodes.Forbidden, "You are not allowed to do this."),
        [StatusCodes.Status404NotFound] = new(ErrorCodes.NotFound, "Not found."),
        [StatusCodes.Status405MethodNotAllowed] = new(ErrorCodes.BadRequest, "This method is not allowed on this resource."),
        [StatusCodes.Status429TooManyRequests] = new(ErrorCodes.RateLimited, "Too many requests. Try again later."),
        [StatusCodes.Status500InternalServerError] = new(ErrorCodes.InternalError, "Something went wrong."),
    };

    /// <summary>Model doğrulama hataları da aynı zarfla döner</summary>
    public static IMvcBuilder AddErrorEnvelope(this IMvcBuilder builder) =>
        builder.ConfigureApiBehaviorOptions(options =>
        {
            options.SuppressMapClientErrors = true;
            options.InvalidModelStateResponseFactory = context =>
            {
                var fields = context.ModelState
                    .Where(e => e.Value?.Errors.Count > 0)
                    .ToDictionary(e => e.Key, _ => "INVALID_VALUE");
                return new BadRequestObjectResult(
                    new ErrorEnvelope(new ErrorBody(ErrorCodes.ValidationError, "Some fields are invalid.", fields)));
            };
        });

    public static WebApplication UseErrorEnvelope(this WebApplication app)
    {
        // Beklenmeyen hatalar loglanır; istemciye yalnızca genel mesaj gider (yığın izi sızmaz)
        app.UseExceptionHandler(handler => handler.Run(async context =>
        {
            var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
            ErrorBody body;
            int status;
            if (exception is AppException appException)
            {
                status = StatusByCode.GetValueOrDefault(appException.Code, StatusCodes.Status400BadRequest);
                body = status == StatusCodes.Status500InternalServerError && appException.Code == ErrorCodes.InternalError
                    ? DefaultByStatus[status]
                    : new ErrorBody(appException.Code, appException.Message, appException.Fields);
            }
            else
            {
                status = StatusCodes.Status500InternalServerError;
                body = DefaultByStatus[status];
            }
            if (status == StatusCodes.Status500InternalServerError)
            {
                var logger = context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("Portfolio.Errors");
                LogUnhandled(logger, exception, context.Request.Method, context.Request.Path);
            }
            context.Response.StatusCode = status;
            await context.Response.WriteAsJsonAsync(new ErrorEnvelope(body));
        }));

        // Gövdesiz 4xx yanıtlarını (ör. bilinmeyen route) zarfa çevirir
        app.UseStatusCodePages(async context =>
        {
            var response = context.HttpContext.Response;
            if (response.HasStarted || response.ContentLength > 0) return;
            var body = DefaultByStatus.GetValueOrDefault(response.StatusCode)
                ?? new ErrorBody(ErrorCodes.BadRequest, "The request could not be processed.");
            await response.WriteAsJsonAsync(new ErrorEnvelope(body));
        });

        return app;
    }
}
