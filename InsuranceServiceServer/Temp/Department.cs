using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class Department
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<EmployeeProfile> EmployeeProfiles { get; set; } = new List<EmployeeProfile>();
}
