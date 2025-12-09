using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Models;

[Table("KYCDocuments")]
public partial class KYCDocument
{
    [Key]
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

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? VerificationScore { get; set; }

    public bool? IsFaceMatched { get; set; }
}


