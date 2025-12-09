using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class PhoneVerification
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Otp { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool IsVerified { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public int AttemptCount { get; set; }

    public DateTime? LastAttemptAt { get; set; }

    public int ResendCount { get; set; }

    public DateTime? LastResendAt { get; set; }

    public string? DeliveryStatus { get; set; }

    public string? SmsProvider { get; set; }

    public virtual User User { get; set; } = null!;
}
