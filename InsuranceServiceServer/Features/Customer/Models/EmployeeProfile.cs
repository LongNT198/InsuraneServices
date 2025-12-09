namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Employee Profile - For company staff (Agent, Officer, Manager, Admin)
    /// </summary>
    public class EmployeeProfile : BaseProfile
    {
        // Employee Info
        public string EmployeeCode { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string Position { get; set; } = string.Empty;
        public string EmployeeType { get; set; } = "Full-time"; // Full-time, Part-time, Contract
        
        // Hierarchy
        public string? ManagerId { get; set; } // EmployeeProfile Id
        
        // Employment
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public DateTime? ProbationEndDate { get; set; }
        public DateTime? ResignDate { get; set; }
        public string EmploymentStatus { get; set; } = "Active"; // Active, OnLeave, Resigned
        
        // Work Info
        public decimal Salary { get; set; }
        public string? WorkLocation { get; set; }
        public string? WorkSchedule { get; set; }
        
        // Permissions & Access
        public bool CanApprovePolicy { get; set; }
        public decimal ApprovalLimit { get; set; } // Policy approval limit amount
        public bool CanApproveClaim { get; set; }
        public decimal ClaimApprovalLimit { get; set; } // Claim approval limit amount
        
        // Performance (for Agent role)
        public decimal? SalesTarget { get; set; }
        public decimal? AchievedSales { get; set; }
        public int? ManagedCustomerCount { get; set; }
        public decimal? CommissionRate { get; set; } // Percentage
        
        // Navigation
        public Department? Department { get; set; }
    }
}



