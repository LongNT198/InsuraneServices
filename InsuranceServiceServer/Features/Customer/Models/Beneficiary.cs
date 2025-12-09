using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Beneficiary - Person who receives benefits from insurance policy
    /// </summary>
    public class Beneficiary
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        // Beneficiary Type
        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "Primary"; // Primary or Contingent

        // Personal Information
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Relationship { get; set; } = string.Empty; // Spouse, Child, Parent, Sibling, Other

    [MaxLength(50)]
    public string? RelationshipOther { get; set; } // Specify when Relationship = "Other"

    [MaxLength(20)]
    public string? NationalId { get; set; } // CMND/CCCD        [MaxLength(20)]
        public string? SSN { get; set; } // Social Security Number

        [Required]
        public DateTime DateOfBirth { get; set; }

    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty; // Male, Female, Other

    [Required]
    [MaxLength(20)]
    [Phone]
    public string Phone { get; set; } = string.Empty;        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        // Address
        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(50)]
        public string? State { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        // Benefit Share
        [Required]
        [Range(0, 100)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Percentage { get; set; } // Must total 100% across all beneficiaries

        // Minor & Trust Information
        public bool IsMinor { get; set; } = false;

        [MaxLength(100)]
        public string? Trustee { get; set; } // Guardian/Trustee for minor

        [MaxLength(50)]
        public string? TrusteeRelationship { get; set; }

        [MaxLength(50)]
        public string? TrusteeRelationshipOther { get; set; } // Specify when TrusteeRelationship = "Other"

        // Legal Options
        public bool PerStirpes { get; set; } = false; // Distribution to descendants
        public bool IsIrrevocable { get; set; } = false; // Cannot be changed without consent

        // Status
        public bool IsActive { get; set; } = true;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey("ApplicationId")]
        public virtual Application? Application { get; set; }
    }
}
