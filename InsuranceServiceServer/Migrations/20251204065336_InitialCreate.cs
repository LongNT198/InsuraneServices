using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceServiceServer.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaseDocument",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    OwnerType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UploadedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VerifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    VerifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IssueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IssuingAuthority = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaseDocument", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NationalId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PassportNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    District = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ward = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Occupation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Company = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MonthlyIncome = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    KycStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KycVerifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KycVerifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerTier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LifetimeValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AssignedAgentId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmergencyContactName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmergencyContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmergencyContactRelationship = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AcceptMarketing = table.Column<bool>(type: "bit", nullable: false),
                    PreferredContactMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InsuranceProducts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Features = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessingFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PolicyIssuanceFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MedicalCheckupFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AdminFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LumpSumDiscount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MonthlySurcharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QuarterlySurcharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SemiAnnualSurcharge = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceProducts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KYCDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerProfileId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    NationalId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentIssueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DocumentIssuedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReviewNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExtractedData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VerificationScore = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IsFaceMatched = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KYCDocuments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ProfileType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfileId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClaimDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    ClaimId = table.Column<int>(type: "int", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IncidentDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaimDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClaimDocuments_BaseDocument_Id",
                        column: x => x.Id,
                        principalTable: "BaseDocument",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FinancialDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Period = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinancialDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinancialDocuments_BaseDocument_Id",
                        column: x => x.Id,
                        principalTable: "BaseDocument",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExaminationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DoctorName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hospital = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Diagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthDocuments_BaseDocument_Id",
                        column: x => x.Id,
                        principalTable: "BaseDocument",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IdentityDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IssuedPlace = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IdentityDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IdentityDocuments_BaseDocument_Id",
                        column: x => x.Id,
                        principalTable: "BaseDocument",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicyDocuments_BaseDocument_Id",
                        column: x => x.Id,
                        principalTable: "BaseDocument",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmployeeType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ManagerId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProbationEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResignDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EmploymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WorkLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkSchedule = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CanApprovePolicy = table.Column<bool>(type: "bit", nullable: false),
                    ApprovalLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CanApproveClaim = table.Column<bool>(type: "bit", nullable: false),
                    ClaimApprovalLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SalesTarget = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AchievedSales = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ManagedCustomerCount = table.Column<int>(type: "int", nullable: true),
                    CommissionRate = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeProfiles_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InsurancePlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    PlanName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TermYears = table.Column<int>(type: "int", nullable: false),
                    AccidentalDeathBenefit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DisabilityBenefit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CriticalIllnessBenefit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IncludesMaternityBenefit = table.Column<bool>(type: "bit", nullable: false),
                    IncludesRiderOptions = table.Column<bool>(type: "bit", nullable: false),
                    BasePremiumMonthly = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BasePremiumAnnual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier18_25 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier26_35 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier36_45 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier46_55 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgeMultiplier56_65 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthExcellentMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthGoodMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthFairMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HealthPoorMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaleMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FemaleMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OccupationLowRiskMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OccupationMediumRiskMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OccupationHighRiskMultiplier = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinAge = table.Column<int>(type: "int", nullable: false),
                    MaxAge = table.Column<int>(type: "int", nullable: false),
                    RequiresMedicalExam = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    IsPopular = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsurancePlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsurancePlans_InsuranceProducts_ProductId",
                        column: x => x.ProductId,
                        principalTable: "InsuranceProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InsurancePolicies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PolicyNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CustomerProfileId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TermYears = table.Column<int>(type: "int", nullable: false),
                    Premium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentFrequency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsLumpSumPayment = table.Column<bool>(type: "bit", nullable: false),
                    TotalPremiumAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaymentPerPeriod = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalPayments = table.Column<int>(type: "int", nullable: true),
                    ApplicationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AgentId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BeneficiariesJson = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsurancePolicies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsurancePolicies_CustomerProfiles_CustomerProfileId",
                        column: x => x.CustomerProfileId,
                        principalTable: "CustomerProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InsurancePolicies_InsuranceProducts_ProductId",
                        column: x => x.ProductId,
                        principalTable: "InsuranceProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationDrafts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ApplicationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DraftData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationDrafts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationDrafts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailVerifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VerificationToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OTP = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    VerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    LastAttemptAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailVerifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailVerifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhoneVerifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OTP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    VerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    LastAttemptAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResendCount = table.Column<int>(type: "int", nullable: false),
                    LastResendAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeliveryStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SmsProvider = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhoneVerifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PhoneVerifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InsuranceClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaimNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClaimDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IncidentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignedTo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReviewedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReviewerNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaidDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsuranceClaims_InsurancePolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "InsurancePolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TransactionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PaymentFrequency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsLumpSum = table.Column<bool>(type: "bit", nullable: false),
                    PaymentNumber = table.Column<int>(type: "int", nullable: true),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReceiptUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentNote = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_InsurancePolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "InsurancePolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PolicyLoans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LoanNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    LoanAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InterestRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxLoanAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RepaymentMonths = table.Column<int>(type: "int", nullable: false),
                    MonthlyRepayment = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApplicationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisbursementDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OutstandingAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyLoans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicyLoans_InsurancePolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "InsurancePolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RegistrationSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SessionToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CurrentStep = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegistrationStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAccountCreated = table.Column<bool>(type: "bit", nullable: false),
                    IsKYCCompleted = table.Column<bool>(type: "bit", nullable: false),
                    IsProfileCompleted = table.Column<bool>(type: "bit", nullable: false),
                    IsProductSelected = table.Column<bool>(type: "bit", nullable: false),
                    IsHealthDeclared = table.Column<bool>(type: "bit", nullable: false),
                    IsUnderwritingCompleted = table.Column<bool>(type: "bit", nullable: false),
                    IsPaymentCompleted = table.Column<bool>(type: "bit", nullable: false),
                    IsPolicyIssued = table.Column<bool>(type: "bit", nullable: false),
                    SelectedProductId = table.Column<int>(type: "int", nullable: true),
                    SelectedCoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SelectedTermYears = table.Column<int>(type: "int", nullable: true),
                    SelectedPaymentFrequency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedPolicyId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrationSessions_InsurancePolicies_CreatedPolicyId",
                        column: x => x.CreatedPolicyId,
                        principalTable: "InsurancePolicies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HealthDeclarations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegistrationSessionId = table.Column<int>(type: "int", nullable: false),
                    CustomerProfileId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BMI = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BloodType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSmoker = table.Column<bool>(type: "bit", nullable: false),
                    CigarettesPerDay = table.Column<int>(type: "int", nullable: true),
                    IsDrinker = table.Column<bool>(type: "bit", nullable: false),
                    AlcoholFrequency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsExercising = table.Column<bool>(type: "bit", nullable: false),
                    ExerciseFrequency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CurrentMedicationsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PastIllnessesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChronicConditionsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SurgeriesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllergiesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyMedicalHistoryJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasHeartDisease = table.Column<bool>(type: "bit", nullable: false),
                    HasDiabetes = table.Column<bool>(type: "bit", nullable: false),
                    HasCancer = table.Column<bool>(type: "bit", nullable: false),
                    HasHypertension = table.Column<bool>(type: "bit", nullable: false),
                    HasMentalIllness = table.Column<bool>(type: "bit", nullable: false),
                    IsPregnant = table.Column<bool>(type: "bit", nullable: false),
                    PregnancyWeeks = table.Column<int>(type: "int", nullable: true),
                    HasHighRiskOccupation = table.Column<bool>(type: "bit", nullable: false),
                    OccupationRiskDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorksWithHazardousMaterials = table.Column<bool>(type: "bit", nullable: false),
                    HasFrequentTravel = table.Column<bool>(type: "bit", nullable: false),
                    HasRecentHospitalization = table.Column<bool>(type: "bit", nullable: false),
                    LastHospitalizationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HospitalizationReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasUpcomingSurgery = table.Column<bool>(type: "bit", nullable: false),
                    RequiresMedicalExam = table.Column<bool>(type: "bit", nullable: false),
                    MedicalExamResultPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LabReportPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeclarationAccurate = table.Column<bool>(type: "bit", nullable: false),
                    DeclarationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeclarationSignature = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReviewNotes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthDeclarations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthDeclarations_RegistrationSessions_RegistrationSessionId",
                        column: x => x.RegistrationSessionId,
                        principalTable: "RegistrationSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KYCVerifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegistrationSessionId = table.Column<int>(type: "int", nullable: false),
                    CustomerProfileId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DocumentNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DocumentIssueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DocumentExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DocumentIssuedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExtractedFullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExtractedDateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExtractedGender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExtractedNationality = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExtractedAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsFaceMatched = table.Column<bool>(type: "bit", nullable: false),
                    FaceMatchScore = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IsDocumentAuthentic = table.Column<bool>(type: "bit", nullable: false),
                    AuthenticityScore = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IsBlacklisted = table.Column<bool>(type: "bit", nullable: false),
                    IsFraudulent = table.Column<bool>(type: "bit", nullable: false),
                    RiskLevel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VerificationStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    VerifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FrontImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BackImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SelfiePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OCRResponseJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FaceMatchResponseJson = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KYCVerifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KYCVerifications_RegistrationSessions_RegistrationSessionId",
                        column: x => x.RegistrationSessionId,
                        principalTable: "RegistrationSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UnderwritingDecisions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegistrationSessionId = table.Column<int>(type: "int", nullable: false),
                    CustomerProfileId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PolicyId = table.Column<int>(type: "int", nullable: true),
                    Decision = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DecisionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DecisionBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RiskLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RiskScore = table.Column<int>(type: "int", nullable: false),
                    RiskFactorsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsAutoApprovalEligible = table.Column<bool>(type: "bit", nullable: false),
                    AutoApprovalReasons = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequiresMedicalExam = table.Column<bool>(type: "bit", nullable: false),
                    RequiresAdditionalDocuments = table.Column<bool>(type: "bit", nullable: false),
                    RequiredDocumentsList = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AdjustedPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PremiumLoadingPercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PremiumAdjustmentReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequestedCoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApprovedCoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CoverageModificationReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExclusionsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewCompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UnderwriterNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CommunicationToCustomer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnderwritingDecisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UnderwritingDecisions_InsurancePolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "InsurancePolicies",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UnderwritingDecisions_RegistrationSessions_RegistrationSessionId",
                        column: x => x.RegistrationSessionId,
                        principalTable: "RegistrationSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TermYears = table.Column<int>(type: "int", nullable: false),
                    PaymentFrequency = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PremiumAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsLumpSumPayment = table.Column<bool>(type: "bit", nullable: false),
                    TotalPremiumAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaymentPerPeriod = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ApplicantData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HealthDeclarationId = table.Column<int>(type: "int", nullable: true),
                    BeneficiariesData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DocumentsData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TermsAccepted = table.Column<bool>(type: "bit", nullable: false),
                    DeclarationAccepted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewNotes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReviewedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_HealthDeclarations_HealthDeclarationId",
                        column: x => x.HealthDeclarationId,
                        principalTable: "HealthDeclarations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Applications_InsuranceProducts_ProductId",
                        column: x => x.ProductId,
                        principalTable: "InsuranceProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Beneficiaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Relationship = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NationalId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BenefitPercentage = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Beneficiaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Beneficiaries_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PropertyInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    PropertyType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    District = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    LandArea = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    FloorArea = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    NumberOfFloors = table.Column<int>(type: "int", nullable: true),
                    NumberOfRooms = table.Column<int>(type: "int", nullable: true),
                    NumberOfBathrooms = table.Column<int>(type: "int", nullable: true),
                    YearBuilt = table.Column<int>(type: "int", nullable: true),
                    YearRenovated = table.Column<int>(type: "int", nullable: true),
                    ConstructionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RoofType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    WallMaterial = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FloorMaterial = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PropertyValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ContentsValue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    OwnerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OwnerNationalId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    IsOwnerOccupied = table.Column<bool>(type: "bit", nullable: false),
                    OwnershipType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PurchasePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HasMortgage = table.Column<bool>(type: "bit", nullable: false),
                    MortgageProvider = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OutstandingLoanAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    OccupancyType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsCommercialUse = table.Column<bool>(type: "bit", nullable: false),
                    CommercialUseDetails = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HasSecuritySystem = table.Column<bool>(type: "bit", nullable: false),
                    HasFireAlarm = table.Column<bool>(type: "bit", nullable: false),
                    HasSmokeDetector = table.Column<bool>(type: "bit", nullable: false),
                    HasBurglarAlarm = table.Column<bool>(type: "bit", nullable: false),
                    HasCCTV = table.Column<bool>(type: "bit", nullable: false),
                    HasSecurityGuard = table.Column<bool>(type: "bit", nullable: false),
                    HasGatedCommunity = table.Column<bool>(type: "bit", nullable: false),
                    HasSwimmingPool = table.Column<bool>(type: "bit", nullable: false),
                    HasGarden = table.Column<bool>(type: "bit", nullable: false),
                    HasGarage = table.Column<bool>(type: "bit", nullable: false),
                    NumberOfParkingSpaces = table.Column<int>(type: "int", nullable: true),
                    HasElevator = table.Column<bool>(type: "bit", nullable: false),
                    HasGenerator = table.Column<bool>(type: "bit", nullable: false),
                    FloodRiskLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EarthquakeRiskLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsNearWater = table.Column<bool>(type: "bit", nullable: false),
                    IsNearForest = table.Column<bool>(type: "bit", nullable: false),
                    DistanceToFireStation = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    DistanceToPoliceStation = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    PropertyCondition = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastInspectionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastMaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KnownDefects = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HasPreviousInsurance = table.Column<bool>(type: "bit", nullable: false),
                    PreviousInsurerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PreviousPolicyExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HasClaimHistory = table.Column<bool>(type: "bit", nullable: false),
                    NumberOfClaims = table.Column<int>(type: "int", nullable: true),
                    TotalClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ClaimHistoryDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyDeedPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PropertyPhotoPaths = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    InspectionReportPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ValuationReportPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyInfos_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TravelInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    TripType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DestinationDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DepartureDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TripDuration = table.Column<int>(type: "int", nullable: false),
                    TravelPurpose = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PurposeDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NumberOfTravelers = table.Column<int>(type: "int", nullable: false),
                    TravelersDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IncludesChildren = table.Column<bool>(type: "bit", nullable: false),
                    NumberOfChildren = table.Column<int>(type: "int", nullable: true),
                    IncludesElderly = table.Column<bool>(type: "bit", nullable: false),
                    IncludesPregnantTraveler = table.Column<bool>(type: "bit", nullable: false),
                    PregnancyWeeks = table.Column<int>(type: "int", nullable: true),
                    RiskLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IncludesAdventureSports = table.Column<bool>(type: "bit", nullable: false),
                    PlannedActivities = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IncludesWaterSports = table.Column<bool>(type: "bit", nullable: false),
                    IncludesWinterSports = table.Column<bool>(type: "bit", nullable: false),
                    IncludesExtremeSports = table.Column<bool>(type: "bit", nullable: false),
                    IncludesMountainClimbing = table.Column<bool>(type: "bit", nullable: false),
                    PrimaryTransport = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FlightDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IncludesCarRental = table.Column<bool>(type: "bit", nullable: false),
                    IncludesCruise = table.Column<bool>(type: "bit", nullable: false),
                    AccommodationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AccommodationCost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IsPrePaid = table.Column<bool>(type: "bit", nullable: false),
                    HasPreExistingConditions = table.Column<bool>(type: "bit", nullable: false),
                    PreExistingConditionsDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    RequiresMedication = table.Column<bool>(type: "bit", nullable: false),
                    HasTravelVaccinations = table.Column<bool>(type: "bit", nullable: false),
                    VaccinationDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VisitingHighRiskRegion = table.Column<bool>(type: "bit", nullable: false),
                    HighRiskRegionDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MedicalCoverageAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TripCancellationCoverage = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    LuggageCoverage = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PersonalLiabilityCoverage = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IncludesEmergencyEvacuation = table.Column<bool>(type: "bit", nullable: false),
                    IncludesTripDelay = table.Column<bool>(type: "bit", nullable: false),
                    IncludesMissedConnection = table.Column<bool>(type: "bit", nullable: false),
                    TotalTripCost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NonRefundableDeposit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FirstDepositDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HasTravelInsuranceHistory = table.Column<bool>(type: "bit", nullable: false),
                    HasPreviousClaims = table.Column<bool>(type: "bit", nullable: false),
                    NumberOfPreviousClaims = table.Column<int>(type: "int", nullable: true),
                    PreviousClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ClaimHistoryDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmergencyContactName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EmergencyContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    EmergencyContactRelationship = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SecondaryEmergencyContactName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SecondaryEmergencyContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DestinationRiskLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    HasTravelAdvisory = table.Column<bool>(type: "bit", nullable: false),
                    TravelAdvisoryDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    RequiresVisa = table.Column<bool>(type: "bit", nullable: false),
                    VisaObtained = table.Column<bool>(type: "bit", nullable: false),
                    PassportCopyPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    VisaCopyPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FlightTicketPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HotelBookingPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ItineraryPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TravelInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TravelInfos_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VehicleInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    VehicleType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Make = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ManufactureYear = table.Column<int>(type: "int", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LicensePlate = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ChassisNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EngineNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EngineCapacity = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    FuelType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NumberOfSeats = table.Column<int>(type: "int", nullable: true),
                    VehicleValue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    OwnerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OwnerNationalId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RegistrationAddress = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RegistrationExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UsagePurpose = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AnnualMileage = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ParkingLocation = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HasAntiTheftDevice = table.Column<bool>(type: "bit", nullable: false),
                    HasDashcam = table.Column<bool>(type: "bit", nullable: false),
                    HasPreviousInsurance = table.Column<bool>(type: "bit", nullable: false),
                    PreviousInsurerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PreviousPolicyExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HasClaimHistory = table.Column<bool>(type: "bit", nullable: false),
                    NumberOfClaims = table.Column<int>(type: "int", nullable: true),
                    TotalClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ClaimHistoryDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasModifications = table.Column<bool>(type: "bit", nullable: false),
                    ModificationDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Condition = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastMaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RegistrationCertificatePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    VehiclePhotoPaths = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    InspectionReportPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleInfos_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationDrafts_UserId",
                table: "ApplicationDrafts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_HealthDeclarationId",
                table: "Applications",
                column: "HealthDeclarationId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_ProductId",
                table: "Applications",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Beneficiaries_ApplicationId",
                table: "Beneficiaries",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerProfiles_Email",
                table: "CustomerProfiles",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerProfiles_NationalId",
                table: "CustomerProfiles",
                column: "NationalId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailVerifications_UserId",
                table: "EmailVerifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeProfiles_DepartmentId",
                table: "EmployeeProfiles",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeProfiles_EmployeeCode",
                table: "EmployeeProfiles",
                column: "EmployeeCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HealthDeclarations_RegistrationSessionId",
                table: "HealthDeclarations",
                column: "RegistrationSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceClaims_ClaimNumber",
                table: "InsuranceClaims",
                column: "ClaimNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceClaims_PolicyId",
                table: "InsuranceClaims",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePlans_ProductId",
                table: "InsurancePlans",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_CustomerProfileId",
                table: "InsurancePolicies",
                column: "CustomerProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_PolicyNumber",
                table: "InsurancePolicies",
                column: "PolicyNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_ProductId",
                table: "InsurancePolicies",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_KYCVerifications_RegistrationSessionId",
                table: "KYCVerifications",
                column: "RegistrationSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PolicyId",
                table: "Payments",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_TransactionId",
                table: "Payments",
                column: "TransactionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhoneVerifications_PhoneNumber_IsVerified",
                table: "PhoneVerifications",
                columns: new[] { "PhoneNumber", "IsVerified" });

            migrationBuilder.CreateIndex(
                name: "IX_PhoneVerifications_UserId",
                table: "PhoneVerifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyLoans_LoanNumber",
                table: "PolicyLoans",
                column: "LoanNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PolicyLoans_PolicyId",
                table: "PolicyLoans",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyInfos_Address_City",
                table: "PropertyInfos",
                columns: new[] { "Address", "City" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyInfos_ApplicationId",
                table: "PropertyInfos",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationSessions_CreatedPolicyId",
                table: "RegistrationSessions",
                column: "CreatedPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TravelInfos_ApplicationId",
                table: "TravelInfos",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TravelInfos_DepartureDate_ReturnDate",
                table: "TravelInfos",
                columns: new[] { "DepartureDate", "ReturnDate" });

            migrationBuilder.CreateIndex(
                name: "IX_UnderwritingDecisions_PolicyId",
                table: "UnderwritingDecisions",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_UnderwritingDecisions_RegistrationSessionId",
                table: "UnderwritingDecisions",
                column: "RegistrationSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleInfos_ApplicationId",
                table: "VehicleInfos",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VehicleInfos_LicensePlate",
                table: "VehicleInfos",
                column: "LicensePlate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationDrafts");

            migrationBuilder.DropTable(
                name: "Beneficiaries");

            migrationBuilder.DropTable(
                name: "ClaimDocuments");

            migrationBuilder.DropTable(
                name: "EmailVerifications");

            migrationBuilder.DropTable(
                name: "EmployeeProfiles");

            migrationBuilder.DropTable(
                name: "FinancialDocuments");

            migrationBuilder.DropTable(
                name: "HealthDocuments");

            migrationBuilder.DropTable(
                name: "IdentityDocuments");

            migrationBuilder.DropTable(
                name: "InsuranceClaims");

            migrationBuilder.DropTable(
                name: "InsurancePlans");

            migrationBuilder.DropTable(
                name: "KYCDocuments");

            migrationBuilder.DropTable(
                name: "KYCVerifications");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PhoneVerifications");

            migrationBuilder.DropTable(
                name: "PolicyDocuments");

            migrationBuilder.DropTable(
                name: "PolicyLoans");

            migrationBuilder.DropTable(
                name: "PropertyInfos");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "TravelInfos");

            migrationBuilder.DropTable(
                name: "UnderwritingDecisions");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "VehicleInfos");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "BaseDocument");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "HealthDeclarations");

            migrationBuilder.DropTable(
                name: "RegistrationSessions");

            migrationBuilder.DropTable(
                name: "InsurancePolicies");

            migrationBuilder.DropTable(
                name: "CustomerProfiles");

            migrationBuilder.DropTable(
                name: "InsuranceProducts");
        }
    }
}
