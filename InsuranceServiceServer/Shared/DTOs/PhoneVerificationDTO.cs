using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
    public class SendPhoneOtpRequest
    {
        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [RegularExpression(@"^(\+84|0)[0-9]{9,10}$", ErrorMessage = "Phone number must be valid Vietnamese format")]
        public string PhoneNumber { get; set; } = string.Empty;
    }

    public class VerifyPhoneOtpRequest
    {
        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "OTP is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "OTP must be 6 digits")]
        public string OTP { get; set; } = string.Empty;
    }

    public class PhoneVerificationStatusDTO
    {
        public bool IsVerified { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public int AttemptsRemaining { get; set; }
        public bool CanResend { get; set; }
        public int? SecondsUntilResend { get; set; }
    }
}



