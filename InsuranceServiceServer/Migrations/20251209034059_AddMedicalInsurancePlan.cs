using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicalInsurancePlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicalInsurancePlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    PlanName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnnualCoverageLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LifetimeCoverageLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Deductible = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CoPaymentPercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OutOfPocketMaximum = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TermYears = table.Column<int>(type: "int", nullable: false),
                    RoomAndBoardDailyLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ICUDailyLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HospitalizationCoveragePercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxHospitalizationDays = table.Column<int>(type: "int", nullable: false),
                    OutpatientAnnualLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DoctorVisitCopay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SpecialistVisitCopay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiagnosticTestsCoveragePercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PrescriptionDrugAnnualLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GenericDrugCopay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BrandNameDrugCopay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IncludesMaternityBenefit = table.Column<bool>(type: "bit", nullable: false),
                    MaternityCoverageLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IncludesDentalBasic = table.Column<bool>(type: "bit", nullable: false),
                    DentalAnnualLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IncludesVisionBasic = table.Column<bool>(type: "bit", nullable: false),
                    VisionAnnualLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AnnualHealthCheckupIncluded = table.Column<bool>(type: "bit", nullable: false),
                    PreventiveCareIncluded = table.Column<bool>(type: "bit", nullable: false),
                    MentalHealthCoverageIncluded = table.Column<bool>(type: "bit", nullable: false),
                    MentalHealthSessionLimit = table.Column<int>(type: "int", nullable: true),
                    EmergencyRoomCopay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AmbulanceServiceIncluded = table.Column<bool>(type: "bit", nullable: false),
                    CriticalIllnessBenefit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AccidentalInjuryCoverage = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NetworkHospitalsOnly = table.Column<bool>(type: "bit", nullable: false),
                    RequiresReferralForSpecialist = table.Column<bool>(type: "bit", nullable: false),
                    PreAuthorizationRequired = table.Column<bool>(type: "bit", nullable: false),
                    GeneralWaitingPeriodDays = table.Column<int>(type: "int", nullable: false),
                    PreExistingConditionWaitingPeriodMonths = table.Column<int>(type: "int", nullable: false),
                    MaternityWaitingPeriodMonths = table.Column<int>(type: "int", nullable: true),
                    BasePremiumMonthly = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BasePremiumQuarterly = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BasePremiumSemiAnnual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BasePremiumAnnual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BasePremiumLumpSum = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier18_25 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier26_35 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier36_45 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier46_55 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier56_65 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthExcellentMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthGoodMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthFairMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthPoorMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaleMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FemaleMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OccupationLowRiskMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OccupationMediumRiskMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OccupationHighRiskMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinAge = table.Column<int>(type: "int", nullable: false),
                    MaxAge = table.Column<int>(type: "int", nullable: false),
                    RequiresMedicalExam = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    IsPopular = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalInsurancePlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalInsurancePlans_InsuranceProducts_ProductId",
                        column: x => x.ProductId,
                        principalTable: "InsuranceProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsurancePlans_ProductId",
                table: "MedicalInsurancePlans",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalInsurancePlans");
        }
    }
}
