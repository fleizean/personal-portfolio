using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.OutputCaching;
using Portfolio.Application.Exceptions;
using Portfolio.WebAPI.Extensions;

namespace Portfolio.WebAPI.Filters;

/// <summary>
/// Admin yazma isteklerinin ortak kuralları:
/// 1) CSRF: istek özel bir başlık taşımalıdır. Başka bir sitedeki sayfa bu başlığı ancak
///    CORS ön kontrolüyle ekleyebilir; API hiçbir kaynağa CORS izni vermez.
/// 2) Başarılı yazmadan sonra içerik önbelleği temizlenir; site değişikliği hemen görür.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class AdminMutationAttribute : Attribute, IAsyncActionFilter
{
    public const string HeaderName = "X-Portfolio-Admin";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var request = context.HttpContext.Request;
        var isSafe = HttpMethods.IsGet(request.Method) || HttpMethods.IsHead(request.Method) || HttpMethods.IsOptions(request.Method);
        if (isSafe)
        {
            await next();
            return;
        }

        if (request.Headers[HeaderName] != "1")
        {
            throw AppException.Forbidden("Missing admin request header.");
        }

        var executed = await next();
        if (executed.Exception is null && executed.Result is not ObjectResult { StatusCode: >= 400 })
        {
            var cache = context.HttpContext.RequestServices.GetRequiredService<IOutputCacheStore>();
            await cache.EvictByTagAsync(PlatformExtensions.ContentCacheTag, context.HttpContext.RequestAborted);
        }
    }
}
