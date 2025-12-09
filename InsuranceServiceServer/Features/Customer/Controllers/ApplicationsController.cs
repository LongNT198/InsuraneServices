using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Shared.DTOs;
using InsuranceServiceServer.Shared.Services;
using InsuranceServiceServer.Models.Insurance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace InsuranceServiceServer.Features.Customer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ApplicationsController> _logger;
    private readonly IEmailService _emailService;

    public ApplicationsController(AppDbContext context, ILogger<ApplicationsController> logger, IEmailService emailService)
    {
        _context = context;
        _logger = logger;
        _emailService = emailService;
    }

    /// <summary>
    /// Generate unique application number in format: APP-YYYYMMDD-XXXXX
    /// </summary>
    private async Task<string> GenerateApplicationNumberAsync()
    {
        var today = DateTime.UtcNow.Date;
        var datePrefix = today.ToString("yyyyMMdd");
        var applicationPrefix = $"APP-{datePrefix}-";

        // Get count of applications created today
        var todayApplicationsCount = await _context.Applications
            .Where(a => a.CreatedAt.Date == today)
            .CountAsync();

        // Generate sequence number (1-based, padded to 5 digits)
        var sequenceNumber = (todayApplicationsCount + 1).ToString("D5");

        return applicationPrefix + sequenceNumber;
    }

    /// <summary>
    /// Save beneficiaries to normalized Beneficiaries table
    /// This ensures all beneficiary data is properly structured and queryable
    /// </summary>
    private List<string> ValidateBeneficiaries(List<BeneficiaryDto> beneficiaries)
    {
        var errors = new List<string>();

        if (beneficiaries == null || !beneficiaries.Any())
        {
            errors.Add("At least one beneficiary is required.");
            return errors;
        }

        // Validate total percentage equals 100%
        var totalPercentage = beneficiaries.Sum(b => b.Percentage);
        if (Math.Abs(totalPercentage - 100) >= 0.01m)
        {
            errors.Add($"Total allocation must equal 100% (currently {totalPercentage:F2}%).");
        }

        for (int i = 0; i < beneficiaries.Count; i++)
        {
            var ben = beneficiaries[i];
            var benNumber = i + 1;

            // Required fields
            if (string.IsNullOrWhiteSpace(ben.Type))
                errors.Add($"Beneficiary {benNumber}: Type is required.");
            
            if (string.IsNullOrWhiteSpace(ben.FullName))
                errors.Add($"Beneficiary {benNumber}: Full Name is required.");
            
            if (string.IsNullOrWhiteSpace(ben.Relationship))
                errors.Add($"Beneficiary {benNumber}: Relationship is required.");
            
            if (string.IsNullOrWhiteSpace(ben.DateOfBirth))
                errors.Add($"Beneficiary {benNumber}: Date of Birth is required.");
            
            if (string.IsNullOrWhiteSpace(ben.Gender))
                errors.Add($"Beneficiary {benNumber}: Gender is required.");
            
            if (string.IsNullOrWhiteSpace(ben.Email))
                errors.Add($"Beneficiary {benNumber}: Email is required.");
            
            if (string.IsNullOrWhiteSpace(ben.Phone))
                errors.Add($"Beneficiary {benNumber}: Phone Number is required.");

            // Percentage validation
            if (ben.Percentage < 0 || ben.Percentage > 100)
                errors.Add($"Beneficiary {benNumber}: Allocation must be between 0 and 100.");

            // Trustee validation for minors
            if (ben.IsMinor)
            {
                if (string.IsNullOrWhiteSpace(ben.Trustee))
                    errors.Add($"Beneficiary {benNumber}: Trustee Name is required for minor beneficiaries.");
                
                if (string.IsNullOrWhiteSpace(ben.TrusteeRelationship))
                    errors.Add($"Beneficiary {benNumber}: Trustee Relationship is required for minor beneficiaries.");
            }
        }

        return errors;
    }

    private async Task SaveBeneficiariesAsync(int applicationId, List<BeneficiaryDto> beneficiaries)
    {
        if (beneficiaries == null || !beneficiaries.Any())
        {
            _logger.LogWarning("No beneficiaries provided for application {ApplicationId}", applicationId);
            return;
        }

        foreach (var dto in beneficiaries)
        {
            // Parse date of birth safely
            DateTime? dateOfBirth = null;
            if (!string.IsNullOrEmpty(dto.DateOfBirth))
            {
                if (DateTime.TryParse(dto.DateOfBirth, out var parsedDate))
                {
                    dateOfBirth = parsedDate;
                }
                else
                {
                    _logger.LogWarning("Invalid date format for beneficiary {Name}: {Date}", 
                        dto.FullName, dto.DateOfBirth);
                }
            }

            var beneficiary = new InsuranceServiceServer.Features.Customer.Models.Beneficiary
            {
                ApplicationId = applicationId,
                Type = dto.Type ?? "Primary",
                FullName = dto.FullName ?? string.Empty,
                Relationship = dto.Relationship ?? string.Empty,
                RelationshipOther = dto.RelationshipOther, // Map Other field
                DateOfBirth = dateOfBirth ?? DateTime.MinValue,
                Gender = dto.Gender ?? string.Empty,
                NationalId = dto.NationalId,
                SSN = dto.SSN,
                Phone = dto.Phone ?? string.Empty,
                Email = dto.Email ?? string.Empty,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                PostalCode = dto.PostalCode,
                Percentage = dto.Percentage,
                IsMinor = dto.IsMinor,
                Trustee = dto.Trustee,
                TrusteeRelationship = dto.TrusteeRelationship,
                TrusteeRelationshipOther = dto.TrusteeRelationshipOther, // Map Other field
                PerStirpes = dto.PerStirpes,
                IsIrrevocable = dto.IsIrrevocable,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Beneficiaries.Add(beneficiary);

            _logger.LogInformation("Adding beneficiary {Name} ({Type}) for application {ApplicationId}", 
                dto.FullName, dto.Type, applicationId);
        }

        await _context.SaveChangesAsync();
        
        _logger.LogInformation("✅ Successfully saved {Count} beneficiaries for application {ApplicationId}", 
            beneficiaries.Count, applicationId);
    }

    private async Task<int?> SaveHealthDeclarationAsync(string userId, HealthDeclarationDto dto)
    {
        if (dto == null) return null;

        var hd = new InsuranceServiceServer.Features.Customer.Models.HealthDeclaration
        {
            CustomerProfileId = userId,
            
            // Vital Statistics
            Height = decimal.TryParse(dto.Height, out var h) ? h : 0,
            Weight = decimal.TryParse(dto.Weight, out var w) ? w : 0,
            BMI = 0, // Calculate if needed
            BloodPressureSystolic = int.TryParse(dto.BloodPressureSystolic, out var sys) ? sys : null,
            BloodPressureDiastolic = int.TryParse(dto.BloodPressureDiastolic, out var dia) ? dia : null,
            CholesterolLevel = int.TryParse(dto.CholesterolLevel, out var chol) ? chol : null,
            RestingHeartRate = int.TryParse(dto.RestingHeartRate, out var hr) ? hr : null,
            
            // Lifestyle
            SmokingStatus = dto.SmokingStatus,
            IsSmoker = dto.IsSmoker,
            SmokingPacksPerDay = int.TryParse(dto.SmokingPacksPerDay, out var packs) ? packs : null,
            SmokingYears = int.TryParse(dto.SmokingYears, out var years) ? years : null,
            AlcoholConsumptionLevel = dto.AlcoholConsumptionLevel,
            AlcoholUnitsPerWeek = int.TryParse(dto.AlcoholUnitsPerWeek, out var units) ? units : null,
            UsesDrugs = dto.UsesDrugs,
            DrugDetails = dto.DrugDetails,
            ExerciseLevel = dto.ExerciseLevel,
            ExerciseHoursPerWeek = int.TryParse(dto.ExerciseHoursPerWeek, out var exHr) ? exHr : null,
            SleepQuality = dto.SleepQuality,
            AverageSleepHours = decimal.TryParse(dto.AverageSleepHours, out var sleep) ? sleep : null,
            StressLevel = dto.StressLevel,
            DietQuality = dto.DietQuality,
            
            // Diseases
            HasHeartDisease = dto.HasHeartDisease,
            HeartDiseaseDiagnosisDate = DateTime.TryParse(dto.HeartDiseaseDiagnosisDate, out var hdDate) ? hdDate : null,
            HeartDiseaseTreatmentStatus = dto.HeartDiseaseTreatmentStatus,
            HasStroke = dto.HasStroke,
            StrokeDiagnosisDate = DateTime.TryParse(dto.StrokeDiagnosisDate, out var sDate) ? sDate : null,
            StrokeTreatmentStatus = dto.StrokeTreatmentStatus,
            HasCancer = dto.HasCancer,
            CancerDetails = dto.CancerDetails,
            CancerDiagnosisDate = DateTime.TryParse(dto.CancerDiagnosisDate, out var cDate) ? cDate : null,
            CancerTreatmentStatus = dto.CancerTreatmentStatus,
            HasDiabetes = dto.HasDiabetes,
            DiabetesType = dto.DiabetesType,
            DiabetesDiagnosisDate = DateTime.TryParse(dto.DiabetesDiagnosisDate, out var dDate) ? dDate : null,
            DiabetesTreatmentStatus = dto.DiabetesTreatmentStatus,
            DiabetesHbA1c = decimal.TryParse(dto.DiabetesHbA1c, out var hba1c) ? hba1c : null,
            HasHypertension = dto.HasHighBloodPressure,
            HasHighBloodPressure = dto.HasHighBloodPressure,
            HighBloodPressureDiagnosisDate = DateTime.TryParse(dto.HighBloodPressureDiagnosisDate, out var hbpDate) ? hbpDate : null,
            HighBloodPressureTreatmentStatus = dto.HighBloodPressureTreatmentStatus,
            HasHighCholesterol = dto.HasHighCholesterol,
            HighCholesterolDiagnosisDate = DateTime.TryParse(dto.HighCholesterolDiagnosisDate, out var hcDate) ? hcDate : null,
            HighCholesterolTreatmentStatus = dto.HighCholesterolTreatmentStatus,
            HasKidneyDisease = dto.HasKidneyDisease,
            KidneyDiseaseDiagnosisDate = DateTime.TryParse(dto.KidneyDiseaseDiagnosisDate, out var kdDate) ? kdDate : null,
            KidneyDiseaseTreatmentStatus = dto.KidneyDiseaseTreatmentStatus,
            HasLiverDisease = dto.HasLiverDisease,
            LiverDiseaseDiagnosisDate = DateTime.TryParse(dto.LiverDiseaseDiagnosisDate, out var ldDate) ? ldDate : null,
            LiverDiseaseTreatmentStatus = dto.LiverDiseaseTreatmentStatus,
            HasMentalIllness = dto.HasMentalHealthCondition,
            HasMentalHealthCondition = dto.HasMentalHealthCondition,
            MentalHealthDetails = dto.MentalHealthDetails,
            MentalHealthDiagnosisDate = DateTime.TryParse(dto.MentalHealthDiagnosisDate, out var mhDate) ? mhDate : null,
            MentalHealthTreatmentStatus = dto.MentalHealthTreatmentStatus,
            HasHIV = dto.HasHIV,
            HIVDiagnosisDate = DateTime.TryParse(dto.HIVDiagnosisDate, out var hivDate) ? hivDate : null,
            HIVTreatmentStatus = dto.HIVTreatmentStatus,
            LastMedicalCheckupDate = DateTime.TryParse(dto.LastMedicalCheckupDate, out var lmcDate) ? lmcDate : null,
            
            // Medical History JSON
            MedicalConditionsJson = dto.MedicalConditions?.Any() == true ? JsonSerializer.Serialize(dto.MedicalConditions) : null,
            MedicalConditionDetailsJson = dto.MedicalConditionDetails?.Any() == true ? JsonSerializer.Serialize(dto.MedicalConditionDetails) : null,
            CurrentMedicationsJson = dto.Medications?.Any() == true ? JsonSerializer.Serialize(dto.Medications) : null,
            
            // Recent Medical Events
            HospitalizationHistory = dto.HospitalizationHistory,
            HasSurgeryLast5Years = dto.HasSurgeryLast5Years,
            SurgeryDetails = dto.SurgeryDetails,
            HasPendingMedicalTests = dto.HasPendingMedicalTests,
            PendingTestsDetails = dto.PendingTestsDetails,
            HasPlannedProcedures = dto.HasPlannedProcedures,
            PlannedProceduresDetails = dto.PlannedProceduresDetails,
            
            // Family History
            FamilyHeartDisease = dto.FamilyHeartDisease,
            FamilyCancer = dto.FamilyCancer,
            FamilyDiabetes = dto.FamilyDiabetes,
            FamilyStroke = dto.FamilyStroke,
            FamilyOtherConditions = dto.FamilyOtherConditions,
            FatherDeceased = dto.FatherDeceased,
            FatherAgeAtDeath = int.TryParse(dto.FatherAgeAtDeath, out var fAge) ? fAge : null,
            FatherCauseOfDeath = dto.FatherCauseOfDeath,
            MotherDeceased = dto.MotherDeceased,
            MotherAgeAtDeath = int.TryParse(dto.MotherAgeAtDeath, out var mAge) ? mAge : null,
            MotherCauseOfDeath = dto.MotherCauseOfDeath,
            
            // Occupation
            Occupation = dto.Occupation,
            HasOccupationalHazards = dto.HasOccupationalHazards,
            OccupationHazardsDetails = dto.OccupationHazardsDetails,
            ParticipatesInDangerousSports = dto.ParticipatesInDangerousSports,
            DangerousSportsDetails = dto.DangerousSportsDetails,
            
            // Reproductive Health
            IsPregnant = dto.IsPregnant,
            PregnancyDueDate = DateTime.TryParse(dto.PregnancyDueDate, out var pdDate) ? pdDate : null,
            HasPregnancyComplications = dto.HasPregnancyComplications,
            PregnancyComplicationDetails = dto.PregnancyComplicationDetails,
            
            // Disability
            HasDisability = dto.HasDisability,
            DisabilityDetails = dto.DisabilityDetails,
            HasLifeThreateningCondition = dto.HasLifeThreateningCondition,
            LifeThreateningConditionDetails = dto.LifeThreateningConditionDetails,
            
            // Consent
            MedicalRecordsConsent = dto.MedicalRecordsConsent
        };

        _context.HealthDeclarations.Add(hd);
        await _context.SaveChangesAsync();
        
        return hd.Id;
    }

    private async Task LinkDocumentsToApplicationAsync(int applicationId, string userId)
    {
        // Find all documents uploaded by this user that don't have ApplicationId yet
        // These are documents uploaded during the application process
        var unlinkedDocuments = await _context.BaseDocuments
            .Where(d => d.OwnerId == userId && 
                       d.ApplicationId == null && 
                       d.Status == "Uploaded" &&
                       d.UploadedDate >= DateTime.UtcNow.AddHours(-24)) // Only link recent documents (within 24h)
            .ToListAsync();

        if (unlinkedDocuments.Any())
        {
            foreach (var doc in unlinkedDocuments)
            {
                doc.ApplicationId = applicationId;
            }
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Linked {Count} documents to application {ApplicationId}", 
                unlinkedDocuments.Count, applicationId);
        }
    }

    /// <summary>
    /// Submit a new insurance application
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> SubmitApplication([FromBody] ApplicationRequest request)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Validate product exists
            if (request.ProductId.HasValue)
            {
                var productExists = await _context.InsuranceProducts
                    .AnyAsync(p => p.Id == request.ProductId.Value && p.IsActive);
                
                if (!productExists)
                {
                    return BadRequest(new { success = false, message = "Invalid product ID" });
                }
            }

            // Save HealthDeclaration
            var healthDeclarationId = await SaveHealthDeclarationAsync(userId, request.HealthDeclaration);

            // Generate unique application number
            var applicationNumber = await GenerateApplicationNumberAsync();

            // Create application (normalized - no JSON fields)
            var application = new InsuranceServiceServer.Features.Customer.Models.Application
            {
                ApplicationNumber = applicationNumber,
                UserId = userId,
                ProductId = request.ProductId ?? 0,
                CoverageAmount = request.CoverageAmount,
                TermYears = request.TermYears,
                PaymentFrequency = request.PaymentFrequency,
                PremiumAmount = request.PremiumAmount,
                HealthDeclarationId = healthDeclarationId,
                TermsAccepted = request.TermsAccepted,
                DeclarationAccepted = request.DeclarationAccepted,
                Status = "Submitted",
                CreatedAt = DateTime.UtcNow,
                SubmittedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync(); // Save to get application.Id

            // Link documents to this application
            await LinkDocumentsToApplicationAsync(application.Id, userId);

            // Save beneficiaries to normalized Beneficiaries table
            await SaveBeneficiariesAsync(application.Id, request.Beneficiaries);

            // Update CustomerProfile with latest applicant emergency contact info
            var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null && request.Applicant != null)
            {
                profile.EmergencyContactName = request.Applicant.EmergencyContactName;
                profile.EmergencyContactPhone = request.Applicant.EmergencyContactPhone;
                profile.EmergencyContactRelationship = request.Applicant.EmergencyContactRelationship;
                profile.EmergencyContactRelationshipOther = request.Applicant.EmergencyContactRelationshipOther;
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("✅ Application {ApplicationId} submitted successfully by user {UserId}", 
                application.Id, userId);

            // Send confirmation email to user
            try
            {
                var product = await _context.InsuranceProducts
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId);
                
                // Get planId from session storage or use default
                int? planId = null;
                if (request.ProductId.HasValue)
                {
                    // Try to get the plan from the premium calculation context
                    // For now, we'll just use the product's default plan if available
                    var defaultPlan = await _context.InsurancePlans
                        .FirstOrDefaultAsync(p => p.ProductId == request.ProductId.Value);
                    planId = defaultPlan?.Id;
                }

                if (profile != null && product != null)
                {
                    var userName = $"{profile.FirstName} {profile.LastName}";
                    var productName = product.ProductName ?? "Life Insurance";
                    
                    // Get plan name if planId exists
                    string planName = "Standard Plan";
                    if (planId.HasValue)
                    {
                        var plan = await _context.InsurancePlans
                            .FirstOrDefaultAsync(p => p.Id == planId.Value);
                        planName = plan?.PlanName ?? "Standard Plan";
                    }
                    
                    var premiumAmount = request.PremiumAmount;
                    var paymentFrequency = string.IsNullOrEmpty(request.PaymentFrequency) ? "Annual" : request.PaymentFrequency;

                    await _emailService.SendApplicationConfirmationEmailAsync(
                        profile.Email,
                        userName,
                        application.ApplicationNumber,
                        productName,
                        planName,
                        premiumAmount,
                        paymentFrequency
                    );

                    _logger.LogInformation("📧 Confirmation email sent to {Email} for application {ApplicationNumber}",
                        profile.Email, application.ApplicationNumber);
                }
            }
            catch (Exception emailEx)
            {
                // Don't fail the request if email fails, just log it
                _logger.LogError(emailEx, "Failed to send confirmation email for application {ApplicationId}", application.Id);
            }

            return Ok(new 
            { 
                success = true, 
                message = "Application submitted successfully",
                id = application.Id,
                applicationNumber = application.ApplicationNumber,
                status = application.Status
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting application");
            return StatusCode(500, new { success = false, message = "Failed to submit application" });
        }
    }

    /// <summary>
    /// Create a draft application at the start of the application flow
    /// This is called when user begins the application process
    /// </summary>
    [HttpPost("create-draft")]
    public async Task<IActionResult> CreateDraftApplication([FromBody] CreateDraftRequest request)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Validate product exists
            if (request.ProductId.HasValue)
            {
                var productExists = await _context.InsuranceProducts
                    .AnyAsync(p => p.Id == request.ProductId.Value && p.IsActive);
                
                if (!productExists)
                {
                    return BadRequest(new { success = false, message = "Invalid product ID" });
                }
            }

            // Check if user already has a draft application for this product
            var existingDraft = await _context.Applications
                .Where(a => a.UserId == userId && 
                           a.Status == "Draft" && 
                           a.ProductId == request.ProductId)
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefaultAsync();

            if (existingDraft != null)
            {
                // Return existing draft
                return Ok(new
                {
                    success = true,
                    message = "Returning existing draft application",
                    applicationId = existingDraft.Id,
                    applicationNumber = existingDraft.ApplicationNumber
                });
            }

            // Generate application number
            var applicationNumber = await GenerateApplicationNumberAsync();

            // Create draft application
            var application = new InsuranceServiceServer.Features.Customer.Models.Application
            {
                ApplicationNumber = applicationNumber,
                UserId = userId,
                ProductId = request.ProductId ?? 0,
                CoverageAmount = 0,
                TermYears = 0,
                PaymentFrequency = "Monthly",
                PremiumAmount = 0,
                Status = "Draft",
                TermsAccepted = false,
                DeclarationAccepted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Created draft application {AppNumber} (ID: {AppId}) for user {UserId}", 
                applicationNumber, application.Id, userId);

            return Ok(new
            {
                success = true,
                message = "Draft application created successfully",
                applicationId = application.Id,
                applicationNumber = application.ApplicationNumber
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating draft application");
            return StatusCode(500, new { success = false, message = "Failed to create draft application" });
        }
    }

    /// <summary>
    /// Update application with personal info (Step 1)
    /// Saves applicant data to CustomerProfile
    /// </summary>
    [HttpPut("{id}/personal-info")]
    public async Task<IActionResult> UpdatePersonalInfo(int id, [FromBody] ApplicantDto applicant)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Verify application belongs to user
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found" });
            }

            // Update CustomerProfile with applicant data
            var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                return BadRequest(new { success = false, message = "Customer profile not found" });
            }

            profile.FirstName = applicant.FirstName;
            profile.LastName = applicant.LastName;
            profile.Email = applicant.Email;
            profile.PhoneNumber = applicant.Phone;
            profile.DateOfBirth = DateTime.TryParse(applicant.DateOfBirth, out var dob) ? dob : profile.DateOfBirth;
            profile.Gender = applicant.Gender;
            profile.NationalId = applicant.NationalId;
            profile.Occupation = applicant.Occupation;
            profile.OccupationOther = applicant.OccupationOther;
            profile.MonthlyIncome = applicant.AnnualIncome.HasValue ? applicant.AnnualIncome.Value / 12 : null;
            profile.Address = applicant.Address;
            profile.City = applicant.City;
            profile.PostalCode = applicant.PostalCode;
            profile.EmergencyContactName = applicant.EmergencyContactName;
            profile.EmergencyContactPhone = applicant.EmergencyContactPhone;
            profile.EmergencyContactGender = applicant.EmergencyContactGender;
            profile.EmergencyContactRelationship = applicant.EmergencyContactRelationship;
            profile.EmergencyContactRelationshipOther = applicant.EmergencyContactRelationshipOther;
            profile.UpdatedDate = DateTime.UtcNow;

            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Updated personal info for application {AppId}", id);

            return Ok(new
            {
                success = true,
                message = "Personal information saved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating personal info for application {AppId}", id);
            return StatusCode(500, new { success = false, message = "Failed to save personal information" });
        }
    }

    /// <summary>
    /// Update application with health declaration (Step 2)
    /// Creates or updates HealthDeclaration
    /// </summary>
    [HttpPut("{id}/health-declaration")]
    public async Task<IActionResult> UpdateHealthDeclaration(int id, [FromBody] HealthDeclarationDto healthDeclaration)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Verify application belongs to user
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found" });
            }

            // Create or update HealthDeclaration
            var existingHealthDeclaration = application.HealthDeclarationId.HasValue
                ? await _context.HealthDeclarations.FindAsync(application.HealthDeclarationId.Value)
                : null;

            if (existingHealthDeclaration != null)
            {
                // Update existing
                UpdateHealthDeclarationEntity(existingHealthDeclaration, healthDeclaration);
            }
            else
            {
                // Create new
                var newHealthDeclaration = new InsuranceServiceServer.Features.Customer.Models.HealthDeclaration
                {
                    CustomerProfileId = userId,
                    CreatedDate = DateTime.UtcNow
                };
                UpdateHealthDeclarationEntity(newHealthDeclaration, healthDeclaration);

                _context.HealthDeclarations.Add(newHealthDeclaration);
                await _context.SaveChangesAsync(); // Save to get ID

                application.HealthDeclarationId = newHealthDeclaration.Id;
            }

            application.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Updated health declaration for application {AppId}", id);

            return Ok(new
            {
                success = true,
                message = "Health declaration saved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating health declaration for application {AppId}", id);
            return StatusCode(500, new { success = false, message = "Failed to save health declaration" });
        }
    }

    /// <summary>
    /// Helper method to update HealthDeclaration entity from DTO
    /// </summary>
    private void UpdateHealthDeclarationEntity(
        InsuranceServiceServer.Features.Customer.Models.HealthDeclaration entity, 
        HealthDeclarationDto dto)
    {
        entity.MedicalConditionsJson = dto.MedicalConditions != null && dto.MedicalConditions.Any()
            ? JsonSerializer.Serialize(dto.MedicalConditions)
            : null;
        entity.CurrentMedicationsJson = dto.Medications != null && dto.Medications.Any()
            ? JsonSerializer.Serialize(dto.Medications)
            : null;
        entity.HasRecentHospitalization = dto.HasHospitalization;
        entity.HospitalizationHistory = dto.HospitalizationHistory;

        // Specific Diseases
        entity.HasHeartDisease = dto.HasHeartDisease;
        entity.HasStroke = dto.HasStroke;
        entity.HasCancer = dto.HasCancer;
        entity.CancerDetails = dto.CancerDetails;
        entity.HasDiabetes = dto.HasDiabetes;
        entity.DiabetesType = dto.DiabetesType;
        entity.HasHighBloodPressure = dto.HasHighBloodPressure;
        entity.HasHighCholesterol = dto.HasHighCholesterol;
        entity.HasKidneyDisease = dto.HasKidneyDisease;
        entity.HasLiverDisease = dto.HasLiverDisease;
        entity.HasMentalHealthCondition = dto.HasMentalHealthCondition;
        entity.MentalHealthDetails = dto.MentalHealthDetails;
        entity.HasHIV = dto.HasHIV;

        // Recent Medical Events
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
        entity.FatherAgeAtDeath = int.TryParse(dto.FatherAgeAtDeath, out var fAge) ? fAge : (int?)null;
        entity.FatherCauseOfDeath = dto.FatherCauseOfDeath;
        entity.MotherDeceased = dto.MotherDeceased;
        entity.MotherAgeAtDeath = int.TryParse(dto.MotherAgeAtDeath, out var mAge) ? mAge : (int?)null;
        entity.MotherCauseOfDeath = dto.MotherCauseOfDeath;

        // Lifestyle
        entity.SmokingStatus = dto.SmokingStatus;
        entity.AlcoholConsumptionLevel = dto.AlcoholConsumption;
        entity.ExerciseLevel = dto.ExerciseLevel;
        entity.ParticipatesInDangerousSports = dto.ParticipatesInDangerousSports;
        entity.DangerousSportsDetails = dto.DangerousSportsDetails;

        // Physical Measurements
        entity.Height = decimal.TryParse(dto.Height, out var h) ? h : 0;
        entity.Weight = decimal.TryParse(dto.Weight, out var w) ? w : 0;
    }

    /// <summary>
    /// Update application with product selection and quote details (Step 3)
    /// </summary>
    [HttpPut("{id}/product")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductSelectionDto productSelection)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Verify application belongs to user
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found" });
            }

            // Validate product exists
            if (productSelection.ProductId.HasValue)
            {
                var productExists = await _context.InsuranceProducts
                    .AnyAsync(p => p.Id == productSelection.ProductId.Value && p.IsActive);
                
                if (!productExists)
                {
                    return BadRequest(new { success = false, message = "Invalid product ID" });
                }
            }

            // Update application with product details
            application.ProductId = productSelection.ProductId ?? application.ProductId;
            application.CoverageAmount = productSelection.CoverageAmount;
            application.TermYears = productSelection.TermYears;
            application.PaymentFrequency = productSelection.PaymentFrequency;
            application.PremiumAmount = productSelection.PremiumAmount;
            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Updated product selection for application {AppId}", id);

            return Ok(new
            {
                success = true,
                message = "Product selection saved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product selection for application {AppId}", id);
            return StatusCode(500, new { success = false, message = "Failed to save product selection" });
        }
    }

    /// <summary>
    /// Get application by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetApplication(int id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var application = await _context.Applications
                .Include(a => a.Product)
                .Include(a => a.HealthDeclaration)
                .Include(a => a.Beneficiaries) // Load normalized beneficiaries
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found" });
            }

            // Load applicant data from CustomerProfile
            var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                return NotFound(new { success = false, message = "Profile not found" });
            }

            // Map HealthDeclaration to DTO
            HealthDeclarationDto? healthDeclarationDto = null;
            // TODO: Fix HealthDeclaration DTO mapping
            /* if (application.HealthDeclaration != null)
            {
                var hd = application.HealthDeclaration;
                healthDeclarationDto = new HealthDeclarationDto
                {
                    HasMedicalConditions = hd.HasMedicalConditions,
                    MedicalConditions = JsonSerializer.Deserialize<List<string>>(hd.MedicalConditions) ?? new(),
                    IsOnMedication = hd.IsOnMedication,
                    Medications = JsonSerializer.Deserialize<List<string>>(hd.Medications) ?? new(),
                    HasHospitalization = hd.HasHospitalization,
                    HospitalizationHistory = hd.HospitalizationHistory,
                    HasHeartDisease = hd.HasHeartDisease,
                    HasStroke = hd.HasStroke,
                    HasCancer = hd.HasCancer,
                    CancerDetails = hd.CancerDetails,
                    HasDiabetes = hd.HasDiabetes,
                    DiabetesType = hd.DiabetesType,
                    HasHighBloodPressure = hd.HasHighBloodPressure,
                    HasHighCholesterol = hd.HasHighCholesterol,
                    HasKidneyDisease = hd.HasKidneyDisease,
                    HasLiverDisease = hd.HasLiverDisease,
                    HasMentalHealthCondition = hd.HasMentalHealthCondition,
                    MentalHealthDetails = hd.MentalHealthDetails,
                    HasHIV = hd.HasHIV,
                    HasSurgeryLast5Years = hd.HasSurgeryLast5Years,
                    SurgeryDetails = hd.SurgeryDetails,
                    HasPendingMedicalTests = hd.HasPendingMedicalTests,
                    PendingTestsDetails = hd.PendingTestsDetails,
                    HasPlannedProcedures = hd.HasPlannedProcedures,
                    PlannedProceduresDetails = hd.PlannedProceduresDetails,
                    FamilyHeartDisease = hd.FamilyHeartDisease,
                    FamilyCancer = hd.FamilyCancer,
                    FamilyDiabetes = hd.FamilyDiabetes,
                    FamilyStroke = hd.FamilyStroke,
                    FamilyOtherConditions = hd.FamilyOtherConditions,
                    FatherDeceased = hd.FatherDeceased,
                    FatherAgeAtDeath = hd.FatherAgeAtDeath,
                    FatherCauseOfDeath = hd.FatherCauseOfDeath,
                    MotherDeceased = hd.MotherDeceased,
                    MotherAgeAtDeath = hd.MotherAgeAtDeath,
                    MotherCauseOfDeath = hd.MotherCauseOfDeath,
                    IsSmoker = hd.IsSmoker,
                    SmokingPacksPerDay = hd.SmokingPacksPerDay,
                    SmokingYears = hd.SmokingYears,
                    AlcoholConsumption = hd.AlcoholConsumption,
                    AlcoholUnitsPerWeek = hd.AlcoholUnitsPerWeek,
                    UsesDrugs = hd.UsesDrugs,
                    DrugDetails = hd.DrugDetails,
                    Occupation = hd.Occupation,
                    HasOccupationalHazards = hd.HasOccupationalHazards,
                    OccupationHazardsDetails = hd.OccupationHazardsDetails,
                    ParticipatesInDangerousSports = hd.ParticipatesInDangerousSports,
                    DangerousSportsDetails = hd.DangerousSportsDetails,
                    Height = hd.Height,
                    Weight = hd.Weight,
                    BloodPressureSystolic = hd.BloodPressureSystolic,
                    BloodPressureDiastolic = hd.BloodPressureDiastolic,
                    CholesterolLevel = hd.CholesterolLevel,
                    IsPregnant = hd.IsPregnant,
                    PregnancyDueDate = hd.PregnancyDueDate,
                    HasPregnancyComplications = hd.HasPregnancyComplications,
                    PregnancyComplicationDetails = hd.PregnancyComplicationDetails,
                    HasDisability = hd.HasDisability,
                    DisabilityDetails = hd.DisabilityDetails,
                    HasLifeThreateningCondition = hd.HasLifeThreateningCondition,
                    LifeThreateningConditionDetails = hd.LifeThreateningConditionDetails,
                    MedicalRecordsConsent = hd.MedicalRecordsConsent
                };
            } */

            // Map from CustomerProfile to ApplicantDto
            var applicantDto = new ApplicantDto
            {
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                Email = profile.Email,
                Phone = profile.PhoneNumber,
                DateOfBirth = profile.DateOfBirth.ToString("yyyy-MM-dd"),
                Gender = profile.Gender,
                NationalId = profile.NationalId,
                Occupation = profile.Occupation,
                AnnualIncome = profile.MonthlyIncome * 12, // Convert monthly to annual
                Address = profile.Address,
                City = profile.City,
                PostalCode = "", // CustomerProfile doesn't have PostalCode
                EmergencyContactName = profile.EmergencyContactName,
                EmergencyContactPhone = profile.EmergencyContactPhone,
                EmergencyContactRelationship = profile.EmergencyContactRelationship,
                EmergencyContactRelationshipOther = profile.EmergencyContactRelationshipOther
            };

            // Map beneficiaries from normalized table
            var beneficiariesDto = application.Beneficiaries.Select(b => new BeneficiaryDto
            {
                FullName = b.FullName,
                DateOfBirth = b.DateOfBirth.ToString("yyyy-MM-dd"),
                Gender = b.Gender,
                Relationship = b.Relationship,
                RelationshipOther = b.RelationshipOther,
                Percentage = b.Percentage,
                IsMinor = b.IsMinor,
                Trustee = b.Trustee,
                TrusteeRelationship = b.TrusteeRelationship,
                TrusteeRelationshipOther = b.TrusteeRelationshipOther
            }).ToList();

            var response = new ApplicationResponse
            {
                Id = application.Id,
                UserId = application.UserId,
                ProductId = application.ProductId,
                ProductName = application.Product?.ProductName,
                CoverageAmount = application.CoverageAmount,
                TermYears = application.TermYears,
                PaymentFrequency = application.PaymentFrequency,
                PremiumAmount = application.PremiumAmount,
                Status = application.Status,
                CreatedAt = application.CreatedAt,
                SubmittedAt = application.SubmittedAt,
                ReviewedAt = application.ReviewedAt,
                ReviewNotes = application.ReviewNotes,
                Applicant = applicantDto,
                HealthDeclaration = healthDeclarationDto,
                Beneficiaries = beneficiariesDto
            };

            return Ok(new { success = true, application = response });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving application {ApplicationId}", id);
            return StatusCode(500, new { success = false, message = "Failed to retrieve application" });
        }
    }

    /// <summary>
    /// Get all applications for the current user
    /// </summary>
    [HttpGet("my-applications")]
    public async Task<IActionResult> GetMyApplications()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var applications = await _context.Applications
                .Include(a => a.Product)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new ApplicationListResponse
                {
                    Id = a.Id,
                    ProductId = a.ProductId,
                    ProductName = a.Product!.ProductName,
                    ProductType = a.Product.ProductType,
                    CoverageAmount = a.CoverageAmount,
                    PremiumAmount = a.PremiumAmount,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt,
                    SubmittedAt = a.SubmittedAt
                })
                .ToListAsync();

            return Ok(new { success = true, applications });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications for user");
            return StatusCode(500, new { success = false, message = "Failed to retrieve applications" });
        }
    }

    /// <summary>
    /// Save application as draft
    /// </summary>
    [HttpPost("draft")]
    public async Task<IActionResult> SaveDraft([FromBody] ApplicationRequest request)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var application = new InsuranceServiceServer.Features.Customer.Models.Application
            {
                UserId = userId,
                ProductId = request.ProductId ?? 0,
                CoverageAmount = request.CoverageAmount,
                TermYears = request.TermYears,
                PaymentFrequency = request.PaymentFrequency,
                PremiumAmount = request.PremiumAmount,
                TermsAccepted = request.TermsAccepted,
                DeclarationAccepted = request.DeclarationAccepted,
                Status = "Draft",
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync(); // Save to get application.Id

            // Save beneficiaries to normalized table
            if (request.Beneficiaries != null && request.Beneficiaries.Any())
            {
                await SaveBeneficiariesAsync(application.Id, request.Beneficiaries);
            }

            // Update CustomerProfile with applicant info
            if (request.Applicant != null)
            {
                var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
                if (profile != null)
                {
                    profile.EmergencyContactName = request.Applicant.EmergencyContactName;
                    profile.EmergencyContactPhone = request.Applicant.EmergencyContactPhone;
                    profile.EmergencyContactRelationship = request.Applicant.EmergencyContactRelationship;
                    profile.EmergencyContactRelationshipOther = request.Applicant.EmergencyContactRelationshipOther;
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new 
            { 
                success = true, 
                message = "Draft saved successfully",
                id = application.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving draft application");
            return StatusCode(500, new { success = false, message = "Failed to save draft" });
        }
    }

    /// <summary>
    /// Update existing application (draft only)
    /// </summary>
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateApplication(int id, [FromBody] ApplicationRequest request)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found" });
            }

            // Only allow updates to draft applications
            if (application.Status != "Draft")
            {
                return BadRequest(new { success = false, message = "Cannot update submitted applications" });
            }

            // Update fields (normalized - no JSON)
            if (request.ProductId.HasValue)
                application.ProductId = request.ProductId.Value;
            
            application.CoverageAmount = request.CoverageAmount;
            application.TermYears = request.TermYears;
            application.PaymentFrequency = request.PaymentFrequency;
            application.PremiumAmount = request.PremiumAmount;
            application.TermsAccepted = request.TermsAccepted;
            application.DeclarationAccepted = request.DeclarationAccepted;
            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Update CustomerProfile with applicant info
            var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile != null && request.Applicant != null)
            {
                profile.EmergencyContactName = request.Applicant.EmergencyContactName;
                profile.EmergencyContactPhone = request.Applicant.EmergencyContactPhone;
                profile.EmergencyContactRelationship = request.Applicant.EmergencyContactRelationship;
                profile.EmergencyContactRelationshipOther = request.Applicant.EmergencyContactRelationshipOther;
                await _context.SaveChangesAsync();
            }

            // Update beneficiaries
            await SaveBeneficiariesAsync(application.Id, request.Beneficiaries);

            return Ok(new 
            { 
                success = true, 
                message = "Application updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating application {ApplicationId}", id);
            return StatusCode(500, new { success = false, message = "Failed to update application" });
        }
    }

    /// <summary>
    /// Get all applications for current user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetApplications()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var applications = await _context.Applications
                .Include(a => a.Product)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    a.ApplicationNumber,
                    a.Status,
                    a.CoverageAmount,
                    a.PremiumAmount,
                    a.TermYears,
                    a.PaymentFrequency,
                    a.CreatedAt,
                    a.SubmittedAt,
                    a.ReviewedAt,
                    a.ReviewNotes,
                    Product = new
                    {
                        a.Product!.Id,
                        a.Product.ProductName,
                        a.Product.ProductType
                    }
                })
                .ToListAsync();

            return Ok(new 
            { 
                success = true, 
                applications
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications");
            return StatusCode(500, new { success = false, message = "Failed to retrieve applications" });
        }
    }

    /// <summary>
    /// Save or update beneficiaries for a draft application
    /// Allows users to save beneficiaries independently before final submission
    /// </summary>
    [HttpPost("{applicationId}/beneficiaries")]
    public async Task<IActionResult> SaveApplicationBeneficiaries(int applicationId, [FromBody] List<BeneficiaryDto> beneficiaries)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Validate beneficiaries
            var validationErrors = ValidateBeneficiaries(beneficiaries);
            if (validationErrors.Any())
            {
                return BadRequest(new { success = false, message = "Validation failed", errors = validationErrors });
            }

            // Check if application exists and belongs to user
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found or access denied" });
            }

            // Delete existing beneficiaries for this application
            var existingBeneficiaries = await _context.Beneficiaries
                .Where(b => b.ApplicationId == applicationId)
                .ToListAsync();

            if (existingBeneficiaries.Any())
            {
                _context.Beneficiaries.RemoveRange(existingBeneficiaries);
            }

            // Save new beneficiaries to normalized table
            await SaveBeneficiariesAsync(applicationId, beneficiaries);

            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Saved {Count} beneficiaries for application {ApplicationId}", 
                beneficiaries.Count, applicationId);

            return Ok(new 
            { 
                success = true, 
                message = "Beneficiaries saved successfully",
                beneficiaryCount = beneficiaries.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving beneficiaries for application {ApplicationId}", applicationId);
            return StatusCode(500, new { success = false, message = "Failed to save beneficiaries" });
        }
    }

    /// <summary>
    /// Get beneficiaries for an application
    /// </summary>
    [HttpGet("{applicationId}/beneficiaries")]
    public async Task<IActionResult> GetApplicationBeneficiaries(int applicationId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            // Check if application exists and belongs to user
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { success = false, message = "Application not found or access denied" });
            }

            // Get beneficiaries from normalized table
            var beneficiaries = await _context.Beneficiaries
                .Where(b => b.ApplicationId == applicationId && b.IsActive)
                .Select(b => new
                {
                    b.Id,
                    b.Type,
                    b.FullName,
                    b.Relationship,
                    b.DateOfBirth,
                    b.NationalId,
                    b.SSN,
                    b.Email,
                    b.Phone,
                    b.Address,
                    b.City,
                    b.State,
                    b.PostalCode,
                    b.Percentage,
                    b.IsMinor,
                    b.Trustee,
                    b.TrusteeRelationship,
                    b.PerStirpes,
                    b.IsIrrevocable
                })
                .ToListAsync();

            return Ok(new 
            { 
                success = true, 
                beneficiaries
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving beneficiaries for application {ApplicationId}", applicationId);
            return StatusCode(500, new { success = false, message = "Failed to retrieve beneficiaries" });
        }
    }
}



