using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddCompleteBeneficiaryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Beneficiaries");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Beneficiaries",
                newName: "SSN");

            migrationBuilder.RenameColumn(
                name: "BenefitPercentage",
                table: "Beneficiaries",
                newName: "Percentage");

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Beneficiaries",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Beneficiaries",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsIrrevocable",
                table: "Beneficiaries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsMinor",
                table: "Beneficiaries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PerStirpes",
                table: "Beneficiaries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Beneficiaries",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Beneficiaries",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Beneficiaries",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Trustee",
                table: "Beneficiaries",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrusteeRelationship",
                table: "Beneficiaries",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Beneficiaries",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "IsIrrevocable",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "IsMinor",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "PerStirpes",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "Trustee",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "TrusteeRelationship",
                table: "Beneficiaries");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Beneficiaries");

            migrationBuilder.RenameColumn(
                name: "SSN",
                table: "Beneficiaries",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "Percentage",
                table: "Beneficiaries",
                newName: "BenefitPercentage");

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Beneficiaries",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Beneficiaries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
