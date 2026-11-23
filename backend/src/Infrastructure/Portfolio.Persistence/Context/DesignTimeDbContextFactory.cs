using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Portfolio.Persistence.Context;

/// <summary>
/// `dotnet ef migrations add` için. Migration üretmek veritabanına bağlanmayı gerektirmez;
/// bu bağlantı cümlesi gerçek bir sunucuyu göstermez ve hiçbir sır içermez.
/// </summary>
public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PortfolioDbContext>
{
    public PortfolioDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>();
        ServiceRegistration.ConfigureDbContext(options, "Host=localhost;Database=portfolio_design_time");
        return new PortfolioDbContext(options.Options);
    }
}
