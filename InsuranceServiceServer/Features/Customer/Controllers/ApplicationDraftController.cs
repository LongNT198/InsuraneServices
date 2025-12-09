using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Features.Customer.DTOs;
using System.Security.Claims;
using System.Text.Json;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationDraftController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ApplicationDraftController> _logger;

        public ApplicationDraftController(
            AppDbContext context,
            ILogger<ApplicationDraftController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? throw new UnauthorizedAccessException("User not authenticated");
        }

        /// <summary>
        /// Create a new application draft (from Calculator)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateDraft([FromBody] CreateDraftRequest request)
        {
            try
            {
                var userId = GetUserId();

                // Check if user already has a draft of this type
                var existingDraft = await _context.ApplicationDrafts
                    .FirstOrDefaultAsync(d => d.UserId == userId && d.ApplicationType == request.ApplicationType);

                if (existingDraft != null)
                {
                    // Update existing draft
                    existingDraft.DraftData = request.DraftData.ToString();
                    existingDraft.UpdatedAt = DateTime.UtcNow;
                    existingDraft.ExpiresAt = DateTime.UtcNow.AddDays(30); // Expire after 30 days
                    existingDraft.Notes = request.Notes;

                    _logger.LogInformation("Updated draft {DraftId} for user {UserId}", existingDraft.Id, userId);
                }
                else
                {
                    // Create new draft
                    var draft = new ApplicationDraft
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        ApplicationType = request.ApplicationType,
                        DraftData = request.DraftData.ToString(),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddDays(30),
                        Notes = request.Notes
                    };

                    _context.ApplicationDrafts.Add(draft);
                    existingDraft = draft;

                    _logger.LogInformation("Created new draft {DraftId} for user {UserId}", draft.Id, userId);
                }

                await _context.SaveChangesAsync();

                var response = new ApplicationDraftResponse
                {
                    Id = existingDraft.Id,
                    ApplicationType = existingDraft.ApplicationType,
                    DraftData = JsonSerializer.Deserialize<JsonElement>(existingDraft.DraftData),
                    CreatedAt = existingDraft.CreatedAt,
                    UpdatedAt = existingDraft.UpdatedAt,
                    ExpiresAt = existingDraft.ExpiresAt,
                    Notes = existingDraft.Notes
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating draft");
                return StatusCode(500, new { success = false, message = "Failed to create draft" });
            }
        }

        /// <summary>
        /// Get a specific draft by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDraft(Guid id)
        {
            try
            {
                var userId = GetUserId();

                var draft = await _context.ApplicationDrafts
                    .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

                if (draft == null)
                {
                    return NotFound(new { success = false, message = "Draft not found" });
                }

                // Check if expired
                if (draft.ExpiresAt.HasValue && draft.ExpiresAt.Value < DateTime.UtcNow)
                {
                    _context.ApplicationDrafts.Remove(draft);
                    await _context.SaveChangesAsync();
                    return NotFound(new { success = false, message = "Draft has expired" });
                }

                var response = new ApplicationDraftResponse
                {
                    Id = draft.Id,
                    ApplicationType = draft.ApplicationType,
                    DraftData = JsonSerializer.Deserialize<JsonElement>(draft.DraftData),
                    CreatedAt = draft.CreatedAt,
                    UpdatedAt = draft.UpdatedAt,
                    ExpiresAt = draft.ExpiresAt,
                    Notes = draft.Notes
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching draft {DraftId}", id);
                return StatusCode(500, new { success = false, message = "Failed to fetch draft" });
            }
        }

        /// <summary>
        /// Get all drafts for current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllDrafts()
        {
            try
            {
                var userId = GetUserId();

                var drafts = await _context.ApplicationDrafts
                    .Where(d => d.UserId == userId)
                    .Where(d => !d.ExpiresAt.HasValue || d.ExpiresAt.Value > DateTime.UtcNow)
                    .OrderByDescending(d => d.UpdatedAt)
                    .Select(d => new DraftListResponse
                    {
                        Id = d.Id,
                        ApplicationType = d.ApplicationType,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt,
                        Notes = d.Notes
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = drafts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching drafts");
                return StatusCode(500, new { success = false, message = "Failed to fetch drafts" });
            }
        }

        /// <summary>
        /// Delete a draft
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDraft(Guid id)
        {
            try
            {
                var userId = GetUserId();

                var draft = await _context.ApplicationDrafts
                    .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

                if (draft == null)
                {
                    return NotFound(new { success = false, message = "Draft not found" });
                }

                _context.ApplicationDrafts.Remove(draft);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Deleted draft {DraftId} for user {UserId}", id, userId);

                return Ok(new { success = true, message = "Draft deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting draft {DraftId}", id);
                return StatusCode(500, new { success = false, message = "Failed to delete draft" });
            }
        }

        /// <summary>
        /// Clean up expired drafts (can be called by background job)
        /// </summary>
        [HttpPost("cleanup")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CleanupExpiredDrafts()
        {
            try
            {
                var expiredDrafts = await _context.ApplicationDrafts
                    .Where(d => d.ExpiresAt.HasValue && d.ExpiresAt.Value < DateTime.UtcNow)
                    .ToListAsync();

                _context.ApplicationDrafts.RemoveRange(expiredDrafts);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Cleaned up {Count} expired drafts", expiredDrafts.Count);

                return Ok(new { success = true, message = $"Cleaned up {expiredDrafts.Count} expired drafts" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired drafts");
                return StatusCode(500, new { success = false, message = "Failed to cleanup drafts" });
            }
        }
    }
}
