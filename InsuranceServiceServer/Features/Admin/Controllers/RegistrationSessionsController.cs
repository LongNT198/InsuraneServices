using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InsuranceServiceServer.Features.Admin.Controllers
{
    [ApiController]
    [Route("api/admin/registration-sessions")]
    [Authorize(Roles = "Admin")]
    public class RegistrationSessionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RegistrationSessionsController> _logger;

        public RegistrationSessionsController(
            AppDbContext context,
            ILogger<RegistrationSessionsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all registration sessions - Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllRegistrationSessions(
            [FromQuery] string? status = null,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 50)
        {
            try
            {
                var query = _context.RegistrationSessions
                    .AsNoTracking()
                    .AsQueryable();

                // Filter by registration status
                if (!string.IsNullOrWhiteSpace(status))
                {
                    query = query.Where(x => x.RegistrationStatus == status);
                }

                query = query.OrderByDescending(x => x.CreatedDate);

                var sessions = await query.Skip(skip).Take(take)
                    .Select(s => new
                    {
                        s.Id,
                        s.UserId,
                        s.CurrentStep,
                        s.RegistrationStatus,
                        s.CreatedDate,
                        s.LastUpdateDate,
                        s.SelectedProductId,
                        s.SelectedCoverageAmount,
                        s.SelectedTermYears,
                        s.Notes,
                        s.RejectionReason
                    })
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {sessions.Count} registration sessions");
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving registration sessions: {ex.Message}");
                throw new InternalServerException("Failed to retrieve registration sessions");
            }
        }

        /// <summary>
        /// Get registration session by ID - Admin only
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRegistrationSessionById(int id)
        {
            try
            {
                var session = await _context.RegistrationSessions
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (session == null)
                    throw new NotFoundException($"Registration session with ID {id} not found");

                return Ok(new
                {
                    session.Id,
                    session.UserId,
                    session.SessionToken,
                    session.CurrentStep,
                    session.RegistrationStatus,
                    session.CreatedDate,
                    session.CompletedDate,
                    session.LastUpdateDate,
                    session.IsAccountCreated,
                    session.IsKYCCompleted,
                    session.IsProfileCompleted,
                    session.IsProductSelected,
                    session.IsHealthDeclared,
                    session.IsUnderwritingCompleted,
                    session.IsPaymentCompleted,
                    session.IsPolicyIssued,
                    session.SelectedProductId,
                    session.SelectedCoverageAmount,
                    session.SelectedTermYears,
                    session.SelectedPaymentFrequency,
                    session.Notes,
                    session.RejectionReason
                });
            }
            catch (NotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving registration session {id}: {ex.Message}");
                throw new InternalServerException("Failed to retrieve registration session");
            }
        }

        /// <summary>
        /// Approve registration session - Admin only
        /// </summary>
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveRegistrationSession(
            int id,
            [FromBody] ApprovalRequest request)
        {
            try
            {
                var session = await _context.RegistrationSessions
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (session == null)
                    throw new NotFoundException($"Registration session with ID {id} not found");

                if (session.RegistrationStatus != "InProgress")
                    throw new ValidationException($"Only in-progress applications can be approved. Current status: {session.RegistrationStatus}");

                session.RegistrationStatus = "Completed";
                session.CurrentStep = "PolicyIssued";
                session.IsPolicyIssued = true;
                session.CompletedDate = DateTime.UtcNow;
                session.LastUpdateDate = DateTime.UtcNow;
                session.Notes = request?.ApprovalNotes ?? "";

                _context.RegistrationSessions.Update(session);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Registration session {id} approved by admin");
                return Ok(new { message = "Registration session approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error approving registration session {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Reject registration session - Admin only
        /// </summary>
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectRegistrationSession(
            int id,
            [FromBody] RejectionRequest request)
        {
            try
            {
                var session = await _context.RegistrationSessions
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (session == null)
                    throw new NotFoundException($"Registration session with ID {id} not found");

                if (session.RegistrationStatus != "InProgress")
                    throw new ValidationException($"Only in-progress applications can be rejected. Current status: {session.RegistrationStatus}");

                session.RegistrationStatus = "Rejected";
                session.LastUpdateDate = DateTime.UtcNow;
                session.RejectionReason = request?.RejectionReason ?? "";
                session.Notes = request?.RejectionReason ?? "";

                _context.RegistrationSessions.Update(session);
                await _context.SaveChangesAsync();

                _logger.LogWarning($"Registration session {id} rejected by admin. Reason: {request?.RejectionReason}");
                return Ok(new { message = "Registration session rejected successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error rejecting registration session {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Update registration session notes - Admin only
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRegistrationSession(
            int id,
            [FromBody] UpdateSessionRequest request)
        {
            try
            {
                var session = await _context.RegistrationSessions
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (session == null)
                    throw new NotFoundException($"Registration session with ID {id} not found");

                if (!string.IsNullOrWhiteSpace(request?.Notes))
                {
                    session.Notes = request.Notes;
                }

                if (!string.IsNullOrWhiteSpace(request?.CurrentStep))
                {
                    session.CurrentStep = request.CurrentStep;
                }

                session.LastUpdateDate = DateTime.UtcNow;

                _context.RegistrationSessions.Update(session);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Registration session {id} updated by admin");
                return Ok(new { message = "Registration session updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating registration session {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Get registration session statistics - Admin only
        /// </summary>
        [HttpGet("admin/stats")]
        public async Task<IActionResult> GetRegistrationStats()
        {
            try
            {
                var totalCount = await _context.RegistrationSessions.CountAsync();
                var inProgressCount = await _context.RegistrationSessions
                    .CountAsync(s => s.RegistrationStatus == "InProgress");
                var completedCount = await _context.RegistrationSessions
                    .CountAsync(s => s.RegistrationStatus == "Completed");
                var rejectedCount = await _context.RegistrationSessions
                    .CountAsync(s => s.RegistrationStatus == "Rejected");

                return Ok(new
                {
                    totalCount,
                    inProgressCount,
                    completedCount,
                    rejectedCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving registration stats: {ex.Message}");
                throw new InternalServerException("Failed to retrieve statistics");
            }
        }
    }

    public class ApprovalRequest
    {
        public string? ApprovalNotes { get; set; }
    }

    public class RejectionRequest
    {
        public string? RejectionReason { get; set; }
    }

    public class UpdateSessionRequest
    {
        public string? CurrentStep { get; set; }
        public string? Notes { get; set; }
    }
}
