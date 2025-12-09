using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddProductManagementFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "InsuranceProducts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "InsuranceProducts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "InsuranceProducts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ShortDescription",
                table: "InsuranceProducts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "InsuranceProducts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "InsuranceProducts");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "InsuranceProducts");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "InsuranceProducts");

            migrationBuilder.DropColumn(
                name: "ShortDescription",
                table: "InsuranceProducts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "InsuranceProducts");
        }
    }
}
