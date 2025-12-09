using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class InsuranceProduct
{
    public int Id { get; set; }

    public string ProductCode { get; set; } = null!;

    public string ProductName { get; set; } = null!;

    public string ProductType { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? Features { get; set; }

    public decimal ProcessingFee { get; set; }

    public decimal PolicyIssuanceFee { get; set; }

    public decimal MedicalCheckupFee { get; set; }

    public decimal AdminFee { get; set; }

    public decimal LumpSumDiscount { get; set; }

    public decimal MonthlySurcharge { get; set; }

    public decimal QuarterlySurcharge { get; set; }

    public decimal SemiAnnualSurcharge { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsFeatured { get; set; }

    public string? ShortDescription { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

    public virtual ICollection<InsurancePlan> InsurancePlans { get; set; } = new List<InsurancePlan>();

    public virtual ICollection<InsurancePolicy> InsurancePolicies { get; set; } = new List<InsurancePolicy>();
}
