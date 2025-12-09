using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Admin.Controllers
{
    [Route("api/admin/policies")]
    [ApiController]
    public class AdminPoliciesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminPoliciesController> _logger;

        public AdminPoliciesController(AppDbContext context, ILogger<AdminPoliciesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class AdminCreatePolicyRequest
        {
            // Accept either CustomerProfileId (preferred) or UserId (to lookup profile)
            public string? CustomerProfileId { get; set; }
            public string? UserId { get; set; }
            public int ProductId { get; set; }
            public decimal CoverageAmount { get; set; }
            public int TermYears { get; set; }
            public string PaymentFrequency { get; set; } = "Monthly";
            public DateTime StartDate { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreatePolicy([FromBody] AdminCreatePolicyRequest request)
        {
            try
            {
                // Resolve customer profile
                CustomerProfile? customer = null;

                if (!string.IsNullOrWhiteSpace(request.CustomerProfileId))
                {
                    customer = await _context.CustomerProfiles
                        .FirstOrDefaultAsync(c => c.Id == request.CustomerProfileId);
                }
                else if (!string.IsNullOrWhiteSpace(request.UserId))
                {
                    customer = await _context.CustomerProfiles
                        .FirstOrDefaultAsync(c => c.UserId == request.UserId);
                }

                if (customer == null)
                    throw new NotFoundException("Customer profile not found. Provide valid CustomerProfileId or UserId.");

                var product = await _context.InsuranceProducts
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

                if (product == null)
                    throw new NotFoundException("Insurance product not found or inactive");

                // TODO: DEPRECATED - Coverage/term validation now done against InsurancePlan, not Product
                // Products no longer have Min/MaxCoverageAmount or Min/MaxTermYears
                // Validation should check if selected planId exists and belongs to this product

                var age = DateTime.Today.Year - customer.DateOfBirth.Year;
                decimal ageFactor = 1.0m;
                if (age > 50) ageFactor = 1.5m;
                else if (age > 40) ageFactor = 1.3m;
                else if (age > 30) ageFactor = 1.1m;

                // TODO: DEPRECATED - Use InsurancePlan.BasePremium instead
                decimal annualPremium = 5000; // Placeholder - should get from selected plan
                annualPremium *= ageFactor; // <-- Use ageFactor in premium calculation
                decimal premium = request.PaymentFrequency switch
                {
                    "Monthly" => annualPremium / 12,
                    "Quarterly" => annualPremium / 4,
                    "HalfYearly" => annualPremium / 2,
                    "Yearly" => annualPremium,
                    _ => annualPremium
                };

                var policyCount = await _context.InsurancePolicies.CountAsync();
                var policyNumber = $"POL-{product.ProductType.ToUpper()}-{(policyCount + 1):D6}";

                var policy = new InsurancePolicy
                {
                    PolicyNumber = policyNumber,
                    CustomerProfileId = customer.Id,
                    ProductId = product.Id,
                    CoverageAmount = request.CoverageAmount,
                    Premium = Math.Round(premium, 2),
                    PaymentFrequency = request.PaymentFrequency,
                    TermYears = request.TermYears,
                    StartDate = request.StartDate,
                    EndDate = request.StartDate.AddYears(request.TermYears),
                    ApplicationDate = DateTime.UtcNow,
                    ApprovalDate = DateTime.UtcNow,
                    Status = "Active"
                };

                await _context.InsurancePolicies.AddAsync(policy);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPolicyById), new { id = policy.Id }, new { success = true, policy });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating policy as admin");
                throw;
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPolicyById(int id)
        {
            var policy = await _context.InsurancePolicies
                .Include(p => p.Product)
                .Include(p => p.Customer)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (policy == null)
                return NotFound(new { success = false, message = "Policy not found" });

            return Ok(new { success = true, policy });
        }
    }
}
