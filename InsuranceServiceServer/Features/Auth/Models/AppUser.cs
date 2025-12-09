using Microsoft.AspNetCore.Identity;

namespace InsuranceServiceServer.Features.Auth.Models
{
    /// <summary>
    /// AUTH LAYER - Authentication & Authorization
    /// </summary>
    public class AppUser : IdentityUser
    {
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginDate { get; set; }
        public bool IsActive { get; set; } = true;

        // Profile Reference
        public string? ProfileType { get; set; } // "Customer", "Employee"
        public string? ProfileId { get; set; } // Link to CustomerProfile or EmployeeProfile

        // Navigation property for refresh tokens
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}




