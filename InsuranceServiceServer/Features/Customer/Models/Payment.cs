namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Payment - Premium payments
    /// </summary>
    public class Payment
    {
        public int Id { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        
        // Policy
        public int PolicyId { get; set; }
        public InsurancePolicy? Policy { get; set; }
        
        // Amount
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        
        // Payment Info
        public string PaymentFrequency { get; set; } = "Monthly"; // LumpSum, Monthly, Quarterly, SemiAnnual, Annual
        public bool IsLumpSum { get; set; } = false;
        public int? PaymentNumber { get; set; } // e.g., 1 of 12, 2 of 12, etc. (null for lump sum)
        
        // Method
        public string PaymentMethod { get; set; } = string.Empty; // CreditCard, BankTransfer, EWallet
        public string Status { get; set; } = "Pending"; // Pending, Paid, Failed, Overdue
        
        // Receipt
        public string? ReceiptUrl { get; set; }
        public string? PaymentNote { get; set; }
    }
}



