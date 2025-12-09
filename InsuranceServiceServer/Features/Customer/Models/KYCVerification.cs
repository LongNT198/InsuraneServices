namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// KYC Verification - Electronic KYC verification records
    /// </summary>
    public class KYCVerification
    {
        public int Id { get; set; }
        public int RegistrationSessionId { get; set; }
        public string CustomerProfileId { get; set; } = string.Empty;
        
        // Document Info
        public string DocumentType { get; set; } = string.Empty; // CMND, CCCD, Passport
        public string DocumentNumber { get; set; } = string.Empty;
        public DateTime? DocumentIssueDate { get; set; }
        public DateTime? DocumentExpiryDate { get; set; }
        public string? DocumentIssuedBy { get; set; }
        
        // OCR Extracted Data
        public string? ExtractedFullName { get; set; }
        public DateTime? ExtractedDateOfBirth { get; set; }
        public string? ExtractedGender { get; set; }
        public string? ExtractedNationality { get; set; }
        public string? ExtractedAddress { get; set; }
        
        // Face Matching
        public bool IsFaceMatched { get; set; }
        public decimal? FaceMatchScore { get; set; } // 0-100
        
        // Document Verification
        public bool IsDocumentAuthentic { get; set; }
        public decimal? AuthenticityScore { get; set; } // 0-100
        
        // Risk Checks
        public bool IsBlacklisted { get; set; }
        public bool IsFraudulent { get; set; }
        public string? RiskLevel { get; set; } // Low, Medium, High
        
        // Status
        public string VerificationStatus { get; set; } = "Pending"; // Pending, InProgress, Approved, Rejected, RequiresReview
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedDate { get; set; }
        public string? VerifiedBy { get; set; }
        public string? RejectionReason { get; set; }
        
        // Images (stored as file paths or URLs)
        public string? FrontImagePath { get; set; }
        public string? BackImagePath { get; set; }
        public string? SelfiePath { get; set; }
        
        // API Response (JSON)
        public string? OCRResponseJson { get; set; }
        public string? FaceMatchResponseJson { get; set; }
        
        // Navigation
        public RegistrationSession? RegistrationSession { get; set; }
    }
}



