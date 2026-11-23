using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Abstractions;
using Portfolio.Infrastructure.Storage;

namespace Portfolio.Infrastructure;

/// <summary>Dış sistemlerle (dosya sistemi vb.) konuşan servisler</summary>
public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string uploadsDirectory)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<IImageStorage>(new LocalImageStorage(uploadsDirectory));
        return services;
    }
}
