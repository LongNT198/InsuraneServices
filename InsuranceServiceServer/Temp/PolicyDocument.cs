using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class PolicyDocument
{
    public int Id { get; set; }

    public int PolicyId { get; set; }

    public string DocumentType { get; set; } = null!;

    public int Version { get; set; }

    public bool IsActive { get; set; }

    public virtual BaseDocument IdNavigation { get; set; } = null!;
}
