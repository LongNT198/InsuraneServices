using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class FinancialDocument
{
    public int Id { get; set; }

    public string DocumentType { get; set; } = null!;

    public decimal? Amount { get; set; }

    public string? Period { get; set; }

    public virtual BaseDocument IdNavigation { get; set; } = null!;
}
