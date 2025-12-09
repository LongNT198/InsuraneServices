using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class InsurancePolicy
{
    public int Id { get; set; }

    public string PolicyNumber { get; set; } = null!;

    public string CustomerProfileId { get; set; } = null!;

    public int ProductId { get; set; }

    public decimal CoverageAmount { get; set; }

    public int TermYears { get; set; }

    public decimal Premium { get; set; }

    public string PaymentFrequency { get; set; } = null!;

    public bool IsLumpSumPayment { get; set; }

    public decimal? TotalPremiumAmount { get; set; }

    public decimal? PaymentPerPeriod { get; set; }

    public int? TotalPayments { get; set; }

    public DateTime ApplicationDate { get; set; }

    public DateTime? ApprovalDate { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Status { get; set; } = null!;

    public string? RejectionReason { get; set; }

    public string? AgentId { get; set; }

    public string? ApprovedBy { get; set; }

    public string? BeneficiariesJson { get; set; }

    public virtual CustomerProfile CustomerProfile { get; set; } = null!;

    public virtual ICollection<InsuranceClaim> InsuranceClaims { get; set; } = new List<InsuranceClaim>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<PolicyLoan> PolicyLoans { get; set; } = new List<PolicyLoan>();

    public virtual InsuranceProduct Product { get; set; } = null!;

    public virtual ICollection<RegistrationSession> RegistrationSessions { get; set; } = new List<RegistrationSession>();

    public virtual ICollection<UnderwritingDecision> UnderwritingDecisions { get; set; } = new List<UnderwritingDecision>();
}
