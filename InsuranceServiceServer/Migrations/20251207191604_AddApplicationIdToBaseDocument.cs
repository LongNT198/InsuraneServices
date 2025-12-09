using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationIdToBaseDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApplicationId",
                table: "BaseDocument",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationId",
                table: "BaseDocument");
        }
    }
}
