using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Models.Insurance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace InsuranceServiceServer.Features.Admin.Controllers
{
    [ApiController]
    [Route("api/admin/applications")]
    [Authorize(Roles = "Admin")]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ApplicationsController> _logger;

        public ApplicationsController(
            AppDbContext context,
            ILogger<ApplicationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all applications - Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllApplications(
            [FromQuery] string? status = null,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 50)
        {
            try
            {
                var query = _context.Applications
                    .Include(a => a.Product)
                    .AsNoTracking()
                    .AsQueryable();

                // Filter by status
                if (!string.IsNullOrWhiteSpace(status))
                {
                    query = query.Where(x => x.Status == status);
                }

                query = query.OrderByDescending(x => x.CreatedAt);

                var applications = await query.Skip(skip).Take(take)
                    .Select(a => new
                    {
                        a.Id,
                        a.ApplicationNumber,
                        a.UserId,
                        a.ProductId,
                        ProductName = a.Product != null ? a.Product.ProductName : "N/A",
                        ProductType = a.Product != null ? a.Product.ProductType : "N/A",
                        a.CoverageAmount,
                        a.TermYears,
                        a.PaymentFrequency,
                        a.PremiumAmount,
                        a.TotalPremiumAmount,
                        a.Status,
                        a.TermsAccepted,
                        a.DeclarationAccepted,
                        BeneficiariesCount = a.Beneficiaries.Count,
                        a.CreatedAt,
                        a.UpdatedAt,
                        a.SubmittedAt,
                        a.ReviewedAt,
                        a.ReviewNotes,
                        a.ReviewedBy
                    })
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {applications.Count} applications");
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving applications: {ex.Message}");
                throw new InternalServerException("Failed to retrieve applications");
            }
        }

        /// <summary>
        /// Get application by ID - Admin only
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplicationById(int id)
        {
            try
            {
                var application = await _context.Applications
                    .Include(a => a.Product)
                    .Include(a => a.Beneficiaries)
                    .Where(a => a.Id == id)
                    .Select(a => new
                    {
                        a.Id,
                        a.ApplicationNumber,
                        a.UserId,
                        a.ProductId,
                        ProductName = a.Product != null ? a.Product.ProductName : "N/A",
                        ProductType = a.Product != null ? a.Product.ProductType : "N/A",
                        a.CoverageAmount,
                        a.TermYears,
                        a.PaymentFrequency,
                        a.PremiumAmount,
                        a.TotalPremiumAmount,
                        a.HealthDeclarationId,
                        Beneficiaries = a.Beneficiaries.Select(b => new
                        {
                            b.FullName,
                            b.Relationship,
                            b.RelationshipOther,
                            b.Percentage,
                            b.IsMinor
                        }),
                        a.Status,
                        a.TermsAccepted,
                        a.DeclarationAccepted,
                        a.CreatedAt,
                        a.UpdatedAt,
                        a.SubmittedAt,
                        a.ReviewedAt,
                        a.ReviewNotes,
                        a.ReviewedBy
                    })
                    .FirstOrDefaultAsync();

                if (application == null)
                {
                    return NotFound(new { success = false, message = "Application not found" });
                }

                return Ok(application);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving application {id}: {ex.Message}");
                throw new InternalServerException("Failed to retrieve application");
            }
        }

        /// <summary>
        /// Approve application - Admin only
        /// </summary>
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveApplication(int id, [FromBody] ApplicationApprovalRequest request)
        {
            try
            {
                var application = await _context.Applications.FindAsync(id);
                if (application == null)
                {
                    return NotFound(new { success = false, message = "Application not found" });
                }

                application.Status = "Approved";
                application.ReviewedAt = DateTime.UtcNow;
                application.ReviewNotes = request.Notes;
                application.ReviewedBy = User.FindFirstValue("sub") ?? "Admin";
                application.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Application {id} approved by admin");
                return Ok(new { success = true, message = "Application approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error approving application {id}: {ex.Message}");
                throw new InternalServerException("Failed to approve application");
            }
        }

        /// <summary>
        /// Reject application - Admin only
        /// </summary>
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectApplication(int id, [FromBody] ApplicationRejectionRequest request)
        {
            try
            {
                var application = await _context.Applications.FindAsync(id);
                if (application == null)
                {
                    return NotFound(new { success = false, message = "Application not found" });
                }

                application.Status = "Rejected";
                application.ReviewedAt = DateTime.UtcNow;
                application.ReviewNotes = request.Reason;
                application.ReviewedBy = User.FindFirstValue("sub") ?? "Admin";
                application.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Application {id} rejected by admin");
                return Ok(new { success = true, message = "Application rejected successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error rejecting application {id}: {ex.Message}");
                throw new InternalServerException("Failed to reject application");
            }
        }

        /// <summary>
        /// Update application status - Admin only
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApplication(int id, [FromBody] UpdateApplicationRequest request)
        {
            try
            {
                var application = await _context.Applications.FindAsync(id);
                if (application == null)
                {
                    return NotFound(new { success = false, message = "Application not found" });
                }

                if (!string.IsNullOrWhiteSpace(request.Status))
                {
                    application.Status = request.Status;
                }

                if (!string.IsNullOrWhiteSpace(request.ReviewNotes))
                {
                    application.ReviewNotes = request.ReviewNotes;
                }

                application.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Application {id} updated by admin");
                return Ok(new { success = true, message = "Application updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating application {id}: {ex.Message}");
                throw new InternalServerException("Failed to update application");
            }
        }

        /// <summary>
        /// Get application statistics - Admin only
        /// </summary>
        [HttpGet("stats/summary")]
        public async Task<IActionResult> GetApplicationStats()
        {
            try
            {
                var stats = new
                {
                    total = await _context.Applications.CountAsync(),
                    submitted = await _context.Applications.Where(a => a.Status == "Submitted").CountAsync(),
                    approved = await _context.Applications.Where(a => a.Status == "Approved").CountAsync(),
                    rejected = await _context.Applications.Where(a => a.Status == "Rejected").CountAsync(),
                    inReview = await _context.Applications.Where(a => a.Status == "In Review").CountAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving application statistics: {ex.Message}");
                throw new InternalServerException("Failed to retrieve statistics");
            }
        }
    }

    public class ApplicationApprovalRequest
    {
        public string? Notes { get; set; }
    }

    public class ApplicationRejectionRequest
    {
        public string? Reason { get; set; }
    }

    public class UpdateApplicationRequest
    {
        public string? Status { get; set; }
        public string? ReviewNotes { get; set; }
    }
}
