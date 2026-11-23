using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;

namespace Portfolio.Persistence.Context.Configurations;

// Çeviriler sahip varlığa ait (owned) koleksiyonlardır: ayrı tabloda durur,
// anahtarları (sahip id, dil) çiftidir ve sahip sorgulanınca birlikte yüklenir.

internal sealed class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(120);
        builder.Property(p => p.Email).HasMaxLength(254);
        builder.OwnsMany(p => p.Translations, t =>
        {
            t.ToTable("profile_translations");
            t.WithOwner().HasForeignKey(x => x.ProfileId);
            t.HasKey(x => new { x.ProfileId, x.Language });
            t.Property(x => x.Greeting).HasMaxLength(200);
            t.Property(x => x.Role).HasMaxLength(200);
            t.Property(x => x.Company).HasMaxLength(200);
            t.Property(x => x.Description).HasMaxLength(2000);
            t.Property(x => x.PortraitAlt).HasMaxLength(200);
            t.Property(x => x.Location).HasMaxLength(200);
            t.Property(x => x.ContactTitle).HasMaxLength(200);
            t.Property(x => x.ContactText).HasMaxLength(2000);
        });
        builder.OwnsMany(p => p.Socials, s =>
        {
            s.ToTable("social_links");
            s.WithOwner().HasForeignKey(x => x.ProfileId);
            s.HasKey(x => x.Id);
            s.Property(x => x.Label).HasMaxLength(60);
            s.Property(x => x.Url).HasMaxLength(500);
        });
    }
}

internal sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(120);
        builder.Property(p => p.Year).HasMaxLength(20);
        builder.Property(p => p.GithubUrl).HasMaxLength(500);
        builder.Property(p => p.LiveUrl).HasMaxLength(500);
        builder.Property(p => p.ImagePath).HasMaxLength(300);
        builder.HasIndex(p => p.SortOrder);
        builder.OwnsMany(p => p.Translations, t =>
        {
            t.ToTable("project_translations");
            t.WithOwner().HasForeignKey(x => x.ProjectId);
            t.HasKey(x => new { x.ProjectId, x.Language });
            t.Property(x => x.Description).HasMaxLength(4000);
        });
    }
}

internal sealed class JourneyEntryConfiguration : IEntityTypeConfiguration<JourneyEntry>
{
    public void Configure(EntityTypeBuilder<JourneyEntry> builder)
    {
        builder.Property(j => j.Link).HasMaxLength(500);
        builder.Property(j => j.ImagePath).HasMaxLength(300);
        builder.HasIndex(j => j.SortOrder);
        builder.OwnsMany(j => j.Translations, t =>
        {
            t.ToTable("journey_entry_translations");
            t.WithOwner().HasForeignKey(x => x.JourneyEntryId);
            t.HasKey(x => new { x.JourneyEntryId, x.Language });
            t.Property(x => x.Title).HasMaxLength(200);
            t.Property(x => x.Place).HasMaxLength(200);
            t.Property(x => x.Period).HasMaxLength(60);
            t.Property(x => x.Description).HasMaxLength(4000);
        });
    }
}

internal sealed class TechnologyConfiguration : IEntityTypeConfiguration<Technology>
{
    public void Configure(EntityTypeBuilder<Technology> builder)
    {
        builder.Property(t => t.Name).HasMaxLength(80);
        builder.Property(t => t.Link).HasMaxLength(500);
        builder.HasIndex(t => t.SortOrder);
        builder.OwnsMany(t => t.Translations, tr =>
        {
            tr.ToTable("technology_translations");
            tr.WithOwner().HasForeignKey(x => x.TechnologyId);
            tr.HasKey(x => new { x.TechnologyId, x.Language });
            tr.Property(x => x.Description).HasMaxLength(1000);
        });
    }
}

internal sealed class SchoolExperienceConfiguration : IEntityTypeConfiguration<SchoolExperience>
{
    public void Configure(EntityTypeBuilder<SchoolExperience> builder)
    {
        builder.Property(s => s.Link).HasMaxLength(500);
        builder.Property(s => s.ImagePath).HasMaxLength(300);
        builder.HasIndex(s => s.SortOrder);
        builder.OwnsMany(s => s.Translations, t =>
        {
            t.ToTable("school_experience_translations");
            t.WithOwner().HasForeignKey(x => x.SchoolExperienceId);
            t.HasKey(x => new { x.SchoolExperienceId, x.Language });
            t.Property(x => x.Title).HasMaxLength(200);
            t.Property(x => x.Period).HasMaxLength(60);
            t.Property(x => x.Description).HasMaxLength(4000);
            t.Property(x => x.Reflection).HasMaxLength(4000);
        });
    }
}
