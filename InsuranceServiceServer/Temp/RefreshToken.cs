using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class RefreshToken
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Token { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual User User { get; set; } = null!;
}
