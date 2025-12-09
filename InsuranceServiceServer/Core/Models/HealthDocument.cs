using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Models;

public partial class HealthDocument
{
    [Key]
    public int Id { get; set; }

    public string DocumentType { get; set; } = null!;

    public DateTime? ExaminationDate { get; set; }

    public string? DoctorName { get; set; }

    public string? Hospital { get; set; }

    public string? Diagnosis { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("HealthDocument")]
    public virtual BaseDocument IdNavigation { get; set; } = null!;
}


