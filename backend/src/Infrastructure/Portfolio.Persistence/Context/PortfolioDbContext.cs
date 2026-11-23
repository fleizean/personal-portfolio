using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;

namespace Portfolio.Persistence.Context;

public class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : DbContext(options)
{
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<JourneyEntry> JourneyEntries => Set<JourneyEntry>();
    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<SchoolExperience> SchoolExperiences => Set<SchoolExperience>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PortfolioDbContext).Assembly);

    /// <summary>Enum'lar veritabanında sayı yerine okunabilir metin olarak saklanır</summary>
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Language>().HaveConversion<string>().HaveMaxLength(8);
        configurationBuilder.Properties<ProjectStatus>().HaveConversion<string>().HaveMaxLength(32);
        configurationBuilder.Properties<JourneyKind>().HaveConversion<string>().HaveMaxLength(32);
        configurationBuilder.Properties<TechCategory>().HaveConversion<string>().HaveMaxLength(32);
        configurationBuilder.Properties<SocialKind>().HaveConversion<string>().HaveMaxLength(32);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added) entry.Entity.CreatedAt = now;
            if (entry.State is EntityState.Added or EntityState.Modified) entry.Entity.UpdatedAt = now;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
