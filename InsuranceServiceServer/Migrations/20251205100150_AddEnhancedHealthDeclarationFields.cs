using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class AddEnhancedHealthDeclarationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CigarettesPerDay",
                table: "HealthDeclarations",
                newName: "SmokingYears");

            migrationBuilder.AddColumn<string>(
                name: "AlcoholConsumptionLevel",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "AlcoholUnitsPerWeek",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AverageSleepHours",
                table: "HealthDeclarations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BloodPressureDiastolic",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BloodPressureSystolic",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancerDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancerDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancerTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CholesterolLevel",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DangerousSportsDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DiabetesDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiabetesHbA1c",
                table: "HealthDeclarations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiabetesTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiabetesType",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DietQuality",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DisabilityDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DrugDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExerciseHoursPerWeek",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExerciseLevel",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "FamilyCancer",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "FamilyDiabetes",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "FamilyHeartDisease",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "FamilyOtherConditions",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FamilyStroke",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "FatherAgeAtDeath",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FatherCauseOfDeath",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FatherDeceased",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "HIVDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HIVTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasDisability",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasHIV",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasHighBloodPressure",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasHighCholesterol",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasKidneyDisease",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasLifeThreateningCondition",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasLiverDisease",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasMentalHealthCondition",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasOccupationalHazards",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasPendingMedicalTests",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasPlannedProcedures",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasPregnancyComplications",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasStroke",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasSurgeryLast5Years",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "HeartDiseaseDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeartDiseaseTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "HighBloodPressureDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HighBloodPressureTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "HighCholesterolDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HighCholesterolTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HospitalizationHistory",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "KidneyDiseaseDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KidneyDiseaseTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastMedicalCheckupDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LifeThreateningConditionDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LiverDiseaseDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LiverDiseaseTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicalConditionDetailsJson",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicalConditionsJson",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MedicalRecordsConsent",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MentalHealthDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "MentalHealthDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MentalHealthTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MotherAgeAtDeath",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MotherCauseOfDeath",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MotherDeceased",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Occupation",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OccupationHazardsDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ParticipatesInDangerousSports",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PendingTestsDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlannedProceduresDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PregnancyComplicationDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PregnancyDueDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RestingHeartRate",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SleepQuality",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SmokingPacksPerDay",
                table: "HealthDeclarations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SmokingStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StressLevel",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "StrokeDiagnosisDate",
                table: "HealthDeclarations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StrokeTreatmentStatus",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SurgeryDetails",
                table: "HealthDeclarations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "UsesDrugs",
                table: "HealthDeclarations",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlcoholConsumptionLevel",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "AlcoholUnitsPerWeek",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "AverageSleepHours",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "BloodPressureDiastolic",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "BloodPressureSystolic",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "CancerDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "CancerDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "CancerTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "CholesterolLevel",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DangerousSportsDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DiabetesDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DiabetesHbA1c",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DiabetesTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DiabetesType",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DietQuality",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DisabilityDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "DrugDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "ExerciseHoursPerWeek",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "ExerciseLevel",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FamilyCancer",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FamilyDiabetes",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FamilyHeartDisease",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FamilyOtherConditions",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FamilyStroke",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FatherAgeAtDeath",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FatherCauseOfDeath",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "FatherDeceased",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HIVDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HIVTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasDisability",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasHIV",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasHighBloodPressure",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasHighCholesterol",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasKidneyDisease",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasLifeThreateningCondition",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasLiverDisease",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasMentalHealthCondition",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasOccupationalHazards",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasPendingMedicalTests",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasPlannedProcedures",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasPregnancyComplications",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasStroke",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HasSurgeryLast5Years",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HeartDiseaseDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HeartDiseaseTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HighBloodPressureDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HighBloodPressureTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HighCholesterolDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HighCholesterolTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "HospitalizationHistory",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "KidneyDiseaseDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "KidneyDiseaseTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "LastMedicalCheckupDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "LifeThreateningConditionDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "LiverDiseaseDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "LiverDiseaseTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MedicalConditionDetailsJson",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MedicalConditionsJson",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MedicalRecordsConsent",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MentalHealthDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MentalHealthDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MentalHealthTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MotherAgeAtDeath",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MotherCauseOfDeath",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "MotherDeceased",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "Occupation",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "OccupationHazardsDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "ParticipatesInDangerousSports",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "PendingTestsDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "PlannedProceduresDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "PregnancyComplicationDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "PregnancyDueDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "RestingHeartRate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "SleepQuality",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "SmokingPacksPerDay",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "SmokingStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "StressLevel",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "StrokeDiagnosisDate",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "StrokeTreatmentStatus",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "SurgeryDetails",
                table: "HealthDeclarations");

            migrationBuilder.DropColumn(
                name: "UsesDrugs",
                table: "HealthDeclarations");

            migrationBuilder.RenameColumn(
                name: "SmokingYears",
                table: "HealthDeclarations",
                newName: "CigarettesPerDay");
        }
    }
}
