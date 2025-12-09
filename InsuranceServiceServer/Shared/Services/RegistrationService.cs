using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Models;
using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Shared.DTOs.Registration;
using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace InsuranceServiceServer.Shared.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger<RegistrationService> _logger;

        public RegistrationService(
            AppDbContext context,
            UserManager<AppUser> userManager,
            ILogger<RegistrationService> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        // ===== Session Management =====
        public async Task<RegistrationSession> CreateSessionAsync(string userId)
        {
            var session = new RegistrationSession
            {
                UserId = userId,
                SessionToken = Guid.NewGuid().ToString(),
                IsAccountCreated = true,
                CurrentStep = "AccountCreated"
            };

            _context.RegistrationSessions.Add(session);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Created registration session {session.SessionToken} for user {userId}");
            return session;
        }

        public async Task<RegistrationSession?> GetSessionAsync(string sessionToken)
        {
            return await _context.RegistrationSessions
                .FirstOrDefaultAsync(s => s.SessionToken == sessionToken);
        }

        public async Task<RegistrationStatusResponse> GetStatusAsync(string sessionToken)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            var progress = new RegistrationProgressDTO
            {
                IsAccountCreated = session.IsAccountCreated,
                IsKYCCompleted = session.IsKYCCompleted,
                IsProfileCompleted = session.IsProfileCompleted,
                IsProductSelected = session.IsProductSelected,
                IsHealthDeclared = session.IsHealthDeclared,
                IsUnderwritingCompleted = session.IsUnderwritingCompleted,
                IsPaymentCompleted = session.IsPaymentCompleted,
                IsPolicyIssued = session.IsPolicyIssued
            };

            // Calculate percentage
            int completedSteps = 0;
            if (progress.IsAccountCreated) completedSteps++;
            if (progress.IsKYCCompleted) completedSteps++;
            if (progress.IsProfileCompleted) completedSteps++;
            if (progress.IsProductSelected) completedSteps++;
            if (progress.IsHealthDeclared) completedSteps++;
            if (progress.IsUnderwritingCompleted) completedSteps++;
            if (progress.IsPaymentCompleted) completedSteps++;
            if (progress.IsPolicyIssued) completedSteps++;
            progress.PercentageComplete = (completedSteps * 100) / 8;

            string? nextAction = GetNextAction(session);

            return new RegistrationStatusResponse
            {
                SessionToken = sessionToken,
                CurrentStep = session.CurrentStep,
                RegistrationStatus = session.RegistrationStatus,
                Progress = progress,
                NextAction = nextAction,
                Message = session.RejectionReason
            };
        }

        private string? GetNextAction(RegistrationSession session)
        {
            if (!session.IsKYCCompleted) return "Complete eKYC verification";
            if (!session.IsProfileCompleted) return "Complete your profile";
            if (!session.IsProductSelected) return "Select an insurance product";
            if (!session.IsHealthDeclared) return "Submit health declaration";
            if (!session.IsUnderwritingCompleted) return "Waiting for underwriting approval";
            if (!session.IsPaymentCompleted) return "Complete payment";
            if (!session.IsPolicyIssued) return "Waiting for policy issuance";
            return "Registration completed";
        }

        // ===== Step 2: eKYC =====
        public async Task<KYCResponse> ProcessKYCAsync(string sessionToken, StartKYCRequest request)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            // Get user
            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Create CustomerProfile if not exists
            var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == session.UserId);
            if (profile == null)
            {
                profile = new CustomerProfile
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = session.UserId,
                    Email = user.Email ?? "",
                    PhoneNumber = user.PhoneNumber ?? "",
                    CreatedDate = DateTime.UtcNow
                };
                _context.CustomerProfiles.Add(profile);
                await _context.SaveChangesAsync();

                // Link profile to user
                user.ProfileId = profile.Id;
                user.ProfileType = "Customer";
                await _userManager.UpdateAsync(user);
            }

            // TODO: Call actual eKYC API (OCR, Face Matching, etc.)
            // For now, simulate the process
            var kycVerification = new KYCVerification
            {
                RegistrationSessionId = session.Id,
                CustomerProfileId = profile.Id,
                DocumentType = request.DocumentType,
                DocumentNumber = "SIMULATED-" + Guid.NewGuid().ToString().Substring(0, 8),
                VerificationStatus = "Approved",
                IsFaceMatched = true,
                FaceMatchScore = 95.5m,
                IsDocumentAuthentic = true,
                AuthenticityScore = 98.0m,
                IsBlacklisted = false,
                IsFraudulent = false,
                RiskLevel = "Low",
                CompletedDate = DateTime.UtcNow,
                VerifiedBy = "System",
                ExtractedFullName = "Simulated Name",
                ExtractedDateOfBirth = DateTime.UtcNow.AddYears(-30),
                ExtractedGender = "Male",
                ExtractedNationality = "Vietnamese"
            };

            _context.KYCVerifications.Add(kycVerification);

            // Update session
            session.IsKYCCompleted = true;
            session.CurrentStep = "KYCCompleted";
            session.LastUpdateDate = DateTime.UtcNow;

            // Update profile KYC status
            profile.KycStatus = "Verified";
            profile.KycVerifiedDate = DateTime.UtcNow;
            profile.KycVerifiedBy = "System";

            await _context.SaveChangesAsync();

            return new KYCResponse
            {
                IsSuccess = true,
                Status = "Approved",
                Message = "eKYC verification completed successfully",
                ExtractedData = new KYCDataDTO
                {
                    DocumentNumber = kycVerification.DocumentNumber,
                    FullName = kycVerification.ExtractedFullName,
                    DateOfBirth = kycVerification.ExtractedDateOfBirth,
                    Gender = kycVerification.ExtractedGender,
                    Nationality = kycVerification.ExtractedNationality
                },
                FaceMatchScore = kycVerification.FaceMatchScore,
                RequiresManualReview = false
            };
        }

        // ===== Step 3: Complete Profile =====
        public async Task<bool> CompleteProfileAsync(string sessionToken, CompleteProfileRequest request)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            if (!session.IsKYCCompleted)
            {
                throw new Exception("eKYC must be completed first");
            }

            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null || string.IsNullOrEmpty(user.ProfileId))
            {
                throw new Exception("User profile not found");
            }

            var profile = await _context.CustomerProfiles.FirstOrDefaultAsync(p => p.Id == user.ProfileId);
            if (profile == null)
            {
                throw new Exception("Customer profile not found");
            }

            // Update profile
            profile.FirstName = request.FirstName;
            profile.LastName = request.LastName;
            profile.DateOfBirth = request.DateOfBirth;
            profile.Gender = request.Gender;
            profile.Email = request.Email;
            profile.PhoneNumber = request.PhoneNumber;
            profile.Address = request.Address;
            profile.City = request.City;
            profile.District = request.District;
            profile.Ward = request.Ward;
            profile.Occupation = request.Occupation;
            profile.Company = request.Company;
            profile.Position = request.Position;
            profile.MonthlyIncome = request.MonthlyIncome;
            profile.EmergencyContactName = request.EmergencyContactName;
            profile.EmergencyContactPhone = request.EmergencyContactPhone;
            profile.EmergencyContactRelationship = request.EmergencyContactRelationship;
            profile.EmergencyContactRelationshipOther = request.EmergencyContactRelationshipOther;
            profile.AcceptMarketing = request.AcceptMarketing;
            profile.UpdatedDate = DateTime.UtcNow;

            // Update session
            session.IsProfileCompleted = true;
            session.CurrentStep = "ProfileCompleted";
            session.LastUpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Profile completed for session {sessionToken}");
            return true;
        }

        // ===== Step 4: Product Selection =====
        public async Task<ProductQuoteResponse> GetProductQuoteAsync(int productId, decimal coverageAmount, int termYears)
        {
            var product = await _context.InsuranceProducts.FindAsync(productId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            // TODO: Premium calculation now uses InsurancePlan entity with realistic pricing
            // This method is deprecated - use PlansController to get actual plan pricing
            throw new NotImplementedException("Please use the Plans API to get accurate premium quotes. Coverage/term/rates are now defined in InsurancePlan entity.");
            
            /*return new ProductQuoteResponse
            {
                ProductId = productId,
                ProductName = product.ProductName,
                CoverageAmount = coverageAmount,
                TermYears = termYears,
                YearlyPremium = 0,
                QuarterlyPremium = 0,
                MonthlyPremium = 0,
                CoverageDetails = null
            };*/
        }

        public async Task<bool> SelectProductAsync(string sessionToken, SelectProductRequest request)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            if (!session.IsProfileCompleted)
            {
                throw new Exception("Profile must be completed first");
            }

            var product = await _context.InsuranceProducts.FindAsync(request.ProductId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            // Store selected product in session
            session.SelectedProductId = request.ProductId;
            session.SelectedCoverageAmount = request.CoverageAmount;
            session.SelectedTermYears = request.TermYears;
            session.SelectedPaymentFrequency = request.PaymentFrequency;
            session.IsProductSelected = true;
            session.CurrentStep = "ProductSelected";
            session.LastUpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Product selected for session {sessionToken}: Product {request.ProductId}");
            return true;
        }

        // ===== Step 5: Health Declaration =====
        public async Task<bool> SubmitHealthDeclarationAsync(string sessionToken, HealthDeclarationRequest request)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            if (!session.IsProductSelected)
            {
                throw new Exception("Product must be selected first");
            }

            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null || string.IsNullOrEmpty(user.ProfileId))
            {
                throw new Exception("User profile not found");
            }

            // Calculate BMI
            decimal bmi = request.Weight / ((request.Height / 100) * (request.Height / 100));

            var healthDeclaration = new HealthDeclaration
            {
                RegistrationSessionId = session.Id,
                CustomerProfileId = user.ProfileId,
                
                // === VITAL STATISTICS ===
                Height = request.Height,
                Weight = request.Weight,
                BMI = Math.Round(bmi, 2),
                BloodType = request.BloodType,
                BloodPressureSystolic = request.BloodPressureSystolic,
                BloodPressureDiastolic = request.BloodPressureDiastolic,
                CholesterolLevel = request.CholesterolLevel,
                RestingHeartRate = request.RestingHeartRate,
                
                // === LIFESTYLE ENHANCED ===
                SmokingStatus = request.SmokingStatus ?? "Never",
                SmokingPacksPerDay = request.SmokingPacksPerDay,
                SmokingYears = request.SmokingYears,
                AlcoholConsumptionLevel = request.AlcoholConsumptionLevel ?? "None",
                AlcoholUnitsPerWeek = request.AlcoholUnitsPerWeek,
                UsesDrugs = request.UsesDrugs,
                DrugDetails = request.DrugDetails,
                ExerciseLevel = request.ExerciseLevel ?? "Sedentary",
                ExerciseHoursPerWeek = request.ExerciseHoursPerWeek,
                SleepQuality = request.SleepQuality ?? "Average",
                AverageSleepHours = request.AverageSleepHours,
                StressLevel = request.StressLevel ?? "Moderate",
                DietQuality = request.DietQuality ?? "Average",
                
                // === SPECIFIC DISEASES (with diagnosis dates and treatment status) ===
                HasHeartDisease = request.HasHeartDisease,
                HeartDiseaseDiagnosisDate = request.HeartDiseaseDiagnosisDate,
                HeartDiseaseTreatmentStatus = request.HeartDiseaseTreatmentStatus,
                
                HasStroke = request.HasStroke,
                StrokeDiagnosisDate = request.StrokeDiagnosisDate,
                StrokeTreatmentStatus = request.StrokeTreatmentStatus,
                
                HasCancer = request.HasCancer,
                CancerDiagnosisDate = request.CancerDiagnosisDate,
                CancerTreatmentStatus = request.CancerTreatmentStatus,
                CancerDetails = request.CancerDetails,
                
                HasDiabetes = request.HasDiabetes,
                DiabetesType = request.DiabetesType,
                DiabetesDiagnosisDate = request.DiabetesDiagnosisDate,
                DiabetesHbA1c = request.DiabetesHbA1c,
                DiabetesTreatmentStatus = request.DiabetesTreatmentStatus,
                
                HasHighBloodPressure = request.HasHighBloodPressure,
                HighBloodPressureDiagnosisDate = request.HighBloodPressureDiagnosisDate,
                HighBloodPressureTreatmentStatus = request.HighBloodPressureTreatmentStatus,
                
                HasHighCholesterol = request.HasHighCholesterol,
                HighCholesterolDiagnosisDate = request.HighCholesterolDiagnosisDate,
                HighCholesterolTreatmentStatus = request.HighCholesterolTreatmentStatus,
                
                HasKidneyDisease = request.HasKidneyDisease,
                KidneyDiseaseDiagnosisDate = request.KidneyDiseaseDiagnosisDate,
                KidneyDiseaseTreatmentStatus = request.KidneyDiseaseTreatmentStatus,
                
                HasLiverDisease = request.HasLiverDisease,
                LiverDiseaseDiagnosisDate = request.LiverDiseaseDiagnosisDate,
                LiverDiseaseTreatmentStatus = request.LiverDiseaseTreatmentStatus,
                
                HasMentalHealthCondition = request.HasMentalHealthCondition,
                MentalHealthDiagnosisDate = request.MentalHealthDiagnosisDate,
                MentalHealthTreatmentStatus = request.MentalHealthTreatmentStatus,
                MentalHealthDetails = request.MentalHealthDetails,
                
                HasHIV = request.HasHIV,
                HIVDiagnosisDate = request.HIVDiagnosisDate,
                HIVTreatmentStatus = request.HIVTreatmentStatus,
                
                // === OLD FIELDS (keep for backwards compatibility) ===
                IsSmoker = request.IsSmoker,
                IsDrinker = request.IsDrinker,
                AlcoholFrequency = request.AlcoholFrequency,
                IsExercising = request.IsExercising,
                HasHypertension = request.HasHypertension,
                HasMentalIllness = request.HasMentalIllness,
                
                // === MEDICAL HISTORY JSON ===
                MedicalConditionsJson = request.MedicalConditions != null ? JsonSerializer.Serialize(request.MedicalConditions) : null,
                MedicalConditionDetailsJson = request.MedicalConditionDetails != null ? JsonSerializer.Serialize(request.MedicalConditionDetails) : null,
                CurrentMedicationsJson = request.CurrentMedications != null ? JsonSerializer.Serialize(request.CurrentMedications) : null,
                PastIllnessesJson = request.PastIllnesses != null ? JsonSerializer.Serialize(request.PastIllnesses) : null,
                ChronicConditionsJson = request.ChronicConditions != null ? JsonSerializer.Serialize(request.ChronicConditions) : null,
                SurgeriesJson = request.Surgeries != null ? JsonSerializer.Serialize(request.Surgeries) : null,
                AllergiesJson = request.Allergies != null ? JsonSerializer.Serialize(request.Allergies) : null,
                
                // === RECENT MEDICAL EVENTS ===
                LastMedicalCheckupDate = request.LastMedicalCheckupDate,
                HasRecentHospitalization = request.HasRecentHospitalization,
                LastHospitalizationDate = request.LastHospitalizationDate,
                HospitalizationReason = request.HospitalizationReason,
                HospitalizationHistory = request.HospitalizationHistory,
                HasSurgeryLast5Years = request.HasSurgeryLast5Years,
                SurgeryDetails = request.SurgeryDetails,
                HasPendingMedicalTests = request.HasPendingMedicalTests,
                PendingTestsDetails = request.PendingTestsDetails,
                HasPlannedProcedures = request.HasPlannedProcedures,
                PlannedProceduresDetails = request.PlannedProceduresDetails,
                
                // === FAMILY MEDICAL HISTORY ===
                FamilyHeartDisease = request.FamilyHeartDisease,
                FamilyCancer = request.FamilyCancer,
                FamilyDiabetes = request.FamilyDiabetes,
                FamilyStroke = request.FamilyStroke,
                FamilyOtherConditions = request.FamilyOtherConditions,
                FatherDeceased = request.FatherDeceased,
                FatherAgeAtDeath = request.FatherAgeAtDeath,
                FatherCauseOfDeath = request.FatherCauseOfDeath,
                MotherDeceased = request.MotherDeceased,
                MotherAgeAtDeath = request.MotherAgeAtDeath,
                MotherCauseOfDeath = request.MotherCauseOfDeath,
                
                // === PREGNANCY ===
                IsPregnant = request.IsPregnant,
                PregnancyDueDate = request.PregnancyDueDate,
                HasPregnancyComplications = request.HasPregnancyComplications,
                PregnancyComplicationDetails = request.PregnancyComplicationDetails,
                
                // === OCCUPATION & RISK ===
                Occupation = request.Occupation,
                HasOccupationalHazards = request.HasOccupationalHazards,
                OccupationHazardsDetails = request.OccupationHazardsDetails,
                HasHighRiskOccupation = request.HasHighRiskOccupation,
                OccupationRiskDetails = request.OccupationRiskDetails,
                ParticipatesInDangerousSports = request.ParticipatesInDangerousSports,
                DangerousSportsDetails = request.DangerousSportsDetails,
                
                // === DISABILITY & LIFE-THREATENING ===
                HasDisability = request.HasDisability,
                DisabilityDetails = request.DisabilityDetails,
                HasLifeThreateningCondition = request.HasLifeThreateningCondition,
                LifeThreateningConditionDetails = request.LifeThreateningConditionDetails,
                
                // === DOCUMENTS & CONSENT ===
                MedicalRecordsConsent = request.MedicalRecordsConsent,
                
                // === STATUS & DECLARATION ===
                IsDeclarationAccurate = request.IsDeclarationAccurate,
                Status = "Submitted"
            };

            _context.HealthDeclarations.Add(healthDeclaration);

            // Update customer profile health info
            var profile = await _context.CustomerProfiles.FindAsync(user.ProfileId);
            if (profile != null)
            {
                // Basic info still in profile (removed height, weight, etc. - now in HealthDeclaration)
                profile.UpdatedDate = DateTime.UtcNow;
            }

            // Update session
            session.IsHealthDeclared = true;
            session.CurrentStep = "HealthDeclared";
            session.LastUpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Health declaration submitted for session {sessionToken}");
            return true;
        }

        // ===== Step 6: Underwriting =====
        public async Task<UnderwritingResponse> ProcessUnderwritingAsync(string sessionToken)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            if (!session.IsHealthDeclared)
            {
                throw new Exception("Health declaration must be submitted first");
            }

            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null || string.IsNullOrEmpty(user.ProfileId))
            {
                throw new Exception("User profile not found");
            }

            var healthDeclaration = await _context.HealthDeclarations
                .FirstOrDefaultAsync(h => h.RegistrationSessionId == session.Id);
            
            if (healthDeclaration == null)
            {
                throw new Exception("Health declaration not found");
            }

            var product = await _context.InsuranceProducts.FindAsync(session.SelectedProductId);
            if (product == null)
            {
                throw new Exception("Selected product not found");
            }

            // Simple auto-underwriting logic
            int riskScore = CalculateRiskScore(healthDeclaration);
            string riskLevel = GetRiskLevel(riskScore);
            bool isAutoApprovalEligible = riskScore < 30;

            // TODO: Premium calculation now uses InsurancePlan entity
            decimal basePremium = 0; // Deprecated - should get from selected plan
            decimal adjustedPremium = basePremium;
            decimal loadingPercentage = 0;

            string decision;
            string? rejectionReason = null;
            List<string>? requiredDocuments = null;
            bool requiresMedicalExam = false;

            if (isAutoApprovalEligible && riskScore < 20)
            {
                decision = "AutoApproved";
            }
            else if (riskScore < 30)
            {
                decision = "AutoApproved";
                loadingPercentage = 10;
                adjustedPremium = basePremium * 1.1m;
            }
            else if (riskScore < 50)
            {
                decision = "RequiresReview";
                requiresMedicalExam = true;
            }
            else if (riskScore < 70)
            {
                decision = "RequiresDocuments";
                requiredDocuments = new List<string> { "Medical Certificate", "Lab Reports" };
            }
            else
            {
                decision = "Rejected";
                rejectionReason = "High risk factors detected. Unable to provide coverage at this time.";
            }

            var underwriting = new UnderwritingDecision
            {
                RegistrationSessionId = session.Id,
                CustomerProfileId = user.ProfileId,
                Decision = decision,
                RiskLevel = riskLevel,
                RiskScore = riskScore,
                IsAutoApprovalEligible = isAutoApprovalEligible,
                OriginalPremium = basePremium,
                AdjustedPremium = decision == "Rejected" ? null : adjustedPremium,
                PremiumLoadingPercentage = decision == "Rejected" ? null : loadingPercentage,
                RequestedCoverageAmount = session.SelectedCoverageAmount ?? 0,
                ApprovedCoverageAmount = decision == "Rejected" ? null : session.SelectedCoverageAmount,
                RequiresMedicalExam = requiresMedicalExam,
                RequiresAdditionalDocuments = requiredDocuments != null && requiredDocuments.Count > 0,
                RequiredDocumentsList = requiredDocuments != null ? JsonSerializer.Serialize(requiredDocuments) : null,
                RejectionReason = rejectionReason,
                DecisionBy = "System"
            };

            _context.UnderwritingDecisions.Add(underwriting);

            // Update session
            if (decision == "AutoApproved")
            {
                session.IsUnderwritingCompleted = true;
                session.CurrentStep = "UnderwritingApproved";
            }
            else if (decision == "Rejected")
            {
                session.RegistrationStatus = "Rejected";
                session.RejectionReason = rejectionReason;
                session.CurrentStep = "UnderwritingRejected";
            }
            else
            {
                session.CurrentStep = "UnderwritingPending";
            }
            
            session.LastUpdateDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Underwriting processed for session {sessionToken}: {decision}");

            return new UnderwritingResponse
            {
                Decision = decision,
                RiskLevel = riskLevel,
                IsAutoApproved = decision == "AutoApproved",
                FinalPremium = decision == "Rejected" ? null : adjustedPremium,
                FinalCoverageAmount = decision == "Rejected" ? null : session.SelectedCoverageAmount,
                RequiresMedicalExam = requiresMedicalExam,
                RequiresAdditionalDocuments = requiredDocuments != null && requiredDocuments.Count > 0,
                RequiredDocuments = requiredDocuments,
                RejectionReason = rejectionReason,
                Message = decision == "AutoApproved" ? "Your application has been approved!" : 
                         decision == "Rejected" ? rejectionReason :
                         "Your application requires additional review"
            };
        }

        private int CalculateRiskScore(HealthDeclaration health)
        {
            int score = 0;

            // BMI risk
            if (health.BMI < 18.5m || health.BMI > 30m) score += 10;
            else if (health.BMI > 25m) score += 5;

            // Smoking
            if (health.IsSmoker)
            {
                score += 15;
                if (health.SmokingPacksPerDay > 10) score += 10;
            }

            // Alcohol
            if (health.IsDrinker && health.AlcoholFrequency == "Daily") score += 10;
            else if (health.IsDrinker && health.AlcoholFrequency == "Regularly") score += 5;

            // Medical conditions
            if (health.HasHeartDisease) score += 25;
            if (health.HasDiabetes) score += 20;
            if (health.HasCancer) score += 30;
            if (health.HasHypertension) score += 15;
            if (health.HasMentalIllness) score += 10;

            // Hospitalization
            if (health.HasRecentHospitalization) score += 15;

            // High risk occupation
            if (health.HasHighRiskOccupation) score += 10;

            return score;
        }

        private string GetRiskLevel(int riskScore)
        {
            if (riskScore < 20) return "Low";
            if (riskScore < 40) return "Medium";
            if (riskScore < 60) return "High";
            return "VeryHigh";
        }

        // ===== Step 7: Payment =====
        public async Task<PaymentResponse> InitiatePaymentAsync(string sessionToken, InitiatePaymentRequest request)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            if (!session.IsUnderwritingCompleted)
            {
                throw new Exception("Underwriting must be completed first");
            }

            // TODO: Integrate with actual payment gateway
            // For now, simulate payment
            var paymentId = "PAY-" + Guid.NewGuid().ToString();

            _logger.LogInformation($"Payment initiated for session {sessionToken}: {paymentId}");

            return new PaymentResponse
            {
                IsSuccess = true,
                PaymentId = paymentId,
                PaymentUrl = $"https://payment-gateway.example.com/pay/{paymentId}",
                Status = "Pending",
                Message = "Please complete the payment to proceed"
            };
        }

        public async Task<bool> ConfirmPaymentAsync(string sessionToken, string paymentId)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null || string.IsNullOrEmpty(user.ProfileId))
            {
                throw new Exception("User profile not found");
            }

            // TODO: Verify payment with payment gateway
            // For now, assume payment is successful

            // Get underwriting decision
            var underwriting = await _context.UnderwritingDecisions
                .FirstOrDefaultAsync(u => u.RegistrationSessionId == session.Id);
            
            if (underwriting == null || underwriting.AdjustedPremium == null)
            {
                throw new Exception("Underwriting decision not found");
            }

            // Create payment record
            var payment = new Payment
            {
                PolicyId = 0, // Will be set after policy creation
                Amount = underwriting.AdjustedPremium.Value,
                PaymentMethod = "Online",
                PaymentDate = DateTime.UtcNow,
                Status = "Paid",
                TransactionId = paymentId,
                DueDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // Update session
            session.IsPaymentCompleted = true;
            session.CurrentStep = "PaymentCompleted";
            session.LastUpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Payment confirmed for session {sessionToken}: {paymentId}");
            return true;
        }

        // ===== Step 8: Policy Issuance =====
        public async Task<PolicyIssuanceResponse> IssuePolicyAsync(string sessionToken)
        {
            var session = await GetSessionAsync(sessionToken);
            if (session == null)
            {
                throw new Exception("Registration session not found");
            }

            if (!session.IsPaymentCompleted)
            {
                throw new Exception("Payment must be completed first");
            }

            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null || string.IsNullOrEmpty(user.ProfileId))
            {
                throw new Exception("User profile not found");
            }

            var underwriting = await _context.UnderwritingDecisions
                .FirstOrDefaultAsync(u => u.RegistrationSessionId == session.Id);
            
            if (underwriting == null)
            {
                throw new Exception("Underwriting decision not found");
            }

            // Generate policy number
            var policyNumber = $"POL-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

            // Create policy
            var policy = new InsurancePolicy
            {
                PolicyNumber = policyNumber,
                CustomerProfileId = user.ProfileId,
                ProductId = session.SelectedProductId ?? 0,
                CoverageAmount = underwriting.ApprovedCoverageAmount ?? 0,
                TermYears = session.SelectedTermYears ?? 0,
                Premium = underwriting.AdjustedPremium ?? 0,
                PaymentFrequency = session.SelectedPaymentFrequency ?? "",
                ApplicationDate = session.CreatedDate,
                ApprovalDate = DateTime.UtcNow,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(session.SelectedTermYears ?? 0),
                Status = "Active",
                ApprovedBy = underwriting.DecisionBy
            };

            _context.InsurancePolicies.Add(policy);
            await _context.SaveChangesAsync();

            // Update payment with policy ID
            var payment = await _context.Payments
                .Where(p => p.PolicyId == 0)
                .OrderByDescending(p => p.PaymentDate)
                .FirstOrDefaultAsync();
            
            if (payment != null)
            {
                payment.PolicyId = policy.Id;
            }

            // Update session
            session.IsPolicyIssued = true;
            session.CurrentStep = "PolicyIssued";
            session.RegistrationStatus = "Completed";
            session.CompletedDate = DateTime.UtcNow;
            session.LastUpdateDate = DateTime.UtcNow;

            // Update user role to Customer if not already
            var isInRole = await _userManager.IsInRoleAsync(user, AppRoles.Customer);
            if (!isInRole)
            {
                await _userManager.AddToRoleAsync(user, AppRoles.Customer);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Policy issued for session {sessionToken}: {policyNumber}");

            // TODO: Generate PDF and send email
            return new PolicyIssuanceResponse
            {
                IsSuccess = true,
                PolicyNumber = policyNumber,
                StartDate = policy.StartDate ?? DateTime.UtcNow,
                EndDate = policy.EndDate ?? DateTime.UtcNow.AddYears(1),
                PolicyDocumentUrl = $"/api/policies/{policy.Id}/document",
                Message = "Congratulations! Your insurance policy has been issued successfully."
            };
        }
    }
}



