using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class ApplicationDraft
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = null!;

    public string ApplicationType { get; set; } = null!;

    public string DraftData { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public string? Notes { get; set; }

    public virtual User User { get; set; } = null!;
}
