namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Health Declaration - Enhanced with comprehensive health tracking
    /// Updated to support 11-factor health scoring and detailed medical history
    /// </summary>
    public class HealthDeclaration
    {
        public int Id { get; set; }
        public int? RegistrationSessionId { get; set; } // Made nullable for standalone health declarations
        public string CustomerProfileId { get; set; } = string.Empty;
        
        // ===== VITAL STATISTICS =====
        public decimal Height { get; set; } // cm (100-250)
        public decimal Weight { get; set; } // kg (30-300)
        public decimal BMI { get; set; }
        public string? BloodType { get; set; }
        public int? BloodPressureSystolic { get; set; } // mmHg (70-200)
        public int? BloodPressureDiastolic { get; set; } // mmHg (40-130)
        public int? CholesterolLevel { get; set; } // mg/dL (100-400)
        public int? RestingHeartRate { get; set; } // bpm (40-120)
        
        // ===== LIFESTYLE & HABITS - ENHANCED =====
        // Smoking
        public string SmokingStatus { get; set; } = "non-smoker"; // non-smoker, occasional, regular, heavy
        public bool IsSmoker { get; set; }
        public int? SmokingPacksPerDay { get; set; }
        public int? SmokingYears { get; set; }
        
        // Alcohol
        public string AlcoholConsumptionLevel { get; set; } = "none"; // none, light, moderate, heavy
        public bool IsDrinker { get; set; }
        public string? AlcoholFrequency { get; set; }
        public int? AlcoholUnitsPerWeek { get; set; }
        
        // Drugs
        public bool UsesDrugs { get; set; }
        public string? DrugDetails { get; set; }
        
        // Exercise (NEW - Enhanced)
        public bool IsExercising { get; set; }
        public string ExerciseLevel { get; set; } = "moderate"; // sedentary, light, moderate, active, very-active
        public string? ExerciseFrequency { get; set; }
        public int? ExerciseHoursPerWeek { get; set; }
        
        // Sleep Quality (NEW)
        public string SleepQuality { get; set; } = "good"; // poor, fair, good, excellent
        public decimal? AverageSleepHours { get; set; }
        
        // Stress Level (NEW)
        public string StressLevel { get; set; } = "moderate"; // low, moderate, high, very-high
        
        // Diet Quality (NEW)
        public string DietQuality { get; set; } = "balanced"; // poor, fair, balanced, healthy, very-healthy
        
        // ===== SPECIFIC DISEASES - WITH DETAILED TRACKING =====
        // Heart Disease
        public bool HasHeartDisease { get; set; }
        public DateTime? HeartDiseaseDiagnosisDate { get; set; }
        public string? HeartDiseaseTreatmentStatus { get; set; } // Controlled, Uncontrolled, Remission, Cured
        
        // Stroke
        public bool HasStroke { get; set; }
        public DateTime? StrokeDiagnosisDate { get; set; }
        public string? StrokeTreatmentStatus { get; set; }
        
        // Cancer
        public bool HasCancer { get; set; }
        public string? CancerDetails { get; set; }
        public DateTime? CancerDiagnosisDate { get; set; }
        public string? CancerTreatmentStatus { get; set; }
        
        // Diabetes
        public bool HasDiabetes { get; set; }
        public string? DiabetesType { get; set; } // Type 1, Type 2, Gestational
        public DateTime? DiabetesDiagnosisDate { get; set; }
        public string? DiabetesTreatmentStatus { get; set; }
        public decimal? DiabetesHbA1c { get; set; } // Latest HbA1c reading
        
        // High Blood Pressure
        public bool HasHypertension { get; set; }
        public bool HasHighBloodPressure { get; set; }
        public DateTime? HighBloodPressureDiagnosisDate { get; set; }
        public string? HighBloodPressureTreatmentStatus { get; set; }
        
        // High Cholesterol
        public bool HasHighCholesterol { get; set; }
        public DateTime? HighCholesterolDiagnosisDate { get; set; }
        public string? HighCholesterolTreatmentStatus { get; set; }
        
        // Kidney Disease
        public bool HasKidneyDisease { get; set; }
        public DateTime? KidneyDiseaseDiagnosisDate { get; set; }
        public string? KidneyDiseaseTreatmentStatus { get; set; }
        
        // Liver Disease
        public bool HasLiverDisease { get; set; }
        public DateTime? LiverDiseaseDiagnosisDate { get; set; }
        public string? LiverDiseaseTreatmentStatus { get; set; }
        
        // Mental Health
        public bool HasMentalIllness { get; set; }
        public bool HasMentalHealthCondition { get; set; }
        public string? MentalHealthDetails { get; set; }
        public DateTime? MentalHealthDiagnosisDate { get; set; }
        public string? MentalHealthTreatmentStatus { get; set; }
        
        // HIV/AIDS
        public bool HasHIV { get; set; }
        public DateTime? HIVDiagnosisDate { get; set; }
        public string? HIVTreatmentStatus { get; set; }
        
        // ===== MEDICAL HISTORY (JSON) =====
        public string? CurrentMedicationsJson { get; set; }
        public string? MedicalConditionsJson { get; set; }
        public string? MedicalConditionDetailsJson { get; set; }
        public string? PastIllnessesJson { get; set; }
        public string? ChronicConditionsJson { get; set; }
        public string? SurgeriesJson { get; set; }
        public string? AllergiesJson { get; set; }
        public string? FamilyMedicalHistoryJson { get; set; }
        
        // ===== RECENT MEDICAL EVENTS =====
        public bool HasRecentHospitalization { get; set; }
        public DateTime? LastHospitalizationDate { get; set; }
        public string? HospitalizationReason { get; set; }
        public string? HospitalizationHistory { get; set; }
        public bool HasUpcomingSurgery { get; set; }
        public bool HasSurgeryLast5Years { get; set; }
        public string? SurgeryDetails { get; set; }
        public bool HasPendingMedicalTests { get; set; }
        public string? PendingTestsDetails { get; set; }
        public bool HasPlannedProcedures { get; set; }
        public string? PlannedProceduresDetails { get; set; }
        public DateTime? LastMedicalCheckupDate { get; set; }
        
        // ===== FAMILY MEDICAL HISTORY =====
        public bool FamilyHeartDisease { get; set; }
        public bool FamilyCancer { get; set; }
        public bool FamilyDiabetes { get; set; }
        public bool FamilyStroke { get; set; }
        public string? FamilyOtherConditions { get; set; }
        public bool FatherDeceased { get; set; }
        public int? FatherAgeAtDeath { get; set; }
        public string? FatherCauseOfDeath { get; set; }
        public bool MotherDeceased { get; set; }
        public int? MotherAgeAtDeath { get; set; }
        public string? MotherCauseOfDeath { get; set; }
        
        // ===== PREGNANCY =====
        public bool IsPregnant { get; set; }
        public DateTime? PregnancyDueDate { get; set; }
        public int? PregnancyWeeks { get; set; }
        public bool HasPregnancyComplications { get; set; }
        public string? PregnancyComplicationDetails { get; set; }
        
        // ===== OCCUPATION & RISK =====
        public string? Occupation { get; set; }
        public bool HasHighRiskOccupation { get; set; }
        public bool HasOccupationalHazards { get; set; }
        public string? OccupationRiskDetails { get; set; }
        public string? OccupationHazardsDetails { get; set; }
        public bool WorksWithHazardousMaterials { get; set; }
        public bool HasFrequentTravel { get; set; }
        public bool ParticipatesInDangerousSports { get; set; }
        public string? DangerousSportsDetails { get; set; }
        
        // ===== DISABILITY & LIFE-THREATENING CONDITIONS =====
        public bool HasDisability { get; set; }
        public string? DisabilityDetails { get; set; }
        public bool HasLifeThreateningCondition { get; set; }
        public string? LifeThreateningConditionDetails { get; set; }
        
        // ===== DOCUMENTS & CONSENT =====
        public bool RequiresMedicalExam { get; set; }
        public string? MedicalExamResultPath { get; set; }
        public string? LabReportPath { get; set; }
        public bool MedicalRecordsConsent { get; set; }
        
        // ===== DECLARATION & STATUS =====
        public bool IsDeclarationAccurate { get; set; }
        public DateTime DeclarationDate { get; set; } = DateTime.UtcNow;
        public string? DeclarationSignature { get; set; }
        public string Status { get; set; } = "Submitted"; // Submitted, UnderReview, Approved, RequiresExam
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedDate { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ReviewNotes { get; set; }
        
        // Navigation
        public RegistrationSession? RegistrationSession { get; set; }
    }
}



