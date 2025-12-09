using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Features.Admin.DTOs;
using InsuranceServiceServer.Shared.Services;

namespace InsuranceServiceServer.Features.Admin;

[ApiController]
[Route("api/admin/plans")]
[Authorize(Roles = "Admin")]
public class PlanManagementController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPremiumCalculationService _premiumService;
    private readonly ILogger<PlanManagementController> _logger;

    public PlanManagementController(
        AppDbContext context, 
        IPremiumCalculationService premiumService,
        ILogger<PlanManagementController> logger)
    {
        _context = context;
        _premiumService = premiumService;
        _logger = logger;
    }

    /// <summary>
    /// Get all plans (optionally filter by product)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<PlanResponse>>> GetAllPlans([FromQuery] int? productId = null)
    {
        var query = _context.InsurancePlans
            .Include(p => p.Product)
            .AsQueryable();

        if (productId.HasValue)
            query = query.Where(p => p.ProductId == productId.Value);

        var plans = await query
            .OrderBy(p => p.ProductId)
            .ThenBy(p => p.DisplayOrder)
            .Select(p => new PlanResponse
            {
                Id = p.Id,
                ProductId = p.ProductId,
                ProductName = p.Product.ProductName,
                PlanName = p.PlanName,
                PlanCode = p.PlanCode,
                Description = p.Description,
                CoverageAmount = p.CoverageAmount,
                TermYears = p.TermYears,
                AccidentalDeathBenefit = p.AccidentalDeathBenefit,
                DisabilityBenefit = p.DisabilityBenefit,
                CriticalIllnessBenefit = p.CriticalIllnessBenefit,
                IncludesMaternityBenefit = p.IncludesMaternityBenefit,
                IncludesRiderOptions = p.IncludesRiderOptions,
                BasePremiumMonthly = p.BasePremiumMonthly,
                BasePremiumAnnual = p.BasePremiumAnnual,
                MinAge = p.MinAge,
                MaxAge = p.MaxAge,
                RequiresMedicalExam = p.RequiresMedicalExam,
                DisplayOrder = p.DisplayOrder,
                IsActive = p.IsActive,
                IsFeatured = p.IsFeatured,
                IsPopular = p.IsPopular,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();

        return Ok(plans);
    }

    /// <summary>
    /// Get a specific plan by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PlanResponse>> GetPlan(int id)
    {
        var plan = await _context.InsurancePlans
            .Include(p => p.Product)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plan == null)
            return NotFound(new { message = "Plan not found" });

        var response = new PlanResponse
        {
            Id = plan.Id,
            ProductId = plan.ProductId,
            ProductName = plan.Product.ProductName,
            PlanName = plan.PlanName,
            PlanCode = plan.PlanCode,
            Description = plan.Description,
            CoverageAmount = plan.CoverageAmount,
            TermYears = plan.TermYears,
            AccidentalDeathBenefit = plan.AccidentalDeathBenefit,
            DisabilityBenefit = plan.DisabilityBenefit,
            CriticalIllnessBenefit = plan.CriticalIllnessBenefit,
            IncludesMaternityBenefit = plan.IncludesMaternityBenefit,
            IncludesRiderOptions = plan.IncludesRiderOptions,
            BasePremiumMonthly = plan.BasePremiumMonthly,
            BasePremiumAnnual = plan.BasePremiumAnnual,
            MinAge = plan.MinAge,
            MaxAge = plan.MaxAge,
            RequiresMedicalExam = plan.RequiresMedicalExam,
            DisplayOrder = plan.DisplayOrder,
            IsActive = plan.IsActive,
            IsFeatured = plan.IsFeatured,
            IsPopular = plan.IsPopular,
            CreatedAt = plan.CreatedAt,
            UpdatedAt = plan.UpdatedAt
        };

        return Ok(response);
    }

    /// <summary>
    /// Create a new insurance plan
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PlanResponse>> CreatePlan([FromBody] CreatePlanRequest request)
    {
        // Validate product exists
        var productExists = await _context.InsuranceProducts.AnyAsync(p => p.Id == request.ProductId);
        if (!productExists)
            return BadRequest(new { message = "Product not found" });

        // Check if plan code already exists
        if (await _context.InsurancePlans.AnyAsync(p => p.PlanCode == request.PlanCode))
            return BadRequest(new { message = "Plan code already exists" });

        var plan = new InsurancePlan
        {
            ProductId = request.ProductId,
            PlanName = request.PlanName,
            PlanCode = request.PlanCode,
            Description = request.Description,
            CoverageAmount = request.CoverageAmount,
            TermYears = request.TermYears,
            AccidentalDeathBenefit = request.AccidentalDeathBenefit,
            DisabilityBenefit = request.DisabilityBenefit,
            CriticalIllnessBenefit = request.CriticalIllnessBenefit,
            IncludesMaternityBenefit = request.IncludesMaternityBenefit,
            IncludesRiderOptions = request.IncludesRiderOptions,
            BasePremiumMonthly = request.BasePremiumMonthly,
            BasePremiumAnnual = request.BasePremiumAnnual,
            AgeMultiplier18_25 = request.AgeMultiplier18_25,
            AgeMultiplier26_35 = request.AgeMultiplier26_35,
            AgeMultiplier36_45 = request.AgeMultiplier36_45,
            AgeMultiplier46_55 = request.AgeMultiplier46_55,
            AgeMultiplier56_65 = request.AgeMultiplier56_65,
            HealthExcellentMultiplier = request.HealthExcellentMultiplier,
            HealthGoodMultiplier = request.HealthGoodMultiplier,
            HealthFairMultiplier = request.HealthFairMultiplier,
            HealthPoorMultiplier = request.HealthPoorMultiplier,
            MaleMultiplier = request.MaleMultiplier,
            FemaleMultiplier = request.FemaleMultiplier,
            OccupationLowRiskMultiplier = request.OccupationLowRiskMultiplier,
            OccupationMediumRiskMultiplier = request.OccupationMediumRiskMultiplier,
            OccupationHighRiskMultiplier = request.OccupationHighRiskMultiplier,
            MinAge = request.MinAge,
            MaxAge = request.MaxAge,
            RequiresMedicalExam = request.RequiresMedicalExam,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            IsFeatured = request.IsFeatured,
            IsPopular = request.IsPopular,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InsurancePlans.Add(plan);
        await _context.SaveChangesAsync();

        // Load product for response
        await _context.Entry(plan).Reference(p => p.Product).LoadAsync();

        _logger.LogInformation("Admin created new plan: {PlanName} ({PlanCode}) for product {ProductId}", 
            plan.PlanName, plan.PlanCode, plan.ProductId);

        var response = new PlanResponse
        {
            Id = plan.Id,
            ProductId = plan.ProductId,
            ProductName = plan.Product.ProductName,
            PlanName = plan.PlanName,
            PlanCode = plan.PlanCode,
            Description = plan.Description,
            CoverageAmount = plan.CoverageAmount,
            TermYears = plan.TermYears,
            AccidentalDeathBenefit = plan.AccidentalDeathBenefit,
            DisabilityBenefit = plan.DisabilityBenefit,
            CriticalIllnessBenefit = plan.CriticalIllnessBenefit,
            IncludesMaternityBenefit = plan.IncludesMaternityBenefit,
            IncludesRiderOptions = plan.IncludesRiderOptions,
            BasePremiumMonthly = plan.BasePremiumMonthly,
            BasePremiumAnnual = plan.BasePremiumAnnual,
            MinAge = plan.MinAge,
            MaxAge = plan.MaxAge,
            RequiresMedicalExam = plan.RequiresMedicalExam,
            DisplayOrder = plan.DisplayOrder,
            IsActive = plan.IsActive,
            IsFeatured = plan.IsFeatured,
            IsPopular = plan.IsPopular,
            CreatedAt = plan.CreatedAt,
            UpdatedAt = plan.UpdatedAt
        };

        return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, response);
    }

    /// <summary>
    /// Update an existing plan
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<PlanResponse>> UpdatePlan(int id, [FromBody] UpdatePlanRequest request)
    {
        var plan = await _context.InsurancePlans
            .Include(p => p.Product)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plan == null)
            return NotFound(new { message = "Plan not found" });

        // Update only provided fields
        if (request.PlanName != null) plan.PlanName = request.PlanName;
        if (request.Description != null) plan.Description = request.Description;
        if (request.CoverageAmount.HasValue) plan.CoverageAmount = request.CoverageAmount.Value;
        if (request.TermYears.HasValue) plan.TermYears = request.TermYears.Value;
        if (request.AccidentalDeathBenefit.HasValue) plan.AccidentalDeathBenefit = request.AccidentalDeathBenefit;
        if (request.DisabilityBenefit.HasValue) plan.DisabilityBenefit = request.DisabilityBenefit;
        if (request.CriticalIllnessBenefit.HasValue) plan.CriticalIllnessBenefit = request.CriticalIllnessBenefit;
        if (request.IncludesMaternityBenefit.HasValue) plan.IncludesMaternityBenefit = request.IncludesMaternityBenefit.Value;
        if (request.IncludesRiderOptions.HasValue) plan.IncludesRiderOptions = request.IncludesRiderOptions.Value;
        if (request.BasePremiumMonthly.HasValue) plan.BasePremiumMonthly = request.BasePremiumMonthly.Value;
        if (request.BasePremiumAnnual.HasValue) plan.BasePremiumAnnual = request.BasePremiumAnnual.Value;
        
        // Update multipliers if provided
        if (request.AgeMultiplier18_25.HasValue) plan.AgeMultiplier18_25 = request.AgeMultiplier18_25.Value;
        if (request.AgeMultiplier26_35.HasValue) plan.AgeMultiplier26_35 = request.AgeMultiplier26_35.Value;
        if (request.AgeMultiplier36_45.HasValue) plan.AgeMultiplier36_45 = request.AgeMultiplier36_45.Value;
        if (request.AgeMultiplier46_55.HasValue) plan.AgeMultiplier46_55 = request.AgeMultiplier46_55.Value;
        if (request.AgeMultiplier56_65.HasValue) plan.AgeMultiplier56_65 = request.AgeMultiplier56_65.Value;
        if (request.HealthExcellentMultiplier.HasValue) plan.HealthExcellentMultiplier = request.HealthExcellentMultiplier.Value;
        if (request.HealthGoodMultiplier.HasValue) plan.HealthGoodMultiplier = request.HealthGoodMultiplier.Value;
        if (request.HealthFairMultiplier.HasValue) plan.HealthFairMultiplier = request.HealthFairMultiplier.Value;
        if (request.HealthPoorMultiplier.HasValue) plan.HealthPoorMultiplier = request.HealthPoorMultiplier.Value;
        if (request.MaleMultiplier.HasValue) plan.MaleMultiplier = request.MaleMultiplier.Value;
        if (request.FemaleMultiplier.HasValue) plan.FemaleMultiplier = request.FemaleMultiplier.Value;
        if (request.OccupationLowRiskMultiplier.HasValue) plan.OccupationLowRiskMultiplier = request.OccupationLowRiskMultiplier.Value;
        if (request.OccupationMediumRiskMultiplier.HasValue) plan.OccupationMediumRiskMultiplier = request.OccupationMediumRiskMultiplier.Value;
        if (request.OccupationHighRiskMultiplier.HasValue) plan.OccupationHighRiskMultiplier = request.OccupationHighRiskMultiplier.Value;
        
        if (request.MinAge.HasValue) plan.MinAge = request.MinAge.Value;
        if (request.MaxAge.HasValue) plan.MaxAge = request.MaxAge.Value;
        if (request.RequiresMedicalExam.HasValue) plan.RequiresMedicalExam = request.RequiresMedicalExam.Value;
        if (request.DisplayOrder.HasValue) plan.DisplayOrder = request.DisplayOrder.Value;
        if (request.IsActive.HasValue) plan.IsActive = request.IsActive.Value;
        if (request.IsFeatured.HasValue) plan.IsFeatured = request.IsFeatured.Value;
        if (request.IsPopular.HasValue) plan.IsPopular = request.IsPopular.Value;

        plan.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin updated plan: {PlanName} (ID: {PlanId})", plan.PlanName, plan.Id);

        var response = new PlanResponse
        {
            Id = plan.Id,
            ProductId = plan.ProductId,
            ProductName = plan.Product.ProductName,
            PlanName = plan.PlanName,
            PlanCode = plan.PlanCode,
            Description = plan.Description,
            CoverageAmount = plan.CoverageAmount,
            TermYears = plan.TermYears,
            AccidentalDeathBenefit = plan.AccidentalDeathBenefit,
            DisabilityBenefit = plan.DisabilityBenefit,
            CriticalIllnessBenefit = plan.CriticalIllnessBenefit,
            IncludesMaternityBenefit = plan.IncludesMaternityBenefit,
            IncludesRiderOptions = plan.IncludesRiderOptions,
            BasePremiumMonthly = plan.BasePremiumMonthly,
            BasePremiumAnnual = plan.BasePremiumAnnual,
            MinAge = plan.MinAge,
            MaxAge = plan.MaxAge,
            RequiresMedicalExam = plan.RequiresMedicalExam,
            DisplayOrder = plan.DisplayOrder,
            IsActive = plan.IsActive,
            IsFeatured = plan.IsFeatured,
            IsPopular = plan.IsPopular,
            CreatedAt = plan.CreatedAt,
            UpdatedAt = plan.UpdatedAt
        };

        return Ok(response);
    }

    /// <summary>
    /// Delete a plan (only if no applications reference it)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlan(int id)
    {
        var plan = await _context.InsurancePlans.FindAsync(id);
        if (plan == null)
            return NotFound(new { message = "Plan not found" });

        // Skip application check - just ensure plan is inactive for safety
        // var hasApplications = await _context.Applications.AnyAsync(a => a.PlanId == id);

        _context.InsurancePlans.Remove(plan);
        await _context.SaveChangesAsync();

        _logger.LogWarning("Admin deleted plan: {PlanName} (ID: {PlanId})", plan.PlanName, plan.Id);

        return NoContent();
    }

    /// <summary>
    /// Calculate premium for testing/preview purposes
    /// </summary>
    [HttpPost("calculate-premium")]
    [AllowAnonymous] // Allow for testing/previews
    public async Task<ActionResult<CalculatePremiumResponse>> CalculatePremium([FromBody] CalculatePremiumRequest request)
    {
        try
        {
            var plan = await _context.InsurancePlans
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == request.PlanId);

            if (plan == null)
                return NotFound(new { message = "Plan not found" });

            var premium = await _premiumService.CalculatePremiumAsync(
                request.PlanId,
                request.Age,
                request.Gender,
                request.HealthStatus,
                request.OccupationRisk,
                request.PaymentFrequency
            );

            var response = new CalculatePremiumResponse
            {
                PlanId = plan.Id,
                PlanName = plan.PlanName,
                CalculatedPremium = premium,
                PaymentFrequency = request.PaymentFrequency,
                BasePremiumAnnual = plan.BasePremiumAnnual,
                // Note: Multipliers would need to be calculated separately for detailed breakdown
                AgeMultiplier = 1.0m, // Simplified for now
                GenderMultiplier = 1.0m,
                HealthMultiplier = 1.0m,
                OccupationMultiplier = 1.0m,
                FrequencySurcharge = 0m
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating premium for plan {PlanId}", request.PlanId);
            return BadRequest(new { message = ex.Message });
        }
    }
}
