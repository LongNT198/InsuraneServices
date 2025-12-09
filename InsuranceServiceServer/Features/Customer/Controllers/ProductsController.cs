using InsuranceServiceServer.Core.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all active insurance products (Public endpoint)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                _logger.LogInformation("Fetching all active insurance products");

                var products = await _context.InsuranceProducts
                    .Where(p => p.IsActive)
                    .OrderBy(p => p.DisplayOrder)
                    .Select(p => new
                    {
                        p.Id,
                        p.ProductCode,
                        p.ProductName,
                        p.ProductType,
                        p.Description,
                        p.ShortDescription,
                        p.Features,
                        p.IsFeatured,
                        p.DisplayOrder,
                        p.ProcessingFee,
                        p.PolicyIssuanceFee,
                        p.MedicalCheckupFee,
                        p.AdminFee,
                        p.MonthlySurcharge,
                        p.QuarterlySurcharge,
                        p.SemiAnnualSurcharge,
                        p.LumpSumDiscount
                    })
                    .ToListAsync();

                _logger.LogInformation("Found {Count} active products", products.Count);

                return Ok(new
                {
                    success = true,
                    count = products.Count,
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching insurance products");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching products",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get product by ID (Public endpoint)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                _logger.LogInformation("Fetching product with ID: {ProductId}", id);

                var product = await _context.InsuranceProducts
                    .Where(p => p.Id == id && p.IsActive)
                    .Select(p => new
                    {
                        p.Id,
                        p.ProductCode,
                        p.ProductName,
                        p.ProductType,
                        p.Description,
                        p.ShortDescription,
                        p.Features,
                        p.IsFeatured,
                        p.DisplayOrder,
                        p.ProcessingFee,
                        p.PolicyIssuanceFee,
                        p.MedicalCheckupFee,
                        p.AdminFee,
                        p.MonthlySurcharge,
                        p.QuarterlySurcharge,
                        p.SemiAnnualSurcharge,
                        p.LumpSumDiscount,
                        Plans = _context.InsurancePlans
                            .Where(plan => plan.ProductId == id && plan.IsActive)
                            .OrderBy(plan => plan.CoverageAmount)
                            .Select(plan => new
                            {
                                plan.Id,
                                plan.PlanName,
                                plan.PlanCode,
                                plan.Description,
                                plan.CoverageAmount,
                                plan.TermYears,
                                plan.BasePremiumMonthly,
                                plan.BasePremiumQuarterly,
                                plan.BasePremiumSemiAnnual,
                                plan.BasePremiumAnnual,
                                plan.BasePremiumLumpSum,
                                plan.AccidentalDeathBenefit,
                                plan.DisabilityBenefit,
                                plan.CriticalIllnessBenefit,
                                plan.IsFeatured,
                                plan.IsPopular,
                                plan.RequiresMedicalExam
                            })
                            .ToList()
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    _logger.LogWarning("Product not found: {ProductId}", id);
                    return NotFound(new
                    {
                        success = false,
                        message = "Product not found"
                    });
                }

                _logger.LogInformation("Found product: {ProductName} with {PlanCount} plans", 
                    product.ProductName, product.Plans.Count);

                return Ok(new
                {
                    success = true,
                    data = product
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product {ProductId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching product",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get featured products (Public endpoint)
        /// </summary>
        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedProducts()
        {
            try
            {
                _logger.LogInformation("Fetching featured insurance products");

                var products = await _context.InsuranceProducts
                    .Where(p => p.IsActive && p.IsFeatured)
                    .OrderBy(p => p.DisplayOrder)
                    .Select(p => new
                    {
                        p.Id,
                        p.ProductCode,
                        p.ProductName,
                        p.ProductType,
                        p.Description,
                        p.ShortDescription,
                        p.Features,
                        p.DisplayOrder
                    })
                    .ToListAsync();

                _logger.LogInformation("Found {Count} featured products", products.Count);

                return Ok(new
                {
                    success = true,
                    count = products.Count,
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching featured products");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching featured products",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get products by type (Public endpoint)
        /// </summary>
        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetProductsByType(string type)
        {
            try
            {
                _logger.LogInformation("Fetching products of type: {ProductType}", type);

                var products = await _context.InsuranceProducts
                    .Where(p => p.IsActive && p.ProductType == type)
                    .OrderBy(p => p.DisplayOrder)
                    .Select(p => new
                    {
                        p.Id,
                        p.ProductCode,
                        p.ProductName,
                        p.ProductType,
                        p.Description,
                        p.ShortDescription,
                        p.Features,
                        p.IsFeatured,
                        p.DisplayOrder,
                        p.ProcessingFee,
                        p.PolicyIssuanceFee,
                        p.MedicalCheckupFee,
                        p.AdminFee
                    })
                    .ToListAsync();

                _logger.LogInformation("Found {Count} products of type {ProductType}", 
                    products.Count, type);

                return Ok(new
                {
                    success = true,
                    count = products.Count,
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products by type {ProductType}", type);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching products",
                    error = ex.Message
                });
            }
        }
    }
}
