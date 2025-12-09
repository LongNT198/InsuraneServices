// AUTO-GENERATED SEED DATA from database on 2025-12-06 04:24:44
// Combined with roles, departments, and user seeding

using InsuranceServiceServer.Models;
using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Core.Data
{
    public partial class SeedData
    {
        // =============================================
        // MAIN SEED METHOD
        // =============================================
        
        public static async Task CreateRoles(IServiceProvider serviceProvider, UserManager<AppUser> userManager) 
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var context = serviceProvider.GetRequiredService<AppDbContext>();

            // Create all roles
            var roleNames = AppRoles.GetAllRoles();

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed Departments
            if (!await context.Departments.AnyAsync())
            {
                var departments = new[]
                {
                    new Department { Code = "ADMIN", Name = "Administration", Description = "System administration" },
                    new Department { Code = "SALES", Name = "Sales", Description = "Insurance sales and marketing" },
                    new Department { Code = "UNDERWRITING", Name = "Underwriting", Description = "Policy underwriting and risk assessment" },
                    new Department { Code = "CLAIMS", Name = "Claims", Description = "Claims processing and settlement" },
                    new Department { Code = "FINANCE", Name = "Finance", Description = "Finance and accounting" }
                };
                await context.Departments.AddRangeAsync(departments);
                await context.SaveChangesAsync();
            }

            // Create Admin user
            var adminUser = await userManager.FindByEmailAsync("admin@insurance.com");
            if (adminUser == null)
            {
                var user = new AppUser
                {
                    UserName = "admin@insurance.com",
                    Email = "admin@insurance.com",
                    EmailConfirmed = true,
                    ProfileType = "Employee",
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                };
                
                var result = await userManager.CreateAsync(user, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, AppRoles.Admin);
                    
                    // Create Admin Profile
                    var adminDept = await context.Departments.FirstOrDefaultAsync(d => d.Code == "ADMIN");
                    if (adminDept != null)
                    {
                        var adminProfile = new EmployeeProfile
                        {
                            UserId = user.Id,
                            FirstName = "System",
                            LastName = "Administrator",
                            Email = user.Email,
                            PhoneNumber = "0000000000",
                            DateOfBirth = new DateTime(1990, 1, 1),
                            Gender = "Male",
                            EmployeeCode = "EMP-ADMIN",
                            DepartmentId = adminDept.Id,
                            Position = "System Administrator",
                            EmployeeType = "Full-time",
                            JoinDate = DateTime.UtcNow,
                            Salary = 0,
                            CanApprovePolicy = true,
                            ApprovalLimit = 999999999999.99M,
                            CanApproveClaim = true,
                            ClaimApprovalLimit = 999999999999.99M
                        };
                        
                        user.ProfileId = adminProfile.Id;
                        await context.EmployeeProfiles.AddAsync(adminProfile);
                        await context.SaveChangesAsync();
                    }
                }
            }

            // Seed Insurance Products and Plans from database
            await SeedInsuranceProducts(context);
            await SeedInsurancePlans(context);

            // Seed sample Customer and Policies
            await SeedCustomerAndPolicies(context, userManager);
        }

        // =============================================
        // SEED INSURANCE PRODUCTS
        // Generated from existing database
        // =============================================
        
        public static async Task SeedInsuranceProducts(AppDbContext context)
        {
            if (!await context.InsuranceProducts.AnyAsync())
            {
                var products = new[]
                {
                    new InsuranceProduct
                    {
                        ProductCode = "HEALTH-001",
                        ProductName = "UnitedHealth Global Medical",
                        ProductType = "Health",
                        Description = "Comprehensive international health coverage - Based on UnitedHealthcare Global",
                        ProcessingFee = 45.00M,
                        PolicyIssuanceFee = 90.00M,
                        MedicalCheckupFee = 200.00M,
                        AdminFee = 35.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "HEALTH-002",
                        ProductName = "Cigna Family Health Plus",
                        ProductType = "Health",
                        Description = "Family floater plan with maternity and pediatric care - Based on Cigna Global Health",
                        ProcessingFee = 60.00M,
                        PolicyIssuanceFee = 120.00M,
                        MedicalCheckupFee = 250.00M,
                        AdminFee = 50.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "HEALTH-003",
                        ProductName = "Aetna Senior Care Elite",
                        ProductType = "Health",
                        Description = "Medicare supplement for seniors 65+ - Based on Aetna Medicare Solutions",
                        ProcessingFee = 55.00M,
                        PolicyIssuanceFee = 110.00M,
                        MedicalCheckupFee = 180.00M,
                        AdminFee = 45.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "HOME-001",
                        ProductName = "Allstate Homeowners Premier",
                        ProductType = "Home",
                        Description = "Comprehensive home protection with claim-free rewards - Based on Allstate Home Insurance",
                        ProcessingFee = 40.00M,
                        PolicyIssuanceFee = 80.00M,
                        MedicalCheckupFee = 0.00M,
                        AdminFee = 30.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "HOME-002",
                        ProductName = "Liberty Mutual Condo Guard",
                        ProductType = "Home",
                        Description = "Condo and apartment protection - Based on Liberty Mutual Condo Insurance",
                        ProcessingFee = 30.00M,
                        PolicyIssuanceFee = 60.00M,
                        MedicalCheckupFee = 0.00M,
                        AdminFee = 25.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "HOME-003",
                        ProductName = "Travelers Landlord Protector",
                        ProductType = "Home",
                        Description = "Investment property and rental coverage - Based on Travelers Landlord Insurance",
                        ProcessingFee = 50.00M,
                        PolicyIssuanceFee = 100.00M,
                        MedicalCheckupFee = 0.00M,
                        AdminFee = 40.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "LIFE-001",
                        ProductName = "MetLife Whole Life Select",
                        ProductType = "Life",
                        Description = "Premium whole life insurance with guaranteed cash value and lifetime protection - Based on MetLife Global products",
                        ProcessingFee = 50.00M,
                        PolicyIssuanceFee = 100.00M,
                        MedicalCheckupFee = 250.00M,
                        AdminFee = 40.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "LIFE-002",
                        ProductName = "Prudential Term Life Protector",
                        ProductType = "Life",
                        Description = "Affordable term life coverage with conversion privilege - Based on Prudential International",
                        ProcessingFee = 35.00M,
                        PolicyIssuanceFee = 75.00M,
                        MedicalCheckupFee = 150.00M,
                        AdminFee = 30.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "LIFE-003",
                        ProductName = "AIG Universal Life Flex",
                        ProductType = "Life",
                        Description = "Flexible universal life with investment options - Based on AIG Global Life Solutions",
                        ProcessingFee = 75.00M,
                        PolicyIssuanceFee = 150.00M,
                        MedicalCheckupFee = 350.00M,
                        AdminFee = 60.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "MOTOR-001",
                        ProductName = "State Farm Auto Complete",
                        ProductType = "Motor",
                        Description = "Full coverage auto insurance with accident forgiveness - Based on State Farm",
                        ProcessingFee = 25.00M,
                        PolicyIssuanceFee = 50.00M,
                        MedicalCheckupFee = 0.00M,
                        AdminFee = 20.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "MOTOR-002",
                        ProductName = "Geico Motorcycle Shield",
                        ProductType = "Motor",
                        Description = "Specialized motorcycle and scooter coverage - Based on Geico Motorcycle",
                        ProcessingFee = 20.00M,
                        PolicyIssuanceFee = 40.00M,
                        MedicalCheckupFee = 0.00M,
                        AdminFee = 15.00M,
                        IsActive = true
                    },
                    new InsuranceProduct
                    {
                        ProductCode = "MOTOR-003",
                        ProductName = "Progressive Commercial Auto",
                        ProductType = "Motor",
                        Description = "Business vehicle and fleet coverage - Based on Progressive Commercial",
                        ProcessingFee = 65.00M,
                        PolicyIssuanceFee = 130.00M,
                        MedicalCheckupFee = 0.00M,
                        AdminFee = 55.00M,
                        IsActive = true
                    }
                };
                
                await context.InsuranceProducts.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }
        }
        
        // =============================================
        // SEED INSURANCE PLANS
        // Generated from existing database
        // =============================================
        
        public static async Task SeedInsurancePlans(AppDbContext context)
        {
            if (!await context.InsurancePlans.AnyAsync())
            {
                var plans = new List<InsurancePlan>();
                
                // Plans for HEALTH-001
                var product_HEALTH_001 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-001");
                if (product_HEALTH_001 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "UnitedHealth Global Medical - Basic",
                        PlanCode = "HEALTH-001-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "UnitedHealth Global Medical - Platinum",
                        PlanCode = "HEALTH-001-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "UnitedHealth Global Medical - Premium",
                        PlanCode = "HEALTH-001-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "UnitedHealth Global Medical - Standard",
                        PlanCode = "HEALTH-001-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for HEALTH-002
                var product_HEALTH_002 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-002");
                if (product_HEALTH_002 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Cigna Family Health Plus - Basic",
                        PlanCode = "HEALTH-002-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Cigna Family Health Plus - Platinum",
                        PlanCode = "HEALTH-002-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Cigna Family Health Plus - Premium",
                        PlanCode = "HEALTH-002-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Cigna Family Health Plus - Standard",
                        PlanCode = "HEALTH-002-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for HEALTH-003
                var product_HEALTH_003 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-003");
                if (product_HEALTH_003 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Aetna Senior Care Elite - Basic",
                        PlanCode = "HEALTH-003-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Aetna Senior Care Elite - Platinum",
                        PlanCode = "HEALTH-003-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Aetna Senior Care Elite - Premium",
                        PlanCode = "HEALTH-003-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Aetna Senior Care Elite - Standard",
                        PlanCode = "HEALTH-003-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for HOME-001
                var product_HOME_001 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HOME-001");
                if (product_HOME_001 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_001.Id,
                        PlanName = "Allstate Homeowners Premier - Basic",
                        PlanCode = "HOME-001-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_001.Id,
                        PlanName = "Allstate Homeowners Premier - Platinum",
                        PlanCode = "HOME-001-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_001.Id,
                        PlanName = "Allstate Homeowners Premier - Premium",
                        PlanCode = "HOME-001-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_001.Id,
                        PlanName = "Allstate Homeowners Premier - Standard",
                        PlanCode = "HOME-001-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for HOME-002
                var product_HOME_002 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HOME-002");
                if (product_HOME_002 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_002.Id,
                        PlanName = "Liberty Mutual Condo Guard - Basic",
                        PlanCode = "HOME-002-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_002.Id,
                        PlanName = "Liberty Mutual Condo Guard - Platinum",
                        PlanCode = "HOME-002-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_002.Id,
                        PlanName = "Liberty Mutual Condo Guard - Premium",
                        PlanCode = "HOME-002-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_002.Id,
                        PlanName = "Liberty Mutual Condo Guard - Standard",
                        PlanCode = "HOME-002-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for HOME-003
                var product_HOME_003 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HOME-003");
                if (product_HOME_003 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_003.Id,
                        PlanName = "Travelers Landlord Protector - Basic",
                        PlanCode = "HOME-003-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_003.Id,
                        PlanName = "Travelers Landlord Protector - Platinum",
                        PlanCode = "HOME-003-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_003.Id,
                        PlanName = "Travelers Landlord Protector - Premium",
                        PlanCode = "HOME-003-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_HOME_003.Id,
                        PlanName = "Travelers Landlord Protector - Standard",
                        PlanCode = "HOME-003-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for LIFE-001
                var product_LIFE_001 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "LIFE-001");
                if (product_LIFE_001 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_001.Id,
                        PlanName = "MetLife Whole Life Select - Basic",
                        PlanCode = "LIFE-001-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_001.Id,
                        PlanName = "MetLife Whole Life Select - Elite",
                        PlanCode = "LIFE-001-ELITE",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_001.Id,
                        PlanName = "MetLife Whole Life Select - Premium",
                        PlanCode = "LIFE-001-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_001.Id,
                        PlanName = "MetLife Whole Life Select - Standard",
                        PlanCode = "LIFE-001-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for LIFE-002
                var product_LIFE_002 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "LIFE-002");
                if (product_LIFE_002 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_002.Id,
                        PlanName = "Prudential Term Life Protector - Basic",
                        PlanCode = "LIFE-002-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_002.Id,
                        PlanName = "Prudential Term Life Protector - Elite",
                        PlanCode = "LIFE-002-ELITE",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_002.Id,
                        PlanName = "Prudential Term Life Protector - Premium",
                        PlanCode = "LIFE-002-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_002.Id,
                        PlanName = "Prudential Term Life Protector - Standard",
                        PlanCode = "LIFE-002-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for LIFE-003
                var product_LIFE_003 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "LIFE-003");
                if (product_LIFE_003 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_003.Id,
                        PlanName = "AIG Universal Life Flex - Basic",
                        PlanCode = "LIFE-003-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_003.Id,
                        PlanName = "AIG Universal Life Flex - Elite",
                        PlanCode = "LIFE-003-ELITE",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_003.Id,
                        PlanName = "AIG Universal Life Flex - Premium",
                        PlanCode = "LIFE-003-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_LIFE_003.Id,
                        PlanName = "AIG Universal Life Flex - Standard",
                        PlanCode = "LIFE-003-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for MOTOR-001
                var product_MOTOR_001 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "MOTOR-001");
                if (product_MOTOR_001 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_001.Id,
                        PlanName = "State Farm Auto Complete - Basic",
                        PlanCode = "MOTOR-001-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_001.Id,
                        PlanName = "State Farm Auto Complete - Platinum",
                        PlanCode = "MOTOR-001-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_001.Id,
                        PlanName = "State Farm Auto Complete - Premium",
                        PlanCode = "MOTOR-001-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_001.Id,
                        PlanName = "State Farm Auto Complete - Standard",
                        PlanCode = "MOTOR-001-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for MOTOR-002
                var product_MOTOR_002 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "MOTOR-002");
                if (product_MOTOR_002 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_002.Id,
                        PlanName = "Geico Motorcycle Shield - Basic",
                        PlanCode = "MOTOR-002-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_002.Id,
                        PlanName = "Geico Motorcycle Shield - Platinum",
                        PlanCode = "MOTOR-002-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_002.Id,
                        PlanName = "Geico Motorcycle Shield - Premium",
                        PlanCode = "MOTOR-002-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_002.Id,
                        PlanName = "Geico Motorcycle Shield - Standard",
                        PlanCode = "MOTOR-002-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                // Plans for MOTOR-003
                var product_MOTOR_003 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "MOTOR-003");
                if (product_MOTOR_003 != null)
                {
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_003.Id,
                        PlanName = "Progressive Commercial Auto - Basic",
                        PlanCode = "MOTOR-003-BASIC",
                        Description = "Entry-level coverage for essential protection - Affordable starter plan",
                        CoverageAmount = 50000.00M,
                        TermYears = 10,
                        AccidentalDeathBenefit = 25000.00M,
                        DisabilityBenefit = 15000.00M,
                        CriticalIllnessBenefit = 10000.00M,
                        IncludesMaternityBenefit = false,
                        IncludesRiderOptions = false,
                        BasePremiumMonthly = 45.00M,
                        BasePremiumQuarterly = 132.30M,
                        BasePremiumSemiAnnual = 259.20M,
                        BasePremiumAnnual = 495.00M,
                        BasePremiumLumpSum = 4356.00M,
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.40M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_003.Id,
                        PlanName = "Progressive Commercial Auto - Platinum",
                        PlanCode = "MOTOR-003-PLATINUM",
                        Description = "Top-tier coverage with exclusive benefits - Ultimate protection and concierge services",
                        CoverageAmount = 500000.00M,
                        TermYears = 25,
                        AccidentalDeathBenefit = 250000.00M,
                        DisabilityBenefit = 150000.00M,
                        CriticalIllnessBenefit = 100000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 425.00M,
                        BasePremiumQuarterly = 1249.50M,
                        BasePremiumSemiAnnual = 2448.00M,
                        BasePremiumAnnual = 4675.00M,
                        BasePremiumLumpSum = 102850.00M,
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.25M,
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_003.Id,
                        PlanName = "Progressive Commercial Auto - Premium",
                        PlanCode = "MOTOR-003-PREMIUM",
                        Description = "Comprehensive coverage with maximum benefits - Enhanced protection",
                        CoverageAmount = 300000.00M,
                        TermYears = 20,
                        AccidentalDeathBenefit = 150000.00M,
                        DisabilityBenefit = 90000.00M,
                        CriticalIllnessBenefit = 60000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 245.00M,
                        BasePremiumQuarterly = 720.30M,
                        BasePremiumSemiAnnual = 1411.20M,
                        BasePremiumAnnual = 2695.00M,
                        BasePremiumLumpSum = 47432.00M,
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.30M,
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                    plans.Add(new InsurancePlan
                    {
                        ProductId = product_MOTOR_003.Id,
                        PlanName = "Progressive Commercial Auto - Standard",
                        PlanCode = "MOTOR-003-STANDARD",
                        Description = "Balanced coverage with enhanced benefits - Most popular choice",
                        CoverageAmount = 150000.00M,
                        TermYears = 15,
                        AccidentalDeathBenefit = 75000.00M,
                        DisabilityBenefit = 45000.00M,
                        CriticalIllnessBenefit = 30000.00M,
                        IncludesMaternityBenefit = true,
                        IncludesRiderOptions = true,
                        BasePremiumMonthly = 125.00M,
                        BasePremiumQuarterly = 367.50M,
                        BasePremiumSemiAnnual = 720.00M,
                        BasePremiumAnnual = 1375.00M,
                        BasePremiumLumpSum = 18150.00M,
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        MaleMultiplier = 1.10M,
                        FemaleMultiplier = 0.95M,
                        OccupationLowRiskMultiplier = 0.90M,
                        OccupationMediumRiskMultiplier = 1.00M,
                        OccupationHighRiskMultiplier = 1.35M,
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        IsActive = true
                    });
                }
                
                if (plans.Any())
                {
                    await context.InsurancePlans.AddRangeAsync(plans);
                    await context.SaveChangesAsync();
                }
            }
        }

        // =============================================
        // SEED CUSTOMER AND POLICIES
        // =============================================
        
        public static async Task SeedCustomerAndPolicies(AppDbContext context, UserManager<AppUser> userManager)
        {
            var customerUser = await userManager.FindByEmailAsync("customer@test.com");
            if (customerUser == null)
            {
                var user = new AppUser
                {
                    UserName = "customer@test.com",
                    Email = "customer@test.com",
                    EmailConfirmed = true,
                    ProfileType = "Customer",
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                };
                
                var result = await userManager.CreateAsync(user, "Customer@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, AppRoles.Customer);
                    
                    // Create Customer Profile
                    var customerProfile = new CustomerProfile
                    {
                        UserId = user.Id,
                        FirstName = "Nguyen Van",
                        LastName = "Test",
                        Email = user.Email,
                        PhoneNumber = "0912345678",
                        DateOfBirth = new DateTime(1990, 5, 15),
                        Gender = "Male",
                        Address = "123 Test Street, District 1, Ho Chi Minh City",
                        City = "Ho Chi Minh City",
                        Country = "Vietnam",
                        NationalId = "123456789012",
                        Occupation = "Software Engineer",
                        MonthlyIncome = 30000000
                    };
                    
                    await context.CustomerProfiles.AddAsync(customerProfile);
                    await context.SaveChangesAsync();
                    
                    user.ProfileId = customerProfile.Id;
                    await context.SaveChangesAsync();

                    // Get products for creating policies - use generated product codes
                    var lifeProduct = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "LIFE-001");
                    var healthProduct = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-001");
                    var motorProduct = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "MOTOR-001");

                    if (lifeProduct != null && healthProduct != null && motorProduct != null)
                    {
                        var policies = new[]
                        {
                            new InsurancePolicy
                            {
                                PolicyNumber = "POL-LIFE-001",
                                CustomerProfileId = customerProfile.Id,
                                ProductId = lifeProduct.Id,
                                CoverageAmount = 1000000,
                                Premium = 2400,
                                PaymentFrequency = "Monthly",
                                TermYears = 10,
                                StartDate = DateTime.UtcNow,
                                EndDate = DateTime.UtcNow.AddYears(10),
                                ApplicationDate = DateTime.UtcNow.AddDays(-5),
                                ApprovalDate = DateTime.UtcNow.AddDays(-2),
                                Status = "Active"
                            },
                            new InsurancePolicy
                            {
                                PolicyNumber = "POL-HEALTH-001",
                                CustomerProfileId = customerProfile.Id,
                                ProductId = healthProduct.Id,
                                CoverageAmount = 500000,
                                Premium = 15000,
                                PaymentFrequency = "Yearly",
                                TermYears = 5,
                                StartDate = DateTime.UtcNow.AddMonths(-3),
                                EndDate = DateTime.UtcNow.AddYears(5).AddMonths(-3),
                                ApplicationDate = DateTime.UtcNow.AddMonths(-4),
                                ApprovalDate = DateTime.UtcNow.AddMonths(-3).AddDays(-1),
                                Status = "Active"
                            },
                            new InsurancePolicy
                            {
                                PolicyNumber = "POL-MOTOR-002",
                                CustomerProfileId = customerProfile.Id,
                                ProductId = motorProduct.Id,
                                CoverageAmount = 200000,
                                Premium = 5000,
                                PaymentFrequency = "Yearly",
                                TermYears = 1,
                                StartDate = DateTime.UtcNow.AddMonths(-6),
                                EndDate = DateTime.UtcNow.AddMonths(6),
                                ApplicationDate = DateTime.UtcNow.AddMonths(-7),
                                ApprovalDate = DateTime.UtcNow.AddMonths(-6).AddDays(-2),
                                Status = "Active"
                            },
                            new InsurancePolicy
                            {
                                PolicyNumber = "POL-LIFE-PENDING",
                                CustomerProfileId = customerProfile.Id,
                                ProductId = lifeProduct.Id,
                                CoverageAmount = 2000000,
                                Premium = 4800,
                                PaymentFrequency = "Monthly",
                                TermYears = 15,
                                StartDate = DateTime.UtcNow.AddDays(10),
                                EndDate = DateTime.UtcNow.AddYears(15).AddDays(10),
                                ApplicationDate = DateTime.UtcNow.AddDays(-2),
                                Status = "Pending"
                            }
                        };
                        
                        await context.InsurancePolicies.AddRangeAsync(policies);
                        await context.SaveChangesAsync();

                        // Seed Payments for active policies
                        var activePolicies = policies.Where(p => p.Status == "Active").ToList();
                        var payments = new List<Payment>();

                        foreach (var policy in activePolicies)
                        {
                            if (policy.PaymentFrequency == "Monthly")
                            {
                                // Create past payments (already paid)
                                for (int i = 1; i <= 3; i++)
                                {
                                    payments.Add(new Payment
                                    {
                                        TransactionId = $"TXN-{policy.PolicyNumber}-{i:D3}",
                                        PolicyId = policy.Id,
                                        Amount = policy.Premium,
                                        DueDate = policy.StartDate!.Value.AddMonths(i - 1),
                                        PaymentDate = policy.StartDate.Value.AddMonths(i - 1).AddDays(2),
                                        PaymentMethod = i % 2 == 0 ? "BankTransfer" : "CreditCard",
                                        Status = "Paid",
                                        PaymentNote = $"Monthly premium payment #{i}"
                                    });
                                }

                                // Create upcoming payment (pending)
                                payments.Add(new Payment
                                {
                                    TransactionId = $"TXN-{policy.PolicyNumber}-004",
                                    PolicyId = policy.Id,
                                    Amount = policy.Premium,
                                    DueDate = DateTime.UtcNow.AddDays(15),
                                    PaymentMethod = "BankTransfer",
                                    Status = "Pending"
                                });

                                // Create overdue payment
                                payments.Add(new Payment
                                {
                                    TransactionId = $"TXN-{policy.PolicyNumber}-005",
                                    PolicyId = policy.Id,
                                    Amount = policy.Premium,
                                    DueDate = DateTime.UtcNow.AddDays(-5),
                                    PaymentMethod = "BankTransfer",
                                    Status = "Pending"
                                });
                            }
                            else if (policy.PaymentFrequency == "Yearly")
                            {
                                // Create past payment (already paid)
                                payments.Add(new Payment
                                {
                                    TransactionId = $"TXN-{policy.PolicyNumber}-001",
                                    PolicyId = policy.Id,
                                    Amount = policy.Premium,
                                    DueDate = policy.StartDate!.Value,
                                    PaymentDate = policy.StartDate.Value.AddDays(5),
                                    PaymentMethod = "BankTransfer",
                                    Status = "Paid",
                                    PaymentNote = "Annual premium payment"
                                });

                                // Create upcoming payment (pending) if policy still has time
                                if (policy.EndDate > DateTime.UtcNow.AddMonths(6))
                                {
                                    payments.Add(new Payment
                                    {
                                        TransactionId = $"TXN-{policy.PolicyNumber}-002",
                                        PolicyId = policy.Id,
                                        Amount = policy.Premium,
                                        DueDate = policy.StartDate.Value.AddYears(1),
                                        PaymentMethod = "BankTransfer",
                                        Status = "Pending"
                                    });
                                }
                            }
                        }

                        if (payments.Any())
                        {
                            await context.Payments.AddRangeAsync(payments);
                            await context.SaveChangesAsync();
                        }
                    }
                }
            }
        }
    }
}
