namespace InsuranceServiceServer.Features.Customer.Models;

/// <summary>
/// DTO for Medical Insurance Plan API responses
/// </summary>
public class MedicalInsurancePlanDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public string PlanCode { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Coverage Limits
    public decimal AnnualCoverageLimit { get; set; }
    public decimal? LifetimeCoverageLimit { get; set; }
    public decimal Deductible { get; set; }
    public decimal CoPaymentPercentage { get; set; }
    public decimal OutOfPocketMaximum { get; set; }
    public int TermYears { get; set; }
    
    // Hospitalization Coverage
    public decimal RoomAndBoardDailyLimit { get; set; }
    public decimal ICUDailyLimit { get; set; }
    public decimal HospitalizationCoveragePercentage { get; set; }
    public int MaxHospitalizationDays { get; set; }
    
    // Outpatient Coverage
    public decimal OutpatientAnnualLimit { get; set; }
    public decimal DoctorVisitCopay { get; set; }
    public decimal SpecialistVisitCopay { get; set; }
    public decimal DiagnosticTestsCoveragePercentage { get; set; }
    
    // Medication Coverage
    public decimal PrescriptionDrugAnnualLimit { get; set; }
    public decimal GenericDrugCopay { get; set; }
    public decimal BrandNameDrugCopay { get; set; }
    
    // Additional Benefits
    public bool IncludesMaternityBenefit { get; set; }
    public decimal? MaternityCoverageLimit { get; set; }
    public bool IncludesDentalBasic { get; set; }
    public decimal? DentalAnnualLimit { get; set; }
    public bool IncludesVisionBasic { get; set; }
    public decimal? VisionAnnualLimit { get; set; }
    public bool AnnualHealthCheckupIncluded { get; set; }
    public bool PreventiveCareIncluded { get; set; }
    public bool MentalHealthCoverageIncluded { get; set; }
    public int? MentalHealthSessionLimit { get; set; }
    
    // Emergency & Critical Care
    public decimal EmergencyRoomCopay { get; set; }
    public bool AmbulanceServiceIncluded { get; set; }
    public decimal? CriticalIllnessBenefit { get; set; }
    public decimal? AccidentalInjuryCoverage { get; set; }
    
    // Network & Restrictions
    public bool NetworkHospitalsOnly { get; set; }
    public bool RequiresReferralForSpecialist { get; set; }
    public bool PreAuthorizationRequired { get; set; }
    
    // Waiting Periods
    public int GeneralWaitingPeriodDays { get; set; }
    public int PreExistingConditionWaitingPeriodMonths { get; set; }
    public int? MaternityWaitingPeriodMonths { get; set; }
    
    // Premium fields
    public decimal BasePremiumMonthly { get; set; }
    public decimal BasePremiumQuarterly { get; set; }
    public decimal BasePremiumSemiAnnual { get; set; }
    public decimal BasePremiumAnnual { get; set; }
    public decimal BasePremiumLumpSum { get; set; }
    
    // Plan limits
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
    public bool RequiresMedicalExam { get; set; }
    
    // Display
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPopular { get; set; }
}
