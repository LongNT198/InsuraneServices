namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Loan - Policy loan facility
    /// </summary>
    public class PolicyLoan
    {
        public int Id { get; set; }
        public string LoanNumber { get; set; } = string.Empty;
        
        // Policy
        public int PolicyId { get; set; }
        public InsurancePolicy? Policy { get; set; }
        
        // Loan Details
        public decimal LoanAmount { get; set; }
        public decimal InterestRate { get; set; }
        public decimal MaxLoanAmount { get; set; } // Based on policy surrender value
        public int RepaymentMonths { get; set; }
        public decimal MonthlyRepayment { get; set; }
        
        // Status
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Active, Closed
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovalDate { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? DisbursementDate { get; set; }
        
        // Outstanding
        public decimal OutstandingAmount { get; set; }
        public string? RejectionReason { get; set; }
    }
}



