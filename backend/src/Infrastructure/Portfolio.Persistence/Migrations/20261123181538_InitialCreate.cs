using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Portfolio.Persistence.Migrations;

/// <inheritdoc />
public partial class _20261123181538_InitialCreate : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "journey_entries",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                kind = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                link = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                image_path = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                is_current = table.Column<bool>(type: "boolean", nullable: false),
                sort_order = table.Column<int>(type: "integer", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_journey_entries", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "profiles",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_profiles", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "projects",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                year = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                tech_stack = table.Column<List<string>>(type: "text[]", nullable: false),
                github_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                live_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                image_path = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                is_current = table.Column<bool>(type: "boolean", nullable: false),
                sort_order = table.Column<int>(type: "integer", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_projects", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "school_experiences",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                link = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                image_path = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                sort_order = table.Column<int>(type: "integer", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_school_experiences", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "technologies",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                category = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                link = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                sort_order = table.Column<int>(type: "integer", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_technologies", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "journey_entry_translations",
            columns: table => new
            {
                journey_entry_id = table.Column<long>(type: "bigint", nullable: false),
                language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                place = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                period = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_journey_entry_translations", x => new { x.journey_entry_id, x.language });
                table.ForeignKey(
                    name: "fk_journey_entry_translations_journey_entries_journey_entry_id",
                    column: x => x.journey_entry_id,
                    principalTable: "journey_entries",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "profile_translations",
            columns: table => new
            {
                profile_id = table.Column<long>(type: "bigint", nullable: false),
                language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                greeting = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                role = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                company = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                portrait_alt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                contact_title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                contact_text = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_profile_translations", x => new { x.profile_id, x.language });
                table.ForeignKey(
                    name: "fk_profile_translations_profiles_profile_id",
                    column: x => x.profile_id,
                    principalTable: "profiles",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "social_links",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                profile_id = table.Column<long>(type: "bigint", nullable: false),
                kind = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                label = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                sort_order = table.Column<int>(type: "integer", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_social_links", x => x.id);
                table.ForeignKey(
                    name: "fk_social_links_profiles_profile_id",
                    column: x => x.profile_id,
                    principalTable: "profiles",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "project_translations",
            columns: table => new
            {
                project_id = table.Column<long>(type: "bigint", nullable: false),
                language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_project_translations", x => new { x.project_id, x.language });
                table.ForeignKey(
                    name: "fk_project_translations_projects_project_id",
                    column: x => x.project_id,
                    principalTable: "projects",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "school_experience_translations",
            columns: table => new
            {
                school_experience_id = table.Column<long>(type: "bigint", nullable: false),
                language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                period = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                highlights = table.Column<List<string>>(type: "text[]", nullable: false),
                reflection = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_school_experience_translations", x => new { x.school_experience_id, x.language });
                table.ForeignKey(
                    name: "fk_school_experience_translations_school_experiences_school_ex",
                    column: x => x.school_experience_id,
                    principalTable: "school_experiences",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "technology_translations",
            columns: table => new
            {
                technology_id = table.Column<long>(type: "bigint", nullable: false),
                language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_technology_translations", x => new { x.technology_id, x.language });
                table.ForeignKey(
                    name: "fk_technology_translations_technologies_technology_id",
                    column: x => x.technology_id,
                    principalTable: "technologies",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "ix_journey_entries_sort_order",
            table: "journey_entries",
            column: "sort_order");

        migrationBuilder.CreateIndex(
            name: "ix_projects_sort_order",
            table: "projects",
            column: "sort_order");

        migrationBuilder.CreateIndex(
            name: "ix_school_experiences_sort_order",
            table: "school_experiences",
            column: "sort_order");

        migrationBuilder.CreateIndex(
            name: "ix_social_links_profile_id",
            table: "social_links",
            column: "profile_id");

        migrationBuilder.CreateIndex(
            name: "ix_technologies_sort_order",
            table: "technologies",
            column: "sort_order");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "journey_entry_translations");

        migrationBuilder.DropTable(
            name: "profile_translations");

        migrationBuilder.DropTable(
            name: "project_translations");

        migrationBuilder.DropTable(
            name: "school_experience_translations");

        migrationBuilder.DropTable(
            name: "social_links");

        migrationBuilder.DropTable(
            name: "technology_translations");

        migrationBuilder.DropTable(
            name: "journey_entries");

        migrationBuilder.DropTable(
            name: "projects");

        migrationBuilder.DropTable(
            name: "school_experiences");

        migrationBuilder.DropTable(
            name: "profiles");

        migrationBuilder.DropTable(
            name: "technologies");
    }
}
