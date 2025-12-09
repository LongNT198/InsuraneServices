using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddBasePremiumFrequencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BasePremiumLumpSum",
                table: "InsurancePlans",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "BasePremiumQuarterly",
                table: "InsurancePlans",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "BasePremiumSemiAnnual",
                table: "InsurancePlans",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BasePremiumLumpSum",
                table: "InsurancePlans");

            migrationBuilder.DropColumn(
                name: "BasePremiumQuarterly",
                table: "InsurancePlans");

            migrationBuilder.DropColumn(
                name: "BasePremiumSemiAnnual",
                table: "InsurancePlans");
        }
    }
}
