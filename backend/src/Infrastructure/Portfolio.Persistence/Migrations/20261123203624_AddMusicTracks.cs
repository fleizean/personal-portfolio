using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Portfolio.Persistence.Migrations;

/// <inheritdoc />
public partial class _20261123203624_AddMusicTracks : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "music_tracks",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                artist = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                video_id = table.Column<string>(type: "character(11)", fixedLength: true, maxLength: 11, nullable: false),
                sort_order = table.Column<int>(type: "integer", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_music_tracks", x => x.id);
            });

        migrationBuilder.CreateIndex(
            name: "ix_music_tracks_sort_order",
            table: "music_tracks",
            column: "sort_order");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "music_tracks");
    }
}
