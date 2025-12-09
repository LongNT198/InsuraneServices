using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Models;

public partial class FinancialDocument
{
    [Key]
    public int Id { get; set; }

    public string DocumentType { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    public string? Period { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("FinancialDocument")]
    public virtual BaseDocument IdNavigation { get; set; } = null!;
}


