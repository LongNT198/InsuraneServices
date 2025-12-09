using InsuranceServiceServer.Features.Customer.Models;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Insurance Policy - Customer's insurance contract
    /// </summary>
    public class InsurancePolicy
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        
        // Customer
        public string CustomerProfileId { get; set; } = string.Empty;
        public CustomerProfile? Customer { get; set; }
        
        // Product
        public int ProductId { get; set; }
        public InsuranceProduct? Product { get; set; }
        
        // Coverage
        public decimal CoverageAmount { get; set; }
        public int TermYears { get; set; }
        public decimal Premium { get; set; }
        public string PaymentFrequency { get; set; } = "Monthly"; // LumpSum, Monthly, Quarterly, SemiAnnual, Annual
        
        // Payment Details
        public bool IsLumpSumPayment { get; set; } = false;
        public decimal? TotalPremiumAmount { get; set; } // Total amount for entire term
        public decimal? PaymentPerPeriod { get; set; } // Amount per payment period
        public int? TotalPayments { get; set; } // Total number of payments
        
        // Dates
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovalDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        // Status
        public string Status { get; set; } = "Pending"; // Pending, Approved, Active, Expired, Cancelled
        public string? RejectionReason { get; set; }
        
        // Agent & Approval
        public string? AgentId { get; set; }
        public string? ApprovedBy { get; set; }
        
        // Beneficiaries
        public string? BeneficiariesJson { get; set; } // JSON array
        
        // Navigation
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<InsuranceClaim> Claims { get; set; } = new List<InsuranceClaim>();
    }
}



