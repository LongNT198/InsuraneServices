using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InsuranceServiceServer.Models.Insurance;

namespace InsuranceServiceServer.Features.Customer.Models;

public class Application
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string ApplicationNumber { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal CoverageAmount { get; set; }

    [Required]
    public int TermYears { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentFrequency { get; set; } = "Monthly"; // LumpSum, Monthly, Quarterly, SemiAnnual, Annual

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PremiumAmount { get; set; }
    
    // Payment Details
    public bool IsLumpSumPayment { get; set; } = false;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? TotalPremiumAmount { get; set; } // Total for entire term
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? PaymentPerPeriod { get; set; } // Per-period amount

    // Reference to HealthDeclaration (normalized)
    public int? HealthDeclarationId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Draft"; // Draft, Submitted, Under Review, Approved, Rejected

    public bool TermsAccepted { get; set; }
    public bool DeclarationAccepted { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }

    [MaxLength(500)]
    public string? ReviewNotes { get; set; }

    [MaxLength(100)]
    public string? ReviewedBy { get; set; }

    // Navigation properties
    [ForeignKey("ProductId")]
    public virtual InsuranceProduct? Product { get; set; }

    [ForeignKey("HealthDeclarationId")]
    public virtual HealthDeclaration? HealthDeclaration { get; set; }

    // Collections for normalized data
    public virtual ICollection<Beneficiary> Beneficiaries { get; set; } = new List<Beneficiary>();
    public virtual VehicleInfo? VehicleInfo { get; set; } // For Motor Insurance
    public virtual PropertyInfo? PropertyInfo { get; set; } // For Home Insurance
    public virtual TravelInfo? TravelInfo { get; set; } // For Travel Insurance
}



