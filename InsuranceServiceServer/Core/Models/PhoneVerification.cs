using System;
using InsuranceServiceServer.Features.Auth.Models;

namespace InsuranceServiceServer.Core.Models
{
    public class PhoneVerification
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        
        // OTP Code (6 digits)
        public string OTP { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsVerified { get; set; }
        public DateTime? VerifiedAt { get; set; }
        
        // Attempt tracking for security (max 5 attempts)
        public int AttemptCount { get; set; } = 0;
        public DateTime? LastAttemptAt { get; set; }
        
        // Prevent spam (max 3 resends per hour)
        public int ResendCount { get; set; } = 0;
        public DateTime? LastResendAt { get; set; }
        
        // Optional: Track delivery status
        public string? DeliveryStatus { get; set; } // Sent, Delivered, Failed
        public string? SmsProvider { get; set; } // Twilio, AWS SNS, etc.

        // Navigation
        public virtual AppUser? User { get; set; }
    }
}



