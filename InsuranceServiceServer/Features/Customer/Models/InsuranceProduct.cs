using System.Text.Json.Serialization;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Insurance Product - Life, Medical, Motor, Home
    /// Now acts as a container for multiple InsurancePlans with fixed coverage/terms
    /// </summary>
    public class InsuranceProduct
    {
        public int Id { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string ProductType { get; set; } = string.Empty; // Life, Medical, Motor, Home
        public string Description { get; set; } = string.Empty;
        public string? ShortDescription { get; set; } // Brief description for cards
        public string? Features { get; set; } // JSON array
        
        // Additional Fees (still used for general product-level fees)
        public decimal ProcessingFee { get; set; } = 0; // One-time application processing fee
        public decimal PolicyIssuanceFee { get; set; } = 0; // One-time policy issuance fee
        public decimal MedicalCheckupFee { get; set; } = 0; // Medical examination fee (if required)
        public decimal AdminFee { get; set; } = 0; // Annual administrative fee
        
        // Payment Frequency Adjustments (as percentage, e.g., 0.05 = 5%)
        public decimal LumpSumDiscount { get; set; } = 0.08m; // 8% discount for lump sum payment
        public decimal MonthlySurcharge { get; set; } = 0.05m; // 5% surcharge for monthly payments
        public decimal QuarterlySurcharge { get; set; } = 0.03m; // 3% surcharge for quarterly
        public decimal SemiAnnualSurcharge { get; set; } = 0.02m; // 2% surcharge for semi-annual
        // Note: Annual payment has no surcharge (baseline = 0%)
        
    // Display settings
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    
    // Navigation property
    [JsonIgnore] // Prevent circular reference during serialization
    public virtual ICollection<InsuranceServiceServer.Core.Models.InsurancePlan> Plans { get; set; } = new List<InsuranceServiceServer.Core.Models.InsurancePlan>();        // Note: Coverage amounts, terms, and rates are now defined in InsurancePlan entity
        // Each product can have multiple plans (Basic, Standard, Premium, VIP)
        
        // Status
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}



