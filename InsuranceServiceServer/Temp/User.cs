using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class User
{
    public string Id { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public DateTime? LastLoginDate { get; set; }

    public bool IsActive { get; set; }

    public string? ProfileType { get; set; }

    public string? ProfileId { get; set; }

    public string? UserName { get; set; }

    public string? NormalizedUserName { get; set; }

    public string? Email { get; set; }

    public string? NormalizedEmail { get; set; }

    public bool EmailConfirmed { get; set; }

    public string? PasswordHash { get; set; }

    public string? SecurityStamp { get; set; }

    public string? ConcurrencyStamp { get; set; }

    public string? PhoneNumber { get; set; }

    public bool PhoneNumberConfirmed { get; set; }

    public bool TwoFactorEnabled { get; set; }

    public DateTimeOffset? LockoutEnd { get; set; }

    public bool LockoutEnabled { get; set; }

    public int AccessFailedCount { get; set; }

    public virtual ICollection<ApplicationDraft> ApplicationDrafts { get; set; } = new List<ApplicationDraft>();

    public virtual ICollection<EmailVerification> EmailVerifications { get; set; } = new List<EmailVerification>();

    public virtual ICollection<PhoneVerification> PhoneVerifications { get; set; } = new List<PhoneVerification>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<UserClaim> UserClaims { get; set; } = new List<UserClaim>();

    public virtual ICollection<UserLogin> UserLogins { get; set; } = new List<UserLogin>();

    public virtual ICollection<UserToken> UserTokens { get; set; } = new List<UserToken>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
