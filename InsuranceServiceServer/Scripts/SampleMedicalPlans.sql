-- Sample Medical Insurance Plans
-- Run this script to populate the MedicalInsurancePlans table with sample data

-- First, verify the Medical Insurance product exists and get its ID
-- Assuming ProductId = 2 for Medical Insurance (adjust if different)

-- Basic Health Plan
INSERT INTO MedicalInsurancePlans (
    ProductId, PlanName, PlanCode, Description,
    -- Coverage Limits
    AnnualCoverageLimit, LifetimeCoverageLimit, Deductible, CoPaymentPercentage, OutOfPocketMaximum, TermYears,
    -- Hospitalization
    RoomAndBoardDailyLimit, ICUDailyLimit, HospitalizationCoveragePercentage, MaxHospitalizationDays,
    -- Outpatient
    OutpatientAnnualLimit, DoctorVisitCopay, SpecialistVisitCopay, DiagnosticTestsCoveragePercentage,
    -- Medication
    PrescriptionDrugAnnualLimit, GenericDrugCopay, BrandNameDrugCopay,
    -- Additional Benefits
    IncludesMaternityBenefit, MaternityCoverageLimit,
    IncludesDentalBasic, DentalAnnualLimit,
    IncludesVisionBasic, VisionAnnualLimit,
    AnnualHealthCheckupIncluded, PreventiveCareIncluded,
    MentalHealthCoverageIncluded, MentalHealthSessionLimit,
    -- Emergency & Critical Care
    EmergencyRoomCopay, AmbulanceServiceIncluded,
    CriticalIllnessBenefit, AccidentalInjuryCoverage,
    -- Network & Restrictions
    NetworkHospitalsOnly, RequiresReferralForSpecialist, PreAuthorizationRequired,
    -- Waiting Periods
    GeneralWaitingPeriodDays, PreExistingConditionWaitingPeriodMonths, MaternityWaitingPeriodMonths,
    -- Premium
    BasePremiumMonthly, BasePremiumQuarterly, BasePremiumSemiAnnual, BasePremiumAnnual, BasePremiumLumpSum,
    -- Plan Limits
    MinAge, MaxAge, RequiresMedicalExam,
    -- Display
    DisplayOrder, IsActive, IsFeatured, IsPopular,
    -- Metadata
    CreatedAt, UpdatedAt
) VALUES (
    2, 'Basic Health Plan', 'MED-BASIC-001', 
    'Essential health coverage for individuals and families with basic hospitalization and outpatient benefits',
    -- Coverage Limits
    100000, 500000, 1000, 20, 5000, 1,
    -- Hospitalization
    500, 1500, 80, 365,
    -- Outpatient
    10000, 30, 60, 80,
    -- Medication
    5000, 10, 30,
    -- Additional Benefits
    1, 15000,
    1, 1000,
    1, 500,
    1, 1,
    1, 12,
    -- Emergency & Critical Care
    200, 1,
    25000, 50000,
    -- Network & Restrictions
    0, 0, 1,
    -- Waiting Periods
    30, 12, 9,
    -- Premium
    250, 720, 1380, 2800, 2576,
    -- Plan Limits
    18, 65, 0,
    -- Display
    1, 1, 0, 1,
    -- Metadata
    GETDATE(), GETDATE()
);

-- Standard Health Plan
INSERT INTO MedicalInsurancePlans (
    ProductId, PlanName, PlanCode, Description,
    AnnualCoverageLimit, LifetimeCoverageLimit, Deductible, CoPaymentPercentage, OutOfPocketMaximum, TermYears,
    RoomAndBoardDailyLimit, ICUDailyLimit, HospitalizationCoveragePercentage, MaxHospitalizationDays,
    OutpatientAnnualLimit, DoctorVisitCopay, SpecialistVisitCopay, DiagnosticTestsCoveragePercentage,
    PrescriptionDrugAnnualLimit, GenericDrugCopay, BrandNameDrugCopay,
    IncludesMaternityBenefit, MaternityCoverageLimit,
    IncludesDentalBasic, DentalAnnualLimit,
    IncludesVisionBasic, VisionAnnualLimit,
    AnnualHealthCheckupIncluded, PreventiveCareIncluded,
    MentalHealthCoverageIncluded, MentalHealthSessionLimit,
    EmergencyRoomCopay, AmbulanceServiceIncluded,
    CriticalIllnessBenefit, AccidentalInjuryCoverage,
    NetworkHospitalsOnly, RequiresReferralForSpecialist, PreAuthorizationRequired,
    GeneralWaitingPeriodDays, PreExistingConditionWaitingPeriodMonths, MaternityWaitingPeriodMonths,
    BasePremiumMonthly, BasePremiumQuarterly, BasePremiumSemiAnnual, BasePremiumAnnual, BasePremiumLumpSum,
    MinAge, MaxAge, RequiresMedicalExam,
    DisplayOrder, IsActive, IsFeatured, IsPopular,
    CreatedAt, UpdatedAt
) VALUES (
    2, 'Standard Health Plan', 'MED-STD-001',
    'Comprehensive health coverage with enhanced benefits and lower copays',
    -- Coverage Limits
    250000, 1000000, 500, 15, 3000, 1,
    -- Hospitalization
    800, 2500, 90, 365,
    -- Outpatient
    25000, 20, 40, 90,
    -- Medication
    10000, 5, 20,
    -- Additional Benefits
    1, 25000,
    1, 2000,
    1, 1000,
    1, 1,
    1, 20,
    -- Emergency & Critical Care
    150, 1,
    50000, 75000,
    -- Network & Restrictions
    0, 0, 1,
    -- Waiting Periods
    30, 9, 6,
    -- Premium
    450, 1296, 2484, 5040, 4636,
    -- Plan Limits
    18, 65, 0,
    -- Display
    2, 1, 1, 0,
    -- Metadata
    GETDATE(), GETDATE()
);

-- Premium Health Plan
INSERT INTO MedicalInsurancePlans (
    ProductId, PlanName, PlanCode, Description,
    AnnualCoverageLimit, LifetimeCoverageLimit, Deductible, CoPaymentPercentage, OutOfPocketMaximum, TermYears,
    RoomAndBoardDailyLimit, ICUDailyLimit, HospitalizationCoveragePercentage, MaxHospitalizationDays,
    OutpatientAnnualLimit, DoctorVisitCopay, SpecialistVisitCopay, DiagnosticTestsCoveragePercentage,
    PrescriptionDrugAnnualLimit, GenericDrugCopay, BrandNameDrugCopay,
    IncludesMaternityBenefit, MaternityCoverageLimit,
    IncludesDentalBasic, DentalAnnualLimit,
    IncludesVisionBasic, VisionAnnualLimit,
    AnnualHealthCheckupIncluded, PreventiveCareIncluded,
    MentalHealthCoverageIncluded, MentalHealthSessionLimit,
    EmergencyRoomCopay, AmbulanceServiceIncluded,
    CriticalIllnessBenefit, AccidentalInjuryCoverage,
    NetworkHospitalsOnly, RequiresReferralForSpecialist, PreAuthorizationRequired,
    GeneralWaitingPeriodDays, PreExistingConditionWaitingPeriodMonths, MaternityWaitingPeriodMonths,
    BasePremiumMonthly, BasePremiumQuarterly, BasePremiumSemiAnnual, BasePremiumAnnual, BasePremiumLumpSum,
    MinAge, MaxAge, RequiresMedicalExam,
    DisplayOrder, IsActive, IsFeatured, IsPopular,
    CreatedAt, UpdatedAt
) VALUES (
    2, 'Premium Health Plan', 'MED-PREM-001',
    'Premium health coverage with maximum benefits, minimal copays, and extensive additional coverage',
    -- Coverage Limits
    500000, NULL, 250, 10, 2000, 1,
    -- Hospitalization
    1500, 5000, 100, 365,
    -- Outpatient
    50000, 10, 20, 100,
    -- Medication
    20000, 0, 10,
    -- Additional Benefits
    1, 50000,
    1, 3000,
    1, 1500,
    1, 1,
    1, 30,
    -- Emergency & Critical Care
    100, 1,
    100000, 100000,
    -- Network & Restrictions
    0, 0, 0,
    -- Waiting Periods
    0, 6, 3,
    -- Premium
    800, 2304, 4416, 8960, 8243,
    -- Plan Limits
    18, 65, 0,
    -- Display
    3, 1, 1, 0,
    -- Metadata
    GETDATE(), GETDATE()
);

-- Family Health Plan
INSERT INTO MedicalInsurancePlans (
    ProductId, PlanName, PlanCode, Description,
    AnnualCoverageLimit, LifetimeCoverageLimit, Deductible, CoPaymentPercentage, OutOfPocketMaximum, TermYears,
    RoomAndBoardDailyLimit, ICUDailyLimit, HospitalizationCoveragePercentage, MaxHospitalizationDays,
    OutpatientAnnualLimit, DoctorVisitCopay, SpecialistVisitCopay, DiagnosticTestsCoveragePercentage,
    PrescriptionDrugAnnualLimit, GenericDrugCopay, BrandNameDrugCopay,
    IncludesMaternityBenefit, MaternityCoverageLimit,
    IncludesDentalBasic, DentalAnnualLimit,
    IncludesVisionBasic, VisionAnnualLimit,
    AnnualHealthCheckupIncluded, PreventiveCareIncluded,
    MentalHealthCoverageIncluded, MentalHealthSessionLimit,
    EmergencyRoomCopay, AmbulanceServiceIncluded,
    CriticalIllnessBenefit, AccidentalInjuryCoverage,
    NetworkHospitalsOnly, RequiresReferralForSpecialist, PreAuthorizationRequired,
    GeneralWaitingPeriodDays, PreExistingConditionWaitingPeriodMonths, MaternityWaitingPeriodMonths,
    BasePremiumMonthly, BasePremiumQuarterly, BasePremiumSemiAnnual, BasePremiumAnnual, BasePremiumLumpSum,
    MinAge, MaxAge, RequiresMedicalExam,
    DisplayOrder, IsActive, IsFeatured, IsPopular,
    CreatedAt, UpdatedAt
) VALUES (
    2, 'Family Health Plan', 'MED-FAM-001',
    'Designed for families with children, includes pediatric care and family wellness programs',
    -- Coverage Limits
    300000, 1500000, 750, 15, 4000, 1,
    -- Hospitalization
    1000, 3000, 85, 365,
    -- Outpatient
    35000, 15, 30, 85,
    -- Medication
    15000, 5, 15,
    -- Additional Benefits
    1, 35000,
    1, 2500,
    1, 1200,
    1, 1,
    1, 25,
    -- Emergency & Critical Care
    125, 1,
    75000, 80000,
    -- Network & Restrictions
    0, 0, 1,
    -- Waiting Periods
    30, 9, 6,
    -- Premium
    650, 1872, 3588, 7280, 6697,
    -- Plan Limits
    0, 70, 0,
    -- Display
    4, 1, 0, 1,
    -- Metadata
    GETDATE(), GETDATE()
);

-- Verify the inserts
SELECT 
    Id, PlanName, PlanCode, 
    AnnualCoverageLimit, Deductible, 
    BasePremiumMonthly, BasePremiumAnnual,
    IsActive, IsPopular
FROM MedicalInsurancePlans
ORDER BY DisplayOrder;
