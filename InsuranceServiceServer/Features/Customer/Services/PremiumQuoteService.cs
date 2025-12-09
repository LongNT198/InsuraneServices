using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Core.Services;
using InsuranceServiceServer.Features.Customer.DTOs;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Customer.Services
{
    /// <summary>
    /// Service for generating premium quotes with different payment frequencies
    /// </summary>
    public class PremiumQuoteService
    {
        private readonly AppDbContext _context;
        private readonly PremiumCalculationService _calculator;

        public PremiumQuoteService(AppDbContext context)
        {
            _context = context;
            _calculator = new PremiumCalculationService();
        }

        /// <summary>
        /// Get premium quotes for all available payment frequencies
        /// </summary>
        public async Task<PremiumQuoteResponse> GetPremiumQuotesAsync(PremiumQuoteRequest request)
        {
            // Get product
            var product = await _context.InsuranceProducts
                .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

            if (product == null)
                throw new Exception("Product not found or inactive");

            // TODO: DEPRECATED - Use InsurancePlan entity for validation
            // Products no longer have Min/MaxCoverageAmount or Min/MaxTermYears
            // Validation should check against selected InsurancePlan
            
            /* OLD VALIDATION REMOVED
            if (request.CoverageAmount < product.MinCoverageAmount || 
                request.CoverageAmount > product.MaxCoverageAmount)
            {
                throw new Exception($"Coverage amount must be between {product.MinCoverageAmount:C0} and {product.MaxCoverageAmount:C0}");
            }

            if (request.TermYears < product.MinTermYears || 
                request.TermYears > product.MaxTermYears)
            {
                throw new Exception($"Term must be between {product.MinTermYears} and {product.MaxTermYears} years");
            }
            */

            // TODO: Should use InsurancePlan.BasePremium instead of calculation
            decimal baseAnnualPremium = CalculateBasePremium(product, request.CoverageAmount);

            var response = new PremiumQuoteResponse
            {
                ProductId = product.Id,
                ProductName = product.ProductName,
                CoverageAmount = request.CoverageAmount,
                TermYears = request.TermYears
            };

            // Generate quotes for all payment frequencies
            var frequencies = new[]
            {
                PaymentFrequency.LumpSum,
                PaymentFrequency.Annual,
                PaymentFrequency.SemiAnnual,
                PaymentFrequency.Quarterly,
                PaymentFrequency.Monthly
            };

            PaymentOption? monthlyOption = null;

            foreach (var frequency in frequencies)
            {
                var option = GeneratePaymentOption(
                    frequency, 
                    baseAnnualPremium, 
                    request.TermYears, 
                    product);

                response.PaymentOptions.Add(option);

                if (frequency == PaymentFrequency.Monthly)
                    monthlyOption = option;
            }

            // Calculate savings vs monthly for each option
            if (monthlyOption != null)
            {
                foreach (var option in response.PaymentOptions)
                {
                    if (option.PaymentFrequency != "Monthly")
                    {
                        option.SavingsVsMonthly = monthlyOption.GrandTotal - option.GrandTotal;
                        option.SavingsPercentageVsMonthly = 
                            (option.SavingsVsMonthly / monthlyOption.GrandTotal) * 100;
                    }
                }
            }

            // Mark recommended option (Lump Sum if they can afford it, otherwise Annual)
            var lumpSumOption = response.PaymentOptions.First(o => o.IsLumpSum);
            lumpSumOption.IsRecommended = true;
            lumpSumOption.RecommendationReason = $"Best value - Save {lumpSumOption.SavingsPercentageVsMonthly:F1}% compared to monthly payments";

            return response;
        }

        /// <summary>
        /// Generate payment option for specific frequency
        /// DEPRECATED - This method is not compatible with new premium calculation logic
        /// Use InsurancePlan.CalculatePremium() or PremiumCalculationService instead
        /// </summary>
        private PaymentOption GeneratePaymentOption(
            PaymentFrequency frequency,
            decimal baseAnnualPremium,
            int termYears,
            InsuranceProduct product)
        {
            // DEPRECATED: PremiumCalculationService.CalculatePremiumBreakdown now requires InsurancePlan
            // This service generates quotes without using InsurancePlans (deprecated approach)
            // Return placeholder values to prevent compilation error
            
            return new PaymentOption
            {
                PaymentFrequency = frequency.ToString(),
                DisplayName = PaymentFrequencyHelper.GetDisplayName(frequency),
                IsLumpSum = frequency == PaymentFrequency.LumpSum,
                BasePremiumPerYear = baseAnnualPremium,
                TotalPremiumBeforeAdjustment = baseAnnualPremium * termYears,
                FrequencyAdjustment = 0,
                AdjustmentPercentage = 0,
                TotalPremium = baseAnnualPremium * termYears,
                PaymentPerPeriod = 0,
                NumberOfPayments = 0,
                ProcessingFee = 0,
                PolicyIssuanceFee = 0,
                MedicalCheckupFee = 0,
                AdminFeePerYear = 0,
                TotalAdminFees = 0,
                OneTimeFees = 0,
                GrandTotal = baseAnnualPremium * termYears
            };
        }

        /// <summary>
        /// Calculate base annual premium - DEPRECATED
        /// TODO: Use InsurancePlan.BasePremium instead
        /// </summary>
        private decimal CalculateBasePremium(InsuranceProduct product, decimal coverageAmount)
        {
            // DEPRECATED: Products no longer have BaseRate - use InsurancePlan
            return 0; // Placeholder
        }
    }
}
