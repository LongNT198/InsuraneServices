using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class EmailVerification
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string VerificationToken { get; set; } = null!;

    public string? Otp { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool IsVerified { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public int AttemptCount { get; set; }

    public DateTime? LastAttemptAt { get; set; }

    public virtual User User { get; set; } = null!;
}
