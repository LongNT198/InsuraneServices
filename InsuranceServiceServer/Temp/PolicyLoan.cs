using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class PolicyLoan
{
    public int Id { get; set; }

    public string LoanNumber { get; set; } = null!;

    public int PolicyId { get; set; }

    public decimal LoanAmount { get; set; }

    public decimal InterestRate { get; set; }

    public decimal MaxLoanAmount { get; set; }

    public int RepaymentMonths { get; set; }

    public decimal MonthlyRepayment { get; set; }

    public string Status { get; set; } = null!;

    public DateTime ApplicationDate { get; set; }

    public DateTime? ApprovalDate { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime? DisbursementDate { get; set; }

    public decimal OutstandingAmount { get; set; }

    public string? RejectionReason { get; set; }

    public virtual InsurancePolicy Policy { get; set; } = null!;
}
