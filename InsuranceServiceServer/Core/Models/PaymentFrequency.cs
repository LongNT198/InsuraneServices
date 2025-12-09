namespace InsuranceServiceServer.Core.Models
{
    /// <summary>
    /// Payment frequency options for insurance premiums
    /// </summary>
    public enum PaymentFrequency
    {
        /// <summary>
        /// One-time payment for entire policy term (with discount)
        /// </summary>
        LumpSum = 0,
        
        /// <summary>
        /// Annual payment (12 months)
        /// </summary>
        Annual = 12,
        
        /// <summary>
        /// Semi-annual payment (6 months) - with small surcharge
        /// </summary>
        SemiAnnual = 6,
        
        /// <summary>
        /// Quarterly payment (3 months) - with moderate surcharge
        /// </summary>
        Quarterly = 3,
        
        /// <summary>
        /// Monthly payment - with highest surcharge
        /// </summary>
        Monthly = 1
    }
    
    /// <summary>
    /// Helper class for payment frequency calculations
    /// </summary>
    public static class PaymentFrequencyHelper
    {
        /// <summary>
        /// Get the number of payments per year
        /// </summary>
        public static int GetPaymentsPerYear(PaymentFrequency frequency)
        {
            return frequency switch
            {
                PaymentFrequency.LumpSum => 1,
                PaymentFrequency.Annual => 1,
                PaymentFrequency.SemiAnnual => 2,
                PaymentFrequency.Quarterly => 4,
                PaymentFrequency.Monthly => 12,
                _ => 12
            };
        }
        
        /// <summary>
        /// Get display name for payment frequency
        /// </summary>
        public static string GetDisplayName(PaymentFrequency frequency)
        {
            return frequency switch
            {
                PaymentFrequency.LumpSum => "Lump Sum (One-time payment)",
                PaymentFrequency.Annual => "Annual (Yearly)",
                PaymentFrequency.SemiAnnual => "Semi-Annual (Every 6 months)",
                PaymentFrequency.Quarterly => "Quarterly (Every 3 months)",
                PaymentFrequency.Monthly => "Monthly",
                _ => "Unknown"
            };
        }
        
        /// <summary>
        /// Parse string to PaymentFrequency enum
        /// </summary>
        public static PaymentFrequency Parse(string frequency)
        {
            return frequency?.ToLower() switch
            {
                "lumpsum" or "lump-sum" or "onetime" or "single" => PaymentFrequency.LumpSum,
                "annual" or "yearly" => PaymentFrequency.Annual,
                "semiannual" or "semi-annual" or "halfyearly" => PaymentFrequency.SemiAnnual,
                "quarterly" => PaymentFrequency.Quarterly,
                "monthly" => PaymentFrequency.Monthly,
                _ => PaymentFrequency.Monthly // Default
            };
        }
    }
}
