using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Temp;

public partial class InsuranceServiceDbContext : DbContext
{
    public InsuranceServiceDbContext()
    {
    }

    public InsuranceServiceDbContext(DbContextOptions<InsuranceServiceDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Application> Applications { get; set; }

    public virtual DbSet<ApplicationDraft> ApplicationDrafts { get; set; }

    public virtual DbSet<BaseDocument> BaseDocuments { get; set; }

    public virtual DbSet<Beneficiary> Beneficiaries { get; set; }

    public virtual DbSet<ClaimDocument> ClaimDocuments { get; set; }

    public virtual DbSet<CustomerProfile> CustomerProfiles { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<EmailVerification> EmailVerifications { get; set; }

    public virtual DbSet<EmployeeProfile> EmployeeProfiles { get; set; }

    public virtual DbSet<FinancialDocument> FinancialDocuments { get; set; }

    public virtual DbSet<HealthDeclaration> HealthDeclarations { get; set; }

    public virtual DbSet<HealthDocument> HealthDocuments { get; set; }

    public virtual DbSet<IdentityDocument> IdentityDocuments { get; set; }

    public virtual DbSet<InsuranceClaim> InsuranceClaims { get; set; }

    public virtual DbSet<InsurancePlan> InsurancePlans { get; set; }

    public virtual DbSet<InsurancePolicy> InsurancePolicies { get; set; }

    public virtual DbSet<InsuranceProduct> InsuranceProducts { get; set; }

    public virtual DbSet<Kycdocument> Kycdocuments { get; set; }

    public virtual DbSet<Kycverification> Kycverifications { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PhoneVerification> PhoneVerifications { get; set; }

    public virtual DbSet<PolicyDocument> PolicyDocuments { get; set; }

    public virtual DbSet<PolicyLoan> PolicyLoans { get; set; }

    public virtual DbSet<PropertyInfo> PropertyInfos { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<RegistrationSession> RegistrationSessions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RoleClaim> RoleClaims { get; set; }

    public virtual DbSet<TravelInfo> TravelInfos { get; set; }

    public virtual DbSet<UnderwritingDecision> UnderwritingDecisions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserClaim> UserClaims { get; set; }

    public virtual DbSet<UserLogin> UserLogins { get; set; }

    public virtual DbSet<UserToken> UserTokens { get; set; }

    public virtual DbSet<VehicleInfo> VehicleInfos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=InsuranceServiceDb;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasIndex(e => e.HealthDeclarationId, "IX_Applications_HealthDeclarationId");

            entity.HasIndex(e => e.ProductId, "IX_Applications_ProductId");

            entity.Property(e => e.ApplicationNumber).HasMaxLength(20);
            entity.Property(e => e.CoverageAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PaymentFrequency).HasMaxLength(50);
            entity.Property(e => e.PaymentPerPeriod).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PremiumAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ReviewNotes).HasMaxLength(500);
            entity.Property(e => e.ReviewedBy).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TotalPremiumAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.HealthDeclaration).WithMany(p => p.Applications).HasForeignKey(d => d.HealthDeclarationId);

            entity.HasOne(d => d.Product).WithMany(p => p.Applications).HasForeignKey(d => d.ProductId);
        });

        modelBuilder.Entity<ApplicationDraft>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_ApplicationDrafts_UserId");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.ApplicationType).HasMaxLength(50);
            entity.Property(e => e.Notes).HasMaxLength(500);

            entity.HasOne(d => d.User).WithMany(p => p.ApplicationDrafts).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<BaseDocument>(entity =>
        {
            entity.ToTable("BaseDocument");
        });

        modelBuilder.Entity<Beneficiary>(entity =>
        {
            entity.HasIndex(e => e.ApplicationId, "IX_Beneficiaries_ApplicationId");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Email)
                .HasMaxLength(200)
                .HasDefaultValue("");
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasDefaultValue("");
            entity.Property(e => e.NationalId).HasMaxLength(20);
            entity.Property(e => e.Percentage).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasDefaultValue("");
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.Relationship).HasMaxLength(50);
            entity.Property(e => e.RelationshipOther).HasMaxLength(50);
            entity.Property(e => e.Ssn).HasColumnName("SSN");
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.Trustee).HasMaxLength(100);
            entity.Property(e => e.TrusteeRelationship).HasMaxLength(50);
            entity.Property(e => e.TrusteeRelationshipOther).HasMaxLength(50);
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasDefaultValue("");

            entity.HasOne(d => d.Application).WithMany(p => p.Beneficiaries).HasForeignKey(d => d.ApplicationId);
        });

        modelBuilder.Entity<ClaimDocument>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.ClaimDocument).HasForeignKey<ClaimDocument>(d => d.Id);
        });

        modelBuilder.Entity<CustomerProfile>(entity =>
        {
            entity.HasIndex(e => e.Email, "IX_CustomerProfiles_Email");

            entity.HasIndex(e => e.NationalId, "IX_CustomerProfiles_NationalId");

            entity.Property(e => e.LifetimeValue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MonthlyIncome).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<EmailVerification>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_EmailVerifications_UserId");

            entity.Property(e => e.Otp).HasColumnName("OTP");

            entity.HasOne(d => d.User).WithMany(p => p.EmailVerifications).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<EmployeeProfile>(entity =>
        {
            entity.HasIndex(e => e.DepartmentId, "IX_EmployeeProfiles_DepartmentId");

            entity.HasIndex(e => e.EmployeeCode, "IX_EmployeeProfiles_EmployeeCode").IsUnique();

            entity.Property(e => e.AchievedSales).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ApprovalLimit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ClaimApprovalLimit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CommissionRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Salary).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SalesTarget).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Department).WithMany(p => p.EmployeeProfiles)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<FinancialDocument>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.FinancialDocument).HasForeignKey<FinancialDocument>(d => d.Id);
        });

        modelBuilder.Entity<HealthDeclaration>(entity =>
        {
            entity.HasIndex(e => e.RegistrationSessionId, "IX_HealthDeclarations_RegistrationSessionId");

            entity.Property(e => e.AlcoholConsumptionLevel).HasDefaultValue("");
            entity.Property(e => e.AverageSleepHours).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Bmi)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("BMI");
            entity.Property(e => e.DiabetesHbA1c).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DietQuality).HasDefaultValue("");
            entity.Property(e => e.ExerciseLevel).HasDefaultValue("");
            entity.Property(e => e.HasHiv).HasColumnName("HasHIV");
            entity.Property(e => e.Height).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HivdiagnosisDate).HasColumnName("HIVDiagnosisDate");
            entity.Property(e => e.HivtreatmentStatus).HasColumnName("HIVTreatmentStatus");
            entity.Property(e => e.SleepQuality).HasDefaultValue("");
            entity.Property(e => e.SmokingStatus).HasDefaultValue("");
            entity.Property(e => e.StressLevel).HasDefaultValue("");
            entity.Property(e => e.Weight).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.RegistrationSession).WithMany(p => p.HealthDeclarations).HasForeignKey(d => d.RegistrationSessionId);
        });

        modelBuilder.Entity<HealthDocument>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.HealthDocument).HasForeignKey<HealthDocument>(d => d.Id);
        });

        modelBuilder.Entity<IdentityDocument>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.IdentityDocument).HasForeignKey<IdentityDocument>(d => d.Id);
        });

        modelBuilder.Entity<InsuranceClaim>(entity =>
        {
            entity.HasIndex(e => e.ClaimNumber, "IX_InsuranceClaims_ClaimNumber").IsUnique();

            entity.HasIndex(e => e.PolicyId, "IX_InsuranceClaims_PolicyId");

            entity.Property(e => e.ApprovedAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ClaimAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Priority).HasDefaultValue("");

            entity.HasOne(d => d.Policy).WithMany(p => p.InsuranceClaims)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<InsurancePlan>(entity =>
        {
            entity.HasIndex(e => e.ProductId, "IX_InsurancePlans_ProductId");

            entity.Property(e => e.AccidentalDeathBenefit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.AgeMultiplier1825)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("AgeMultiplier18_25");
            entity.Property(e => e.AgeMultiplier2635)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("AgeMultiplier26_35");
            entity.Property(e => e.AgeMultiplier3645)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("AgeMultiplier36_45");
            entity.Property(e => e.AgeMultiplier4655)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("AgeMultiplier46_55");
            entity.Property(e => e.AgeMultiplier5665)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("AgeMultiplier56_65");
            entity.Property(e => e.BasePremiumAnnual).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BasePremiumLumpSum).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BasePremiumMonthly).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BasePremiumQuarterly).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BasePremiumSemiAnnual).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CoverageAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CriticalIllnessBenefit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DisabilityBenefit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.FemaleMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HealthExcellentMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HealthFairMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HealthGoodMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HealthPoorMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MaleMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OccupationHighRiskMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OccupationLowRiskMultiplier).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OccupationMediumRiskMultiplier).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Product).WithMany(p => p.InsurancePlans).HasForeignKey(d => d.ProductId);
        });

        modelBuilder.Entity<InsurancePolicy>(entity =>
        {
            entity.HasIndex(e => e.CustomerProfileId, "IX_InsurancePolicies_CustomerProfileId");

            entity.HasIndex(e => e.PolicyNumber, "IX_InsurancePolicies_PolicyNumber").IsUnique();

            entity.HasIndex(e => e.ProductId, "IX_InsurancePolicies_ProductId");

            entity.Property(e => e.CoverageAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PaymentPerPeriod).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Premium).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalPremiumAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.CustomerProfile).WithMany(p => p.InsurancePolicies)
                .HasForeignKey(d => d.CustomerProfileId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Product).WithMany(p => p.InsurancePolicies)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<InsuranceProduct>(entity =>
        {
            entity.Property(e => e.AdminFee).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LumpSumDiscount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MedicalCheckupFee).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MonthlySurcharge).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PolicyIssuanceFee).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProcessingFee).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.QuarterlySurcharge).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SemiAnnualSurcharge).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Kycdocument>(entity =>
        {
            entity.ToTable("KYCDocuments");

            entity.Property(e => e.VerificationScore).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Kycverification>(entity =>
        {
            entity.ToTable("KYCVerifications");

            entity.HasIndex(e => e.RegistrationSessionId, "IX_KYCVerifications_RegistrationSessionId");

            entity.Property(e => e.AuthenticityScore).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.FaceMatchScore).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OcrresponseJson).HasColumnName("OCRResponseJson");

            entity.HasOne(d => d.RegistrationSession).WithMany(p => p.Kycverifications).HasForeignKey(d => d.RegistrationSessionId);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasIndex(e => e.PolicyId, "IX_Payments_PolicyId");

            entity.HasIndex(e => e.TransactionId, "IX_Payments_TransactionId").IsUnique();

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Policy).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PhoneVerification>(entity =>
        {
            entity.HasIndex(e => new { e.PhoneNumber, e.IsVerified }, "IX_PhoneVerifications_PhoneNumber_IsVerified");

            entity.HasIndex(e => e.UserId, "IX_PhoneVerifications_UserId");

            entity.Property(e => e.Otp).HasColumnName("OTP");

            entity.HasOne(d => d.User).WithMany(p => p.PhoneVerifications).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<PolicyDocument>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.IdNavigation).WithOne(p => p.PolicyDocument).HasForeignKey<PolicyDocument>(d => d.Id);
        });

        modelBuilder.Entity<PolicyLoan>(entity =>
        {
            entity.HasIndex(e => e.LoanNumber, "IX_PolicyLoans_LoanNumber").IsUnique();

            entity.HasIndex(e => e.PolicyId, "IX_PolicyLoans_PolicyId");

            entity.Property(e => e.InterestRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LoanAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MaxLoanAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MonthlyRepayment).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OutstandingAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Policy).WithMany(p => p.PolicyLoans)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PropertyInfo>(entity =>
        {
            entity.HasIndex(e => new { e.Address, e.City }, "IX_PropertyInfos_Address_City");

            entity.HasIndex(e => e.ApplicationId, "IX_PropertyInfos_ApplicationId").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.CommercialUseDetails).HasMaxLength(200);
            entity.Property(e => e.ConstructionType).HasMaxLength(50);
            entity.Property(e => e.ContentsValue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DistanceToFireStation).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.DistanceToPoliceStation).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.EarthquakeRiskLevel).HasMaxLength(50);
            entity.Property(e => e.FloodRiskLevel).HasMaxLength(50);
            entity.Property(e => e.FloorArea).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.FloorMaterial).HasMaxLength(50);
            entity.Property(e => e.HasCctv).HasColumnName("HasCCTV");
            entity.Property(e => e.InspectionReportPath).HasMaxLength(500);
            entity.Property(e => e.KnownDefects).HasMaxLength(1000);
            entity.Property(e => e.LandArea).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.MortgageProvider).HasMaxLength(100);
            entity.Property(e => e.OccupancyType).HasMaxLength(50);
            entity.Property(e => e.OutstandingLoanAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.OwnerNationalId).HasMaxLength(20);
            entity.Property(e => e.OwnershipType).HasMaxLength(50);
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.PreviousInsurerName).HasMaxLength(100);
            entity.Property(e => e.PropertyCondition).HasMaxLength(50);
            entity.Property(e => e.PropertyDeedPath).HasMaxLength(500);
            entity.Property(e => e.PropertyPhotoPaths).HasMaxLength(500);
            entity.Property(e => e.PropertyType).HasMaxLength(50);
            entity.Property(e => e.PropertyValue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PurchasePrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.RoofType).HasMaxLength(50);
            entity.Property(e => e.TotalClaimAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ValuationReportPath).HasMaxLength(500);
            entity.Property(e => e.WallMaterial).HasMaxLength(50);
            entity.Property(e => e.Ward).HasMaxLength(100);

            entity.HasOne(d => d.Application).WithOne(p => p.PropertyInfo).HasForeignKey<PropertyInfo>(d => d.ApplicationId);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_RefreshTokens_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<RegistrationSession>(entity =>
        {
            entity.HasIndex(e => e.CreatedPolicyId, "IX_RegistrationSessions_CreatedPolicyId");

            entity.Property(e => e.IsKyccompleted).HasColumnName("IsKYCCompleted");
            entity.Property(e => e.SelectedCoverageAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.CreatedPolicy).WithMany(p => p.RegistrationSessions).HasForeignKey(d => d.CreatedPolicyId);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedName] IS NOT NULL)");

            entity.Property(e => e.Name).HasMaxLength(256);
            entity.Property(e => e.NormalizedName).HasMaxLength(256);
        });

        modelBuilder.Entity<RoleClaim>(entity =>
        {
            entity.HasIndex(e => e.RoleId, "IX_RoleClaims_RoleId");

            entity.HasOne(d => d.Role).WithMany(p => p.RoleClaims).HasForeignKey(d => d.RoleId);
        });

        modelBuilder.Entity<TravelInfo>(entity =>
        {
            entity.HasIndex(e => e.ApplicationId, "IX_TravelInfos_ApplicationId").IsUnique();

            entity.HasIndex(e => new { e.DepartureDate, e.ReturnDate }, "IX_TravelInfos_DepartureDate_ReturnDate");

            entity.Property(e => e.AccommodationCost).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.AccommodationType).HasMaxLength(50);
            entity.Property(e => e.Destination).HasMaxLength(100);
            entity.Property(e => e.DestinationDetails).HasMaxLength(500);
            entity.Property(e => e.DestinationRiskLevel).HasMaxLength(50);
            entity.Property(e => e.EmergencyContactName).HasMaxLength(100);
            entity.Property(e => e.EmergencyContactPhone).HasMaxLength(20);
            entity.Property(e => e.EmergencyContactRelationship).HasMaxLength(50);
            entity.Property(e => e.FlightDetails).HasMaxLength(500);
            entity.Property(e => e.FlightTicketPath).HasMaxLength(500);
            entity.Property(e => e.HighRiskRegionDetails).HasMaxLength(500);
            entity.Property(e => e.HotelBookingPath).HasMaxLength(500);
            entity.Property(e => e.ItineraryPath).HasMaxLength(500);
            entity.Property(e => e.LuggageCoverage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MedicalCoverageAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.NonRefundableDeposit).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PassportCopyPath).HasMaxLength(500);
            entity.Property(e => e.PersonalLiabilityCoverage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PreExistingConditionsDetails).HasMaxLength(1000);
            entity.Property(e => e.PreviousClaimAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PrimaryTransport).HasMaxLength(50);
            entity.Property(e => e.PurposeDetails).HasMaxLength(500);
            entity.Property(e => e.RiskLevel).HasMaxLength(50);
            entity.Property(e => e.SecondaryEmergencyContactName).HasMaxLength(100);
            entity.Property(e => e.SecondaryEmergencyContactPhone).HasMaxLength(20);
            entity.Property(e => e.TotalTripCost).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TravelAdvisoryDetails).HasMaxLength(1000);
            entity.Property(e => e.TravelPurpose).HasMaxLength(50);
            entity.Property(e => e.TripCancellationCoverage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TripType).HasMaxLength(50);
            entity.Property(e => e.VisaCopyPath).HasMaxLength(500);

            entity.HasOne(d => d.Application).WithOne(p => p.TravelInfo).HasForeignKey<TravelInfo>(d => d.ApplicationId);
        });

        modelBuilder.Entity<UnderwritingDecision>(entity =>
        {
            entity.HasIndex(e => e.PolicyId, "IX_UnderwritingDecisions_PolicyId");

            entity.HasIndex(e => e.RegistrationSessionId, "IX_UnderwritingDecisions_RegistrationSessionId");

            entity.Property(e => e.AdjustedPremium).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ApprovedCoverageAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OriginalPremium).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PremiumLoadingPercentage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.RequestedCoverageAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Policy).WithMany(p => p.UnderwritingDecisions).HasForeignKey(d => d.PolicyId);

            entity.HasOne(d => d.RegistrationSession).WithMany(p => p.UnderwritingDecisions).HasForeignKey(d => d.RegistrationSessionId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

            entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedUserName] IS NOT NULL)");

            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
            entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
            entity.Property(e => e.UserName).HasMaxLength(256);

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserRole",
                    r => r.HasOne<Role>().WithMany().HasForeignKey("RoleId"),
                    l => l.HasOne<User>().WithMany().HasForeignKey("UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId");
                        j.ToTable("UserRoles");
                        j.HasIndex(new[] { "RoleId" }, "IX_UserRoles_RoleId");
                    });
        });

        modelBuilder.Entity<UserClaim>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_UserClaims_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.UserClaims).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<UserLogin>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

            entity.HasIndex(e => e.UserId, "IX_UserLogins_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.UserLogins).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

            entity.HasOne(d => d.User).WithMany(p => p.UserTokens).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<VehicleInfo>(entity =>
        {
            entity.HasIndex(e => e.ApplicationId, "IX_VehicleInfos_ApplicationId").IsUnique();

            entity.HasIndex(e => e.LicensePlate, "IX_VehicleInfos_LicensePlate");

            entity.Property(e => e.AnnualMileage).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ChassisNumber).HasMaxLength(50);
            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.Condition).HasMaxLength(50);
            entity.Property(e => e.EngineCapacity).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.EngineNumber).HasMaxLength(50);
            entity.Property(e => e.FuelType).HasMaxLength(50);
            entity.Property(e => e.InspectionReportPath).HasMaxLength(500);
            entity.Property(e => e.LicensePlate).HasMaxLength(20);
            entity.Property(e => e.Make).HasMaxLength(100);
            entity.Property(e => e.Model).HasMaxLength(100);
            entity.Property(e => e.ModificationDetails).HasMaxLength(1000);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.OwnerNationalId).HasMaxLength(20);
            entity.Property(e => e.ParkingLocation).HasMaxLength(200);
            entity.Property(e => e.PreviousInsurerName).HasMaxLength(100);
            entity.Property(e => e.RegistrationAddress).HasMaxLength(200);
            entity.Property(e => e.RegistrationCertificatePath).HasMaxLength(500);
            entity.Property(e => e.TotalClaimAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UsagePurpose).HasMaxLength(50);
            entity.Property(e => e.VehiclePhotoPaths).HasMaxLength(500);
            entity.Property(e => e.VehicleType).HasMaxLength(50);
            entity.Property(e => e.VehicleValue).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Application).WithOne(p => p.VehicleInfo).HasForeignKey<VehicleInfo>(d => d.ApplicationId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
