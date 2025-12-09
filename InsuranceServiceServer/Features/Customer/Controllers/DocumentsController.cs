using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceServiceServer.Features.Customer.Controllers;

[ApiController]
[Route("api/documents")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<DocumentsController> _logger;
    private readonly IWebHostEnvironment _environment;
    private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB
    private readonly string[] _allowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png", ".heic" };

    public DocumentsController(
        AppDbContext context,
        ILogger<DocumentsController> logger,
        IWebHostEnvironment environment)
    {
        _context = context;
        _logger = logger;
        _environment = environment;
    }

    /// <summary>
    /// Upload a document file
    /// </summary>
    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocument([FromForm] IFormFile file, [FromForm] string documentType, [FromForm] string category, [FromForm] int? applicationId = null)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Validate file
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { success = false, message = "No file uploaded" });
            }

            if (file.Length > _maxFileSize)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"File size exceeds maximum limit of 5MB. Uploaded: {file.Length / 1024.0 / 1024.0:F2}MB"
                });
            }

            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"File type not allowed. Accepted formats: {string.Join(", ", _allowedExtensions)}"
                });
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "documents", userId);
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Generate unique filename
            var fileName = $"{category}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid():N}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Generate relative URL
            var fileUrl = $"/uploads/documents/{userId}/{fileName}";

            // Save document metadata to database
            var document = new BaseDocument
            {
                DocumentNumber = $"DOC-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}",
                Title = category,
                Description = $"{documentType} document - {category}",
                FileName = file.FileName,
                FileUrl = fileUrl,
                FileType = file.ContentType,
                FileSize = file.Length,
                OwnerType = "Customer",
                OwnerId = userId,
                ApplicationId = applicationId,
                Status = "Uploaded",
                UploadedDate = DateTime.UtcNow,
                UploadedBy = userId
            };

            _context.BaseDocuments.Add(document);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Document uploaded and saved to database: ID={DocumentId}, FileName={FileName} by user {UserId}, category: {Category}",
                document.Id, fileName, userId, category
            );

            return Ok(new
            {
                success = true,
                message = "File uploaded successfully",
                id = document.Id,
                fileUrl = fileUrl,
                filePath = fileUrl,
                fileName = file.FileName,
                savedFileName = fileName,
                fileSize = file.Length,
                uploadedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return StatusCode(500, new
            {
                success = false,
                message = "Failed to upload document",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Delete a document file by ID
    /// </summary>
    [HttpDelete("{documentId}")]
    public async Task<IActionResult> DeleteDocument(int documentId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Find document in database
            var document = await _context.BaseDocuments.FindAsync(documentId);
            
            if (document == null)
            {
                return NotFound(new { success = false, message = "Document not found in database" });
            }

            // Verify ownership
            if (document.OwnerId != userId)
            {
                return Forbid();
            }

            // Extract filename from FileUrl
            var fileName = Path.GetFileName(document.FileUrl);
            var filePath = Path.Combine(_environment.WebRootPath, "uploads", "documents", userId, fileName);

            // Delete physical file if exists
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                _logger.LogInformation("Physical file deleted: {FileName}", fileName);
            }

            // Delete from database
            _context.BaseDocuments.Remove(document);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Document deleted from database: ID={DocumentId}, FileName={FileName} by user {UserId}", 
                documentId, fileName, userId
            );

            return Ok(new
            {
                success = true,
                message = "Document deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting document");
            return StatusCode(500, new
            {
                success = false,
                message = "Failed to delete document",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Get user's documents
    /// </summary>
    [HttpGet("my-documents")]
    public IActionResult GetMyDocuments()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "documents", userId);

            if (!Directory.Exists(uploadsPath))
            {
                return Ok(new { success = true, documents = new List<object>() });
            }

            var files = Directory.GetFiles(uploadsPath)
                .Select(filePath => new
                {
                    fileName = Path.GetFileName(filePath),
                    fileSize = new FileInfo(filePath).Length,
                    uploadedAt = System.IO.File.GetCreationTime(filePath),
                    fileUrl = $"/uploads/documents/{userId}/{Path.GetFileName(filePath)}"
                })
                .ToList();

            return Ok(new
            {
                success = true,
                documents = files
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching documents");
            return StatusCode(500, new
            {
                success = false,
                message = "Failed to fetch documents"
            });
        }
    }
}
