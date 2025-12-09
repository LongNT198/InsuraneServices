using InsuranceServiceServer.Models.Insurance;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Underwriting Decision - Risk assessment and approval decision
    /// </summary>
    public class UnderwritingDecision
    {
        public int Id { get; set; }
        public int RegistrationSessionId { get; set; }
        public string CustomerProfileId { get; set; } = string.Empty;
        public int? PolicyId { get; set; }
        
        // Decision
        public string Decision { get; set; } = "Pending"; // Pending, AutoApproved, RequiresReview, RequiresExam, RequiresDocuments, Approved, Rejected
        public DateTime DecisionDate { get; set; } = DateTime.UtcNow;
        public string? DecisionBy { get; set; } // UnderwriterId or "System" for auto-approval
        
        // Risk Assessment
        public string RiskLevel { get; set; } = "Medium"; // Low, Medium, High, VeryHigh
        public int RiskScore { get; set; } // 0-100
        public string? RiskFactorsJson { get; set; } // JSON array of risk factors
        
        // Auto-Approval Criteria
        public bool IsAutoApprovalEligible { get; set; }
        public string? AutoApprovalReasons { get; set; }
        
        // Review Requirements
        public bool RequiresMedicalExam { get; set; }
        public bool RequiresAdditionalDocuments { get; set; }
        public string? RequiredDocumentsList { get; set; } // JSON array
        
        // Premium Adjustment
        public decimal OriginalPremium { get; set; }
        public decimal? AdjustedPremium { get; set; }
        public decimal? PremiumLoadingPercentage { get; set; }
        public string? PremiumAdjustmentReason { get; set; }
        
        // Coverage Modifications
        public decimal RequestedCoverageAmount { get; set; }
        public decimal? ApprovedCoverageAmount { get; set; }
        public string? CoverageModificationReason { get; set; }
        public string? ExclusionsJson { get; set; } // JSON array of exclusions
        
        // Rejection
        public string? RejectionReason { get; set; }
        public string? RejectionDetails { get; set; }
        
        // Timeline
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewStartDate { get; set; }
        public DateTime? ReviewCompletedDate { get; set; }
        
        // Notes & Communication
        public string? UnderwriterNotes { get; set; }
        public string? CommunicationToCustomer { get; set; }
        
        // Navigation
        public RegistrationSession? RegistrationSession { get; set; }
        public InsurancePolicy? Policy { get; set; }
    }
}



