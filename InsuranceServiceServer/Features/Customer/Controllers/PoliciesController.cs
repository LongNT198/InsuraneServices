using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Models.Insurance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PoliciesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PoliciesController> _logger;

        public PoliciesController(AppDbContext context, ILogger<PoliciesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Create a new insurance policy application
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreatePolicy([FromBody] CreatePolicyRequest request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                // Find customer profile
                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    throw new NotFoundException("Customer profile not found");
                }

                // Validate product (ProductId is int, Id is int)
                var product = await _context.InsuranceProducts
                    .FirstOrDefaultAsync(p => p.Id.ToString() == request.ProductId.ToString() && p.IsActive == true);

                if (product == null)
                {
                    throw new NotFoundException("Insurance product not found or inactive");
                }

                // TODO: DEPRECATED - Coverage/term validation now done against InsurancePlan, not Product
                // Products no longer have Min/MaxCoverageAmount or Min/MaxTermYears
                // Validation should check if selected planId exists and belongs to this product

                /* OLD VALIDATION - REMOVED
                // TODO: DEPRECATED - Coverage/term validation now done against InsurancePlan, not Product
                // Products no longer have Min/MaxCoverageAmount or Min/MaxTermYears
                // if (request.CoverageAmount < product.MinCoverageAmount || 
                //     request.CoverageAmount > product.MaxCoverageAmount)
                // {
                //     throw new ValidationException($"Coverage amount must be between {product.MinCoverageAmount:C} and {product.MaxCoverageAmount:C}");
                // }

                // if (request.TermYears < product.MinTermYears || 
                //     request.TermYears > product.MaxTermYears)
                // {
                //     throw new ValidationException($"Term years must be between {product.MinTermYears} and {product.MaxTermYears}");
                // }
                */

                // Calculate premium - TODO: Should use selected InsurancePlan pricing
                var age = DateTime.Today.Year - customerProfile.DateOfBirth.Year;
                decimal ageFactor = 1.0m;
                if (age > 50)
                    ageFactor = 1.5m;
                else if (age > 40)
                    ageFactor = 1.3m;
                else if (age > 30)
                    ageFactor = 1.1m;

                // TODO: DEPRECATED - Use InsurancePlan.BasePremium instead
                decimal annualPremium = 0; // Placeholder - should get from selected plan

                // Use ageFactor in premium calculation (even if placeholder)
                annualPremium *= ageFactor;

                decimal premium = request.PaymentFrequency switch
                {
                    "Monthly" => annualPremium / 12,
                    "Quarterly" => annualPremium / 4,
                    "HalfYearly" => annualPremium / 2,
                    "Yearly" => annualPremium,
                    _ => annualPremium
                };

                // Generate policy number
                var policyCount = await _context.InsurancePolicies.CountAsync();
                var policyNumber = $"POL-{product.ProductType.ToUpper()}-{(policyCount + 1):D6}";

                // Create policy
                var policy = new InsuranceServiceServer.Features.Customer.Models.InsurancePolicy
                {
                    PolicyNumber = policyNumber,
                    CustomerProfileId = customerProfile.Id,
                    ProductId = product.Id,
                    CoverageAmount = request.CoverageAmount,
                    Premium = Math.Round(premium, 2),
                    PaymentFrequency = request.PaymentFrequency,
                    TermYears = request.TermYears,
                    StartDate = request.StartDate,
                    EndDate = request.StartDate.AddYears(request.TermYears),
                    ApplicationDate = DateTime.UtcNow,
                    Status = "Pending"
                };

                await _context.InsurancePolicies.AddAsync(policy);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Policy application submitted successfully",
                    policy = new
                    {
                        policy.Id,
                        policy.PolicyNumber,
                        policy.CoverageAmount,
                        policy.Premium,
                        policy.PaymentFrequency,
                        policy.TermYears,
                        policy.StartDate,
                        policy.EndDate,
                        policy.Status,
                        Product = new
                        {
                            product.ProductName,
                            product.ProductType
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating policy");
                throw;
            }
        }

        /// <summary>
        /// Get all policies (for admin dashboard)
        /// </summary>
        [HttpGet]
        [Route("admin/all")]
        public async Task<IActionResult> GetAllPolicies()
        {
            try
            {
                var policies = await _context.InsurancePolicies
                    .ToListAsync();

                // Manual mapping to avoid EF Core issues
                var result = policies.Select(p => new
                {
                    p.Id,
                    p.PolicyNumber,
                    p.Status,
                    p.CoverageAmount,
                    p.Premium,
                    p.PaymentFrequency,
                    p.StartDate,
                    p.EndDate,
                    p.ApplicationDate,
                    p.ApprovalDate,
                    CustomerName = "Customer",
                    ProductType = "Insurance",
                    PlanName = "Standard Plan"
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching all policies: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Failed to fetch policies", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all policies for current user
        /// </summary>
        [HttpGet]
        [Route("my-policies")]
        public async Task<IActionResult> GetMyPolicies()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                // Find customer profile
                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    return Ok(new { policies = new List<object>() });
                }

                var policies = await _context.InsurancePolicies
                    .Include(p => p.Product)
                    .Where(p => p.CustomerProfileId == customerProfile.Id)
                    .OrderByDescending(p => p.ApplicationDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.PolicyNumber,
                        p.Status,
                        p.CoverageAmount,
                        p.Premium,
                        p.PaymentFrequency,
                    p.StartDate,
                    p.EndDate,
                    p.ApplicationDate,
                    p.ApprovalDate,
                    Product = new
                    {
                        Name = p.Product!.ProductName,
                        Type = p.Product.ProductType,
                        p.Product.Description
                    }
                })
                .ToListAsync();                return Ok(new { success = true, policies });
            }
            catch (UnauthorizedException ex)
            {
                _logger.LogWarning($"Unauthorized access: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting policies: {ex.Message}");
                throw new InternalServerException("Failed to retrieve policies");
            }
        }

        /// <summary>
        /// Get policy details by ID
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetPolicyById(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    throw new NotFoundException("Customer profile not found");
                }

                var policy = await _context.InsurancePolicies
                    .Include(p => p.Product)
                    .Include(p => p.Customer)
                    .Include(p => p.Payments)
                    .Include(p => p.Claims)
                    .FirstOrDefaultAsync(p => p.Id == id && p.CustomerProfileId == customerProfile.Id);

                if (policy == null)
                {
                    throw new NotFoundException("Policy not found");
                }

                var result = new
                {
                    policy.Id,
                    policy.PolicyNumber,
                    policy.Status,
                    policy.CoverageAmount,
                    policy.Premium,
                    policy.PaymentFrequency,
                    policy.TermYears,
                    policy.StartDate,
                    policy.EndDate,
                    policy.ApplicationDate,
                    policy.ApprovalDate,
                    policy.RejectionReason,
                    policy.BeneficiariesJson,
                    Product = new
                    {
                        policy.Product!.Id,
                        Name = policy.Product.ProductName,
                        Type = policy.Product.ProductType,
                        policy.Product.Description
                        // Coverage/rate details removed - use Plans API
                    },
                    Customer = new
                    {
                        policy.Customer!.FullName,
                        policy.Customer.DateOfBirth,
                        policy.Customer.Gender,
                        policy.Customer.PhoneNumber,
                        policy.Customer.Email,
                        policy.Customer.Address
                    },
                    PaymentSummary = new
                    {
                        TotalPaid = policy.Payments.Where(p => p.Status == "Completed").Sum(p => p.Amount),
                        PendingPayments = policy.Payments.Count(p => p.Status == "Pending"),
                        LastPaymentDate = policy.Payments.Where(p => p.Status == "Completed")
                            .OrderByDescending(p => p.PaymentDate).FirstOrDefault()?.PaymentDate
                    },
                    ClaimsSummary = new
                    {
                        TotalClaims = policy.Claims.Count,
                        ApprovedClaims = policy.Claims.Count(c => c.Status == "Approved"),
                        TotalClaimAmount = policy.Claims.Where(c => c.Status == "Approved").Sum(c => c.ApprovedAmount ?? 0)
                    }
                };

                return Ok(new { success = true, policy = result });
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning($"Policy not found: {ex.Message}");
                throw;
            }
            catch (UnauthorizedException ex)
            {
                _logger.LogWarning($"Unauthorized access: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting policy details: {ex.Message}");
                throw new InternalServerException("Failed to retrieve policy details");
            }
        }

        /// <summary>
        /// Calculate premium for a policy (public endpoint for estimation)
        /// </summary>
        [HttpPost]
        [Route("calculate-premium")]
        [AllowAnonymous]
        public async Task<IActionResult> CalculatePremium([FromBody] PremiumCalculationRequest request)
        {
            try
            {
                var product = await _context.InsuranceProducts
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId);

                if (product == null)
                {
                    throw new NotFoundException("Insurance product not found");
                }

                // TODO: DEPRECATED - Use InsurancePlan entity for coverage validation
                /* OLD VALIDATION REMOVED
                if (request.CoverageAmount < product.MinCoverageAmount || 
                    request.CoverageAmount > product.MaxCoverageAmount)
                {
                    throw new ValidationException($"Coverage amount must be between {product.MinCoverageAmount:C} and {product.MaxCoverageAmount:C}");
                }
                */

                // TODO: Use InsurancePlan.BasePremium instead of calculating from product.BaseRate
                decimal baseRate = 0; // Placeholder - should get from selected plan
                
                // Age factor
                decimal ageFactor = 1.0m;
                if (request.Age > 50)
                    ageFactor = 1.5m;
                else if (request.Age > 40)
                    ageFactor = 1.3m;
                else if (request.Age > 30)
                    ageFactor = 1.1m;

                // Calculate annual premium
                decimal annualPremium = (request.CoverageAmount * baseRate / 1000) * ageFactor;

                // Adjust for payment frequency
                decimal premium = request.PaymentFrequency switch
                {
                    "Monthly" => annualPremium / 12,
                    "Quarterly" => annualPremium / 4,
                    "HalfYearly" => annualPremium / 2,
                    "Yearly" => annualPremium,
                    _ => annualPremium / 12
                };

                var result = new
                {
                    success = true,
                    product = product.ProductName,
                    coverageAmount = request.CoverageAmount,
                    termYears = request.TermYears,
                    paymentFrequency = request.PaymentFrequency,
                    premium = Math.Round(premium, 2),
                    annualPremium = Math.Round(annualPremium, 2),
                    totalPremiumOverTerm = Math.Round(annualPremium * request.TermYears, 2),
                    ageFactor,
                    baseRate
                };

                return Ok(result);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning($"Product not found: {ex.Message}");
                throw;
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning($"Validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error calculating premium: {ex.Message}");
                throw new InternalServerException("Failed to calculate premium");
            }
        }

        /// <summary>
        /// Update policy (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager,Officer")]
        public async Task<IActionResult> UpdatePolicy(int id, [FromBody] UpdatePolicyRequest request)
        {
            try
            {
                var policy = await _context.InsurancePolicies
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (policy == null)
                {
                    throw new NotFoundException($"Policy with ID {id} not found");
                }

                // Update fields if provided
                if (request.Premium.HasValue)
                    policy.Premium = request.Premium.Value;

                if (!string.IsNullOrEmpty(request.Status))
                    policy.Status = request.Status;

                if (request.StartDate.HasValue)
                    policy.StartDate = request.StartDate.Value;

                if (request.EndDate.HasValue)
                    policy.EndDate = request.EndDate.Value;

                if (request.Status == "Active" && policy.ApprovalDate == null)
                    policy.ApprovalDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Policy updated successfully",
                    policy = new
                    {
                        policy.Id,
                        policy.PolicyNumber,
                        policy.Premium,
                        policy.Status,
                        policy.StartDate,
                        policy.EndDate,
                        policy.ApprovalDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating policy: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Delete policy (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeletePolicy(int id)
        {
            try
            {
                var policy = await _context.InsurancePolicies
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (policy == null)
                {
                    throw new NotFoundException($"Policy with ID {id} not found");
                }

                _context.InsurancePolicies.Remove(policy);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Policy deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting policy: {ex.Message}");
                throw;
            }
        }

    }

    public class UpdatePolicyRequest
    {
        public decimal? Premium { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class PremiumCalculationRequest
    {
        public int ProductId { get; set; }
        public decimal CoverageAmount { get; set; }
        public int TermYears { get; set; }
        public int Age { get; set; }
        public string PaymentFrequency { get; set; } = "Monthly";
    }
}



