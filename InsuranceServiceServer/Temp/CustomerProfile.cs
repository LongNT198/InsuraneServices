using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class CustomerProfile
{
    public string Id { get; set; } = null!;

    public string? NationalId { get; set; }

    public string? PassportNumber { get; set; }

    public string? TaxCode { get; set; }

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string? District { get; set; }

    public string? Ward { get; set; }

    public string Country { get; set; } = null!;

    public string? Occupation { get; set; }

    public string? Company { get; set; }

    public string? Position { get; set; }

    public decimal? MonthlyIncome { get; set; }

    public string KycStatus { get; set; } = null!;

    public DateTime? KycVerifiedDate { get; set; }

    public string? KycVerifiedBy { get; set; }

    public string CustomerTier { get; set; } = null!;

    public decimal LifetimeValue { get; set; }

    public string? AssignedAgentId { get; set; }

    public string? EmergencyContactName { get; set; }

    public string? EmergencyContactPhone { get; set; }

    public string? EmergencyContactRelationship { get; set; }

    public bool AcceptMarketing { get; set; }

    public string PreferredContactMethod { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public string Gender { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Avatar { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? EmergencyContactRelationshipOther { get; set; }

    public virtual ICollection<InsurancePolicy> InsurancePolicies { get; set; } = new List<InsurancePolicy>();
}
