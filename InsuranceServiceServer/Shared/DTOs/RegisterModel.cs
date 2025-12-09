using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        [MaxLength(255, ErrorMessage = "Email must not exceed 255 characters")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [MaxLength(255, ErrorMessage = "Password must not exceed 255 characters")]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        [DataType(DataType.Password)]
        public required string ConfirmPassword { get; set; }
    }

    public class CompleteRegistrationProfileRequest
    {
        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(255)]
        public required string FullName { get; set; }

        [Phone(ErrorMessage = "Invalid phone number")]
        [RegularExpression(@"^(\+84|0)[0-9]{9,10}$", ErrorMessage = "Phone must be Vietnamese format")]
        public string? PhoneNumber { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        public string? Address { get; set; }
    }

    public class ChangePasswordRequest
    {
        [Required(ErrorMessage = "Current password is required")]
        [DataType(DataType.Password)]
        public required string CurrentPassword { get; set; }

        [Required(ErrorMessage = "New password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        [DataType(DataType.Password)]
        public required string ConfirmPassword { get; set; }
    }
}



