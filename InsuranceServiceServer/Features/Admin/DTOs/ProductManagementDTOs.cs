namespace InsuranceServiceServer.Features.Admin.DTOs;

/// <summary>
/// Request to create a new insurance product
/// </summary>
public class CreateProductRequest
{
    public required string ProductName { get; set; }
    public required string ProductCode { get; set; }
    public required string ProductType { get; set; } // Life, Health, Motor, Home
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    
    // Payment frequency surcharges/discounts
    public decimal MonthlySurcharge { get; set; } = 0.05m; // 5% default
    public decimal QuarterlySurcharge { get; set; } = 0.03m; // 3% default
    public decimal SemiAnnualSurcharge { get; set; } = 0.02m; // 2% default
    public decimal LumpSumDiscount { get; set; } = 0.08m; // 8% discount default
    
    // Display settings
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
}

/// <summary>
/// Request to update an existing product
/// </summary>
public class UpdateProductRequest
{
    public string? ProductName { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    
    public decimal? MonthlySurcharge { get; set; }
    public decimal? QuarterlySurcharge { get; set; }
    public decimal? SemiAnnualSurcharge { get; set; }
    public decimal? LumpSumDiscount { get; set; }
    
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsFeatured { get; set; }
}

/// <summary>
/// Response for product details
/// </summary>
public class ProductResponse
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    
    public decimal MonthlySurcharge { get; set; }
    public decimal QuarterlySurcharge { get; set; }
    public decimal SemiAnnualSurcharge { get; set; }
    public decimal LumpSumDiscount { get; set; }
    
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    
    public int TotalPlans { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
