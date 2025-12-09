using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Models;

public partial class ClaimDocument
{
    [Key]
    public int Id { get; set; }

    public int ClaimId { get; set; }

    public string DocumentType { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    public DateTime? IncidentDate { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("ClaimDocument")]
    public virtual BaseDocument IdNavigation { get; set; } = null!;
}


