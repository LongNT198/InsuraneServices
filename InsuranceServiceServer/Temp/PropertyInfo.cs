using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class PropertyInfo
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }

    public string PropertyType { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string District { get; set; } = null!;

    public string? Ward { get; set; }

    public string? PostalCode { get; set; }

    public decimal? LandArea { get; set; }

    public decimal? FloorArea { get; set; }

    public int? NumberOfFloors { get; set; }

    public int? NumberOfRooms { get; set; }

    public int? NumberOfBathrooms { get; set; }

    public int? YearBuilt { get; set; }

    public int? YearRenovated { get; set; }

    public string ConstructionType { get; set; } = null!;

    public string? RoofType { get; set; }

    public string? WallMaterial { get; set; }

    public string? FloorMaterial { get; set; }

    public decimal PropertyValue { get; set; }

    public decimal? ContentsValue { get; set; }

    public string OwnerName { get; set; } = null!;

    public string? OwnerNationalId { get; set; }

    public bool IsOwnerOccupied { get; set; }

    public string? OwnershipType { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public decimal? PurchasePrice { get; set; }

    public bool HasMortgage { get; set; }

    public string? MortgageProvider { get; set; }

    public decimal? OutstandingLoanAmount { get; set; }

    public string OccupancyType { get; set; } = null!;

    public bool IsCommercialUse { get; set; }

    public string? CommercialUseDetails { get; set; }

    public bool HasSecuritySystem { get; set; }

    public bool HasFireAlarm { get; set; }

    public bool HasSmokeDetector { get; set; }

    public bool HasBurglarAlarm { get; set; }

    public bool HasCctv { get; set; }

    public bool HasSecurityGuard { get; set; }

    public bool HasGatedCommunity { get; set; }

    public bool HasSwimmingPool { get; set; }

    public bool HasGarden { get; set; }

    public bool HasGarage { get; set; }

    public int? NumberOfParkingSpaces { get; set; }

    public bool HasElevator { get; set; }

    public bool HasGenerator { get; set; }

    public string? FloodRiskLevel { get; set; }

    public string? EarthquakeRiskLevel { get; set; }

    public bool IsNearWater { get; set; }

    public bool IsNearForest { get; set; }

    public decimal? DistanceToFireStation { get; set; }

    public decimal? DistanceToPoliceStation { get; set; }

    public string PropertyCondition { get; set; } = null!;

    public DateTime? LastInspectionDate { get; set; }

    public DateTime? LastMaintenanceDate { get; set; }

    public string? KnownDefects { get; set; }

    public bool HasPreviousInsurance { get; set; }

    public string? PreviousInsurerName { get; set; }

    public DateTime? PreviousPolicyExpiryDate { get; set; }

    public bool HasClaimHistory { get; set; }

    public int? NumberOfClaims { get; set; }

    public decimal? TotalClaimAmount { get; set; }

    public string? ClaimHistoryDetails { get; set; }

    public string? PropertyDeedPath { get; set; }

    public string? PropertyPhotoPaths { get; set; }

    public string? InspectionReportPath { get; set; }

    public string? ValuationReportPath { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Application Application { get; set; } = null!;
}
