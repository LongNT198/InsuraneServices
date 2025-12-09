namespace InsuranceServiceServer.Features.Admin.DTOs;

/// <summary>
/// Request to create a new insurance plan
/// </summary>
public class CreatePlanRequest
{
    public int ProductId { get; set; }
    
    // Plan identification
    public required string PlanName { get; set; }
    public required string PlanCode { get; set; }
    public string? Description { get; set; }
    
    // Fixed coverage details
    public decimal CoverageAmount { get; set; }
    public int TermYears { get; set; }
    
    // Additional benefits
    public decimal? AccidentalDeathBenefit { get; set; }
    public decimal? DisabilityBenefit { get; set; }
    public decimal? CriticalIllnessBenefit { get; set; }
    public bool IncludesMaternityBenefit { get; set; }
    public bool IncludesRiderOptions { get; set; }
    
    // Base premiums
    public decimal BasePremiumMonthly { get; set; }
    public decimal BasePremiumAnnual { get; set; }
    
    // Age multipliers
    public decimal AgeMultiplier18_25 { get; set; } = 0.8m;
    public decimal AgeMultiplier26_35 { get; set; } = 1.0m;
    public decimal AgeMultiplier36_45 { get; set; } = 1.3m;
    public decimal AgeMultiplier46_55 { get; set; } = 1.8m;
    public decimal AgeMultiplier56_65 { get; set; } = 2.5m;
    
    // Health multipliers
    public decimal HealthExcellentMultiplier { get; set; } = 0.9m;
    public decimal HealthGoodMultiplier { get; set; } = 1.0m;
    public decimal HealthFairMultiplier { get; set; } = 1.2m;
    public decimal HealthPoorMultiplier { get; set; } = 1.5m;
    
    // Gender multipliers
    public decimal MaleMultiplier { get; set; } = 1.1m;
    public decimal FemaleMultiplier { get; set; } = 1.0m;
    
    // Occupation multipliers
    public decimal OccupationLowRiskMultiplier { get; set; } = 1.0m;
    public decimal OccupationMediumRiskMultiplier { get; set; } = 1.3m;
    public decimal OccupationHighRiskMultiplier { get; set; } = 1.8m;
    
    // Plan limits
    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 65;
    public bool RequiresMedicalExam { get; set; }
    
    // Display settings
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsPopular { get; set; }
}

/// <summary>
/// Request to update an existing plan
/// </summary>
public class UpdatePlanRequest
{
    public string? PlanName { get; set; }
    public string? Description { get; set; }
    
    public decimal? CoverageAmount { get; set; }
    public int? TermYears { get; set; }
    
    public decimal? AccidentalDeathBenefit { get; set; }
    public decimal? DisabilityBenefit { get; set; }
    public decimal? CriticalIllnessBenefit { get; set; }
    public bool? IncludesMaternityBenefit { get; set; }
    public bool? IncludesRiderOptions { get; set; }
    
    public decimal? BasePremiumMonthly { get; set; }
    public decimal? BasePremiumAnnual { get; set; }
    
    // All multipliers are optional for updates
    public decimal? AgeMultiplier18_25 { get; set; }
    public decimal? AgeMultiplier26_35 { get; set; }
    public decimal? AgeMultiplier36_45 { get; set; }
    public decimal? AgeMultiplier46_55 { get; set; }
    public decimal? AgeMultiplier56_65 { get; set; }
    
    public decimal? HealthExcellentMultiplier { get; set; }
    public decimal? HealthGoodMultiplier { get; set; }
    public decimal? HealthFairMultiplier { get; set; }
    public decimal? HealthPoorMultiplier { get; set; }
    
    public decimal? MaleMultiplier { get; set; }
    public decimal? FemaleMultiplier { get; set; }
    
    public decimal? OccupationLowRiskMultiplier { get; set; }
    public decimal? OccupationMediumRiskMultiplier { get; set; }
    public decimal? OccupationHighRiskMultiplier { get; set; }
    
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public bool? RequiresMedicalExam { get; set; }
    
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsPopular { get; set; }
}

/// <summary>
/// Response for plan details
/// </summary>
public class PlanResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    
    public string PlanName { get; set; } = string.Empty;
    public string PlanCode { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public decimal CoverageAmount { get; set; }
    public int TermYears { get; set; }
    
    public decimal? AccidentalDeathBenefit { get; set; }
    public decimal? DisabilityBenefit { get; set; }
    public decimal? CriticalIllnessBenefit { get; set; }
    public bool IncludesMaternityBenefit { get; set; }
    public bool IncludesRiderOptions { get; set; }
    
    public decimal BasePremiumMonthly { get; set; }
    public decimal BasePremiumAnnual { get; set; }
    
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
    public bool RequiresMedicalExam { get; set; }
    
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPopular { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Request to calculate premium preview for a plan
/// </summary>
public class CalculatePremiumRequest
{
    public int PlanId { get; set; }
    public int Age { get; set; }
    public required string Gender { get; set; } // "Male" or "Female"
    public required string HealthStatus { get; set; } // "Excellent", "Good", "Fair", "Poor"
    public required string OccupationRisk { get; set; } // "Low", "Medium", "High"
    public string PaymentFrequency { get; set; } = "Annual"; // "Monthly", "Quarterly", "Semi-Annual", "Annual", "LumpSum"
}

/// <summary>
/// Response with calculated premium
/// </summary>
public class CalculatePremiumResponse
{
    public int PlanId { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public decimal CalculatedPremium { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    
    // Breakdown for transparency
    public decimal BasePremiumAnnual { get; set; }
    public decimal AgeMultiplier { get; set; }
    public decimal GenderMultiplier { get; set; }
    public decimal HealthMultiplier { get; set; }
    public decimal OccupationMultiplier { get; set; }
    public decimal FrequencySurcharge { get; set; }
}
