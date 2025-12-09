using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Shared.DTOs
{
  /// <summary>
  /// User Data Transfer Object for API responses
  /// </summary>
  public class UserDTO
  {
    /// <summary>
    /// Unique user identifier
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public string UserName { get; set; }

    /// <summary>
    /// User email address
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    public string PhoneNumber { get; set; }

    /// <summary>
    /// Is email confirmed
    /// </summary>
    public bool EmailConfirmed { get; set; }

    /// <summary>
    /// Is lockout enabled
    /// </summary>
    public bool LockoutEnabled { get; set; }

    /// <summary>
    /// Lockout end date/time
    /// </summary>
    public DateTimeOffset? LockoutEnd { get; set; }

    /// <summary>
    /// User creation date
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// List of roles assigned to the user
    /// </summary>
    public List<string> Roles { get; set; } = new List<string>();
  }
}



