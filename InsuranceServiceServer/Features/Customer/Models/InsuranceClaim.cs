namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Insurance Claim - Customer's claim request
    /// </summary>
    public class InsuranceClaim
    {
        public int Id { get; set; }
        public string ClaimNumber { get; set; } = string.Empty;
        
        // Policy
        public int PolicyId { get; set; }
        public InsurancePolicy? Policy { get; set; }
        
        // Claim Info
        public string ClaimType { get; set; } = string.Empty; // Death, Hospitalization, Accident, Property
        public DateTime ClaimDate { get; set; } = DateTime.UtcNow;
        public DateTime IncidentDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        
        // Status
        public string Status { get; set; } = "Pending"; // Pending, UnderReview, Approved, Rejected, Paid
        public string? RejectionReason { get; set; }
        public string Priority { get; set; } = "Medium"; // Low, Medium, High
        
        // Processing
        public string? AssignedTo { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ReviewerNotes { get; set; }
        public DateTime? PaidDate { get; set; }
    }
}



