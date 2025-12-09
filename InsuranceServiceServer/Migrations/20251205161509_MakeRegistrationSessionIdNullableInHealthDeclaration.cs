using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class MakeRegistrationSessionIdNullableInHealthDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthDeclarations_RegistrationSessions_RegistrationSessionId",
                table: "HealthDeclarations");

            migrationBuilder.AlterColumn<int>(
                name: "RegistrationSessionId",
                table: "HealthDeclarations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_HealthDeclarations_RegistrationSessions_RegistrationSessionId",
                table: "HealthDeclarations",
                column: "RegistrationSessionId",
                principalTable: "RegistrationSessions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthDeclarations_RegistrationSessions_RegistrationSessionId",
                table: "HealthDeclarations");

            migrationBuilder.AlterColumn<int>(
                name: "RegistrationSessionId",
                table: "HealthDeclarations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HealthDeclarations_RegistrationSessions_RegistrationSessionId",
                table: "HealthDeclarations",
                column: "RegistrationSessionId",
                principalTable: "RegistrationSessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
