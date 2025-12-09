using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class RemoveGenderOtherFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GenderOther",
                table: "EmployeeProfiles");

            migrationBuilder.DropColumn(
                name: "GenderOther",
                table: "CustomerProfiles");

            migrationBuilder.DropColumn(
                name: "GenderOther",
                table: "Beneficiaries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GenderOther",
                table: "EmployeeProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GenderOther",
                table: "CustomerProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GenderOther",
                table: "Beneficiaries",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
