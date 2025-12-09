using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class Kycverification
{
    public int Id { get; set; }

    public int RegistrationSessionId { get; set; }

    public string CustomerProfileId { get; set; } = null!;

    public string DocumentType { get; set; } = null!;

    public string DocumentNumber { get; set; } = null!;

    public DateTime? DocumentIssueDate { get; set; }

    public DateTime? DocumentExpiryDate { get; set; }

    public string? DocumentIssuedBy { get; set; }

    public string? ExtractedFullName { get; set; }

    public DateTime? ExtractedDateOfBirth { get; set; }

    public string? ExtractedGender { get; set; }

    public string? ExtractedNationality { get; set; }

    public string? ExtractedAddress { get; set; }

    public bool IsFaceMatched { get; set; }

    public decimal? FaceMatchScore { get; set; }

    public bool IsDocumentAuthentic { get; set; }

    public decimal? AuthenticityScore { get; set; }

    public bool IsBlacklisted { get; set; }

    public bool IsFraudulent { get; set; }

    public string? RiskLevel { get; set; }

    public string VerificationStatus { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public string? VerifiedBy { get; set; }

    public string? RejectionReason { get; set; }

    public string? FrontImagePath { get; set; }

    public string? BackImagePath { get; set; }

    public string? SelfiePath { get; set; }

    public string? OcrresponseJson { get; set; }

    public string? FaceMatchResponseJson { get; set; }

    public virtual RegistrationSession RegistrationSession { get; set; } = null!;
}
