using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Models;

public partial class IdentityDocument
{
    [Key]
    public int Id { get; set; }

    public string DocumentType { get; set; } = null!;

    public string IdNumber { get; set; } = null!;

    public string? IssuedPlace { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("IdentityDocument")]
    public virtual BaseDocument IdNavigation { get; set; } = null!;
}


