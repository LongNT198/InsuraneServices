using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InsuranceServiceServer.Features.Customer.Controllers;

[ApiController]
[Route("api/customer/[controller]")]
[Authorize]
public class HealthDeclarationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<HealthDeclarationController> _logger;

    public HealthDeclarationController(AppDbContext context, ILogger<HealthDeclarationController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Save or update health declaration for current user
    /// </summary>
    [HttpPost("save")]
    public async Task<IActionResult> SaveHealthDeclaration([FromBody] HealthDeclarationDto request)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Check if user already has a health declaration
            var existingDeclaration = await _context.HealthDeclarations
                .FirstOrDefaultAsync(h => h.CustomerProfileId == userId);

            if (existingDeclaration != null)
            {
                // Update existing declaration
                UpdateHealthDeclaration(existingDeclaration, request);
                
                _context.HealthDeclarations.Update(existingDeclaration);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Health declaration updated for user {UserId}", userId);

                return Ok(new 
                { 
                    success = true, 
                    message = "Health declaration updated successfully",
                    id = existingDeclaration.Id
                });
            }
            else
            {
                // Create new declaration
                var healthDeclaration = new HealthDeclaration
                {
                    CustomerProfileId = userId
                };

                UpdateHealthDeclaration(healthDeclaration, request);

                _context.HealthDeclarations.Add(healthDeclaration);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Health declaration created for user {UserId}", userId);

                return Ok(new 
                { 
                    success = true, 
                    message = "Health declaration saved successfully",
                    id = healthDeclaration.Id
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving health declaration");
            return StatusCode(500, new { success = false, message = "Failed to save health declaration" });
        }
    }

    /// <summary>
    /// Get health declaration for current user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetHealthDeclaration()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var healthDeclaration = await _context.HealthDeclarations
                .FirstOrDefaultAsync(h => h.CustomerProfileId == userId);

            if (healthDeclaration == null)
            {
                return NotFound(new { success = false, message = "Health declaration not found" });
            }

            var dto = MapToDto(healthDeclaration);

            return Ok(new { success = true, data = dto });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving health declaration");
            return StatusCode(500, new { success = false, message = "Failed to retrieve health declaration" });
        }
    }

    /// <summary>
    /// Delete health declaration for current user
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> DeleteHealthDeclaration()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var healthDeclaration = await _context.HealthDeclarations
                .FirstOrDefaultAsync(h => h.CustomerProfileId == userId);

            if (healthDeclaration == null)
            {
                return NotFound(new { success = false, message = "Health declaration not found" });
            }

            _context.HealthDeclarations.Remove(healthDeclaration);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Health declaration deleted for user {UserId}", userId);

            return Ok(new { success = true, message = "Health declaration deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting health declaration");
            return StatusCode(500, new { success = false, message = "Failed to delete health declaration" });
        }
    }

    private void UpdateHealthDeclaration(HealthDeclaration entity, HealthDeclarationDto dto)
    {
        // Vital Statistics - Convert string to appropriate types
        entity.Height = decimal.TryParse(dto.Height, out var h) ? h : 0;
        entity.Weight = decimal.TryParse(dto.Weight, out var w) ? w : 0;
        
        // Calculate BMI if not provided
        if (entity.Height > 0 && entity.Weight > 0)
        {
            var heightInMeters = entity.Height / 100;
            entity.BMI = entity.Weight / (heightInMeters * heightInMeters);
        }

        entity.BloodPressureSystolic = int.TryParse(dto.BloodPressureSystolic, out var sys) ? sys : null;
        entity.BloodPressureDiastolic = int.TryParse(dto.BloodPressureDiastolic, out var dia) ? dia : null;
        entity.CholesterolLevel = int.TryParse(dto.CholesterolLevel, out var chol) ? chol : null;
        entity.RestingHeartRate = int.TryParse(dto.RestingHeartRate, out var hr) ? hr : null;

        // Basic Medical History - Serialize lists to JSON
        entity.MedicalConditionsJson = dto.MedicalConditions != null && dto.MedicalConditions.Any() 
            ? System.Text.Json.JsonSerializer.Serialize(dto.MedicalConditions) 
            : null;
        entity.MedicalConditionDetailsJson = dto.MedicalConditionDetails != null && dto.MedicalConditionDetails.Any()
            ? System.Text.Json.JsonSerializer.Serialize(dto.MedicalConditionDetails)
            : null;
        entity.CurrentMedicationsJson = dto.Medications != null && dto.Medications.Any()
            ? System.Text.Json.JsonSerializer.Serialize(dto.Medications)
            : null;
        entity.HasRecentHospitalization = dto.HasHospitalization;
        entity.HospitalizationHistory = dto.HospitalizationHistory;

        // Lifestyle & Habits
        entity.SmokingStatus = dto.SmokingStatus ?? "non-smoker";
        entity.IsSmoker = dto.IsSmoker;
        entity.SmokingPacksPerDay = int.TryParse(dto.SmokingPacksPerDay, out var packs) ? packs : null;
        entity.SmokingYears = int.TryParse(dto.SmokingYears, out var years) ? years : null;
        
        entity.AlcoholConsumptionLevel = dto.AlcoholConsumption ?? "none";
        entity.IsDrinker = !string.IsNullOrEmpty(dto.AlcoholConsumption) && dto.AlcoholConsumption != "None" && dto.AlcoholConsumption != "none";
        entity.AlcoholUnitsPerWeek = int.TryParse(dto.AlcoholUnitsPerWeek, out var units) ? units : null;
        
        entity.UsesDrugs = dto.UsesDrugs;
        entity.DrugDetails = dto.DrugDetails;

        entity.ExerciseLevel = dto.ExerciseLevel ?? "moderate";
        entity.IsExercising = !string.IsNullOrEmpty(dto.ExerciseLevel) && dto.ExerciseLevel != "sedentary";
        entity.ExerciseHoursPerWeek = int.TryParse(dto.ExerciseHoursPerWeek, out var exHr) ? exHr : null;
        
        entity.SleepQuality = dto.SleepQuality ?? "good";
        entity.AverageSleepHours = decimal.TryParse(dto.AverageSleepHours, out var sleep) ? sleep : null;
        
        entity.StressLevel = dto.StressLevel ?? "moderate";
        entity.DietQuality = dto.DietQuality ?? "balanced";

        // Specific Diseases - Convert date strings to DateTime
        entity.HasHeartDisease = dto.HasHeartDisease;
        if (!string.IsNullOrEmpty(dto.HeartDiseaseDiagnosisDate) && DateTime.TryParse(dto.HeartDiseaseDiagnosisDate, out var heartDate))
            entity.HeartDiseaseDiagnosisDate = heartDate;
        entity.HeartDiseaseTreatmentStatus = dto.HeartDiseaseTreatmentStatus;

        entity.HasStroke = dto.HasStroke;
        if (!string.IsNullOrEmpty(dto.StrokeDiagnosisDate) && DateTime.TryParse(dto.StrokeDiagnosisDate, out var strokeDate))
            entity.StrokeDiagnosisDate = strokeDate;
        entity.StrokeTreatmentStatus = dto.StrokeTreatmentStatus;

        entity.HasCancer = dto.HasCancer;
        entity.CancerDetails = dto.CancerDetails;
        if (!string.IsNullOrEmpty(dto.CancerDiagnosisDate) && DateTime.TryParse(dto.CancerDiagnosisDate, out var cancerDate))
            entity.CancerDiagnosisDate = cancerDate;
        entity.CancerTreatmentStatus = dto.CancerTreatmentStatus;

        entity.HasDiabetes = dto.HasDiabetes;
        entity.DiabetesType = dto.DiabetesType;
        if (!string.IsNullOrEmpty(dto.DiabetesDiagnosisDate) && DateTime.TryParse(dto.DiabetesDiagnosisDate, out var diabetesDate))
            entity.DiabetesDiagnosisDate = diabetesDate;
        entity.DiabetesTreatmentStatus = dto.DiabetesTreatmentStatus;
        entity.DiabetesHbA1c = decimal.TryParse(dto.DiabetesHbA1c, out var hba1c) ? hba1c : null;

        entity.HasHighBloodPressure = dto.HasHighBloodPressure;
        if (!string.IsNullOrEmpty(dto.HighBloodPressureDiagnosisDate) && DateTime.TryParse(dto.HighBloodPressureDiagnosisDate, out var bpDate))
            entity.HighBloodPressureDiagnosisDate = bpDate;
        entity.HighBloodPressureTreatmentStatus = dto.HighBloodPressureTreatmentStatus;

        entity.HasHighCholesterol = dto.HasHighCholesterol;
        if (!string.IsNullOrEmpty(dto.HighCholesterolDiagnosisDate) && DateTime.TryParse(dto.HighCholesterolDiagnosisDate, out var cholDate))
            entity.HighCholesterolDiagnosisDate = cholDate;
        entity.HighCholesterolTreatmentStatus = dto.HighCholesterolTreatmentStatus;

        entity.HasKidneyDisease = dto.HasKidneyDisease;
        if (!string.IsNullOrEmpty(dto.KidneyDiseaseDiagnosisDate) && DateTime.TryParse(dto.KidneyDiseaseDiagnosisDate, out var kidneyDate))
            entity.KidneyDiseaseDiagnosisDate = kidneyDate;
        entity.KidneyDiseaseTreatmentStatus = dto.KidneyDiseaseTreatmentStatus;

        entity.HasLiverDisease = dto.HasLiverDisease;
        if (!string.IsNullOrEmpty(dto.LiverDiseaseDiagnosisDate) && DateTime.TryParse(dto.LiverDiseaseDiagnosisDate, out var liverDate))
            entity.LiverDiseaseDiagnosisDate = liverDate;
        entity.LiverDiseaseTreatmentStatus = dto.LiverDiseaseTreatmentStatus;

        entity.HasMentalHealthCondition = dto.HasMentalHealthCondition;
        entity.MentalHealthDetails = dto.MentalHealthDetails;
        if (!string.IsNullOrEmpty(dto.MentalHealthDiagnosisDate) && DateTime.TryParse(dto.MentalHealthDiagnosisDate, out var mentalDate))
            entity.MentalHealthDiagnosisDate = mentalDate;
        entity.MentalHealthTreatmentStatus = dto.MentalHealthTreatmentStatus;

        entity.HasHIV = dto.HasHIV;
        if (!string.IsNullOrEmpty(dto.HIVDiagnosisDate) && DateTime.TryParse(dto.HIVDiagnosisDate, out var hivDate))
            entity.HIVDiagnosisDate = hivDate;
        entity.HIVTreatmentStatus = dto.HIVTreatmentStatus;

        // Recent Medical Events
        if (!string.IsNullOrEmpty(dto.LastMedicalCheckupDate) && DateTime.TryParse(dto.LastMedicalCheckupDate, out var checkupDate))
            entity.LastMedicalCheckupDate = checkupDate;
        entity.HasSurgeryLast5Years = dto.HasSurgeryLast5Years;
        entity.SurgeryDetails = dto.SurgeryDetails;
        entity.HasPendingMedicalTests = dto.HasPendingMedicalTests;
        entity.PendingTestsDetails = dto.PendingTestsDetails;
        entity.HasPlannedProcedures = dto.HasPlannedProcedures;
        entity.PlannedProceduresDetails = dto.PlannedProceduresDetails;

        // Family Medical History
        entity.FamilyHeartDisease = dto.FamilyHeartDisease;
        entity.FamilyCancer = dto.FamilyCancer;
        entity.FamilyDiabetes = dto.FamilyDiabetes;
        entity.FamilyStroke = dto.FamilyStroke;
        entity.FamilyOtherConditions = dto.FamilyOtherConditions;
        
        entity.FatherDeceased = dto.FatherDeceased;
        entity.FatherAgeAtDeath = int.TryParse(dto.FatherAgeAtDeath, out var fAge) ? fAge : null;
        entity.FatherCauseOfDeath = dto.FatherCauseOfDeath;
        
        entity.MotherDeceased = dto.MotherDeceased;
        entity.MotherAgeAtDeath = int.TryParse(dto.MotherAgeAtDeath, out var mAge) ? mAge : null;
        entity.MotherCauseOfDeath = dto.MotherCauseOfDeath;

        // Occupation & Activities
        entity.Occupation = dto.Occupation;
        entity.HasOccupationalHazards = dto.HasOccupationalHazards;
        entity.OccupationHazardsDetails = dto.OccupationHazardsDetails;
        entity.ParticipatesInDangerousSports = dto.ParticipatesInDangerousSports;
        entity.DangerousSportsDetails = dto.DangerousSportsDetails;

        // Pregnancy
        entity.IsPregnant = dto.IsPregnant;
        if (!string.IsNullOrEmpty(dto.PregnancyDueDate) && DateTime.TryParse(dto.PregnancyDueDate, out var pregDate))
            entity.PregnancyDueDate = pregDate;
        entity.HasPregnancyComplications = dto.HasPregnancyComplications;
        entity.PregnancyComplicationDetails = dto.PregnancyComplicationDetails;

        // Disability & Life Expectancy
        entity.HasDisability = dto.HasDisability;
        entity.DisabilityDetails = dto.DisabilityDetails;
        entity.HasLifeThreateningCondition = dto.HasLifeThreateningCondition;
        entity.LifeThreateningConditionDetails = dto.LifeThreateningConditionDetails;

        // Consent
        entity.MedicalRecordsConsent = dto.MedicalRecordsConsent;
    }

    private HealthDeclarationDto MapToDto(HealthDeclaration entity)
    {
        // Deserialize medical conditions and medications
        var medicalConditions = !string.IsNullOrEmpty(entity.MedicalConditionsJson)
            ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(entity.MedicalConditionsJson) ?? new List<string>()
            : new List<string>();
        var medications = !string.IsNullOrEmpty(entity.CurrentMedicationsJson)
            ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(entity.CurrentMedicationsJson) ?? new List<string>()
            : new List<string>();
            
        return new HealthDeclarationDto
        {
            // Medical History - Deserialize JSON arrays
            MedicalConditions = medicalConditions,
            MedicalConditionDetails = !string.IsNullOrEmpty(entity.MedicalConditionDetailsJson)
                ? System.Text.Json.JsonSerializer.Deserialize<List<MedicalConditionDetail>>(entity.MedicalConditionDetailsJson) ?? new List<MedicalConditionDetail>()
                : new List<MedicalConditionDetail>(),
            Medications = medications,
            // Computed fields based on arrays
            HasMedicalConditions = medicalConditions.Any(),
            IsOnMedication = medications.Any(),
            HasHospitalization = entity.HasRecentHospitalization,
            HospitalizationHistory = entity.HospitalizationHistory,

            // Vital Statistics - Convert to strings
            Height = entity.Height.ToString(),
            Weight = entity.Weight.ToString(),
            BloodPressureSystolic = entity.BloodPressureSystolic?.ToString(),
            BloodPressureDiastolic = entity.BloodPressureDiastolic?.ToString(),
            CholesterolLevel = entity.CholesterolLevel?.ToString(),
            RestingHeartRate = entity.RestingHeartRate?.ToString(),

            // Lifestyle
            SmokingStatus = entity.SmokingStatus,
            IsSmoker = entity.IsSmoker,
            SmokingPacksPerDay = entity.SmokingPacksPerDay?.ToString(),
            SmokingYears = entity.SmokingYears?.ToString(),
            AlcoholConsumption = entity.AlcoholConsumptionLevel,
            AlcoholUnitsPerWeek = entity.AlcoholUnitsPerWeek?.ToString(),
            UsesDrugs = entity.UsesDrugs,
            DrugDetails = entity.DrugDetails,
            ExerciseLevel = entity.ExerciseLevel,
            ExerciseHoursPerWeek = entity.ExerciseHoursPerWeek?.ToString(),
            SleepQuality = entity.SleepQuality,
            AverageSleepHours = entity.AverageSleepHours?.ToString(),
            StressLevel = entity.StressLevel,
            DietQuality = entity.DietQuality,

            // Diseases - Convert dates to strings
            HasHeartDisease = entity.HasHeartDisease,
            HeartDiseaseDiagnosisDate = entity.HeartDiseaseDiagnosisDate?.ToString("yyyy-MM-dd"),
            HeartDiseaseTreatmentStatus = entity.HeartDiseaseTreatmentStatus,
            HasStroke = entity.HasStroke,
            StrokeDiagnosisDate = entity.StrokeDiagnosisDate?.ToString("yyyy-MM-dd"),
            StrokeTreatmentStatus = entity.StrokeTreatmentStatus,
            HasCancer = entity.HasCancer,
            CancerDetails = entity.CancerDetails,
            CancerDiagnosisDate = entity.CancerDiagnosisDate?.ToString("yyyy-MM-dd"),
            CancerTreatmentStatus = entity.CancerTreatmentStatus,
            HasDiabetes = entity.HasDiabetes,
            DiabetesType = entity.DiabetesType,
            DiabetesDiagnosisDate = entity.DiabetesDiagnosisDate?.ToString("yyyy-MM-dd"),
            DiabetesTreatmentStatus = entity.DiabetesTreatmentStatus,
            DiabetesHbA1c = entity.DiabetesHbA1c?.ToString(),
            HasHighBloodPressure = entity.HasHighBloodPressure,
            HighBloodPressureDiagnosisDate = entity.HighBloodPressureDiagnosisDate?.ToString("yyyy-MM-dd"),
            HighBloodPressureTreatmentStatus = entity.HighBloodPressureTreatmentStatus,
            HasHighCholesterol = entity.HasHighCholesterol,
            HighCholesterolDiagnosisDate = entity.HighCholesterolDiagnosisDate?.ToString("yyyy-MM-dd"),
            HighCholesterolTreatmentStatus = entity.HighCholesterolTreatmentStatus,
            HasKidneyDisease = entity.HasKidneyDisease,
            KidneyDiseaseDiagnosisDate = entity.KidneyDiseaseDiagnosisDate?.ToString("yyyy-MM-dd"),
            KidneyDiseaseTreatmentStatus = entity.KidneyDiseaseTreatmentStatus,
            HasLiverDisease = entity.HasLiverDisease,
            LiverDiseaseDiagnosisDate = entity.LiverDiseaseDiagnosisDate?.ToString("yyyy-MM-dd"),
            LiverDiseaseTreatmentStatus = entity.LiverDiseaseTreatmentStatus,
            HasMentalHealthCondition = entity.HasMentalHealthCondition,
            MentalHealthDetails = entity.MentalHealthDetails,
            MentalHealthDiagnosisDate = entity.MentalHealthDiagnosisDate?.ToString("yyyy-MM-dd"),
            MentalHealthTreatmentStatus = entity.MentalHealthTreatmentStatus,
            HasHIV = entity.HasHIV,
            HIVDiagnosisDate = entity.HIVDiagnosisDate?.ToString("yyyy-MM-dd"),
            HIVTreatmentStatus = entity.HIVTreatmentStatus,

            // Medical Events
            LastMedicalCheckupDate = entity.LastMedicalCheckupDate?.ToString("yyyy-MM-dd"),
            HasSurgeryLast5Years = entity.HasSurgeryLast5Years,
            SurgeryDetails = entity.SurgeryDetails,
            HasPendingMedicalTests = entity.HasPendingMedicalTests,
            PendingTestsDetails = entity.PendingTestsDetails,
            HasPlannedProcedures = entity.HasPlannedProcedures,
            PlannedProceduresDetails = entity.PlannedProceduresDetails,

            // Family History
            FamilyHeartDisease = entity.FamilyHeartDisease,
            FamilyCancer = entity.FamilyCancer,
            FamilyDiabetes = entity.FamilyDiabetes,
            FamilyStroke = entity.FamilyStroke,
            FamilyOtherConditions = entity.FamilyOtherConditions,
            FatherDeceased = entity.FatherDeceased,
            FatherAgeAtDeath = entity.FatherAgeAtDeath?.ToString(),
            FatherCauseOfDeath = entity.FatherCauseOfDeath,
            MotherDeceased = entity.MotherDeceased,
            MotherAgeAtDeath = entity.MotherAgeAtDeath?.ToString(),
            MotherCauseOfDeath = entity.MotherCauseOfDeath,

            // Occupation
            Occupation = entity.Occupation,
            HasOccupationalHazards = entity.HasOccupationalHazards,
            OccupationHazardsDetails = entity.OccupationHazardsDetails,
            ParticipatesInDangerousSports = entity.ParticipatesInDangerousSports,
            DangerousSportsDetails = entity.DangerousSportsDetails,

            // Pregnancy
            IsPregnant = entity.IsPregnant,
            PregnancyDueDate = entity.PregnancyDueDate?.ToString("yyyy-MM-dd"),
            HasPregnancyComplications = entity.HasPregnancyComplications,
            PregnancyComplicationDetails = entity.PregnancyComplicationDetails,

            // Disability
            HasDisability = entity.HasDisability,
            DisabilityDetails = entity.DisabilityDetails,
            HasLifeThreateningCondition = entity.HasLifeThreateningCondition,
            LifeThreateningConditionDetails = entity.LifeThreateningConditionDetails,

            // Consent
            MedicalRecordsConsent = entity.MedicalRecordsConsent
        };
    }
}
