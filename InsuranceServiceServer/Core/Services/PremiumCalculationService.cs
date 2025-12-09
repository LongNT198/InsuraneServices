using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Features.Customer.Models;

namespace InsuranceServiceServer.Core.Services
{
    /// <summary>
    /// Service for calculating insurance premiums with payment frequency adjustments
    /// Updated to use dedicated BasePremium fields instead of surcharge-based calculations
    /// </summary>
    public class PremiumCalculationService
    {
        /// <summary>
        /// Calculate total premium with payment frequency adjustments
        /// Now uses dedicated BasePremium fields from InsurancePlan
        /// </summary>
        public decimal CalculateTotalPremium(
            InsurancePlan plan,
            PaymentFrequency paymentFrequency,
            decimal ageMultiplier,
            decimal genderMultiplier,
            decimal healthMultiplier,
            decimal occupationMultiplier)
        {
            // Select the appropriate base premium based on payment frequency
            decimal basePremium = paymentFrequency switch
            {
                PaymentFrequency.Monthly => plan.BasePremiumMonthly,
                PaymentFrequency.Quarterly => plan.BasePremiumQuarterly > 0 ? plan.BasePremiumQuarterly : plan.BasePremiumMonthly * 3,
                PaymentFrequency.SemiAnnual => plan.BasePremiumSemiAnnual > 0 ? plan.BasePremiumSemiAnnual : plan.BasePremiumMonthly * 6,
                PaymentFrequency.LumpSum => plan.BasePremiumLumpSum > 0 ? plan.BasePremiumLumpSum : plan.BasePremiumAnnual * plan.TermYears,
                _ => plan.BasePremiumAnnual // Annual is default
            };
            
            // Apply all risk multipliers to the selected base premium
            decimal adjustedPremium = basePremium * ageMultiplier * genderMultiplier * healthMultiplier * occupationMultiplier;
            
            return Math.Round(adjustedPremium, 2);
        }
        
        /// <summary>
        /// Calculate per-payment amount based on frequency
        /// </summary>
        public decimal CalculatePaymentAmount(
            decimal totalPremium,
            PaymentFrequency paymentFrequency,
            int termYears)
        {
            if (paymentFrequency == PaymentFrequency.LumpSum)
            {
                // For lump sum, return the total amount
                return totalPremium;
            }
            
            int totalPayments = PaymentFrequencyHelper.GetPaymentsPerYear(paymentFrequency) * termYears;
            return Math.Round(totalPremium / totalPayments, 2);
        }
        
        /// <summary>
        /// Calculate all fees (one-time + recurring)
        /// </summary>
        public PremiumBreakdown CalculatePremiumBreakdown(
            InsurancePlan plan,
            PaymentFrequency paymentFrequency,
            decimal ageMultiplier,
            decimal genderMultiplier,
            decimal healthMultiplier,
            decimal occupationMultiplier)
        {
            var product = plan.Product;
            
            // One-time fees
            decimal oneTimeFees = product.ProcessingFee + product.PolicyIssuanceFee;
            
            // Medical fee if required
            decimal medicalFee = product.MedicalCheckupFee;
            
            // Annual admin fees
            decimal totalAdminFees = product.AdminFee * plan.TermYears;
            
            // Calculate adjusted premium using dedicated BasePremium fields
            decimal adjustedPremium = CalculateTotalPremium(plan, paymentFrequency, ageMultiplier, genderMultiplier, healthMultiplier, occupationMultiplier);
            
            // For LumpSum, premium already includes full term amount
            // For others, calculate total for the term
            decimal premiumForTerm = paymentFrequency == PaymentFrequency.LumpSum 
                ? adjustedPremium 
                : adjustedPremium * plan.TermYears;
            
            // Payment per period
            decimal paymentAmount = CalculatePaymentAmount(premiumForTerm, paymentFrequency, plan.TermYears);
            
            // Grand total
            decimal grandTotal = premiumForTerm + oneTimeFees + medicalFee + totalAdminFees;
            
            return new PremiumBreakdown
            {
                BasePremium = adjustedPremium,
                TermYears = plan.TermYears,
                PaymentFrequency = paymentFrequency,
                BasePremiumTotal = premiumForTerm,
                AdjustedPremiumTotal = premiumForTerm,
                FrequencyAdjustment = 0, // No longer using surcharges
                ProcessingFee = product.ProcessingFee,
                PolicyIssuanceFee = product.PolicyIssuanceFee,
                MedicalCheckupFee = medicalFee,
                AdminFeePerYear = product.AdminFee,
                TotalAdminFees = totalAdminFees,
                OneTimeFees = oneTimeFees + medicalFee,
                PaymentPerPeriod = paymentAmount,
                TotalPayments = paymentFrequency == PaymentFrequency.LumpSum ? 1 : 
                               PaymentFrequencyHelper.GetPaymentsPerYear(paymentFrequency) * plan.TermYears,
                GrandTotal = grandTotal
            };
        }
    }
    
    /// <summary>
    /// Detailed breakdown of premium calculation
    /// </summary>
    public class PremiumBreakdown
    {
        public decimal BasePremium { get; set; }
        public int TermYears { get; set; }
        public PaymentFrequency PaymentFrequency { get; set; }
        
        // Premium calculations
        public decimal BasePremiumTotal { get; set; }
        public decimal AdjustedPremiumTotal { get; set; }
        public decimal FrequencyAdjustment { get; set; }
        
        // Fees
        public decimal ProcessingFee { get; set; }
        public decimal PolicyIssuanceFee { get; set; }
        public decimal MedicalCheckupFee { get; set; }
        public decimal AdminFeePerYear { get; set; }
        public decimal TotalAdminFees { get; set; }
        public decimal OneTimeFees { get; set; }
        
        // Payment schedule
        public decimal PaymentPerPeriod { get; set; }
        public int TotalPayments { get; set; }
        
        // Total
        public decimal GrandTotal { get; set; }
        
        public string FrequencyDisplay => PaymentFrequencyHelper.GetDisplayName(PaymentFrequency);
        public bool IsLumpSum => PaymentFrequency == PaymentFrequency.LumpSum;
    }
}
