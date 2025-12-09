using InsuranceServiceServer.Models.Insurance;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Registration Session - Tracks customer registration progress
    /// </summary>
    public class RegistrationSession
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        
        // Session Info
        public string SessionToken { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedDate { get; set; }
        public DateTime LastUpdateDate { get; set; } = DateTime.UtcNow;
        
        // Current Status
        public string CurrentStep { get; set; } = "AccountCreated"; // AccountCreated, KYCInProgress, KYCCompleted, ProfileCompleted, ProductSelected, HealthDeclared, UnderwritingPending, UnderwritingApproved, PaymentCompleted, PolicyIssued
        public string RegistrationStatus { get; set; } = "InProgress"; // InProgress, Completed, Rejected, Abandoned
        
        // Step Completion Flags
        public bool IsAccountCreated { get; set; } = false;
        public bool IsKYCCompleted { get; set; } = false;
        public bool IsProfileCompleted { get; set; } = false;
        public bool IsProductSelected { get; set; } = false;
        public bool IsHealthDeclared { get; set; } = false;
        public bool IsUnderwritingCompleted { get; set; } = false;
        public bool IsPaymentCompleted { get; set; } = false;
        public bool IsPolicyIssued { get; set; } = false;
        
        // Selected Product (temporary storage during registration)
        public int? SelectedProductId { get; set; }
        public decimal? SelectedCoverageAmount { get; set; }
        public int? SelectedTermYears { get; set; }
        public string? SelectedPaymentFrequency { get; set; }
        
        // Additional Info
        public string? RejectionReason { get; set; }
        public string? Notes { get; set; }
        
        // Navigation
        public InsurancePolicy? CreatedPolicy { get; set; }
    }
}



