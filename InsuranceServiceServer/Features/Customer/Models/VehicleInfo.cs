using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Vehicle Information - For Motor Insurance Applications
    /// </summary>
    public class VehicleInfo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        // Vehicle Identification
        [Required]
        [MaxLength(50)]
        public string VehicleType { get; set; } = string.Empty; // Car, Motorcycle, Truck, Van

        [Required]
        [MaxLength(100)]
        public string Make { get; set; } = string.Empty; // Honda, Toyota, etc.

        [Required]
        [MaxLength(100)]
        public string Model { get; set; } = string.Empty;

        [Required]
        public int ManufactureYear { get; set; }

        [MaxLength(50)]
        public string? Color { get; set; }

        [Required]
        [MaxLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? ChassisNumber { get; set; } // VIN

        [MaxLength(50)]
        public string? EngineNumber { get; set; }

        // Vehicle Specifications
        [Column(TypeName = "decimal(10,2)")]
        public decimal? EngineCapacity { get; set; } // CC

        [MaxLength(50)]
        public string? FuelType { get; set; } // Petrol, Diesel, Electric, Hybrid

        [Range(2, 50)]
        public int? NumberOfSeats { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? VehicleValue { get; set; } // Market value

        // Registration & Ownership
        [Required]
        [MaxLength(100)]
        public string OwnerName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? OwnerNationalId { get; set; }

        [Required]
        [MaxLength(200)]
        public string RegistrationAddress { get; set; } = string.Empty;

        public DateTime? RegistrationDate { get; set; }

        public DateTime? RegistrationExpiryDate { get; set; }

        // Usage Information
        [Required]
        [MaxLength(50)]
        public string UsagePurpose { get; set; } = "Personal"; // Personal, Commercial, Business

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AnnualMileage { get; set; } // km/year

        [MaxLength(200)]
        public string? ParkingLocation { get; set; } // Home garage, Street, Parking lot

        public bool HasAntiTheftDevice { get; set; }

        public bool HasDashcam { get; set; }

        // Previous Insurance & Claims
        public bool HasPreviousInsurance { get; set; }

        [MaxLength(100)]
        public string? PreviousInsurerName { get; set; }

        public DateTime? PreviousPolicyExpiryDate { get; set; }

        public bool HasClaimHistory { get; set; }

        [Range(0, 100)]
        public int? NumberOfClaims { get; set; } // Last 3 years

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalClaimAmount { get; set; } // Last 3 years

        [Column(TypeName = "nvarchar(max)")]
        public string? ClaimHistoryDetails { get; set; } // JSON

        // Modifications
        public bool HasModifications { get; set; }

        [MaxLength(1000)]
        public string? ModificationDetails { get; set; }

        // Condition
        [Required]
        [MaxLength(50)]
        public string Condition { get; set; } = "Good"; // Excellent, Good, Fair, Poor

        public DateTime? LastMaintenanceDate { get; set; }

        // Documents
        [MaxLength(500)]
        public string? RegistrationCertificatePath { get; set; }

        [MaxLength(500)]
        public string? VehiclePhotoPaths { get; set; } // JSON array

        [MaxLength(500)]
        public string? InspectionReportPath { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey("ApplicationId")]
        public virtual Application? Application { get; set; }
    }
}
