using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Shared.Services;

/// <summary>
/// Centralized service for premium calculations across the entire application
/// This ensures consistent calculation logic everywhere
/// </summary>
public interface IPremiumCalculationService
{
    Task<decimal> CalculatePremiumAsync(int planId, int age, string gender, string healthStatus, 
        string occupationRisk, string paymentFrequency);
    
    Task<Dictionary<string, decimal>> CalculateAllFrequenciesAsync(int planId, int age, string gender, 
        string healthStatus, string occupationRisk);
}

public class PremiumCalculationService : IPremiumCalculationService
{
    private readonly AppDbContext _context;
    
    public PremiumCalculationService(AppDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Calculate premium for specific frequency
    /// Updated Formula: BasePremium[Frequency] × Age × Gender × Health × Occupation
    /// Uses dedicated BasePremium fields instead of surcharge-based calculations
    /// </summary>
    public async Task<decimal> CalculatePremiumAsync(
        int planId, 
        int age, 
        string gender, 
        string healthStatus, 
        string occupationRisk, 
        string paymentFrequency)
    {
        var plan = await _context.InsurancePlans
            .Include(p => p.Product)
            .FirstOrDefaultAsync(p => p.Id == planId);
            
        if (plan == null)
            throw new ArgumentException($"Plan with ID {planId} not found");
        
        // Select the appropriate base premium based on payment frequency
        decimal basePremium = paymentFrequency?.ToLower() switch
        {
            "monthly" => plan.BasePremiumMonthly,
            "quarterly" => plan.BasePremiumQuarterly > 0 ? plan.BasePremiumQuarterly : plan.BasePremiumMonthly * 3,
            "semi-annual" or "semiannual" => plan.BasePremiumSemiAnnual > 0 ? plan.BasePremiumSemiAnnual : plan.BasePremiumMonthly * 6,
            "lumpsum" or "single" => plan.BasePremiumLumpSum > 0 ? plan.BasePremiumLumpSum : plan.BasePremiumAnnual * plan.TermYears,
            _ => plan.BasePremiumAnnual // Annual is default
        };
        
        // Apply age multiplier
        decimal ageMultiplier = age switch
        {
            >= 18 and <= 25 => plan.AgeMultiplier18_25,
            >= 26 and <= 35 => plan.AgeMultiplier26_35,
            >= 36 and <= 45 => plan.AgeMultiplier36_45,
            >= 46 and <= 55 => plan.AgeMultiplier46_55,
            >= 56 and <= 65 => plan.AgeMultiplier56_65,
            _ => 1.0m
        };
        
        // Apply gender multiplier
        decimal genderMultiplier = gender?.ToLower() == "male" 
            ? plan.MaleMultiplier 
            : plan.FemaleMultiplier;
        
        // Apply health status multiplier
        decimal healthMultiplier = healthStatus?.ToLower() switch
        {
            "excellent" => plan.HealthExcellentMultiplier,
            "good" => plan.HealthGoodMultiplier,
            "fair" => plan.HealthFairMultiplier,
            "poor" => plan.HealthPoorMultiplier,
            _ => plan.HealthGoodMultiplier
        };
        
        // Apply occupation risk multiplier
        decimal occupationMultiplier = occupationRisk?.ToLower() switch
        {
            "low" => plan.OccupationLowRiskMultiplier,
            "medium" => plan.OccupationMediumRiskMultiplier,
            "high" => plan.OccupationHighRiskMultiplier,
            _ => plan.OccupationLowRiskMultiplier
        };
        
        // Calculate final premium by applying all multipliers to the selected base premium
        decimal finalPremium = basePremium 
            * ageMultiplier 
            * genderMultiplier 
            * healthMultiplier 
            * occupationMultiplier;
        
        return Math.Round(finalPremium, 2);
    }
    
    /// <summary>
    /// Calculate premium for all payment frequencies at once
    /// Useful for displaying comparison table
    /// </summary>
    public async Task<Dictionary<string, decimal>> CalculateAllFrequenciesAsync(
        int planId, 
        int age, 
        string gender, 
        string healthStatus, 
        string occupationRisk)
    {
        var frequencies = new[] { "Monthly", "Quarterly", "Semi-Annual", "Annual", "LumpSum" };
        var results = new Dictionary<string, decimal>();
        
        foreach (var frequency in frequencies)
        {
            var premium = await CalculatePremiumAsync(planId, age, gender, healthStatus, occupationRisk, frequency);
            results[frequency] = premium;
        }
        
        return results;
    }
}
