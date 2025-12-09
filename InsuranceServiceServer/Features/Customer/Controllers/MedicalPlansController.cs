using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Customer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalPlansController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<MedicalPlansController> _logger;

    public MedicalPlansController(AppDbContext context, ILogger<MedicalPlansController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all active medical insurance plans for a specific product
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<IEnumerable<MedicalInsurancePlanDto>>> GetMedicalPlansByProduct(int productId)
    {
        try
        {
            var plans = await _context.MedicalInsurancePlans
                .Include(p => p.Product)
                .Where(p => p.ProductId == productId && p.IsActive)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();

            if (!plans.Any())
            {
                return NotFound(new { message = $"No active medical plans found for product ID {productId}" });
            }

            var planDtos = plans.Select(p => MapToDto(p)).ToList();
            return Ok(planDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving medical plans for product {ProductId}", productId);
            return StatusCode(500, new { message = "Error retrieving medical insurance plans" });
        }
    }

    /// <summary>
    /// Get a specific medical plan by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalInsurancePlanDto>> GetMedicalPlan(int id)
    {
        try
        {
            var plan = await _context.MedicalInsurancePlans
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
            {
                return NotFound(new { message = $"Medical plan with ID {id} not found" });
            }

            return Ok(MapToDto(plan));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving medical plan {PlanId}", id);
            return StatusCode(500, new { message = "Error retrieving medical insurance plan" });
        }
    }

    /// <summary>
    /// Calculate premium for a specific medical plan
    /// </summary>
    [HttpPost("calculate")]
    public async Task<ActionResult<object>> CalculatePremium([FromBody] PlanPremiumCalculationRequest request)
    {
        try
        {
            var plan = await _context.MedicalInsurancePlans
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == request.PlanId);

            if (plan == null)
            {
                return NotFound(new { message = $"Medical plan with ID {request.PlanId} not found" });
            }

            // Validate age range
            if (request.Age < plan.MinAge || request.Age > plan.MaxAge)
            {
                return BadRequest(new 
                { 
                    message = $"Age must be between {plan.MinAge} and {plan.MaxAge} for this plan" 
                });
            }

            // Calculate premium
            var calculatedPremium = plan.CalculatePremium(
                request.Age,
                request.Gender,
                request.HealthStatus,
                request.OccupationRisk,
                request.PaymentFrequency
            );

            // Return response with medical-specific fields
            var response = new
            {
                planId = plan.Id,
                planName = plan.PlanName,
                planCode = plan.PlanCode,
                description = plan.Description ?? "",
                annualCoverageLimit = plan.AnnualCoverageLimit,
                termYears = plan.TermYears,
                basePremiumAnnual = plan.BasePremiumAnnual,
                calculatedPremium = calculatedPremium,
                paymentFrequency = request.PaymentFrequency,
                requiresMedicalExam = plan.RequiresMedicalExam,
                
                // Medical-specific benefits
                coverageDetails = new
                {
                    deductible = plan.Deductible,
                    coPaymentPercentage = plan.CoPaymentPercentage,
                    outOfPocketMaximum = plan.OutOfPocketMaximum,
                    roomAndBoardDailyLimit = plan.RoomAndBoardDailyLimit,
                    icuDailyLimit = plan.ICUDailyLimit,
                    maxHospitalizationDays = plan.MaxHospitalizationDays
                },
                
                additionalBenefits = new
                {
                    includesMaternityBenefit = plan.IncludesMaternityBenefit,
                    maternityCoverageLimit = plan.MaternityCoverageLimit,
                    includesDentalBasic = plan.IncludesDentalBasic,
                    dentalAnnualLimit = plan.DentalAnnualLimit,
                    includesVisionBasic = plan.IncludesVisionBasic,
                    visionAnnualLimit = plan.VisionAnnualLimit,
                    annualHealthCheckupIncluded = plan.AnnualHealthCheckupIncluded,
                    preventiveCareIncluded = plan.PreventiveCareIncluded,
                    mentalHealthCoverageIncluded = plan.MentalHealthCoverageIncluded,
                    mentalHealthSessionLimit = plan.MentalHealthSessionLimit,
                    ambulanceServiceIncluded = plan.AmbulanceServiceIncluded,
                    criticalIllnessBenefit = plan.CriticalIllnessBenefit,
                    accidentalInjuryCoverage = plan.AccidentalInjuryCoverage
                },
                
                appliedFactors = new
                {
                    ageFactor = GetAgeFactor(plan, request.Age),
                    genderFactor = request.Gender?.ToLower() == "male" ? plan.MaleMultiplier : plan.FemaleMultiplier,
                    healthFactor = GetHealthFactor(plan, request.HealthStatus),
                    occupationFactor = GetOccupationFactor(plan, request.OccupationRisk)
                }
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating premium for medical plan {PlanId}", request.PlanId);
            return StatusCode(500, new { message = "Error calculating premium" });
        }
    }

    // Helper method to map entity to DTO
    private MedicalInsurancePlanDto MapToDto(MedicalInsurancePlan plan)
    {
        return new MedicalInsurancePlanDto
        {
            Id = plan.Id,
            ProductId = plan.ProductId,
            PlanName = plan.PlanName,
            PlanCode = plan.PlanCode,
            Description = plan.Description,
            
            // Coverage Limits
            AnnualCoverageLimit = plan.AnnualCoverageLimit,
            LifetimeCoverageLimit = plan.LifetimeCoverageLimit,
            Deductible = plan.Deductible,
            CoPaymentPercentage = plan.CoPaymentPercentage,
            OutOfPocketMaximum = plan.OutOfPocketMaximum,
            TermYears = plan.TermYears,
            
            // Hospitalization
            RoomAndBoardDailyLimit = plan.RoomAndBoardDailyLimit,
            ICUDailyLimit = plan.ICUDailyLimit,
            HospitalizationCoveragePercentage = plan.HospitalizationCoveragePercentage,
            MaxHospitalizationDays = plan.MaxHospitalizationDays,
            
            // Outpatient
            OutpatientAnnualLimit = plan.OutpatientAnnualLimit,
            DoctorVisitCopay = plan.DoctorVisitCopay,
            SpecialistVisitCopay = plan.SpecialistVisitCopay,
            DiagnosticTestsCoveragePercentage = plan.DiagnosticTestsCoveragePercentage,
            
            // Medication
            PrescriptionDrugAnnualLimit = plan.PrescriptionDrugAnnualLimit,
            GenericDrugCopay = plan.GenericDrugCopay,
            BrandNameDrugCopay = plan.BrandNameDrugCopay,
            
            // Additional Benefits
            IncludesMaternityBenefit = plan.IncludesMaternityBenefit,
            MaternityCoverageLimit = plan.MaternityCoverageLimit,
            IncludesDentalBasic = plan.IncludesDentalBasic,
            DentalAnnualLimit = plan.DentalAnnualLimit,
            IncludesVisionBasic = plan.IncludesVisionBasic,
            VisionAnnualLimit = plan.VisionAnnualLimit,
            AnnualHealthCheckupIncluded = plan.AnnualHealthCheckupIncluded,
            PreventiveCareIncluded = plan.PreventiveCareIncluded,
            MentalHealthCoverageIncluded = plan.MentalHealthCoverageIncluded,
            MentalHealthSessionLimit = plan.MentalHealthSessionLimit,
            
            // Emergency & Critical Care
            EmergencyRoomCopay = plan.EmergencyRoomCopay,
            AmbulanceServiceIncluded = plan.AmbulanceServiceIncluded,
            CriticalIllnessBenefit = plan.CriticalIllnessBenefit,
            AccidentalInjuryCoverage = plan.AccidentalInjuryCoverage,
            
            // Network & Restrictions
            NetworkHospitalsOnly = plan.NetworkHospitalsOnly,
            RequiresReferralForSpecialist = plan.RequiresReferralForSpecialist,
            PreAuthorizationRequired = plan.PreAuthorizationRequired,
            
            // Waiting Periods
            GeneralWaitingPeriodDays = plan.GeneralWaitingPeriodDays,
            PreExistingConditionWaitingPeriodMonths = plan.PreExistingConditionWaitingPeriodMonths,
            MaternityWaitingPeriodMonths = plan.MaternityWaitingPeriodMonths,
            
            // Premium
            BasePremiumMonthly = plan.BasePremiumMonthly,
            BasePremiumQuarterly = plan.BasePremiumQuarterly,
            BasePremiumSemiAnnual = plan.BasePremiumSemiAnnual,
            BasePremiumAnnual = plan.BasePremiumAnnual,
            BasePremiumLumpSum = plan.BasePremiumLumpSum,
            
            // Plan limits
            MinAge = plan.MinAge,
            MaxAge = plan.MaxAge,
            RequiresMedicalExam = plan.RequiresMedicalExam,
            
            // Display
            DisplayOrder = plan.DisplayOrder,
            IsActive = plan.IsActive,
            IsFeatured = plan.IsFeatured,
            IsPopular = plan.IsPopular
        };
    }

    // Helper methods
    private decimal GetAgeFactor(MedicalInsurancePlan plan, int age)
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

    private decimal GetHealthFactor(MedicalInsurancePlan plan, string? healthStatus)
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

    private decimal GetOccupationFactor(MedicalInsurancePlan plan, string? occupationRisk)
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
