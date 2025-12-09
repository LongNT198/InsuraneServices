using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
    public class ResendVerificationRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
    }
}



