namespace InsuranceServiceServer.Shared.DTOs;

public class MedicalConditionDetail
{
    public string ConditionName { get; set; } = string.Empty;
    public string? DiagnosisDate { get; set; }
    public string TreatmentStatus { get; set; } = "Unknown"; // Controlled, Uncontrolled, Remission, Cured
    public string? CurrentTreatment { get; set; }
    public string? LastCheckupDate { get; set; }
}

public class ApplicationRequest
{
    public int? ProductId { get; set; }
    public decimal CoverageAmount { get; set; }
    public int TermYears { get; set; }
    public string PaymentFrequency { get; set; } = "Monthly";
    public decimal PremiumAmount { get; set; }

    // Applicant Information
    public ApplicantDto Applicant { get; set; } = new();

    // Health Declaration
    public HealthDeclarationDto HealthDeclaration { get; set; } = new();

    // Beneficiaries
    public List<BeneficiaryDto> Beneficiaries { get; set; } = new();

    // Documents (file paths or base64)
    public DocumentsDto Documents { get; set; } = new();

    // Terms
    public bool TermsAccepted { get; set; }
    public bool DeclarationAccepted { get; set; }
}

public class ApplicantDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string? OccupationOther { get; set; } // Specify when Occupation = "Other"
    public decimal? AnnualIncome { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    
    // Emergency Contact
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? EmergencyContactGender { get; set; }
    public string? EmergencyContactRelationship { get; set; }
    public string? EmergencyContactRelationshipOther { get; set; } // Specify when EmergencyContactRelationship = "Other"
}

public class HealthDeclarationDto
{
    // Basic Medical History
    public bool HasMedicalConditions { get; set; }
    public List<string> MedicalConditions { get; set; } = new();
    public List<MedicalConditionDetail>? MedicalConditionDetails { get; set; } = new();
    public bool IsOnMedication { get; set; }
    public List<string> Medications { get; set; } = new();
    public bool HasHospitalization { get; set; }
    public string? HospitalizationHistory { get; set; }
    
    // Specific Diseases - with detailed tracking
    public bool HasHeartDisease { get; set; }
    public string? HeartDiseaseDiagnosisDate { get; set; }
    public string? HeartDiseaseTreatmentStatus { get; set; } // Controlled, Uncontrolled, Remission
    public bool HasStroke { get; set; }
    public string? StrokeDiagnosisDate { get; set; }
    public string? StrokeTreatmentStatus { get; set; }
    public bool HasCancer { get; set; }
    public string? CancerDetails { get; set; }
    public string? CancerDiagnosisDate { get; set; }
    public string? CancerTreatmentStatus { get; set; }
    public bool HasDiabetes { get; set; }
    public string? DiabetesType { get; set; }
    public string? DiabetesDiagnosisDate { get; set; }
    public string? DiabetesTreatmentStatus { get; set; }
    public string? DiabetesHbA1c { get; set; } // Latest HbA1c reading
    public bool HasHighBloodPressure { get; set; }
    public string? HighBloodPressureDiagnosisDate { get; set; }
    public string? HighBloodPressureTreatmentStatus { get; set; }
    public bool HasHighCholesterol { get; set; }
    public string? HighCholesterolDiagnosisDate { get; set; }
    public string? HighCholesterolTreatmentStatus { get; set; }
    public bool HasKidneyDisease { get; set; }
    public string? KidneyDiseaseDiagnosisDate { get; set; }
    public string? KidneyDiseaseTreatmentStatus { get; set; }
    public bool HasLiverDisease { get; set; }
    public string? LiverDiseaseDiagnosisDate { get; set; }
    public string? LiverDiseaseTreatmentStatus { get; set; }
    public bool HasMentalHealthCondition { get; set; }
    public string? MentalHealthDetails { get; set; }
    public string? MentalHealthDiagnosisDate { get; set; }
    public string? MentalHealthTreatmentStatus { get; set; }
    public bool HasHIV { get; set; }
    public string? HIVDiagnosisDate { get; set; }
    public string? HIVTreatmentStatus { get; set; }
    public string? LastMedicalCheckupDate { get; set; }
    
    // Recent Medical Events
    public bool HasSurgeryLast5Years { get; set; }
    public string? SurgeryDetails { get; set; }
    public bool HasPendingMedicalTests { get; set; }
    public string? PendingTestsDetails { get; set; }
    public bool HasPlannedProcedures { get; set; }
    public string? PlannedProceduresDetails { get; set; }
    
    // Family Medical History
    public bool FamilyHeartDisease { get; set; }
    public bool FamilyCancer { get; set; }
    public bool FamilyDiabetes { get; set; }
    public bool FamilyStroke { get; set; }
    public string? FamilyOtherConditions { get; set; }
    public bool FatherDeceased { get; set; }
    public string? FatherAgeAtDeath { get; set; }
    public string? FatherCauseOfDeath { get; set; }
    public bool MotherDeceased { get; set; }
    public string? MotherAgeAtDeath { get; set; }
    public string? MotherCauseOfDeath { get; set; }
    
    // Lifestyle & Habits - Enhanced with structured options
    public string SmokingStatus { get; set; } = "non-smoker"; // non-smoker, occasional, regular, heavy
    public bool IsSmoker { get; set; }
    public string? SmokingPacksPerDay { get; set; }
    public string? SmokingYears { get; set; }
    public string AlcoholConsumptionLevel { get; set; } = "none"; // none, light, moderate, heavy
    public string? AlcoholConsumption { get; set; }
    public string? AlcoholUnitsPerWeek { get; set; }
    public bool UsesDrugs { get; set; }
    public string? DrugDetails { get; set; }
    
    // NEW: Enhanced Lifestyle Factors
    public string ExerciseLevel { get; set; } = "moderate"; // sedentary, light, moderate, active, very-active
    public string? ExerciseHoursPerWeek { get; set; }
    public string SleepQuality { get; set; } = "good"; // poor, fair, good, excellent
    public string? AverageSleepHours { get; set; }
    public string StressLevel { get; set; } = "moderate"; // low, moderate, high, very-high
    public string DietQuality { get; set; } = "balanced"; // poor, fair, balanced, healthy, very-healthy
    
    // Occupation & Activities
    public string? Occupation { get; set; }
    public bool HasOccupationalHazards { get; set; }
    public string? OccupationHazardsDetails { get; set; }
    public bool ParticipatesInDangerousSports { get; set; }
    public string? DangerousSportsDetails { get; set; }
    
    // Vital Statistics - With validation ranges
    public string? Height { get; set; } // cm (100-250)
    public string? Weight { get; set; } // kg (30-300)
    public string? BloodPressureSystolic { get; set; } // mmHg (70-200)
    public string? BloodPressureDiastolic { get; set; } // mmHg (40-130)
    public string? CholesterolLevel { get; set; } // mg/dL (100-400)
    public string? RestingHeartRate { get; set; } // bpm (40-120)
    
    // Reproductive Health
    public bool IsPregnant { get; set; }
    public string? PregnancyDueDate { get; set; }
    public bool HasPregnancyComplications { get; set; }
    public string? PregnancyComplicationDetails { get; set; }
    
    // Disability & Life Expectancy
    public bool HasDisability { get; set; }
    public string? DisabilityDetails { get; set; }
    public bool HasLifeThreateningCondition { get; set; }
    public string? LifeThreateningConditionDetails { get; set; }
    
    // Consent
    public bool MedicalRecordsConsent { get; set; }
}

public class BeneficiaryDto
{
    public long Id { get; set; }
    public string Type { get; set; } = "Primary"; // Primary or Contingent
    public string FullName { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string? RelationshipOther { get; set; } // Specify when Relationship = "Other"
    public string DateOfBirth { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public string? SSN { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public decimal Percentage { get; set; }
    public bool IsMinor { get; set; }
    public string? Trustee { get; set; }
    public string? TrusteeRelationship { get; set; }
    public string? TrusteeRelationshipOther { get; set; } // Specify when TrusteeRelationship = "Other"
    public bool PerStirpes { get; set; }
    public bool IsIrrevocable { get; set; }
}

public class DocumentsDto
{
    public string? IdentityCard { get; set; }
    public string? ProofOfIncome { get; set; }
}

public class ApplicationResponse
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal CoverageAmount { get; set; }
    public int TermYears { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public decimal PremiumAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }

    // Applicant data (parsed from JSON)
    public ApplicantDto? Applicant { get; set; }
    public HealthDeclarationDto? HealthDeclaration { get; set; }
    public List<BeneficiaryDto>? Beneficiaries { get; set; }
}

public class ApplicationListResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ProductType { get; set; }
    public decimal CoverageAmount { get; set; }
    public decimal PremiumAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
}

/// <summary>
/// Request to create a draft application at the start of the application flow
/// </summary>
public class CreateDraftRequest
{
    public int? ProductId { get; set; }
}

/// <summary>
/// Request to update product selection and quote details (Step 3)
/// </summary>
public class ProductSelectionDto
{
    public int? ProductId { get; set; }
    public decimal CoverageAmount { get; set; }
    public int TermYears { get; set; }
    public string PaymentFrequency { get; set; } = "Monthly";
    public decimal PremiumAmount { get; set; }
}


