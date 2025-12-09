namespace InsuranceServiceServer.Shared.DTOs.Registration
{
    // ===== Step 2: eKYC =====
    public class StartKYCRequest
    {
        public string DocumentType { get; set; } = string.Empty; // CMND, CCCD, Passport
        public string FrontImageBase64 { get; set; } = string.Empty;
        public string BackImageBase64 { get; set; } = string.Empty;
        public string SelfieImageBase64 { get; set; } = string.Empty;
    }

    public class KYCResponse
    {
        public bool IsSuccess { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Message { get; set; }
        public KYCDataDTO? ExtractedData { get; set; }
        public decimal? FaceMatchScore { get; set; }
        public bool RequiresManualReview { get; set; }
    }

    public class KYCDataDTO
    {
        public string? DocumentNumber { get; set; }
        public string? FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public string? Address { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    // ===== Step 3: Complete Profile =====
    public class CompleteProfileRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        
        // Address
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? District { get; set; }
        public string? Ward { get; set; }
        
        // Occupation
        public string Occupation { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string? Position { get; set; }
        public decimal? MonthlyIncome { get; set; }
        
        // Emergency Contact
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public string EmergencyContactRelationship { get; set; } = string.Empty;
        public string? EmergencyContactRelationshipOther { get; set; } // Specify when EmergencyContactRelationship = "Other"
        
        // Marketing
        public bool AcceptMarketing { get; set; }
    }

    // ===== Step 4: Select Product =====
    public class SelectProductRequest
    {
        public int ProductId { get; set; }
        public decimal CoverageAmount { get; set; }
        public int TermYears { get; set; }
        public string PaymentFrequency { get; set; } = string.Empty;
        public List<BeneficiaryDTO>? Beneficiaries { get; set; }
    }

    public class BeneficiaryDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Relationship { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string? NationalId { get; set; }
        public decimal Percentage { get; set; } // Percentage of benefit
    }

    public class ProductQuoteResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal CoverageAmount { get; set; }
        public int TermYears { get; set; }
        public decimal MonthlyPremium { get; set; }
        public decimal QuarterlyPremium { get; set; }
        public decimal YearlyPremium { get; set; }
        public string? CoverageDetails { get; set; }
    }

    // ===== Step 5: Health Declaration =====
    public class HealthDeclarationRequest
    {
        // === VITAL STATISTICS ===
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public string? BloodType { get; set; }
        public int? BloodPressureSystolic { get; set; }
        public int? BloodPressureDiastolic { get; set; }
        public int? CholesterolLevel { get; set; }
        public int? RestingHeartRate { get; set; }
        
        // === LIFESTYLE ENHANCED ===
        public string SmokingStatus { get; set; } = "Never";
        public int? SmokingPacksPerDay { get; set; }
        public int? SmokingYears { get; set; }
        public string AlcoholConsumptionLevel { get; set; } = "None";
        public int? AlcoholUnitsPerWeek { get; set; }
        public bool UsesDrugs { get; set; }
        public string? DrugDetails { get; set; }
        public string ExerciseLevel { get; set; } = "Sedentary";
        public int? ExerciseHoursPerWeek { get; set; }
        public string SleepQuality { get; set; } = "Average";
        public decimal? AverageSleepHours { get; set; }
        public string StressLevel { get; set; } = "Moderate";
        public string DietQuality { get; set; } = "Average";
        
        // === SPECIFIC DISEASES (with diagnosis dates and treatment status) ===
        public bool HasHeartDisease { get; set; }
        public DateTime? HeartDiseaseDiagnosisDate { get; set; }
        public string? HeartDiseaseTreatmentStatus { get; set; }
        
        public bool HasStroke { get; set; }
        public DateTime? StrokeDiagnosisDate { get; set; }
        public string? StrokeTreatmentStatus { get; set; }
        
        public bool HasCancer { get; set; }
        public DateTime? CancerDiagnosisDate { get; set; }
        public string? CancerTreatmentStatus { get; set; }
        public string? CancerDetails { get; set; }
        
        public bool HasDiabetes { get; set; }
        public string? DiabetesType { get; set; }
        public DateTime? DiabetesDiagnosisDate { get; set; }
        public decimal? DiabetesHbA1c { get; set; }
        public string? DiabetesTreatmentStatus { get; set; }
        
        public bool HasHighBloodPressure { get; set; }
        public DateTime? HighBloodPressureDiagnosisDate { get; set; }
        public string? HighBloodPressureTreatmentStatus { get; set; }
        
        public bool HasHighCholesterol { get; set; }
        public DateTime? HighCholesterolDiagnosisDate { get; set; }
        public string? HighCholesterolTreatmentStatus { get; set; }
        
        public bool HasKidneyDisease { get; set; }
        public DateTime? KidneyDiseaseDiagnosisDate { get; set; }
        public string? KidneyDiseaseTreatmentStatus { get; set; }
        
        public bool HasLiverDisease { get; set; }
        public DateTime? LiverDiseaseDiagnosisDate { get; set; }
        public string? LiverDiseaseTreatmentStatus { get; set; }
        
        public bool HasMentalHealthCondition { get; set; }
        public DateTime? MentalHealthDiagnosisDate { get; set; }
        public string? MentalHealthTreatmentStatus { get; set; }
        public string? MentalHealthDetails { get; set; }
        
        public bool HasHIV { get; set; }
        public DateTime? HIVDiagnosisDate { get; set; }
        public string? HIVTreatmentStatus { get; set; }
        
        // === OLD FIELDS (for backwards compatibility) ===
        public bool IsSmoker { get; set; }
        public int? CigarettesPerDay { get; set; }
        public bool IsDrinker { get; set; }
        public string? AlcoholFrequency { get; set; }
        public bool IsExercising { get; set; }
        public bool HasHypertension { get; set; }
        public bool HasMentalIllness { get; set; }
        
        // === MEDICAL HISTORY ===
        public List<string>? MedicalConditions { get; set; }
        public List<string>? MedicalConditionDetails { get; set; }
        public List<string>? CurrentMedications { get; set; }
        public List<string>? PastIllnesses { get; set; }
        public List<string>? ChronicConditions { get; set; }
        public List<string>? Surgeries { get; set; }
        public List<string>? Allergies { get; set; }
        
        // === RECENT MEDICAL EVENTS ===
        public DateTime? LastMedicalCheckupDate { get; set; }
        public bool HasRecentHospitalization { get; set; }
        public DateTime? LastHospitalizationDate { get; set; }
        public string? HospitalizationReason { get; set; }
        public string? HospitalizationHistory { get; set; }
        public bool HasSurgeryLast5Years { get; set; }
        public string? SurgeryDetails { get; set; }
        public bool HasPendingMedicalTests { get; set; }
        public string? PendingTestsDetails { get; set; }
        public bool HasPlannedProcedures { get; set; }
        public string? PlannedProceduresDetails { get; set; }
        
        // === FAMILY MEDICAL HISTORY ===
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
        
        // === PREGNANCY ===
        public bool IsPregnant { get; set; }
        public DateTime? PregnancyDueDate { get; set; }
        public bool HasPregnancyComplications { get; set; }
        public string? PregnancyComplicationDetails { get; set; }
        
        // === OCCUPATION & RISK ===
        public string? Occupation { get; set; }
        public bool HasOccupationalHazards { get; set; }
        public string? OccupationHazardsDetails { get; set; }
        public bool HasHighRiskOccupation { get; set; }
        public string? OccupationRiskDetails { get; set; }
        public bool ParticipatesInDangerousSports { get; set; }
        public string? DangerousSportsDetails { get; set; }
        
        // === DISABILITY & LIFE-THREATENING ===
        public bool HasDisability { get; set; }
        public string? DisabilityDetails { get; set; }
        public bool HasLifeThreateningCondition { get; set; }
        public string? LifeThreateningConditionDetails { get; set; }
        
        // === DOCUMENTS & CONSENT ===
        public bool MedicalRecordsConsent { get; set; }
        
        // === DECLARATION ===
        public bool IsDeclarationAccurate { get; set; }
    }

    // ===== Step 6: Underwriting Response =====
    public class UnderwritingResponse
    {
        public string Decision { get; set; } = string.Empty;
        public string RiskLevel { get; set; } = string.Empty;
        public bool IsAutoApproved { get; set; }
        
        // If approved
        public decimal? FinalPremium { get; set; }
        public decimal? FinalCoverageAmount { get; set; }
        public List<string>? Exclusions { get; set; }
        
        // If requires additional steps
        public bool RequiresMedicalExam { get; set; }
        public bool RequiresAdditionalDocuments { get; set; }
        public List<string>? RequiredDocuments { get; set; }
        
        // If rejected
        public string? RejectionReason { get; set; }
        
        public string? Message { get; set; }
    }

    // ===== Step 7: Payment =====
    public class InitiatePaymentRequest
    {
        public string PaymentMethod { get; set; } = string.Empty; // Visa, Mastercard, Momo, Banking
        public decimal Amount { get; set; }
    }

    public class PaymentResponse
    {
        public bool IsSuccess { get; set; }
        public string PaymentId { get; set; } = string.Empty;
        public string? PaymentUrl { get; set; }
        public string? QRCode { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Message { get; set; }
    }

    // ===== Step 8: Policy Issuance =====
    public class PolicyIssuanceResponse
    {
        public bool IsSuccess { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PolicyDocumentUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    // ===== Registration Status =====
    public class RegistrationStatusResponse
    {
        public string SessionToken { get; set; } = string.Empty;
        public string CurrentStep { get; set; } = string.Empty;
        public string RegistrationStatus { get; set; } = string.Empty;
        public RegistrationProgressDTO Progress { get; set; } = new();
        public string? NextAction { get; set; }
        public string? Message { get; set; }
    }

    public class RegistrationProgressDTO
    {
        public bool IsAccountCreated { get; set; }
        public bool IsKYCCompleted { get; set; }
        public bool IsProfileCompleted { get; set; }
        public bool IsProductSelected { get; set; }
        public bool IsHealthDeclared { get; set; }
        public bool IsUnderwritingCompleted { get; set; }
        public bool IsPaymentCompleted { get; set; }
        public bool IsPolicyIssued { get; set; }
        public int PercentageComplete { get; set; }
    }
}



