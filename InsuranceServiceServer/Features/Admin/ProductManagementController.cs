using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using InsuranceServiceServer.Features.Admin.DTOs;
using InsuranceServiceServer.Features.Customer.Models;

namespace InsuranceServiceServer.Features.Admin;

[ApiController]
[Route("api/admin/products-management")]
[Authorize(Roles = "Admin")]
public class ProductManagementController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProductManagementController> _logger;

    public ProductManagementController(AppDbContext context, ILogger<ProductManagementController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all products with plan counts
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<ProductResponse>>> GetAllProducts()
    {
        var products = await _context.InsuranceProducts
            .Include(p => p.Plans)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProductResponse
            {
                Id = p.Id,
                ProductName = p.ProductName,
                ProductCode = p.ProductCode,
                ProductType = p.ProductType,
                Description = p.Description,
                ShortDescription = p.ShortDescription,
                MonthlySurcharge = p.MonthlySurcharge,
                QuarterlySurcharge = p.QuarterlySurcharge,
                SemiAnnualSurcharge = p.SemiAnnualSurcharge,
                LumpSumDiscount = p.LumpSumDiscount,
                DisplayOrder = p.DisplayOrder,
                IsActive = p.IsActive,
                IsFeatured = p.IsFeatured,
                TotalPlans = p.Plans.Count,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();

        return Ok(products);
    }

    /// <summary>
    /// Get a specific product by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponse>> GetProduct(int id)
    {
        var product = await _context.InsuranceProducts
            .Include(p => p.Plans)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound(new { message = "Product not found" });

        var response = new ProductResponse
        {
            Id = product.Id,
            ProductName = product.ProductName,
            ProductCode = product.ProductCode,
            ProductType = product.ProductType,
            Description = product.Description,
            ShortDescription = product.ShortDescription,
            MonthlySurcharge = product.MonthlySurcharge,
            QuarterlySurcharge = product.QuarterlySurcharge,
            SemiAnnualSurcharge = product.SemiAnnualSurcharge,
            LumpSumDiscount = product.LumpSumDiscount,
            DisplayOrder = product.DisplayOrder,
            IsActive = product.IsActive,
            IsFeatured = product.IsFeatured,
            TotalPlans = product.Plans.Count,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return Ok(response);
    }

    /// <summary>
    /// Create a new insurance product
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ProductResponse>> CreateProduct([FromBody] CreateProductRequest request)
    {
        // Check if product code already exists
        if (await _context.InsuranceProducts.AnyAsync(p => p.ProductCode == request.ProductCode))
            return BadRequest(new { message = "Product code already exists" });

        var product = new InsuranceProduct
        {
            ProductName = request.ProductName,
            ProductCode = request.ProductCode,
            ProductType = request.ProductType,
            Description = request.Description,
            ShortDescription = request.ShortDescription,
            MonthlySurcharge = request.MonthlySurcharge,
            QuarterlySurcharge = request.QuarterlySurcharge,
            SemiAnnualSurcharge = request.SemiAnnualSurcharge,
            LumpSumDiscount = request.LumpSumDiscount,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            IsFeatured = request.IsFeatured,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InsuranceProducts.Add(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin created new product: {ProductName} ({ProductCode})", 
            product.ProductName, product.ProductCode);

        var response = new ProductResponse
        {
            Id = product.Id,
            ProductName = product.ProductName,
            ProductCode = product.ProductCode,
            ProductType = product.ProductType,
            Description = product.Description,
            ShortDescription = product.ShortDescription,
            MonthlySurcharge = product.MonthlySurcharge,
            QuarterlySurcharge = product.QuarterlySurcharge,
            SemiAnnualSurcharge = product.SemiAnnualSurcharge,
            LumpSumDiscount = product.LumpSumDiscount,
            DisplayOrder = product.DisplayOrder,
            IsActive = product.IsActive,
            IsFeatured = product.IsFeatured,
            TotalPlans = 0,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, response);
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        var product = await _context.InsuranceProducts.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        // Update only provided fields
        if (request.ProductName != null) product.ProductName = request.ProductName;
        if (request.Description != null) product.Description = request.Description;
        if (request.ShortDescription != null) product.ShortDescription = request.ShortDescription;
        if (request.MonthlySurcharge.HasValue) product.MonthlySurcharge = request.MonthlySurcharge.Value;
        if (request.QuarterlySurcharge.HasValue) product.QuarterlySurcharge = request.QuarterlySurcharge.Value;
        if (request.SemiAnnualSurcharge.HasValue) product.SemiAnnualSurcharge = request.SemiAnnualSurcharge.Value;
        if (request.LumpSumDiscount.HasValue) product.LumpSumDiscount = request.LumpSumDiscount.Value;
        if (request.DisplayOrder.HasValue) product.DisplayOrder = request.DisplayOrder.Value;
        if (request.IsActive.HasValue) product.IsActive = request.IsActive.Value;
        if (request.IsFeatured.HasValue) product.IsFeatured = request.IsFeatured.Value;

        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin updated product: {ProductName} (ID: {ProductId})", 
            product.ProductName, product.Id);

        var response = new ProductResponse
        {
            Id = product.Id,
            ProductName = product.ProductName,
            ProductCode = product.ProductCode,
            ProductType = product.ProductType,
            Description = product.Description,
            ShortDescription = product.ShortDescription,
            MonthlySurcharge = product.MonthlySurcharge,
            QuarterlySurcharge = product.QuarterlySurcharge,
            SemiAnnualSurcharge = product.SemiAnnualSurcharge,
            LumpSumDiscount = product.LumpSumDiscount,
            DisplayOrder = product.DisplayOrder,
            IsActive = product.IsActive,
            IsFeatured = product.IsFeatured,
            TotalPlans = await _context.InsurancePlans.CountAsync(p => p.ProductId == product.Id),
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return Ok(response);
    }

    /// <summary>
    /// Delete a product (only if it has no plans)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.InsuranceProducts
            .Include(p => p.Plans)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound(new { message = "Product not found" });

        if (product.Plans.Any())
            return BadRequest(new { message = "Cannot delete product with existing plans. Delete plans first or set product to inactive." });

        _context.InsuranceProducts.Remove(product);
        await _context.SaveChangesAsync();

        _logger.LogWarning("Admin deleted product: {ProductName} (ID: {ProductId})", 
            product.ProductName, product.Id);

        return NoContent();
    }
}
