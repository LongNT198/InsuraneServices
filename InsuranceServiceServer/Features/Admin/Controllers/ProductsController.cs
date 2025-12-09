using InsuranceServiceServer.Core.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Admin.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all active insurance products (Public endpoint)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.InsuranceProducts
                .Where(p => p.IsActive)
                .Select(p => new
                {
                    p.Id,
                    p.ProductCode,
                    p.ProductName,
                    p.ProductType,
                    p.Description,
                    p.Features,
                    // Coverage, terms, and rates are now in InsurancePlan entity
                    p.ProcessingFee,
                    p.PolicyIssuanceFee,
                    p.MedicalCheckupFee,
                    p.AdminFee
                })
                .ToListAsync();

            return Ok(new { success = true, products });
        }

        /// <summary>
        /// Get product by ID (Public endpoint)
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.InsuranceProducts
                .Where(p => p.Id == id && p.IsActive)
                .Select(p => new
                {
                    p.Id,
                    p.ProductCode,
                    p.ProductName,
                    p.ProductType,
                    p.Description,
                    p.Features,
                    // Coverage, terms, rates are now in InsurancePlan entity - use Plans API
                    p.ProcessingFee,
                    p.PolicyIssuanceFee,
                    p.MedicalCheckupFee,
                    p.AdminFee
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { success = false, message = "Product not found" });
            }

            return Ok(new { success = true, product });
        }

        /// <summary>
        /// Get products by type (Public endpoint)
        /// </summary>
        [HttpGet]
        [Route("type/{type}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsByType(string type)
        {
            var products = await _context.InsuranceProducts
                .Where(p => p.IsActive && p.ProductType.ToLower() == type.ToLower())
                .Select(p => new
                {
                    p.Id,
                    p.ProductCode,
                    p.ProductName,
                    p.ProductType,
                    p.Description,
                    p.Features
                    // Use Plans API to get coverage/term/rate details
                })
                .ToListAsync();

            return Ok(new { success = true, type, count = products.Count, products });
        }
    }
}



