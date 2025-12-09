using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
    public class KYCDocumentUploadRequest
    {
        [Required(ErrorMessage = "Document type is required")]
        public string DocumentType { get; set; } = string.Empty; // "IdentityFront", "IdentityBack", "Selfie"

        [Required(ErrorMessage = "File is required")]
        public IFormFile File { get; set; } = null!;
    }

    public class KYCDocumentDTO
    {
        public int Id { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class KYCStatusDTO
    {
        public string Status { get; set; } = "Pending"; // Pending, Submitted, UnderReview, Approved, Rejected
        public bool HasIdentityFront { get; set; }
        public bool HasIdentityBack { get; set; }
        public bool HasSelfie { get; set; }
        public bool IsComplete { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewedBy { get; set; }
        public string? RejectionReason { get; set; }
        public List<KYCDocumentDTO> Documents { get; set; } = new();
    }

    public class SubmitKYCRequest
    {
        [Required(ErrorMessage = "National ID is required")]
        [StringLength(20, ErrorMessage = "National ID cannot exceed 20 characters")]
        public string NationalId { get; set; } = string.Empty;

        public DateTime? DocumentIssueDate { get; set; }
        public string? DocumentIssuedBy { get; set; }
    }
}



