using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class BaseDocument
{
    public int Id { get; set; }

    public string DocumentNumber { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string FileName { get; set; } = null!;

    public string FileUrl { get; set; } = null!;

    public string FileType { get; set; } = null!;

    public long FileSize { get; set; }

    public string OwnerType { get; set; } = null!;

    public string OwnerId { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime UploadedDate { get; set; }

    public string? UploadedBy { get; set; }

    public DateTime? VerifiedDate { get; set; }

    public string? VerifiedBy { get; set; }

    public string? RejectionReason { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public DateTime? IssueDate { get; set; }

    public string? IssuingAuthority { get; set; }

    public virtual ClaimDocument? ClaimDocument { get; set; }

    public virtual FinancialDocument? FinancialDocument { get; set; }

    public virtual HealthDocument? HealthDocument { get; set; }

    public virtual IdentityDocument? IdentityDocument { get; set; }

    public virtual PolicyDocument? PolicyDocument { get; set; }
}
