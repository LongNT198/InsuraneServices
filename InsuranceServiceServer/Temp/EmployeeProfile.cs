using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class EmployeeProfile
{
    public string Id { get; set; } = null!;

    public string EmployeeCode { get; set; } = null!;

    public int DepartmentId { get; set; }

    public string Position { get; set; } = null!;

    public string EmployeeType { get; set; } = null!;

    public string? ManagerId { get; set; }

    public DateTime JoinDate { get; set; }

    public DateTime? ProbationEndDate { get; set; }

    public DateTime? ResignDate { get; set; }

    public string EmploymentStatus { get; set; } = null!;

    public decimal Salary { get; set; }

    public string? WorkLocation { get; set; }

    public string? WorkSchedule { get; set; }

    public bool CanApprovePolicy { get; set; }

    public decimal ApprovalLimit { get; set; }

    public bool CanApproveClaim { get; set; }

    public decimal ClaimApprovalLimit { get; set; }

    public decimal? SalesTarget { get; set; }

    public decimal? AchievedSales { get; set; }

    public int? ManagedCustomerCount { get; set; }

    public decimal? CommissionRate { get; set; }

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

    public virtual Department Department { get; set; } = null!;
}
