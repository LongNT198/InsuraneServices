using InsuranceServiceServer.Features.Customer.DTOs;
using InsuranceServiceServer.Features.Customer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PremiumQuoteController : ControllerBase
    {
        private readonly PremiumQuoteService _quoteService;
        private readonly ILogger<PremiumQuoteController> _logger;

        public PremiumQuoteController(
            PremiumQuoteService quoteService,
            ILogger<PremiumQuoteController> logger)
        {
            _quoteService = quoteService;
            _logger = logger;
        }

        /// <summary>
        /// Get premium quotes with all available payment frequency options
        /// </summary>
        /// <remarks>
        /// Returns premium calculations for:
        /// - Lump Sum (one-time payment with discount)
        /// - Annual payment (baseline, no surcharge)
        /// - Semi-Annual payment (small surcharge)
        /// - Quarterly payment (moderate surcharge)
        /// - Monthly payment (highest surcharge)
        /// 
        /// Example request:
        /// ```
        /// POST /api/premiumquote
        /// {
        ///   "productId": 1,
        ///   "termYears": 10,
        ///   "coverageAmount": 500000
        /// }
        /// ```
        /// </remarks>
        [HttpPost]
        [AllowAnonymous] // Allow unauthenticated users to get quotes
        public async Task<ActionResult<PremiumQuoteResponse>> GetPremiumQuotes(
            [FromBody] PremiumQuoteRequest request)
        {
            try
            {
                _logger.LogInformation(
                    "Getting premium quotes for Product {ProductId}, Term {TermYears} years, Coverage {Coverage:C0}",
                    request.ProductId, request.TermYears, request.CoverageAmount);

                var quotes = await _quoteService.GetPremiumQuotesAsync(request);
                
                return Ok(quotes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating premium quotes");
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Compare payment frequencies side by side
        /// </summary>
        [HttpPost("compare")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> ComparePaymentOptions(
            [FromBody] PremiumQuoteRequest request)
        {
            try
            {
                var quotes = await _quoteService.GetPremiumQuotesAsync(request);
                
                // Create comparison table
                var comparison = quotes.PaymentOptions.Select(option => new
                {
                    option.PaymentFrequency,
                    option.DisplayName,
                    TotalPremium = $"{option.TotalPremium:C2}",
                    PaymentAmount = $"{option.PaymentPerPeriod:C2}",
                    NumberOfPayments = option.NumberOfPayments,
                    Fees = $"{option.OneTimeFees:C2}",
                    GrandTotal = $"{option.GrandTotal:C2}",
                    Savings = option.SavingsVsMonthly.HasValue 
                        ? $"{option.SavingsVsMonthly:C2} ({option.SavingsPercentageVsMonthly:F1}%)" 
                        : "Baseline",
                    Recommended = option.IsRecommended
                }).ToList();

                return Ok(new
                {
                    ProductInfo = new
                    {
                        quotes.ProductId,
                        quotes.ProductName,
                        quotes.CoverageAmount,
                        quotes.TermYears
                    },
                    Comparison = comparison
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error comparing payment options");
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
