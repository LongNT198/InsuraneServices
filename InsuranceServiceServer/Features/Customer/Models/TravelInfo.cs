using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Travel Information - For Travel Insurance Applications
    /// </summary>
    public class TravelInfo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        // Trip Details
        [Required]
        [MaxLength(50)]
        public string TripType { get; set; } = string.Empty; // Single Trip, Multi Trip, Annual

        [Required]
        [MaxLength(100)]
        public string Destination { get; set; } = string.Empty; // Country/Region

        [MaxLength(500)]
        public string? DestinationDetails { get; set; } // JSON array for multiple countries

        [Required]
        public DateTime DepartureDate { get; set; }

        [Required]
        public DateTime ReturnDate { get; set; }

        [Range(1, 365)]
        public int TripDuration { get; set; } // Days

        // Travel Purpose
        [Required]
        [MaxLength(50)]
        public string TravelPurpose { get; set; } = "Leisure"; // Leisure, Business, Study, Medical, Sports

        [MaxLength(500)]
        public string? PurposeDetails { get; set; }

        // Travelers
        [Required]
        [Range(1, 50)]
        public int NumberOfTravelers { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? TravelersDetails { get; set; } // JSON array with name, age, relationship

        public bool IncludesChildren { get; set; }

        [Range(0, 20)]
        public int? NumberOfChildren { get; set; }

        public bool IncludesElderly { get; set; } // 65+

        public bool IncludesPregnantTraveler { get; set; }

        [Range(0, 40)]
        public int? PregnancyWeeks { get; set; }

        // Travel Activities & Risks
        [MaxLength(50)]
        public string? RiskLevel { get; set; } = "Standard"; // Standard, High-Risk, Adventure

        public bool IncludesAdventureSports { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? PlannedActivities { get; set; } // JSON array: Skiing, Diving, Hiking, etc.

        public bool IncludesWaterSports { get; set; }

        public bool IncludesWinterSports { get; set; }

        public bool IncludesExtremeSports { get; set; }

        public bool IncludesMountainClimbing { get; set; }

        // Transportation
        [Required]
        [MaxLength(50)]
        public string PrimaryTransport { get; set; } = "Air"; // Air, Sea, Land, Rail

        [MaxLength(500)]
        public string? FlightDetails { get; set; } // JSON: Airline, Flight numbers

        public bool IncludesCarRental { get; set; }

        public bool IncludesCruise { get; set; }

        // Accommodation
        [MaxLength(50)]
        public string? AccommodationType { get; set; } // Hotel, Resort, Hostel, Apartment, Camping

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AccommodationCost { get; set; }

        public bool IsPrePaid { get; set; }

        // Medical & Health
        public bool HasPreExistingConditions { get; set; }

        [MaxLength(1000)]
        public string? PreExistingConditionsDetails { get; set; }

        public bool RequiresMedication { get; set; }

        public bool HasTravelVaccinations { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? VaccinationDetails { get; set; } // JSON

        public bool VisitingHighRiskRegion { get; set; } // Malaria, Yellow Fever zones

        [MaxLength(500)]
        public string? HighRiskRegionDetails { get; set; }

        // Coverage Requirements
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MedicalCoverageAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TripCancellationCoverage { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? LuggageCoverage { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PersonalLiabilityCoverage { get; set; }

        public bool IncludesEmergencyEvacuation { get; set; }

        public bool IncludesTripDelay { get; set; }

        public bool IncludesMissedConnection { get; set; }

        // Financial Information
        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalTripCost { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? NonRefundableDeposit { get; set; }

        public DateTime? FirstDepositDate { get; set; }

        // Previous Travel & Claims
        public bool HasTravelInsuranceHistory { get; set; }

        public bool HasPreviousClaims { get; set; }

        [Range(0, 50)]
        public int? NumberOfPreviousClaims { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PreviousClaimAmount { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? ClaimHistoryDetails { get; set; } // JSON

        // Emergency Contacts
        [Required]
        [MaxLength(100)]
        public string EmergencyContactName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string EmergencyContactPhone { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string EmergencyContactRelationship { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? SecondaryEmergencyContactName { get; set; }

        [MaxLength(20)]
        public string? SecondaryEmergencyContactPhone { get; set; }

        // Destination Risk Assessment
        [MaxLength(50)]
        public string? DestinationRiskLevel { get; set; } // Low, Medium, High, Very High

        public bool HasTravelAdvisory { get; set; }

        [MaxLength(1000)]
        public string? TravelAdvisoryDetails { get; set; }

        public bool RequiresVisa { get; set; }

        public bool VisaObtained { get; set; }

        // Documents
        [MaxLength(500)]
        public string? PassportCopyPath { get; set; }

        [MaxLength(500)]
        public string? VisaCopyPath { get; set; }

        [MaxLength(500)]
        public string? FlightTicketPath { get; set; }

        [MaxLength(500)]
        public string? HotelBookingPath { get; set; }

        [MaxLength(500)]
        public string? ItineraryPath { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey("ApplicationId")]
        public virtual Application? Application { get; set; }
    }
}
