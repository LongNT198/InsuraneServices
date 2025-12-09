using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Customer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlansController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PlansController> _logger;

    public PlansController(AppDbContext context, ILogger<PlansController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all active insurance plans for a specific product
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<IEnumerable<InsurancePlan>>> GetPlansByProduct(int productId)
    {
        try
        {
            var plans = await _context.InsurancePlans
                .Include(p => p.Product)
                .Where(p => p.ProductId == productId && p.IsActive)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();

            if (!plans.Any())
            {
                return NotFound(new { message = $"No active plans found for product ID {productId}" });
            }

            return Ok(plans);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving plans for product {ProductId}", productId);
            return StatusCode(500, new { message = "Error retrieving insurance plans" });
        }
    }

    /// <summary>
    /// Get a specific plan by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<InsurancePlan>> GetPlan(int id)
    {
        try
        {
            var plan = await _context.InsurancePlans
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
            {
                return NotFound(new { message = $"Plan with ID {id} not found" });
            }

            return Ok(plan);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving plan {PlanId}", id);
            return StatusCode(500, new { message = "Error retrieving insurance plan" });
        }
    }

    /// <summary>
    /// Calculate premium for a specific plan based on user characteristics
    /// </summary>
    [HttpPost("calculate")]
    public async Task<ActionResult<PlanPremiumCalculationResponse>> CalculatePremium(
        [FromBody] PlanPremiumCalculationRequest request)
    {
        try
        {
            var plan = await _context.InsurancePlans
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == request.PlanId);

            if (plan == null)
            {
                return NotFound(new { message = $"Plan with ID {request.PlanId} not found" });
            }

            // Validate age range
            if (request.Age < plan.MinAge || request.Age > plan.MaxAge)
            {
                return BadRequest(new 
                { 
                    message = $"Age must be between {plan.MinAge} and {plan.MaxAge} for this plan" 
                });
            }

            // Calculate premium using the plan's method
            var calculatedPremium = plan.CalculatePremium(
                request.Age,
                request.Gender,
                request.HealthStatus,
                request.OccupationRisk,
                request.PaymentFrequency
            );

            // Prepare response
            var response = new PlanPremiumCalculationResponse
            {
                PlanId = plan.Id,
                PlanName = plan.PlanName,
                PlanCode = plan.PlanCode,
                Description = plan.Description ?? "",
                CoverageAmount = plan.CoverageAmount,
                TermYears = plan.TermYears,
                BasePremiumAnnual = plan.BasePremiumAnnual,
                CalculatedPremium = calculatedPremium,
                PaymentFrequency = request.PaymentFrequency,
                RequiresMedicalExam = plan.RequiresMedicalExam,
                Benefits = new PlanBenefitsDto
                {
                    AccidentalDeathBenefit = plan.AccidentalDeathBenefit,
                    DisabilityBenefit = plan.DisabilityBenefit,
                    CriticalIllnessBenefit = plan.CriticalIllnessBenefit,
                    IncludesMaternityBenefit = plan.IncludesMaternityBenefit,
                    IncludesRiderOptions = plan.IncludesRiderOptions
                },
                AppliedFactors = new AppliedFactorsDto
                {
                    AgeFactor = GetAgeFactor(plan, request.Age),
                    GenderFactor = request.Gender?.ToLower() == "male" ? plan.MaleMultiplier : plan.FemaleMultiplier,
                    HealthFactor = GetHealthFactor(plan, request.HealthStatus),
                    OccupationFactor = GetOccupationFactor(plan, request.OccupationRisk)
                }
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating premium for plan {PlanId}", request.PlanId);
            return StatusCode(500, new { message = "Error calculating premium" });
        }
    }

    /// <summary>
    /// Get featured/popular plans across all products
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<InsurancePlan>>> GetFeaturedPlans()
    {
        try
        {
            var plans = await _context.InsurancePlans
                .Include(p => p.Product)
                .Where(p => p.IsActive && (p.IsFeatured || p.IsPopular))
                .OrderByDescending(p => p.IsFeatured)
                .ThenByDescending(p => p.IsPopular)
                .ThenBy(p => p.DisplayOrder)
                .Take(6)
                .ToListAsync();

            return Ok(plans);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured plans");
            return StatusCode(500, new { message = "Error retrieving featured plans" });
        }
    }

    // Helper methods to get factors
    private decimal GetAgeFactor(InsurancePlan plan, int age)
    {
        return age switch
        {
            >= 18 and <= 25 => plan.AgeMultiplier18_25,
            >= 26 and <= 35 => plan.AgeMultiplier26_35,
            >= 36 and <= 45 => plan.AgeMultiplier36_45,
            >= 46 and <= 55 => plan.AgeMultiplier46_55,
            >= 56 and <= 65 => plan.AgeMultiplier56_65,
            _ => 1.0m
        };
    }

    private decimal GetHealthFactor(InsurancePlan plan, string? healthStatus)
    {
        return healthStatus?.ToLower() switch
        {
            "excellent" => plan.HealthExcellentMultiplier,
            "good" => plan.HealthGoodMultiplier,
            "fair" => plan.HealthFairMultiplier,
            "poor" => plan.HealthPoorMultiplier,
            _ => plan.HealthGoodMultiplier
        };
    }

    private decimal GetOccupationFactor(InsurancePlan plan, string? occupationRisk)
    {
        return occupationRisk?.ToLower() switch
        {
            "low" => plan.OccupationLowRiskMultiplier,
            "medium" => plan.OccupationMediumRiskMultiplier,
            "high" => plan.OccupationHighRiskMultiplier,
            _ => plan.OccupationLowRiskMultiplier
        };
    }
}
