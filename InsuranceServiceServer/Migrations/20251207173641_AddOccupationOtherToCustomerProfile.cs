using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddOccupationOtherToCustomerProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OccupationOther",
                table: "CustomerProfiles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OccupationOther",
                table: "CustomerProfiles");
        }
    }
}
