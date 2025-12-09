using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class VehicleInfo
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }

    public string VehicleType { get; set; } = null!;

    public string Make { get; set; } = null!;

    public string Model { get; set; } = null!;

    public int ManufactureYear { get; set; }

    public string? Color { get; set; }

    public string LicensePlate { get; set; } = null!;

    public string? ChassisNumber { get; set; }

    public string? EngineNumber { get; set; }

    public decimal? EngineCapacity { get; set; }

    public string? FuelType { get; set; }

    public int? NumberOfSeats { get; set; }

    public decimal? VehicleValue { get; set; }

    public string OwnerName { get; set; } = null!;

    public string? OwnerNationalId { get; set; }

    public string RegistrationAddress { get; set; } = null!;

    public DateTime? RegistrationDate { get; set; }

    public DateTime? RegistrationExpiryDate { get; set; }

    public string UsagePurpose { get; set; } = null!;

    public decimal? AnnualMileage { get; set; }

    public string? ParkingLocation { get; set; }

    public bool HasAntiTheftDevice { get; set; }

    public bool HasDashcam { get; set; }

    public bool HasPreviousInsurance { get; set; }

    public string? PreviousInsurerName { get; set; }

    public DateTime? PreviousPolicyExpiryDate { get; set; }

    public bool HasClaimHistory { get; set; }

    public int? NumberOfClaims { get; set; }

    public decimal? TotalClaimAmount { get; set; }

    public string? ClaimHistoryDetails { get; set; }

    public bool HasModifications { get; set; }

    public string? ModificationDetails { get; set; }

    public string Condition { get; set; } = null!;

    public DateTime? LastMaintenanceDate { get; set; }

    public string? RegistrationCertificatePath { get; set; }

    public string? VehiclePhotoPaths { get; set; }

    public string? InspectionReportPath { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Application Application { get; set; } = null!;
}
