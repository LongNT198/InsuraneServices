using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class InsurancePlan
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string PlanName { get; set; } = null!;

    public string PlanCode { get; set; } = null!;

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

    public decimal AgeMultiplier1825 { get; set; }

    public decimal AgeMultiplier2635 { get; set; }

    public decimal AgeMultiplier3645 { get; set; }

    public decimal AgeMultiplier4655 { get; set; }

    public decimal AgeMultiplier5665 { get; set; }

    public decimal HealthExcellentMultiplier { get; set; }

    public decimal HealthGoodMultiplier { get; set; }

    public decimal HealthFairMultiplier { get; set; }

    public decimal HealthPoorMultiplier { get; set; }

    public decimal MaleMultiplier { get; set; }

    public decimal FemaleMultiplier { get; set; }

    public decimal OccupationLowRiskMultiplier { get; set; }

    public decimal OccupationMediumRiskMultiplier { get; set; }

    public decimal OccupationHighRiskMultiplier { get; set; }

    public int MinAge { get; set; }

    public int MaxAge { get; set; }

    public bool RequiresMedicalExam { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }

    public bool IsFeatured { get; set; }

    public bool IsPopular { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public decimal BasePremiumLumpSum { get; set; }

    public decimal BasePremiumQuarterly { get; set; }

    public decimal BasePremiumSemiAnnual { get; set; }

    public virtual InsuranceProduct Product { get; set; } = null!;
}
