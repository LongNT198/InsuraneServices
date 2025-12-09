using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
    public class UserProfileDTO
    {
        public string? Id { get; set; }
        public string? UserId { get; set; }
        
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of birth is required")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Gender is required")]
        public string Gender { get; set; } = string.Empty;

        public string? GenderOther { get; set; } // Specify when Gender = "Other"

        [Required(ErrorMessage = "Address is required")]
        [StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        [StringLength(50, ErrorMessage = "City cannot exceed 50 characters")]
        public string City { get; set; } = string.Empty;

        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? PostalCode { get; set; }

        [StringLength(50, ErrorMessage = "Occupation cannot exceed 50 characters")]
        public string? Occupation { get; set; }
        public string? OccupationOther { get; set; } // Specify when Occupation = "Other"

        public string? Company { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Monthly income must be positive")]
        public decimal? MonthlyIncome { get; set; }

        // National ID
        [StringLength(20, ErrorMessage = "National ID cannot exceed 20 characters")]
        public string? NationalId { get; set; }

        // Avatar URL
        public string? Avatar { get; set; }

        // KYC Status
        public string? KycStatus { get; set; }
        public DateTime? KycVerifiedDate { get; set; }

        // Profile completion tracking
        public bool IsProfileCompleted { get; set; }
        public int ProfileCompletionPercentage { get; set; }

        // Emergency Contact
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public string? EmergencyContactGender { get; set; }
        public string? EmergencyContactRelationship { get; set; }
        public string? EmergencyContactRelationshipOther { get; set; } // Specify when EmergencyContactRelationship = "Other"
    }

    public class UpdateProfileRequest
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of birth is required")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Gender is required")]
        public string Gender { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; } = string.Empty;

        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? PostalCode { get; set; }
        public string? Occupation { get; set; }
        public string? OccupationOther { get; set; } // Specify when Occupation = "Other"
        public string? Company { get; set; }
        public decimal? MonthlyIncome { get; set; }
        public string? NationalId { get; set; }

        // Emergency Contact
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public string? EmergencyContactGender { get; set; }
        public string? EmergencyContactRelationship { get; set; }
        public string? EmergencyContactRelationshipOther { get; set; } // Specify when EmergencyContactRelationship = "Other"
    }
}



