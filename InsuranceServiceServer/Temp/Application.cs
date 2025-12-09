using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class Application
{
    public int Id { get; set; }

    public string ApplicationNumber { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public int ProductId { get; set; }

    public decimal CoverageAmount { get; set; }

    public int TermYears { get; set; }

    public string PaymentFrequency { get; set; } = null!;

    public decimal PremiumAmount { get; set; }

    public bool IsLumpSumPayment { get; set; }

    public decimal? TotalPremiumAmount { get; set; }

    public decimal? PaymentPerPeriod { get; set; }

    public string ApplicantData { get; set; } = null!;

    public int? HealthDeclarationId { get; set; }

    public string BeneficiariesData { get; set; } = null!;

    public string DocumentsData { get; set; } = null!;

    public string Status { get; set; } = null!;

    public bool TermsAccepted { get; set; }

    public bool DeclarationAccepted { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public string? ReviewNotes { get; set; }

    public string? ReviewedBy { get; set; }

    public virtual ICollection<Beneficiary> Beneficiaries { get; set; } = new List<Beneficiary>();

    public virtual HealthDeclaration? HealthDeclaration { get; set; }

    public virtual InsuranceProduct Product { get; set; } = null!;

    public virtual PropertyInfo? PropertyInfo { get; set; }

    public virtual TravelInfo? TravelInfo { get; set; }

    public virtual VehicleInfo? VehicleInfo { get; set; }
}
