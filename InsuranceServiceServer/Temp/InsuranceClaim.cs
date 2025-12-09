using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class InsuranceClaim
{
    public int Id { get; set; }

    public string ClaimNumber { get; set; } = null!;

    public int PolicyId { get; set; }

    public string ClaimType { get; set; } = null!;

    public DateTime ClaimDate { get; set; }

    public DateTime IncidentDate { get; set; }

    public string Description { get; set; } = null!;

    public decimal ClaimAmount { get; set; }

    public decimal? ApprovedAmount { get; set; }

    public string Status { get; set; } = null!;

    public string? RejectionReason { get; set; }

    public string? AssignedTo { get; set; }

    public DateTime? ReviewedDate { get; set; }

    public string? ReviewedBy { get; set; }

    public string? ReviewerNotes { get; set; }

    public DateTime? PaidDate { get; set; }

    public string Priority { get; set; } = null!;

    public virtual InsurancePolicy Policy { get; set; } = null!;
}
