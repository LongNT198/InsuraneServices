using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class TravelInfo
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }

    public string TripType { get; set; } = null!;

    public string Destination { get; set; } = null!;

    public string? DestinationDetails { get; set; }

    public DateTime DepartureDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public int TripDuration { get; set; }

    public string TravelPurpose { get; set; } = null!;

    public string? PurposeDetails { get; set; }

    public int NumberOfTravelers { get; set; }

    public string? TravelersDetails { get; set; }

    public bool IncludesChildren { get; set; }

    public int? NumberOfChildren { get; set; }

    public bool IncludesElderly { get; set; }

    public bool IncludesPregnantTraveler { get; set; }

    public int? PregnancyWeeks { get; set; }

    public string? RiskLevel { get; set; }

    public bool IncludesAdventureSports { get; set; }

    public string? PlannedActivities { get; set; }

    public bool IncludesWaterSports { get; set; }

    public bool IncludesWinterSports { get; set; }

    public bool IncludesExtremeSports { get; set; }

    public bool IncludesMountainClimbing { get; set; }

    public string PrimaryTransport { get; set; } = null!;

    public string? FlightDetails { get; set; }

    public bool IncludesCarRental { get; set; }

    public bool IncludesCruise { get; set; }

    public string? AccommodationType { get; set; }

    public decimal? AccommodationCost { get; set; }

    public bool IsPrePaid { get; set; }

    public bool HasPreExistingConditions { get; set; }

    public string? PreExistingConditionsDetails { get; set; }

    public bool RequiresMedication { get; set; }

    public bool HasTravelVaccinations { get; set; }

    public string? VaccinationDetails { get; set; }

    public bool VisitingHighRiskRegion { get; set; }

    public string? HighRiskRegionDetails { get; set; }

    public decimal MedicalCoverageAmount { get; set; }

    public decimal? TripCancellationCoverage { get; set; }

    public decimal? LuggageCoverage { get; set; }

    public decimal? PersonalLiabilityCoverage { get; set; }

    public bool IncludesEmergencyEvacuation { get; set; }

    public bool IncludesTripDelay { get; set; }

    public bool IncludesMissedConnection { get; set; }

    public decimal? TotalTripCost { get; set; }

    public decimal? NonRefundableDeposit { get; set; }

    public DateTime? FirstDepositDate { get; set; }

    public bool HasTravelInsuranceHistory { get; set; }

    public bool HasPreviousClaims { get; set; }

    public int? NumberOfPreviousClaims { get; set; }

    public decimal? PreviousClaimAmount { get; set; }

    public string? ClaimHistoryDetails { get; set; }

    public string EmergencyContactName { get; set; } = null!;

    public string EmergencyContactPhone { get; set; } = null!;

    public string EmergencyContactRelationship { get; set; } = null!;

    public string? SecondaryEmergencyContactName { get; set; }

    public string? SecondaryEmergencyContactPhone { get; set; }

    public string? DestinationRiskLevel { get; set; }

    public bool HasTravelAdvisory { get; set; }

    public string? TravelAdvisoryDetails { get; set; }

    public bool RequiresVisa { get; set; }

    public bool VisaObtained { get; set; }

    public string? PassportCopyPath { get; set; }

    public string? VisaCopyPath { get; set; }

    public string? FlightTicketPath { get; set; }

    public string? HotelBookingPath { get; set; }

    public string? ItineraryPath { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Application Application { get; set; } = null!;
}
