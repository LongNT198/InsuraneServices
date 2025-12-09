using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class RegistrationSession
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string SessionToken { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public DateTime LastUpdateDate { get; set; }

    public string CurrentStep { get; set; } = null!;

    public string RegistrationStatus { get; set; } = null!;

    public bool IsAccountCreated { get; set; }

    public bool IsKyccompleted { get; set; }

    public bool IsProfileCompleted { get; set; }

    public bool IsProductSelected { get; set; }

    public bool IsHealthDeclared { get; set; }

    public bool IsUnderwritingCompleted { get; set; }

    public bool IsPaymentCompleted { get; set; }

    public bool IsPolicyIssued { get; set; }

    public int? SelectedProductId { get; set; }

    public decimal? SelectedCoverageAmount { get; set; }

    public int? SelectedTermYears { get; set; }

    public string? SelectedPaymentFrequency { get; set; }

    public string? RejectionReason { get; set; }

    public string? Notes { get; set; }

    public int? CreatedPolicyId { get; set; }

    public virtual InsurancePolicy? CreatedPolicy { get; set; }

    public virtual ICollection<HealthDeclaration> HealthDeclarations { get; set; } = new List<HealthDeclaration>();

    public virtual ICollection<Kycverification> Kycverifications { get; set; } = new List<Kycverification>();

    public virtual ICollection<UnderwritingDecision> UnderwritingDecisions { get; set; } = new List<UnderwritingDecision>();
}
