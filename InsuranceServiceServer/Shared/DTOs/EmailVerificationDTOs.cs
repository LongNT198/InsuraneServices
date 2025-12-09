using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
    public class SendOTPRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOTPRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "OTP is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "OTP must be 6 digits")]
        public string OTP { get; set; } = string.Empty;
    }

    public class OTPResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime? ExpiresAt { get; set; }
    }
}



