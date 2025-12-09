using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class IdentityDocument
{
    public int Id { get; set; }

    public string DocumentType { get; set; } = null!;

    public string IdNumber { get; set; } = null!;

    public string? IssuedPlace { get; set; }

    public virtual BaseDocument IdNavigation { get; set; } = null!;
}
