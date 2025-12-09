using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class Kycdocument
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string? CustomerProfileId { get; set; }

    public string DocumentType { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public long FileSize { get; set; }

    public string? NationalId { get; set; }

    public DateTime? DocumentIssueDate { get; set; }

    public string? DocumentIssuedBy { get; set; }

    public string Status { get; set; } = null!;

    public DateTime UploadedAt { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public string? ReviewedBy { get; set; }

    public string? RejectionReason { get; set; }

    public string? ReviewNotes { get; set; }

    public string? ExtractedData { get; set; }

    public decimal? VerificationScore { get; set; }

    public bool? IsFaceMatched { get; set; }
}
