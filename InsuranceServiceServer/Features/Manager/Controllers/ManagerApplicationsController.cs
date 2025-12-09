using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Shared.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Manager.Controllers
{
    /// <summary>
    /// MANAGER (và ADMIN) xem các đơn Application đang Pending (Submitted / Under Review),
    /// xem chi tiết, đưa ra quyết định cuối cùng (Approve / Reject)
    /// và gửi email thông báo cho Customer.
    /// </summary>
    [ApiController]
    [Route("api/manager/applications")]
    [Authorize(Roles = "Manager,Admin")]
    public class ManagerApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ManagerApplicationsController> _logger;
        private readonly IEmailService _emailService;

        public ManagerApplicationsController(
            AppDbContext context,
            ILogger<ManagerApplicationsController> logger,
            IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        // =========================================================
        // Helper: Khi Manager approve, tạo Policy + 1 Payment demo
        // =========================================================
        /// <summary>
        /// Khi Manager approve 1 Application, tạo InsurancePolicy + 1 payment demo (Pending)
        /// </summary>
        private async Task<(InsurancePolicy policy, Payment payment)> CreatePolicyAndDemoPaymentAsync(Application app)
        {
            // 1. Tìm customer profile của User đã nộp đơn
            var customerProfile = await _context.CustomerProfiles
                .FirstOrDefaultAsync(c => c.UserId == app.UserId);

            if (customerProfile == null)
            {
                throw new NotFoundException("Customer profile not found for application user.");
            }

            // 2. Lấy thông tin Product
            var product = await _context.InsuranceProducts
                .FirstOrDefaultAsync(p => p.Id == app.ProductId);

            if (product == null)
            {
                throw new NotFoundException("Insurance product not found for application.");
            }

            // 3. Lấy các giá trị cần thiết từ Application
            var coverageAmount = app.CoverageAmount;
            var termYears = app.TermYears;
            var paymentFreq = app.PaymentFrequency;   // "Monthly", "Yearly", ...
            var premium = app.PremiumAmount;          // premium đã tính sẵn trong Application

            // 4. Generate policy number
            var policyCount = await _context.InsurancePolicies.CountAsync();
            var policyNumber = $"POL-{product.ProductType.ToUpper()}-{(policyCount + 1):D6}";

            var startDate = DateTime.UtcNow.Date;
            var endDate = startDate.AddYears(termYears);

            var policy = new InsurancePolicy
            {
                PolicyNumber = policyNumber,
                CustomerProfileId = customerProfile.Id,
                ProductId = product.Id,
                CoverageAmount = coverageAmount,
                Premium = premium,
                PaymentFrequency = paymentFreq,
                TermYears = termYears,
                StartDate = startDate,
                EndDate = endDate,
                ApplicationDate = app.SubmittedAt ?? app.CreatedAt,
                ApprovalDate = DateTime.UtcNow,
                Status = "Pending" // chờ khách thanh toán kỳ đầu
            };

            await _context.InsurancePolicies.AddAsync(policy);
            await _context.SaveChangesAsync(); // để có policy.Id

            // 5. Tạo 1 Payment demo (Pending) cho kỳ thanh toán đầu tiên
            var transactionId = $"TXN-{policyNumber}-{DateTime.UtcNow:yyyyMMddHHmmss}";

            var payment = new Payment
            {
                PolicyId = policy.Id,
                TransactionId = transactionId,
                Amount = premium,
                DueDate = DateTime.UtcNow.Date.AddMonths(1),    // hạn thanh toán kỳ đầu
                PaymentDate = null,
                PaymentFrequency = paymentFreq,
                IsLumpSum = paymentFreq == "LumpSum",
                PaymentNumber = 1,
                PaymentMethod = "Online",
                Status = "Pending",
                ReceiptUrl = null,
                PaymentNote = "Initial premium payment"
            };

            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();

            return (policy, payment);
        }

        // =========================================================
        // 1. Danh sách Pending (Status = "Submitted" / "Under Review")
        // =========================================================
        [HttpGet]
        [HttpGet("submitted")]
        public async Task<IActionResult> GetSubmittedApplications()
        {
            try
            {
                var baseQuery = _context.Applications
                    .Include(a => a.Product)
                    .Where(a => a.Status == "Submitted" || a.Status == "Under Review")
                    .OrderBy(a => a.SubmittedAt ?? a.CreatedAt)
                    .AsNoTracking();

                var apps = await baseQuery.ToListAsync();

                var userIds = apps.Select(a => a.UserId).Distinct().ToList();
                var profiles = await _context.CustomerProfiles
                    .Where(p => userIds.Contains(p.UserId))
                    .ToDictionaryAsync(p => p.UserId, p => p.FullName);

                var applications = apps
                    .Select(a => new
                    {
                        a.Id,
                        a.ApplicationNumber,
                        a.UserId,
                        a.Status,
                        a.ProductId,
                        ProductName = a.Product != null ? a.Product.ProductName : "N/A",
                        ProductType = a.Product != null ? a.Product.ProductType : "N/A",
                        a.CoverageAmount,
                        a.TermYears,
                        a.PaymentFrequency,
                        ApplicantName = profiles.TryGetValue(a.UserId, out var fullName)
                            ? fullName
                            : null,
                        a.SubmittedAt,
                        a.ReviewedAt,
                        a.ReviewNotes
                    })
                    .ToList();

                return Ok(new
                {
                    success = true,
                    count = applications.Count,
                    applications
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading submitted applications for manager.");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while loading applications."
                });
            }
        }

        // =========================================================
        // 2. Chi tiết 1 đơn Application
        // =========================================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetApplicationDetails(int id)
        {
            try
            {
                var application = await _context.Applications
                    .Include(a => a.Product)
                    .Include(a => a.Beneficiaries)
                    .Include(a => a.HealthDeclaration)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (application == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Application with ID {id} not found."
                    });
                }

                // Lấy CustomerProfile (nếu có)
                var customerProfile = await _context.CustomerProfiles
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.UserId == application.UserId);

                var applicantName =
                    customerProfile != null
                        ? (!string.IsNullOrWhiteSpace(customerProfile.FullName)
                            ? customerProfile.FullName
                            : $"{customerProfile.FirstName} {customerProfile.LastName}".Trim())
                        : null;

                var details = new
                {
                    application.Id,
                    application.ApplicationNumber,
                    application.UserId,
                    application.Status,
                    application.ProductId,
                    ProductName = application.Product != null ? application.Product.ProductName : "N/A",
                    ProductType = application.Product != null ? application.Product.ProductType : "N/A",
                    application.CoverageAmount,
                    application.TermYears,
                    application.PaymentFrequency,
                    ApplicantName = applicantName,
                    application.CreatedAt,
                    application.SubmittedAt,
                    application.ReviewedAt,
                    application.UpdatedAt,
                    application.ReviewNotes,
                    application.ReviewedBy,

                    // ========= CustomerProfile chi tiết =========
                    CustomerProfile = customerProfile == null
                        ? null
                        : new
                        {
                            customerProfile.FirstName,
                            customerProfile.LastName,
                            customerProfile.FullName,
                            customerProfile.DateOfBirth,
                            customerProfile.Gender,
                            customerProfile.Email,
                            PhoneNumber = customerProfile.PhoneNumber,
                            customerProfile.NationalId,
                            customerProfile.Occupation,
                            customerProfile.OccupationOther,
                            customerProfile.MonthlyIncome,
                            customerProfile.Address,
                            customerProfile.City,
                            PostalCode = customerProfile.PostalCode,
                            customerProfile.EmergencyContactName,
                            customerProfile.EmergencyContactPhone,
                            customerProfile.EmergencyContactGender,
                            customerProfile.EmergencyContactRelationship,
                            customerProfile.EmergencyContactRelationshipOther
                        },

                    // ========= HealthDeclaration chi tiết =========
                    HealthDeclaration = application.HealthDeclaration == null
                        ? null
                        : new
                        {
                            application.HealthDeclaration.Id,

                            // Vital stats
                            application.HealthDeclaration.Height,
                            application.HealthDeclaration.Weight,
                            application.HealthDeclaration.BMI,
                            application.HealthDeclaration.BloodPressureSystolic,
                            application.HealthDeclaration.BloodPressureDiastolic,
                            application.HealthDeclaration.CholesterolLevel,
                            application.HealthDeclaration.RestingHeartRate,

                            // Lifestyle
                            application.HealthDeclaration.SmokingStatus,
                            application.HealthDeclaration.IsSmoker,
                            application.HealthDeclaration.SmokingPacksPerDay,
                            application.HealthDeclaration.SmokingYears,
                            AlcoholConsumptionLevel = application.HealthDeclaration.AlcoholConsumptionLevel,
                            application.HealthDeclaration.AlcoholUnitsPerWeek,
                            application.HealthDeclaration.UsesDrugs,
                            application.HealthDeclaration.DrugDetails,
                            application.HealthDeclaration.ExerciseLevel,
                            application.HealthDeclaration.ExerciseHoursPerWeek,
                            application.HealthDeclaration.SleepQuality,
                            application.HealthDeclaration.AverageSleepHours,
                            application.HealthDeclaration.StressLevel,
                            application.HealthDeclaration.DietQuality,

                            // Major diseases & dates
                            application.HealthDeclaration.HasHeartDisease,
                            application.HealthDeclaration.HeartDiseaseDiagnosisDate,
                            application.HealthDeclaration.HeartDiseaseTreatmentStatus,
                            application.HealthDeclaration.HasStroke,
                            application.HealthDeclaration.StrokeDiagnosisDate,
                            application.HealthDeclaration.StrokeTreatmentStatus,
                            application.HealthDeclaration.HasCancer,
                            application.HealthDeclaration.CancerDetails,
                            application.HealthDeclaration.CancerDiagnosisDate,
                            application.HealthDeclaration.CancerTreatmentStatus,
                            application.HealthDeclaration.HasDiabetes,
                            application.HealthDeclaration.DiabetesType,
                            application.HealthDeclaration.DiabetesDiagnosisDate,
                            application.HealthDeclaration.DiabetesTreatmentStatus,
                            application.HealthDeclaration.DiabetesHbA1c,
                            application.HealthDeclaration.HasHighBloodPressure,
                            application.HealthDeclaration.HighBloodPressureDiagnosisDate,
                            application.HealthDeclaration.HighBloodPressureTreatmentStatus,
                            application.HealthDeclaration.HasHighCholesterol,
                            application.HealthDeclaration.HighCholesterolDiagnosisDate,
                            application.HealthDeclaration.HighCholesterolTreatmentStatus,
                            application.HealthDeclaration.HasKidneyDisease,
                            application.HealthDeclaration.KidneyDiseaseDiagnosisDate,
                            application.HealthDeclaration.KidneyDiseaseTreatmentStatus,
                            application.HealthDeclaration.HasLiverDisease,
                            application.HealthDeclaration.LiverDiseaseDiagnosisDate,
                            application.HealthDeclaration.LiverDiseaseTreatmentStatus,
                            application.HealthDeclaration.HasMentalHealthCondition,
                            application.HealthDeclaration.MentalHealthDetails,
                            application.HealthDeclaration.MentalHealthDiagnosisDate,
                            application.HealthDeclaration.MentalHealthTreatmentStatus,
                            application.HealthDeclaration.HasHIV,
                            application.HealthDeclaration.HIVDiagnosisDate,
                            application.HealthDeclaration.HIVTreatmentStatus,
                            application.HealthDeclaration.LastMedicalCheckupDate,

                            // Medical history JSON / events
                            application.HealthDeclaration.MedicalConditionsJson,
                            application.HealthDeclaration.MedicalConditionDetailsJson,
                            application.HealthDeclaration.CurrentMedicationsJson,
                            application.HealthDeclaration.HospitalizationHistory,
                            application.HealthDeclaration.HasSurgeryLast5Years,
                            application.HealthDeclaration.SurgeryDetails,
                            application.HealthDeclaration.HasPendingMedicalTests,
                            application.HealthDeclaration.PendingTestsDetails,
                            application.HealthDeclaration.HasPlannedProcedures,
                            application.HealthDeclaration.PlannedProceduresDetails,

                            // Family history
                            application.HealthDeclaration.FamilyHeartDisease,
                            application.HealthDeclaration.FamilyCancer,
                            application.HealthDeclaration.FamilyDiabetes,
                            application.HealthDeclaration.FamilyStroke,
                            application.HealthDeclaration.FamilyOtherConditions,
                            application.HealthDeclaration.FatherDeceased,
                            application.HealthDeclaration.FatherAgeAtDeath,
                            application.HealthDeclaration.FatherCauseOfDeath,
                            application.HealthDeclaration.MotherDeceased,
                            application.HealthDeclaration.MotherAgeAtDeath,
                            application.HealthDeclaration.MotherCauseOfDeath,

                            // Occupation & risk
                            application.HealthDeclaration.Occupation,
                            application.HealthDeclaration.HasOccupationalHazards,
                            application.HealthDeclaration.OccupationHazardsDetails,
                            application.HealthDeclaration.ParticipatesInDangerousSports,
                            application.HealthDeclaration.DangerousSportsDetails,

                            // Pregnancy / disability / life-threatening
                            application.HealthDeclaration.IsPregnant,
                            application.HealthDeclaration.PregnancyDueDate,
                            application.HealthDeclaration.HasPregnancyComplications,
                            application.HealthDeclaration.PregnancyComplicationDetails,
                            application.HealthDeclaration.HasDisability,
                            application.HealthDeclaration.DisabilityDetails,
                            application.HealthDeclaration.HasLifeThreateningCondition,
                            application.HealthDeclaration.LifeThreateningConditionDetails,

                            // Consent & audit
                            application.HealthDeclaration.MedicalRecordsConsent,
                            application.HealthDeclaration.CreatedDate,
                            application.HealthDeclaration.ReviewedDate,
                            application.HealthDeclaration.ReviewNotes
                        },

                    // ========= Beneficiaries =========
                    Beneficiaries = application.Beneficiaries
                        .Select(b => new
                        {
                            b.Id,
                            b.ApplicationId,
                            b.Type,
                            b.FullName,
                            b.Relationship,
                            b.RelationshipOther,
                            b.NationalId,
                            b.SSN,
                            b.DateOfBirth,
                            b.Gender,
                            b.Phone,
                            b.Email,
                            b.Percentage,
                            b.IsMinor,
                            b.Trustee,
                            b.TrusteeRelationship,
                            b.TrusteeRelationshipOther,
                            b.PerStirpes,
                            b.IsIrrevocable,
                            b.IsActive,
                            b.CreatedAt,
                            b.UpdatedAt
                        })
                        .ToList()
                };

                return Ok(new
                {
                    success = true,
                    application = details
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading application {ApplicationId} details for manager.", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving application details."
                });
            }
        }

        // =========================================================
        // 3. Manager quyết định: Approve / Reject
        // =========================================================
        public class ManagerDecisionRequest
        {
            public string Status { get; set; } = default!; // "Approved" | "Rejected"
            public string? ReviewNotes { get; set; }
        }

        [HttpPatch("{id:int}/decision")]
        public async Task<IActionResult> Decide(int id, [FromBody] ManagerDecisionRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Status))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid decision request data."
                    });
                }

                var allowedStatuses = new[] { "Approved", "Rejected" };
                if (!allowedStatuses.Contains(request.Status))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid status value. Only 'Approved' or 'Rejected' are allowed."
                    });
                }

                var application = await _context.Applications
                    .Include(a => a.Product)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (application == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Application with ID {id} not found."
                    });
                }

                // Nếu đã có quyết định cuối cùng rồi thì không cho sửa nữa
                if (application.Status == "Approved" || application.Status == "Rejected")
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "This application already has a final decision."
                    });
                }

                // Chỉ cho quyết định nếu đang Submitted hoặc Under Review
                if (application.Status != "Submitted" && application.Status != "Under Review")
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Only submitted or under-review applications can be decided by manager."
                    });
                }

                var managerId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "UnknownManager";

                application.Status = request.Status;
                application.ReviewNotes = request.ReviewNotes ?? application.ReviewNotes;
                application.ReviewedBy = managerId;
                application.ReviewedAt = DateTime.UtcNow;
                application.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Nếu Approved thì tạo Policy + Payment
                InsurancePolicy? createdPolicy = null;
                Payment? createdPayment = null;

                if (request.Status == "Approved")
                {
                    (createdPolicy, createdPayment) = await CreatePolicyAndDemoPaymentAsync(application);
                }

                // Gửi email thông báo như cũ
                await SendDecisionEmailAsync(application, request.Status, request.ReviewNotes);

                _logger.LogInformation(
                    "Manager {UserId} decided application {ApplicationId} as {Status}",
                    managerId, id, request.Status);

                return Ok(new
                {
                    success = true,
                    message = $"Application {id} has been {request.Status.ToLowerInvariant()}",
                    applicationId = application.Id,
                    newStatus = application.Status,

                    // trả thêm policy & payment nếu có (Approved)
                    policy = createdPolicy == null ? null : new
                    {
                        createdPolicy.Id,
                        createdPolicy.PolicyNumber,
                        createdPolicy.Status,
                        createdPolicy.Premium
                    },
                    payment = createdPayment == null ? null : new
                    {
                        createdPayment.Id,
                        createdPayment.Amount,
                        createdPayment.Status,
                        createdPayment.DueDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error making decision for application {ApplicationId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while making the decision."
                });
            }
        }

        // =========================================================
        // 4. Gửi email thông báo cho Customer
        // =========================================================
        private async Task SendDecisionEmailAsync(Application application, string decisionStatus, string? notes)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == application.UserId);

                if (user == null || string.IsNullOrWhiteSpace(user.Email))
                {
                    _logger.LogWarning(
                        "Cannot send decision email: user or email not found for application {ApplicationId}",
                        application.Id);
                    return;
                }

                var customerProfile = await _context.CustomerProfiles
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.UserId == application.UserId);

                var applicantName =
                    customerProfile?.FullName
                    ?? user.UserName
                    ?? "Customer";

                var email = user.Email;

                var subject = $"Your insurance application {application.ApplicationNumber} has been {decisionStatus}";

                var htmlBody = $@"
<p>Dear {applicantName},</p>

<p>Your insurance application with number <strong>{application.ApplicationNumber}</strong> has been <strong>{decisionStatus}</strong>.</p>

<p><strong>Product:</strong> {application.Product?.ProductName}<br/>
<strong>Coverage Amount:</strong> {application.CoverageAmount:N0}<br/>
<strong>Term:</strong> {application.TermYears} years<br/>
<strong>Payment Frequency:</strong> {application.PaymentFrequency}</p>

<p><strong>Manager notes:</strong><br/>
{(string.IsNullOrWhiteSpace(notes) ? "No additional notes." : notes!.Replace("\n", "<br/>"))}</p>

<p>Thank you for choosing our services.</p>
";

                await _emailService.SendEmailAsync(email, subject, htmlBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error sending decision email for application {ApplicationId}", application.Id);
            }
        }
    }
}
