using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Property Information - For Home Insurance Applications
    /// </summary>
    public class PropertyInfo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        // Property Type & Location
        [Required]
        [MaxLength(50)]
        public string PropertyType { get; set; } = string.Empty; // House, Apartment, Condo, Villa, Townhouse

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string District { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Ward { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        // Property Specifications
        [Column(TypeName = "decimal(10,2)")]
        public decimal? LandArea { get; set; } // m²

        [Column(TypeName = "decimal(10,2)")]
        public decimal? FloorArea { get; set; } // m²

        [Range(0, 200)]
        public int? NumberOfFloors { get; set; }

        [Range(0, 50)]
        public int? NumberOfRooms { get; set; }

        [Range(0, 20)]
        public int? NumberOfBathrooms { get; set; }

        public int? YearBuilt { get; set; }

        public int? YearRenovated { get; set; }

        // Construction Details
        [Required]
        [MaxLength(50)]
        public string ConstructionType { get; set; } = "Concrete"; // Concrete, Brick, Wood, Steel, Mixed

        [MaxLength(50)]
        public string? RoofType { get; set; } // Tile, Metal, Concrete, Asphalt

        [MaxLength(50)]
        public string? WallMaterial { get; set; } // Brick, Concrete, Wood

        [MaxLength(50)]
        public string? FloorMaterial { get; set; } // Tile, Wood, Concrete, Marble

        // Value & Ownership
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PropertyValue { get; set; } // Market value

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ContentsValue { get; set; } // Value of contents/belongings

        [Required]
        [MaxLength(100)]
        public string OwnerName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? OwnerNationalId { get; set; }

        public bool IsOwnerOccupied { get; set; } = true;

        [MaxLength(50)]
        public string? OwnershipType { get; set; } // Freehold, Leasehold

        public DateTime? PurchaseDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PurchasePrice { get; set; }

        // Mortgage & Loan
        public bool HasMortgage { get; set; }

        [MaxLength(100)]
        public string? MortgageProvider { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OutstandingLoanAmount { get; set; }

        // Usage
        [Required]
        [MaxLength(50)]
        public string OccupancyType { get; set; } = "Owner-Occupied"; // Owner-Occupied, Rented, Vacant, Holiday Home

        public bool IsCommercialUse { get; set; }

        [MaxLength(200)]
        public string? CommercialUseDetails { get; set; }

        // Security Features
        public bool HasSecuritySystem { get; set; }

        public bool HasFireAlarm { get; set; }

        public bool HasSmokeDetector { get; set; }

        public bool HasBurglarAlarm { get; set; }

        public bool HasCCTV { get; set; }

        public bool HasSecurityGuard { get; set; }

        public bool HasGatedCommunity { get; set; }

        // Facilities & Amenities
        public bool HasSwimmingPool { get; set; }

        public bool HasGarden { get; set; }

        public bool HasGarage { get; set; }

        [Range(0, 10)]
        public int? NumberOfParkingSpaces { get; set; }

        public bool HasElevator { get; set; }

        public bool HasGenerator { get; set; }

        // Risk Factors
        [MaxLength(50)]
        public string? FloodRiskLevel { get; set; } // Low, Medium, High

        [MaxLength(50)]
        public string? EarthquakeRiskLevel { get; set; }

        public bool IsNearWater { get; set; } // River, Lake, Sea

        public bool IsNearForest { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? DistanceToFireStation { get; set; } // km

        [Column(TypeName = "decimal(10,2)")]
        public decimal? DistanceToPoliceStation { get; set; } // km

        // Condition & Maintenance
        [Required]
        [MaxLength(50)]
        public string PropertyCondition { get; set; } = "Good"; // Excellent, Good, Fair, Poor

        public DateTime? LastInspectionDate { get; set; }

        public DateTime? LastMaintenanceDate { get; set; }

        [MaxLength(1000)]
        public string? KnownDefects { get; set; }

        // Previous Insurance & Claims
        public bool HasPreviousInsurance { get; set; }

        [MaxLength(100)]
        public string? PreviousInsurerName { get; set; }

        public DateTime? PreviousPolicyExpiryDate { get; set; }

        public bool HasClaimHistory { get; set; }

        [Range(0, 100)]
        public int? NumberOfClaims { get; set; } // Last 5 years

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalClaimAmount { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? ClaimHistoryDetails { get; set; } // JSON

        // Documents
        [MaxLength(500)]
        public string? PropertyDeedPath { get; set; }

        [MaxLength(500)]
        public string? PropertyPhotoPaths { get; set; } // JSON array

        [MaxLength(500)]
        public string? InspectionReportPath { get; set; }

        [MaxLength(500)]
        public string? ValuationReportPath { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey("ApplicationId")]
        public virtual Application? Application { get; set; }
    }
}
