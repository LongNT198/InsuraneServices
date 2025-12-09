using System;
using InsuranceServiceServer.Features.Auth.Models;

namespace InsuranceServiceServer.Core.Models
{
    public class EmailVerification
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Support both Token and OTP
        public string VerificationToken { get; set; } = string.Empty; // For email link verification
        public string? OTP { get; set; } // For OTP verification (6 digits)
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsVerified { get; set; }
        public DateTime? VerifiedAt { get; set; }
        
        // Attempt tracking for security
        public int AttemptCount { get; set; } = 0;
        public DateTime? LastAttemptAt { get; set; }

        // Navigation
        public virtual AppUser? User { get; set; }
    }
}



