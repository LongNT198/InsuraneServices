using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class UnderwritingDecision
{
    public int Id { get; set; }

    public int RegistrationSessionId { get; set; }

    public string CustomerProfileId { get; set; } = null!;

    public int? PolicyId { get; set; }

    public string Decision { get; set; } = null!;

    public DateTime DecisionDate { get; set; }

    public string? DecisionBy { get; set; }

    public string RiskLevel { get; set; } = null!;

    public int RiskScore { get; set; }

    public string? RiskFactorsJson { get; set; }

    public bool IsAutoApprovalEligible { get; set; }

    public string? AutoApprovalReasons { get; set; }

    public bool RequiresMedicalExam { get; set; }

    public bool RequiresAdditionalDocuments { get; set; }

    public string? RequiredDocumentsList { get; set; }

    public decimal OriginalPremium { get; set; }

    public decimal? AdjustedPremium { get; set; }

    public decimal? PremiumLoadingPercentage { get; set; }

    public string? PremiumAdjustmentReason { get; set; }

    public decimal RequestedCoverageAmount { get; set; }

    public decimal? ApprovedCoverageAmount { get; set; }

    public string? CoverageModificationReason { get; set; }

    public string? ExclusionsJson { get; set; }

    public string? RejectionReason { get; set; }

    public string? RejectionDetails { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ReviewStartDate { get; set; }

    public DateTime? ReviewCompletedDate { get; set; }

    public string? UnderwriterNotes { get; set; }

    public string? CommunicationToCustomer { get; set; }

    public virtual InsurancePolicy? Policy { get; set; }

    public virtual RegistrationSession RegistrationSession { get; set; } = null!;
}
