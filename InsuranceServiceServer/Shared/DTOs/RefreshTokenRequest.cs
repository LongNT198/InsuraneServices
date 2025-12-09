using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Shared.DTOs
{
  public class RefreshTokenRequest
  {
    [Required(ErrorMessage = "Refresh token is required")]
    [MinLength(1, ErrorMessage = "Refresh token cannot be empty")]
    public required string RefreshToken { get; set; }
  }
}



