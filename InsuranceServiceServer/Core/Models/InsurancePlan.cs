using InsuranceServiceServer.Features.Customer.Models;

namespace InsuranceServiceServer.Core.Models;

/// <summary>
/// Represents a fixed insurance plan/package offered by the company
/// Real-world insurance companies offer predefined plans, not custom amounts
/// </summary>
public class InsurancePlan
{
    public int Id { get; set; }
    
    // Link to parent product
    public int ProductId { get; set; }
    public virtual InsuranceProduct Product { get; set; } = null!;
    
    // Plan identification
    public required string PlanName { get; set; } // e.g., "Basic", "Standard", "Premium", "VIP"
    public required string PlanCode { get; set; } // e.g., "LIFE-BASIC-001"
    public string? Description { get; set; }
    
    // Fixed coverage details (THESE ARE FIXED, NOT USER-SELECTABLE)
    public decimal CoverageAmount { get; set; } // Fixed amount for this plan
    public int TermYears { get; set; } // Fixed term for this plan
    
    // Additional benefits (optional)
    public decimal? AccidentalDeathBenefit { get; set; } // Extra payout for accidental death
    public decimal? DisabilityBenefit { get; set; } // Disability coverage
    public decimal? CriticalIllnessBenefit { get; set; } // Critical illness coverage
    public bool IncludesMaternityBenefit { get; set; }
    public bool IncludesRiderOptions { get; set; }
    
    // Base premium calculation (before age/health factors)
    public decimal BasePremiumMonthly { get; set; } // Base monthly premium
    public decimal BasePremiumQuarterly { get; set; } // Base quarterly premium (3 months)
    public decimal BasePremiumSemiAnnual { get; set; } // Base semi-annual premium (6 months)
    public decimal BasePremiumAnnual { get; set; } // Base annual premium
    public decimal BasePremiumLumpSum { get; set; } // Base lump sum premium (one-time payment)
    
    // Age-based multipliers (will be applied during calculation)
    public decimal AgeMultiplier18_25 { get; set; } = 0.8m;  // Younger = cheaper
    public decimal AgeMultiplier26_35 { get; set; } = 1.0m;  // Standard rate
    public decimal AgeMultiplier36_45 { get; set; } = 1.3m;
    public decimal AgeMultiplier46_55 { get; set; } = 1.8m;
    public decimal AgeMultiplier56_65 { get; set; } = 2.5m;
    
    // Health status multipliers
    public decimal HealthExcellentMultiplier { get; set; } = 0.9m;
    public decimal HealthGoodMultiplier { get; set; } = 1.0m;
    public decimal HealthFairMultiplier { get; set; } = 1.2m;
    public decimal HealthPoorMultiplier { get; set; } = 1.5m;
    
    // Gender multipliers (statistically based)
    public decimal MaleMultiplier { get; set; } = 1.1m;
    public decimal FemaleMultiplier { get; set; } = 1.0m;
    
    // Occupation risk multipliers
    public decimal OccupationLowRiskMultiplier { get; set; } = 1.0m;   // Office work
    public decimal OccupationMediumRiskMultiplier { get; set; } = 1.3m; // Manual labor
    public decimal OccupationHighRiskMultiplier { get; set; } = 1.8m;   // Dangerous jobs
    
    // Plan limits and rules
    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 65;
    public bool RequiresMedicalExam { get; set; } // High coverage plans require exam
    
    // Display order and status
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsPopular { get; set; } // "Most Popular" badge
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Calculate premium for a specific user based on their characteristics
    /// Uses dedicated BasePremium fields for each payment frequency
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
            _ => BasePremiumAnnual // Annual is default
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
        
        // Calculate final premium by applying all multipliers to the selected base premium
        decimal finalPremium = basePremium * ageMultiplier * genderMultiplier * healthMultiplier * occupationMultiplier;
        
        return Math.Round(finalPremium, 2);
    }
}
