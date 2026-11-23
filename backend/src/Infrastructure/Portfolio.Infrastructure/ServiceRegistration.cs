using Microsoft.Extensions.DependencyInjection;

namespace Portfolio.Infrastructure;

/// <summary>
/// Dış sistemlerle konuşan servisler buraya kaydedilir. Sıradaki adımlar:
/// GitHub ile admin girişi, görsel yükleme ve içerik değişince frontend önbelleğini yenileme.
/// </summary>
public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        // Saat soyutlaması: test edilebilir zaman (ör. oturum süreleri) için tek kaynak
        services.AddSingleton(TimeProvider.System);
        return services;
    }
}
