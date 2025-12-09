using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class HealthDeclaration
{
    public int Id { get; set; }

    public int? RegistrationSessionId { get; set; }

    public string CustomerProfileId { get; set; } = null!;

    public decimal Height { get; set; }

    public decimal Weight { get; set; }

    public decimal Bmi { get; set; }

    public string? BloodType { get; set; }

    public bool IsSmoker { get; set; }

    public int? SmokingYears { get; set; }

    public bool IsDrinker { get; set; }

    public string? AlcoholFrequency { get; set; }

    public bool IsExercising { get; set; }

    public string? ExerciseFrequency { get; set; }

    public string? CurrentMedicationsJson { get; set; }

    public string? PastIllnessesJson { get; set; }

    public string? ChronicConditionsJson { get; set; }

    public string? SurgeriesJson { get; set; }

    public string? AllergiesJson { get; set; }

    public string? FamilyMedicalHistoryJson { get; set; }

    public bool HasHeartDisease { get; set; }

    public bool HasDiabetes { get; set; }

    public bool HasCancer { get; set; }

    public bool HasHypertension { get; set; }

    public bool HasMentalIllness { get; set; }

    public bool IsPregnant { get; set; }

    public int? PregnancyWeeks { get; set; }

    public bool HasHighRiskOccupation { get; set; }

    public string? OccupationRiskDetails { get; set; }

    public bool WorksWithHazardousMaterials { get; set; }

    public bool HasFrequentTravel { get; set; }

    public bool HasRecentHospitalization { get; set; }

    public DateTime? LastHospitalizationDate { get; set; }

    public string? HospitalizationReason { get; set; }

    public bool HasUpcomingSurgery { get; set; }

    public bool RequiresMedicalExam { get; set; }

    public string? MedicalExamResultPath { get; set; }

    public string? LabReportPath { get; set; }

    public bool IsDeclarationAccurate { get; set; }

    public DateTime DeclarationDate { get; set; }

    public string? DeclarationSignature { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public DateTime? ReviewedDate { get; set; }

    public string? ReviewedBy { get; set; }

    public string? ReviewNotes { get; set; }

    public string AlcoholConsumptionLevel { get; set; } = null!;

    public int? AlcoholUnitsPerWeek { get; set; }

    public decimal? AverageSleepHours { get; set; }

    public int? BloodPressureDiastolic { get; set; }

    public int? BloodPressureSystolic { get; set; }

    public string? CancerDetails { get; set; }

    public DateTime? CancerDiagnosisDate { get; set; }

    public string? CancerTreatmentStatus { get; set; }

    public int? CholesterolLevel { get; set; }

    public string? DangerousSportsDetails { get; set; }

    public DateTime? DiabetesDiagnosisDate { get; set; }

    public decimal? DiabetesHbA1c { get; set; }

    public string? DiabetesTreatmentStatus { get; set; }

    public string? DiabetesType { get; set; }

    public string DietQuality { get; set; } = null!;

    public string? DisabilityDetails { get; set; }

    public string? DrugDetails { get; set; }

    public int? ExerciseHoursPerWeek { get; set; }

    public string ExerciseLevel { get; set; } = null!;

    public bool FamilyCancer { get; set; }

    public bool FamilyDiabetes { get; set; }

    public bool FamilyHeartDisease { get; set; }

    public string? FamilyOtherConditions { get; set; }

    public bool FamilyStroke { get; set; }

    public int? FatherAgeAtDeath { get; set; }

    public string? FatherCauseOfDeath { get; set; }

    public bool FatherDeceased { get; set; }

    public DateTime? HivdiagnosisDate { get; set; }

    public string? HivtreatmentStatus { get; set; }

    public bool HasDisability { get; set; }

    public bool HasHiv { get; set; }

    public bool HasHighBloodPressure { get; set; }

    public bool HasHighCholesterol { get; set; }

    public bool HasKidneyDisease { get; set; }

    public bool HasLifeThreateningCondition { get; set; }

    public bool HasLiverDisease { get; set; }

    public bool HasMentalHealthCondition { get; set; }

    public bool HasOccupationalHazards { get; set; }

    public bool HasPendingMedicalTests { get; set; }

    public bool HasPlannedProcedures { get; set; }

    public bool HasPregnancyComplications { get; set; }

    public bool HasStroke { get; set; }

    public bool HasSurgeryLast5Years { get; set; }

    public DateTime? HeartDiseaseDiagnosisDate { get; set; }

    public string? HeartDiseaseTreatmentStatus { get; set; }

    public DateTime? HighBloodPressureDiagnosisDate { get; set; }

    public string? HighBloodPressureTreatmentStatus { get; set; }

    public DateTime? HighCholesterolDiagnosisDate { get; set; }

    public string? HighCholesterolTreatmentStatus { get; set; }

    public string? HospitalizationHistory { get; set; }

    public DateTime? KidneyDiseaseDiagnosisDate { get; set; }

    public string? KidneyDiseaseTreatmentStatus { get; set; }

    public DateTime? LastMedicalCheckupDate { get; set; }

    public string? LifeThreateningConditionDetails { get; set; }

    public DateTime? LiverDiseaseDiagnosisDate { get; set; }

    public string? LiverDiseaseTreatmentStatus { get; set; }

    public string? MedicalConditionDetailsJson { get; set; }

    public string? MedicalConditionsJson { get; set; }

    public bool MedicalRecordsConsent { get; set; }

    public string? MentalHealthDetails { get; set; }

    public DateTime? MentalHealthDiagnosisDate { get; set; }

    public string? MentalHealthTreatmentStatus { get; set; }

    public int? MotherAgeAtDeath { get; set; }

    public string? MotherCauseOfDeath { get; set; }

    public bool MotherDeceased { get; set; }

    public string? Occupation { get; set; }

    public string? OccupationHazardsDetails { get; set; }

    public bool ParticipatesInDangerousSports { get; set; }

    public string? PendingTestsDetails { get; set; }

    public string? PlannedProceduresDetails { get; set; }

    public string? PregnancyComplicationDetails { get; set; }

    public DateTime? PregnancyDueDate { get; set; }

    public int? RestingHeartRate { get; set; }

    public string SleepQuality { get; set; } = null!;

    public int? SmokingPacksPerDay { get; set; }

    public string SmokingStatus { get; set; } = null!;

    public string StressLevel { get; set; } = null!;

    public DateTime? StrokeDiagnosisDate { get; set; }

    public string? StrokeTreatmentStatus { get; set; }

    public string? SurgeryDetails { get; set; }

    public bool UsesDrugs { get; set; }

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

    public virtual RegistrationSession? RegistrationSession { get; set; }
}
