using InsuranceServiceServer.Models;
using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Core.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        // Auth
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<EmailVerification> EmailVerifications { get; set; }
        public DbSet<PhoneVerification> PhoneVerifications { get; set; }
        public DbSet<KYCDocument> KYCDocuments { get; set; }

        // Profile Layer
        public DbSet<CustomerProfile> CustomerProfiles { get; set; }
        public DbSet<EmployeeProfile> EmployeeProfiles { get; set; }
        public DbSet<Department> Departments { get; set; }

        // Document Layer
        public DbSet<BaseDocument> BaseDocuments { get; set; }
        public DbSet<IdentityDocument> IdentityDocuments { get; set; }
        public DbSet<HealthDocument> HealthDocuments { get; set; }
        public DbSet<PolicyDocument> PolicyDocuments { get; set; }
        public DbSet<ClaimDocument> ClaimDocuments { get; set; }
        public DbSet<FinancialDocument> FinancialDocuments { get; set; }

        // Insurance Business
        public DbSet<InsuranceProduct> InsuranceProducts { get; set; }
        public DbSet<InsurancePlan> InsurancePlans { get; set; } // Fixed plans for each product
        public DbSet<MedicalInsurancePlan> MedicalInsurancePlans { get; set; } // Medical insurance specific plans
        public DbSet<InsurancePolicy> InsurancePolicies { get; set; }
        public DbSet<InsuranceClaim> InsuranceClaims { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PolicyLoan> PolicyLoans { get; set; }
        public DbSet<Application> Applications { get; set; }

        // Application-specific data (normalized)
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<VehicleInfo> VehicleInfos { get; set; }
        public DbSet<PropertyInfo> PropertyInfos { get; set; }
        public DbSet<TravelInfo> TravelInfos { get; set; }

        // Registration Flow
        public DbSet<RegistrationSession> RegistrationSessions { get; set; }
        public DbSet<KYCVerification> KYCVerifications { get; set; }
        public DbSet<HealthDeclaration> HealthDeclarations { get; set; }
        public DbSet<UnderwritingDecision> UnderwritingDecisions { get; set; }

        // Application Drafts
        public DbSet<ApplicationDraft> ApplicationDrafts { get; set; }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        protected AppDbContext()
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Rename Identity tables
            foreach (var et in builder.Model.GetEntityTypes())
            {
                var tblName = et.GetTableName();
                if (tblName!.StartsWith("AspNet"))
                {
                    et.SetTableName(tblName.Substring(6));
                }
            }

            // Configure RefreshToken
            builder.Entity<RefreshToken>()
                .HasOne(rt => rt.AppUser)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure PhoneVerification
            builder.Entity<PhoneVerification>()
                .HasOne(pv => pv.User)
                .WithMany()
                .HasForeignKey(pv => pv.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PhoneVerification>()
                .HasIndex(pv => new { pv.PhoneNumber, pv.IsVerified });

            // Configure EmployeeProfile - Department relationship
            builder.Entity<EmployeeProfile>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure InsurancePolicy - Customer relationship
            builder.Entity<InsurancePolicy>()
                .HasOne(p => p.Customer)
                .WithMany()
                .HasForeignKey(p => p.CustomerProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure InsurancePolicy - Product relationship
            builder.Entity<InsurancePolicy>()
                .HasOne(p => p.Product)
                .WithMany()
                .HasForeignKey(p => p.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure InsuranceClaim - Policy relationship
            builder.Entity<InsuranceClaim>()
                .HasOne(c => c.Policy)
                .WithMany(p => p.Claims)
                .HasForeignKey(c => c.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Payment - Policy relationship
            builder.Entity<Payment>()
                .HasOne(p => p.Policy)
                .WithMany(pol => pol.Payments)
                .HasForeignKey(p => p.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure PolicyLoan - Policy relationship
            builder.Entity<PolicyLoan>()
                .HasOne(l => l.Policy)
                .WithMany()
                .HasForeignKey(l => l.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BaseDocument derived types
            builder.Entity<BaseDocument>()
                .UseTptMappingStrategy(); // Table-per-type for document hierarchy

            // Indexes for performance
            builder.Entity<CustomerProfile>()
                .HasIndex(c => c.NationalId);
            
            builder.Entity<CustomerProfile>()
                .HasIndex(c => c.Email);

            builder.Entity<EmployeeProfile>()
                .HasIndex(e => e.EmployeeCode)
                .IsUnique();

            builder.Entity<InsurancePolicy>()
                .HasIndex(p => p.PolicyNumber)
                .IsUnique();

            builder.Entity<InsuranceClaim>()
                .HasIndex(c => c.ClaimNumber)
                .IsUnique();

            builder.Entity<Payment>()
                .HasIndex(p => p.TransactionId)
                .IsUnique();

            builder.Entity<PolicyLoan>()
                .HasIndex(l => l.LoanNumber)
                .IsUnique();

            // Configure Beneficiary - Application relationship
            builder.Entity<Beneficiary>()
                .HasOne(b => b.Application)
                .WithMany(a => a.Beneficiaries)
                .HasForeignKey(b => b.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure VehicleInfo - Application relationship (1-to-1)
            builder.Entity<VehicleInfo>()
                .HasOne(v => v.Application)
                .WithOne(a => a.VehicleInfo)
                .HasForeignKey<VehicleInfo>(v => v.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure PropertyInfo - Application relationship (1-to-1)
            builder.Entity<PropertyInfo>()
                .HasOne(p => p.Application)
                .WithOne(a => a.PropertyInfo)
                .HasForeignKey<PropertyInfo>(p => p.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure TravelInfo - Application relationship (1-to-1)
            builder.Entity<TravelInfo>()
                .HasOne(t => t.Application)
                .WithOne(a => a.TravelInfo)
                .HasForeignKey<TravelInfo>(t => t.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for new tables
            builder.Entity<VehicleInfo>()
                .HasIndex(v => v.LicensePlate);

            builder.Entity<PropertyInfo>()
                .HasIndex(p => new { p.Address, p.City });

            builder.Entity<TravelInfo>()
                .HasIndex(t => new { t.DepartureDate, t.ReturnDate });
        }
    }
}



