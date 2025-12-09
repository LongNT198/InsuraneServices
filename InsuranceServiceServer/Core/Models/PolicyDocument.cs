using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Models;

public partial class PolicyDocument
{
    [Key]
    public int Id { get; set; }

    public int PolicyId { get; set; }

    public string DocumentType { get; set; } = null!;

    public int Version { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("PolicyDocument")]
    public virtual BaseDocument IdNavigation { get; set; } = null!;
}


