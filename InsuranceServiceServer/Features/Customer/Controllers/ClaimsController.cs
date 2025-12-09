using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using ValidationException = InsuranceServiceServer.Core.Exceptions.ValidationException;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ClaimsController> _logger;

        public ClaimsController(AppDbContext context, ILogger<ClaimsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all claims for current user
        /// </summary>
        [HttpGet]
        [Route("my-claims")]
        public async Task<IActionResult> GetMyClaims()
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
                    return Ok(new { claims = new List<object>() });
                }

                var claims = await _context.InsuranceClaims
                    .Include(c => c.Policy)
                        .ThenInclude(p => p!.Product)
                    .Where(c => c.Policy!.CustomerProfileId == customerProfile.Id)
                    .OrderByDescending(c => c.ClaimDate)
                    .Select(c => new
                    {
                        c.Id,
                        c.ClaimNumber,
                        c.ClaimType,
                        c.ClaimAmount,
                        c.ClaimDate,
                        c.Status,
                        c.IncidentDate,
                        PolicyNumber = c.Policy!.PolicyNumber,
                        ProductName = c.Policy.Product!.ProductName
                    })
                    .ToListAsync();

                return Ok(new { success = true, claims });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user claims");
                throw;
            }
        }

        /// <summary>
        /// Get claim details by ID
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetClaim(int id)
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

                var claim = await _context.InsuranceClaims
                    .Include(c => c.Policy)
                        .ThenInclude(p => p!.Product)
                    .Include(c => c.Policy)
                        .ThenInclude(p => p!.Customer)
                    .FirstOrDefaultAsync(c => c.Id == id && c.Policy!.CustomerProfileId == customerProfile.Id);

                if (claim == null)
                {
                    throw new NotFoundException("Claim not found");
                }

                var result = new
                {
                    claim.Id,
                    claim.ClaimNumber,
                    claim.ClaimType,
                    claim.ClaimAmount,
                    claim.ApprovedAmount,
                    claim.ClaimDate,
                    claim.IncidentDate,
                    claim.Description,
                    claim.Status,
                    claim.ReviewedDate,
                    claim.ReviewedBy,
                    claim.RejectionReason,
                    Policy = new
                    {
                        claim.Policy!.Id,
                        claim.Policy.PolicyNumber,
                        claim.Policy.CoverageAmount,
                        Product = new
                        {
                            Name = claim.Policy.Product!.ProductName,
                            Type = claim.Policy.Product.ProductType
                        }
                    }
                };

                return Ok(new { success = true, claim = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting claim details");
                throw;
            }
        }

        /// <summary>
        /// Submit a new insurance claim
        /// </summary>
        [HttpPost]
        [Route("submit")]
        public async Task<IActionResult> SubmitClaim([FromBody] SubmitClaimRequest request)
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

                // Verify policy belongs to user and is active
                var policy = await _context.InsurancePolicies
                    .Include(p => p.Product)
                    .FirstOrDefaultAsync(p => p.Id == request.PolicyId && 
                                            p.CustomerProfileId == customerProfile.Id &&
                                            p.Status == "Active");

                if (policy == null)
                {
                    throw new NotFoundException("Active policy not found");
                }

                // Validate claim amount against coverage
                if (request.ClaimAmount > policy.CoverageAmount)
                {
                    throw new ValidationException($"Claim amount cannot exceed policy coverage of {policy.CoverageAmount:C}");
                }

                // Generate claim number
                var claimCount = await _context.InsuranceClaims.CountAsync();
                var claimNumber = $"CLM-{policy.Product!.ProductType.ToUpper()}-{(claimCount + 1):D6}";

                var claim = new InsuranceClaim
                {
                    ClaimNumber = claimNumber,
                    PolicyId = policy.Id,
                    ClaimType = request.ClaimType,
                    ClaimAmount = request.ClaimAmount,
                    IncidentDate = request.IncidentDate,
                    Description = request.Description,
                    ClaimDate = DateTime.UtcNow,
                    Status = "Pending"
                };

                await _context.InsuranceClaims.AddAsync(claim);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Claim submitted successfully",
                    claim = new
                    {
                        claim.Id,
                        claim.ClaimNumber,
                        claim.ClaimAmount,
                        claim.Status,
                        claim.ClaimDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting claim");
                throw;
            }
        }

        /// <summary>
        /// Update claim status (Admin only)
        /// </summary>
        [HttpPut]
        [Route("{id}/status")]
        [Authorize(Roles = "Admin,ClaimsProcessor")]
        public async Task<IActionResult> UpdateClaimStatus(int id, [FromBody] UpdateClaimStatusRequest request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                var claim = await _context.InsuranceClaims
                    .Include(c => c.Policy)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (claim == null)
                {
                    throw new NotFoundException("Claim not found");
                }

                claim.Status = request.Status;
                claim.ReviewedBy = userId;
                claim.ReviewedDate = DateTime.UtcNow;

                // Update claim amount if provided
                if (request.ClaimAmount.HasValue && request.ClaimAmount.Value > 0)
                {
                    claim.ClaimAmount = request.ClaimAmount.Value;
                }

                // Update priority if provided
                if (!string.IsNullOrEmpty(request.Priority))
                {
                    claim.Priority = request.Priority;
                }

                if (request.Status == "Approved")
                {
                    claim.ApprovedAmount = request.ApprovedAmount ?? claim.ClaimAmount;
                }
                else if (request.Status == "Rejected")
                {
                    claim.RejectionReason = request.RejectionReason;
                }
                else if (request.Status == "Paid")
                {
                    claim.PaidDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Claim status updated successfully",
                    claim = new
                    {
                        claim.Id,
                        claim.ClaimNumber,
                        claim.Status,
                        claim.ApprovedAmount,
                        claim.ReviewedDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating claim status");
                throw;
            }
        }

        /// <summary>
        /// Get all claims for admin
        /// </summary>
        [HttpGet]
        [Route("admin/all")]
        [Authorize(Roles = "Admin,ClaimsProcessor")]
        public async Task<IActionResult> GetAllClaims([FromQuery] string? status = null)
        {
            try
            {
                var query = _context.InsuranceClaims
                    .Include(c => c.Policy)
                        .ThenInclude(p => p!.Product)
                    .Include(c => c.Policy)
                        .ThenInclude(p => p!.Customer)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(c => c.Status == status);
                }

                var claims = await query
                    .OrderByDescending(c => c.ClaimDate)
                    .Select(c => new
                    {
                        c.Id,
                        c.ClaimNumber,
                        c.ClaimType,
                        c.ClaimAmount,
                        c.ApprovedAmount,
                        c.ClaimDate,
                        c.Status,
                        c.Priority,
                        PolicyNumber = c.Policy!.PolicyNumber,
                        ProductName = c.Policy.Product!.ProductName,
                        CustomerName = c.Policy.Customer!.FirstName + " " + c.Policy.Customer.LastName
                    })
                    .ToListAsync();

                return Ok(new { success = true, claims });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all claims");
                throw;
            }
        }
    }

    public class SubmitClaimRequest
    {
        [Required]
        public int PolicyId { get; set; }

        [Required]
        public string ClaimType { get; set; } = string.Empty;

        [Required]
        [Range(1, double.MaxValue)]
        public decimal ClaimAmount { get; set; }

        [Required]
        public DateTime IncidentDate { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateClaimStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;

        public decimal? ClaimAmount { get; set; }

        public decimal? ApprovedAmount { get; set; }

        public string? Priority { get; set; }

        public string? RejectionReason { get; set; }
    }
}



