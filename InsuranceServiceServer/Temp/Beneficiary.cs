using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class Beneficiary
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }

    public string FullName { get; set; } = null!;

    public string Relationship { get; set; } = null!;

    public string? NationalId { get; set; }

    public DateTime DateOfBirth { get; set; }

    public string Gender { get; set; } = null!;

    public string? Ssn { get; set; }

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public decimal Percentage { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? City { get; set; }

    public bool IsIrrevocable { get; set; }

    public bool IsMinor { get; set; }

    public bool PerStirpes { get; set; }

    public string Phone { get; set; } = null!;

    public string? PostalCode { get; set; }

    public string? State { get; set; }

    public string? Trustee { get; set; }

    public string? TrusteeRelationship { get; set; }

    public string Type { get; set; } = null!;

    public string? RelationshipOther { get; set; }

    public string? TrusteeRelationshipOther { get; set; }

    public virtual Application Application { get; set; } = null!;
}
