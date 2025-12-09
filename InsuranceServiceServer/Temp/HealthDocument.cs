using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class HealthDocument
{
    public int Id { get; set; }

    public string DocumentType { get; set; } = null!;

    public DateTime? ExaminationDate { get; set; }

    public string? DoctorName { get; set; }

    public string? Hospital { get; set; }

    public string? Diagnosis { get; set; }

    public virtual BaseDocument IdNavigation { get; set; } = null!;
}
