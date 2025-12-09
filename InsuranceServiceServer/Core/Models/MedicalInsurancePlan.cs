using InsuranceServiceServer.Features.Customer.Models;

namespace InsuranceServiceServer.Core.Models;

/// <summary>
/// Specialized insurance plan model for Medical/Health Insurance products
/// Contains health insurance specific fields like hospitalization coverage, outpatient limits, etc.
/// </summary>
public class MedicalInsurancePlan
{
    public int Id { get; set; }
    
    // Link to parent product
    public int ProductId { get; set; }
    public virtual InsuranceProduct Product { get; set; } = null!;
    
    // Plan identification
    public required string PlanName { get; set; } // e.g., "Basic Health", "Premium Health", "Family Care"
    public required string PlanCode { get; set; } // e.g., "MED-BASIC-001"
    public string? Description { get; set; }
    
    // ==================== COVERAGE LIMITS ====================
    
    /// <summary>
    /// Maximum amount insurance will pay per year
    /// </summary>
    public decimal AnnualCoverageLimit { get; set; }
    
    /// <summary>
    /// Maximum amount insurance will pay over lifetime (null = unlimited)
    /// </summary>
    public decimal? LifetimeCoverageLimit { get; set; }
    
    /// <summary>
    /// Amount patient must pay before insurance starts paying
    /// </summary>
    public decimal Deductible { get; set; }
    
    /// <summary>
    /// Percentage of costs patient pays after deductible (e.g., 20 means patient pays 20%)
    /// </summary>
    public decimal CoPaymentPercentage { get; set; }
    
    /// <summary>
    /// Maximum amount patient pays out-of-pocket per year (after this, insurance pays 100%)
    /// </summary>
    public decimal OutOfPocketMaximum { get; set; }
    
    /// <summary>
    /// Policy term in years
    /// </summary>
    public int TermYears { get; set; }
    
    // ==================== HOSPITALIZATION COVERAGE ====================
    
    /// <summary>
    /// Daily limit for room and board charges
    /// </summary>
    public decimal RoomAndBoardDailyLimit { get; set; }
    
    /// <summary>
    /// Daily limit for ICU/CCU charges
    /// </summary>
    public decimal ICUDailyLimit { get; set; }
    
    /// <summary>
    /// Percentage of hospitalization costs covered (e.g., 80 means insurance pays 80%)
    /// </summary>
    public decimal HospitalizationCoveragePercentage { get; set; }
    
    /// <summary>
    /// Maximum number of hospitalization days covered per year
    /// </summary>
    public int MaxHospitalizationDays { get; set; }
    
    // ==================== OUTPATIENT COVERAGE ====================
    
    /// <summary>
    /// Annual limit for outpatient services
    /// </summary>
    public decimal OutpatientAnnualLimit { get; set; }
    
    /// <summary>
    /// Fixed copay amount per general doctor visit
    /// </summary>
    public decimal DoctorVisitCopay { get; set; }
    
    /// <summary>
    /// Fixed copay amount per specialist visit
    /// </summary>
    public decimal SpecialistVisitCopay { get; set; }
    
    /// <summary>
    /// Percentage of diagnostic tests costs covered
    /// </summary>
    public decimal DiagnosticTestsCoveragePercentage { get; set; }
    
    // ==================== MEDICATION COVERAGE ====================
    
    /// <summary>
    /// Annual limit for prescription drugs
    /// </summary>
    public decimal PrescriptionDrugAnnualLimit { get; set; }
    
    /// <summary>
    /// Copay for generic drugs
    /// </summary>
    public decimal GenericDrugCopay { get; set; }
    
    /// <summary>
    /// Copay for brand name drugs
    /// </summary>
    public decimal BrandNameDrugCopay { get; set; }
    
    // ==================== ADDITIONAL BENEFITS ====================
    
    /// <summary>
    /// Maternity coverage included
    /// </summary>
    public bool IncludesMaternityBenefit { get; set; }
    
    /// <summary>
    /// Maximum coverage for maternity care (null if not included)
    /// </summary>
    public decimal? MaternityCoverageLimit { get; set; }
    
    /// <summary>
    /// Basic dental coverage included (extractions, emergency)
    /// </summary>
    public bool IncludesDentalBasic { get; set; }
    
    /// <summary>
    /// Annual limit for dental coverage
    /// </summary>
    public decimal? DentalAnnualLimit { get; set; }
    
    /// <summary>
    /// Basic vision coverage included (eye exams, glasses)
    /// </summary>
    public bool IncludesVisionBasic { get; set; }
    
    /// <summary>
    /// Annual limit for vision coverage
    /// </summary>
    public decimal? VisionAnnualLimit { get; set; }
    
    /// <summary>
    /// Free annual health checkup included
    /// </summary>
    public bool AnnualHealthCheckupIncluded { get; set; }
    
    /// <summary>
    /// Preventive care services covered (vaccinations, screenings)
    /// </summary>
    public bool PreventiveCareIncluded { get; set; }
    
    /// <summary>
    /// Mental health services covered
    /// </summary>
    public bool MentalHealthCoverageIncluded { get; set; }
    
    /// <summary>
    /// Maximum mental health therapy sessions per year
    /// </summary>
    public int? MentalHealthSessionLimit { get; set; }
    
    // ==================== EMERGENCY & CRITICAL CARE ====================
    
    /// <summary>
    /// Fixed copay for emergency room visits
    /// </summary>
    public decimal EmergencyRoomCopay { get; set; }
    
    /// <summary>
    /// Ambulance service coverage included
    /// </summary>
    public bool AmbulanceServiceIncluded { get; set; }
    
    /// <summary>
    /// Lump sum benefit for critical illness diagnosis
    /// </summary>
    public decimal? CriticalIllnessBenefit { get; set; }
    
    /// <summary>
    /// Coverage amount for accidental injuries
    /// </summary>
    public decimal? AccidentalInjuryCoverage { get; set; }
    
    // ==================== NETWORK & RESTRICTIONS ====================
    
    /// <summary>
    /// Coverage restricted to network hospitals only
    /// </summary>
    public bool NetworkHospitalsOnly { get; set; }
    
    /// <summary>
    /// Requires GP referral to see specialist
    /// </summary>
    public bool RequiresReferralForSpecialist { get; set; }
    
    /// <summary>
    /// Pre-authorization required for certain procedures
    /// </summary>
    public bool PreAuthorizationRequired { get; set; }
    
    // ==================== WAITING PERIODS ====================
    
    /// <summary>
    /// Initial waiting period before coverage starts (in days)
    /// </summary>
    public int GeneralWaitingPeriodDays { get; set; }
    
    /// <summary>
    /// Waiting period for pre-existing conditions (in months)
    /// </summary>
    public int PreExistingConditionWaitingPeriodMonths { get; set; }
    
    /// <summary>
    /// Waiting period for maternity benefits (in months)
    /// </summary>
    public int? MaternityWaitingPeriodMonths { get; set; }
    
    // ==================== PREMIUM CALCULATION ====================
    
    public decimal BasePremiumMonthly { get; set; }
    public decimal BasePremiumQuarterly { get; set; }
    public decimal BasePremiumSemiAnnual { get; set; }
    public decimal BasePremiumAnnual { get; set; }
    public decimal BasePremiumLumpSum { get; set; }
    
    // Age-based multipliers
    public decimal AgeMultiplier18_25 { get; set; } = 0.8m;
    public decimal AgeMultiplier26_35 { get; set; } = 1.0m;
    public decimal AgeMultiplier36_45 { get; set; } = 1.3m;
    public decimal AgeMultiplier46_55 { get; set; } = 1.8m;
    public decimal AgeMultiplier56_65 { get; set; } = 2.5m;
    
    // Health status multipliers
    public decimal HealthExcellentMultiplier { get; set; } = 0.9m;
    public decimal HealthGoodMultiplier { get; set; } = 1.0m;
    public decimal HealthFairMultiplier { get; set; } = 1.2m;
    public decimal HealthPoorMultiplier { get; set; } = 1.5m;
    
    // Gender multipliers
    public decimal MaleMultiplier { get; set; } = 1.0m;
    public decimal FemaleMultiplier { get; set; } = 1.0m;
    
    // Occupation risk multipliers
    public decimal OccupationLowRiskMultiplier { get; set; } = 1.0m;
    public decimal OccupationMediumRiskMultiplier { get; set; } = 1.2m;
    public decimal OccupationHighRiskMultiplier { get; set; } = 1.5m;
    
    // ==================== PLAN LIMITS AND RULES ====================
    
    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 65;
    public bool RequiresMedicalExam { get; set; }
    
    // ==================== DISPLAY & STATUS ====================
    
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsPopular { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Calculate premium for a specific user based on their characteristics
    /// </summary>
    public decimal CalculatePremium(
        int age, 
        string gender, 
        string healthStatus, 
        string occupationRisk,
        string paymentFrequency = "Annual")
    {
        // Select the appropriate base premium based on payment frequency
        decimal basePremium = paymentFrequency switch
        {
            "Monthly" => BasePremiumMonthly,
            "Quarterly" => BasePremiumQuarterly > 0 ? BasePremiumQuarterly : BasePremiumMonthly * 3,
            "Semi-Annual" => BasePremiumSemiAnnual > 0 ? BasePremiumSemiAnnual : BasePremiumMonthly * 6,
            "LumpSum" => BasePremiumLumpSum > 0 ? BasePremiumLumpSum : BasePremiumAnnual * TermYears,
            _ => BasePremiumAnnual
        };
        
        // Apply age factor
        decimal ageMultiplier = age switch
        {
            >= 18 and <= 25 => AgeMultiplier18_25,
            >= 26 and <= 35 => AgeMultiplier26_35,
            >= 36 and <= 45 => AgeMultiplier36_45,
            >= 46 and <= 55 => AgeMultiplier46_55,
            >= 56 and <= 65 => AgeMultiplier56_65,
            _ => 1.0m
        };
        
        // Apply gender factor
        decimal genderMultiplier = gender?.ToLower() == "male" ? MaleMultiplier : FemaleMultiplier;
        
        // Apply health status factor
        decimal healthMultiplier = healthStatus?.ToLower() switch
        {
            "excellent" => HealthExcellentMultiplier,
            "good" => HealthGoodMultiplier,
            "fair" => HealthFairMultiplier,
            "poor" => HealthPoorMultiplier,
            _ => HealthGoodMultiplier
        };
        
        // Apply occupation risk factor
        decimal occupationMultiplier = occupationRisk?.ToLower() switch
        {
            "low" => OccupationLowRiskMultiplier,
            "medium" => OccupationMediumRiskMultiplier,
            "high" => OccupationHighRiskMultiplier,
            _ => OccupationLowRiskMultiplier
        };
        
        // Calculate final premium
        decimal finalPremium = basePremium * ageMultiplier * genderMultiplier * healthMultiplier * occupationMultiplier;
        
        return Math.Round(finalPremium, 2);
    }
}
