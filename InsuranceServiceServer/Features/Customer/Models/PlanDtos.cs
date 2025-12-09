namespace InsuranceServiceServer.Features.Customer.Models;

/// <summary>
/// Request DTO for calculating premium based on a fixed insurance plan
/// </summary>
public class PlanPremiumCalculationRequest
{
    public int PlanId { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; } = "Male";
    public string HealthStatus { get; set; } = "Good"; // Excellent, Good, Fair, Poor
    public string OccupationRisk { get; set; } = "Low"; // Low, Medium, High
    public string PaymentFrequency { get; set; } = "Annual"; // LumpSum, Annual, Semi-Annual, Quarterly, Monthly
}

/// <summary>
/// Response DTO for plan premium calculation
/// </summary>
public class PlanPremiumCalculationResponse
{
    public int PlanId { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public string PlanCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal CoverageAmount { get; set; }
    public int TermYears { get; set; }
    public decimal BasePremiumAnnual { get; set; }
    public decimal CalculatedPremium { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public bool RequiresMedicalExam { get; set; }
    public PlanBenefitsDto Benefits { get; set; } = new();
    public AppliedFactorsDto AppliedFactors { get; set; } = new();
}

/// <summary>
/// Plan benefits information
/// </summary>
public class PlanBenefitsDto
{
    public decimal? AccidentalDeathBenefit { get; set; }
    public decimal? DisabilityBenefit { get; set; }
    public decimal? CriticalIllnessBenefit { get; set; }
    public bool IncludesMaternityBenefit { get; set; }
    public bool IncludesRiderOptions { get; set; }
}

/// <summary>
/// Factors applied during premium calculation
/// </summary>
public class AppliedFactorsDto
{
    public decimal AgeFactor { get; set; }
    public decimal GenderFactor { get; set; }
    public decimal HealthFactor { get; set; }
    public decimal OccupationFactor { get; set; }
    public decimal PaymentFrequencyFactor { get; set; }
}
