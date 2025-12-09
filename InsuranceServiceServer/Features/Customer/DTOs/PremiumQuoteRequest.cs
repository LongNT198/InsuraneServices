using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Features.Customer.DTOs
{
    /// <summary>
    /// Request for getting premium quote with different payment frequencies
    /// </summary>
    public class PremiumQuoteRequest
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, 100)]
        public int TermYears { get; set; }
        
        [Required]
        [Range(1000, 100000000)]
        public decimal CoverageAmount { get; set; }
        
        // Optional: Request specific payment frequency
        // If null, will return quotes for all available frequencies
        public string? PaymentFrequency { get; set; } // LumpSum, Monthly, Quarterly, SemiAnnual, Annual
    }
    
    /// <summary>
    /// Response with premium quote details
    /// </summary>
    public class PremiumQuoteResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal CoverageAmount { get; set; }
        public int TermYears { get; set; }
        
        // Available payment options
        public List<PaymentOption> PaymentOptions { get; set; } = new();
    }
    
    /// <summary>
    /// Individual payment option with breakdown
    /// </summary>
    public class PaymentOption
    {
        public string PaymentFrequency { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsLumpSum { get; set; }
        
        // Premium details
        public decimal BasePremiumPerYear { get; set; }
        public decimal TotalPremiumBeforeAdjustment { get; set; }
        public decimal FrequencyAdjustment { get; set; } // Discount (-) or Surcharge (+)
        public decimal AdjustmentPercentage { get; set; }
        public decimal TotalPremium { get; set; }
        
        // Payment schedule
        public decimal PaymentPerPeriod { get; set; }
        public int NumberOfPayments { get; set; }
        
        // Fees
        public decimal ProcessingFee { get; set; }
        public decimal PolicyIssuanceFee { get; set; }
        public decimal MedicalCheckupFee { get; set; }
        public decimal AdminFeePerYear { get; set; }
        public decimal TotalAdminFees { get; set; }
        public decimal OneTimeFees { get; set; }
        
        // Grand total
        public decimal GrandTotal { get; set; }
        
        // Savings comparison (if applicable)
        public decimal? SavingsVsMonthly { get; set; }
        public decimal? SavingsPercentageVsMonthly { get; set; }
        
        // Recommendation
        public bool IsRecommended { get; set; }
        public string? RecommendationReason { get; set; }
    }
}
