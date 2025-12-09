using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class ClaimDocument
{
    public int Id { get; set; }

    public int ClaimId { get; set; }

    public string DocumentType { get; set; } = null!;

    public decimal? Amount { get; set; }

    public DateTime? IncidentDate { get; set; }

    public virtual BaseDocument IdNavigation { get; set; } = null!;
}
