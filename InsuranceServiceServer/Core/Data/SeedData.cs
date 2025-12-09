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
            await SeedMedicalInsurancePlans(context);

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
            // Get all products for reference
            var products = await context.InsuranceProducts.ToListAsync();
            var lifeProduct1 = products.FirstOrDefault(p => p.ProductCode == "LIFE-001");
            var lifeProduct2 = products.FirstOrDefault(p => p.ProductCode == "LIFE-002");
            var healthProduct1 = products.FirstOrDefault(p => p.ProductCode == "HEALTH-001");
            var healthProduct2 = products.FirstOrDefault(p => p.ProductCode == "HEALTH-002");
            var healthProduct3 = products.FirstOrDefault(p => p.ProductCode == "HEALTH-003");
            var homeProduct1 = products.FirstOrDefault(p => p.ProductCode == "HOME-001");
            var homeProduct2 = products.FirstOrDefault(p => p.ProductCode == "HOME-002");
            var motorProduct1 = products.FirstOrDefault(p => p.ProductCode == "MOTOR-001");
            var motorProduct2 = products.FirstOrDefault(p => p.ProductCode == "MOTOR-002");

            // ========== CUSTOMER 1: Nguyen Van An - Young Professional ==========
            var customer1 = await CreateCustomerWithPolicies(context, userManager, new
            {
                Email = "nguyenvanan@example.com",
                Password = "Customer@123",
                FirstName = "Nguyen Van",
                LastName = "An",
                PhoneNumber = "0912345678",
                DateOfBirth = new DateTime(1995, 3, 15),
                Gender = "Male",
                Address = "123 Nguyen Hue Street, District 1",
                City = "Ho Chi Minh City",
                Country = "Vietnam",
                NationalId = "079095001234",
                Occupation = "Software Engineer",
                MonthlyIncome = 35000000M
            }, new[]
            {
                // Life Insurance Policy
                new PolicyData
                {
                    PolicyNumber = "POL-2024-LIFE-001",
                    Product = lifeProduct1,
                    CoverageAmount = 1500000M,
                    Premium = 3200M,
                    PaymentFrequency = "Monthly",
                    TermYears = 15,
                    StartDate = DateTime.UtcNow.AddMonths(-8),
                    Status = "Active",
                    Beneficiaries = new[]
                    {
                        new BeneficiaryData { Name = "Tran Thi Binh", Relationship = "Spouse", Percentage = 70 },
                        new BeneficiaryData { Name = "Nguyen Van Cuong", Relationship = "Parent", Percentage = 30 }
                    }
                },
                // Health Insurance Policy
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HEALTH-001",
                    Product = healthProduct1,
                    CoverageAmount = 800000M,
                    Premium = 4500M,
                    PaymentFrequency = "Quarterly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-4),
                    Status = "Active"
                },
                // Motor Insurance Policy
                new PolicyData
                {
                    PolicyNumber = "POL-2024-MOTOR-001",
                    Product = motorProduct1,
                    CoverageAmount = 500000M,
                    Premium = 6800M,
                    PaymentFrequency = "Yearly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-2),
                    Status = "Active",
                    Claims = new[]
                    {
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-001",
                            ClaimType = "Motor",
                            ClaimAmount = 15000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-30),
                            Status = "Approved",
                            ApprovedAmount = 15000M,
                            Description = "Minor accident - front bumper damage"
                        }
                    }
                }
            });

            // ========== CUSTOMER 2: Tran Thi Mai - Family with Children ==========
            var customer2 = await CreateCustomerWithPolicies(context, userManager, new
            {
                Email = "tranthimai@example.com",
                Password = "Customer@123",
                FirstName = "Tran Thi",
                LastName = "Mai",
                PhoneNumber = "0923456789",
                DateOfBirth = new DateTime(1988, 7, 22),
                Gender = "Female",
                Address = "456 Le Loi Boulevard, District 3",
                City = "Ho Chi Minh City",
                Country = "Vietnam",
                NationalId = "079088002345",
                Occupation = "Teacher",
                MonthlyIncome = 25000000M
            }, new[]
            {
                // Family Health Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HEALTH-002",
                    Product = healthProduct2,
                    CoverageAmount = 1200000M,
                    Premium = 8500M,
                    PaymentFrequency = "Quarterly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-6),
                    Status = "Active",
                    Claims = new[]
                    {
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-002",
                            ClaimType = "Health",
                            ClaimAmount = 25000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-45),
                            Status = "Approved",
                            ApprovedAmount = 22000M,
                            Description = "Hospitalization for child - fever treatment"
                        },
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-003",
                            ClaimType = "Health",
                            ClaimAmount = 8000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-15),
                            Status = "Processing",
                            Description = "Outpatient consultation and medication"
                        }
                    }
                },
                // Home Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HOME-001",
                    Product = homeProduct1,
                    CoverageAmount = 2500000M,
                    Premium = 12000M,
                    PaymentFrequency = "Yearly",
                    TermYears = 3,
                    StartDate = DateTime.UtcNow.AddMonths(-10),
                    Status = "Active"
                },
                // Life Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-LIFE-002",
                    Product = lifeProduct2,
                    CoverageAmount = 2000000M,
                    Premium = 5500M,
                    PaymentFrequency = "Monthly",
                    TermYears = 20,
                    StartDate = DateTime.UtcNow.AddMonths(-12),
                    Status = "Active",
                    Beneficiaries = new[]
                    {
                        new BeneficiaryData { Name = "Nguyen Van Hung", Relationship = "Spouse", Percentage = 50 },
                        new BeneficiaryData { Name = "Tran Minh Khang", Relationship = "Child", Percentage = 25 },
                        new BeneficiaryData { Name = "Tran Minh Anh", Relationship = "Child", Percentage = 25 }
                    }
                }
            });

            // ========== CUSTOMER 3: Le Van Binh - Senior Citizen ==========
            var customer3 = await CreateCustomerWithPolicies(context, userManager, new
            {
                Email = "levanbinh@example.com",
                Password = "Customer@123",
                FirstName = "Le Van",
                LastName = "Binh",
                PhoneNumber = "0934567890",
                DateOfBirth = new DateTime(1960, 11, 10),
                Gender = "Male",
                Address = "789 Tran Hung Dao Street, District 5",
                City = "Ho Chi Minh City",
                Country = "Vietnam",
                NationalId = "079060003456",
                Occupation = "Retired",
                MonthlyIncome = 15000000M
            }, new[]
            {
                // Senior Health Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HEALTH-003",
                    Product = healthProduct3,
                    CoverageAmount = 1500000M,
                    Premium = 15000M,
                    PaymentFrequency = "Yearly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-3),
                    Status = "Active",
                    Claims = new[]
                    {
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-004",
                            ClaimType = "Health",
                            ClaimAmount = 85000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-60),
                            Status = "Approved",
                            ApprovedAmount = 75000M,
                            Description = "Surgery - knee replacement"
                        },
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-005",
                            ClaimType = "Health",
                            ClaimAmount = 12000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-20),
                            Status = "Approved",
                            ApprovedAmount = 12000M,
                            Description = "Regular health checkup and medication"
                        }
                    }
                },
                // Home Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HOME-002",
                    Product = homeProduct2,
                    CoverageAmount = 1800000M,
                    Premium = 8500M,
                    PaymentFrequency = "Yearly",
                    TermYears = 5,
                    StartDate = DateTime.UtcNow.AddYears(-2),
                    Status = "Active"
                }
            });

            // ========== CUSTOMER 4: Pham Thi Dao - Young Entrepreneur ==========
            var customer4 = await CreateCustomerWithPolicies(context, userManager, new
            {
                Email = "phamthidao@example.com",
                Password = "Customer@123",
                FirstName = "Pham Thi",
                LastName = "Dao",
                PhoneNumber = "0945678901",
                DateOfBirth = new DateTime(1992, 5, 8),
                Gender = "Female",
                Address = "321 Vo Van Tan Street, District 3",
                City = "Ho Chi Minh City",
                Country = "Vietnam",
                NationalId = "079092004567",
                Occupation = "Business Owner",
                MonthlyIncome = 55000000M
            }, new[]
            {
                // Premium Life Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-LIFE-003",
                    Product = lifeProduct1,
                    CoverageAmount = 5000000M,
                    Premium = 12000M,
                    PaymentFrequency = "Monthly",
                    TermYears = 25,
                    StartDate = DateTime.UtcNow.AddMonths(-5),
                    Status = "Active",
                    Beneficiaries = new[]
                    {
                        new BeneficiaryData { Name = "Nguyen Van Phong", Relationship = "Spouse", Percentage = 60 },
                        new BeneficiaryData { Name = "Pham Thi Lan", Relationship = "Parent", Percentage = 40 }
                    }
                },
                // Health Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HEALTH-004",
                    Product = healthProduct1,
                    CoverageAmount = 2000000M,
                    Premium = 9500M,
                    PaymentFrequency = "Quarterly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-5),
                    Status = "Active"
                },
                // Motor Insurance (Luxury Car)
                new PolicyData
                {
                    PolicyNumber = "POL-2024-MOTOR-002",
                    Product = motorProduct1,
                    CoverageAmount = 1500000M,
                    Premium = 18000M,
                    PaymentFrequency = "Yearly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-1),
                    Status = "Active"
                },
                // Pending Home Insurance Application
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HOME-003",
                    Product = homeProduct1,
                    CoverageAmount = 8000000M,
                    Premium = 35000M,
                    PaymentFrequency = "Yearly",
                    TermYears = 10,
                    StartDate = DateTime.UtcNow.AddDays(15),
                    Status = "Pending"
                }
            });

            // ========== CUSTOMER 5: Hoang Van Cuong - Middle-aged Professional ==========
            var customer5 = await CreateCustomerWithPolicies(context, userManager, new
            {
                Email = "hoangvancuong@example.com",
                Password = "Customer@123",
                FirstName = "Hoang Van",
                LastName = "Cuong",
                PhoneNumber = "0956789012",
                DateOfBirth = new DateTime(1978, 9, 25),
                Gender = "Male",
                Address = "654 Cach Mang Thang Tam Street, District 10",
                City = "Ho Chi Minh City",
                Country = "Vietnam",
                NationalId = "079078005678",
                Occupation = "Doctor",
                MonthlyIncome = 65000000M
            }, new[]
            {
                // Life Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-LIFE-004",
                    Product = lifeProduct2,
                    CoverageAmount = 3500000M,
                    Premium = 8500M,
                    PaymentFrequency = "Monthly",
                    TermYears = 20,
                    StartDate = DateTime.UtcNow.AddYears(-1),
                    Status = "Active",
                    Beneficiaries = new[]
                    {
                        new BeneficiaryData { Name = "Nguyen Thi Hoa", Relationship = "Spouse", Percentage = 70 },
                        new BeneficiaryData { Name = "Hoang Minh Tuan", Relationship = "Child", Percentage = 30 }
                    }
                },
                // Health Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HEALTH-005",
                    Product = healthProduct2,
                    CoverageAmount = 1800000M,
                    Premium = 11000M,
                    PaymentFrequency = "Quarterly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-7),
                    Status = "Active",
                    Claims = new[]
                    {
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-006",
                            ClaimType = "Health",
                            ClaimAmount = 35000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-10),
                            Status = "Processing",
                            Description = "Emergency room visit and diagnostic tests"
                        }
                    }
                },
                // Motor Insurance (Motorcycle)
                new PolicyData
                {
                    PolicyNumber = "POL-2024-MOTOR-003",
                    Product = motorProduct2,
                    CoverageAmount = 300000M,
                    Premium = 3500M,
                    PaymentFrequency = "Yearly",
                    TermYears = 1,
                    StartDate = DateTime.UtcNow.AddMonths(-9),
                    Status = "Active"
                },
                // Home Insurance
                new PolicyData
                {
                    PolicyNumber = "POL-2024-HOME-004",
                    Product = homeProduct1,
                    CoverageAmount = 4500000M,
                    Premium = 22000M,
                    PaymentFrequency = "Yearly",
                    TermYears = 5,
                    StartDate = DateTime.UtcNow.AddMonths(-14),
                    Status = "Active",
                    Claims = new[]
                    {
                        new ClaimData
                        {
                            ClaimNumber = "CLM-2024-007",
                            ClaimType = "Home",
                            ClaimAmount = 45000M,
                            ClaimDate = DateTime.UtcNow.AddDays(-90),
                            Status = "Rejected",
                            Description = "Water damage from plumbing - pre-existing condition"
                        }
                    }
                },
                // Rejected Life Insurance Application
                new PolicyData
                {
                    PolicyNumber = "POL-2024-LIFE-005",
                    Product = lifeProduct1,
                    CoverageAmount = 10000000M,
                    Premium = 25000M,
                    PaymentFrequency = "Monthly",
                    TermYears = 30,
                    StartDate = DateTime.UtcNow.AddDays(30),
                    Status = "Rejected"
                }
            });

            // ========== GENERATE 50 ADDITIONAL RANDOM CUSTOMERS ==========
            var random = new Random(12345); // Fixed seed for reproducibility
            
            var firstNames = new[] { "Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Vo", "Dang", "Bui", 
                                    "Do", "Ho", "Ngo", "Duong", "Ly", "Mai", "Truong", "Dinh", "Tang", "Lam" };
            var middleNames = new[] { "Van", "Thi", "Minh", "Thanh", "Anh", "Duc", "Quoc", "Ngoc", "Hong", "Kim" };
            var lastNames = new[] { "An", "Binh", "Cuong", "Dao", "Em", "Giang", "Hoa", "Khang", "Linh", "Mai",
                                   "Nam", "Oanh", "Phong", "Quyen", "Son", "Tuan", "Uyen", "Vinh", "Xuan", "Yen" };
            
            var occupations = new[] { "Software Engineer", "Teacher", "Doctor", "Nurse", "Accountant", "Engineer", 
                                     "Manager", "Sales Representative", "Business Owner", "Lawyer", "Architect",
                                     "Designer", "Marketing Specialist", "HR Manager", "Pharmacist", "Dentist",
                                     "Chef", "Mechanic", "Electrician", "Plumber", "Driver", "Clerk", "Consultant" };
            
            var cities = new[] { "Ho Chi Minh City", "Hanoi", "Da Nang", "Can Tho", "Hai Phong", "Bien Hoa", "Nha Trang" };
            var districts = new[] { "District 1", "District 2", "District 3", "District 5", "District 7", "District 10", "Binh Thanh", "Tan Binh" };
            
            for (int i = 6; i <= 55; i++) // Customer 6 to 55
            {
                var firstName = firstNames[random.Next(firstNames.Length)];
                var middleName = middleNames[random.Next(middleNames.Length)];
                var lastName = lastNames[random.Next(lastNames.Length)];
                var fullName = $"{firstName} {middleName}";
                var email = $"{firstName.ToLower()}{middleName.ToLower()}{lastName.ToLower()}{i}@example.com";
                
                var age = random.Next(25, 65);
                var birthYear = DateTime.UtcNow.Year - age;
                var birthMonth = random.Next(1, 13);
                var birthDay = random.Next(1, 29);
                
                var gender = random.Next(2) == 0 ? "Male" : "Female";
                var occupation = occupations[random.Next(occupations.Length)];
                var monthlyIncome = random.Next(15, 100) * 1000000M; // 15M - 100M VND
                
                var city = cities[random.Next(cities.Length)];
                var district = districts[random.Next(districts.Length)];
                var streetNumber = random.Next(1, 999);
                var address = $"{streetNumber} Street {random.Next(1, 50)}, {district}";
                
                // Generate 1-3 random policies
                var numPolicies = random.Next(1, 4);
                var customerPolicies = new List<PolicyData>();
                var usedProducts = new HashSet<int>();
                
                for (int p = 0; p < numPolicies; p++)
                {
                    InsuranceProduct? selectedProduct = null;
                    int attempts = 0;
                    
                    // Try to select a unique product
                    while (selectedProduct == null && attempts < 10)
                    {
                        var productIndex = random.Next(products.Count);
                        if (!usedProducts.Contains(productIndex) && products[productIndex] != null)
                        {
                            selectedProduct = products[productIndex];
                            usedProducts.Add(productIndex);
                        }
                        attempts++;
                    }
                    
                    if (selectedProduct == null) continue;
                    
                    var coverageAmount = random.Next(5, 100) * 10000M; // 50K - 1M
                    var premium = random.Next(20, 200) * 100M; // 2K - 20K
                    var paymentFrequencies = new[] { "Monthly", "Quarterly", "Yearly" };
                    var paymentFrequency = paymentFrequencies[random.Next(paymentFrequencies.Length)];
                    var termYears = random.Next(1, 21); // 1-20 years
                    var monthsAgo = random.Next(1, 24); // Started 1-24 months ago
                    
                    var policy = new PolicyData
                    {
                        PolicyNumber = $"POL-2024-{selectedProduct.ProductType.ToUpper()}-{i:D3}-{p + 1}",
                        Product = selectedProduct,
                        CoverageAmount = coverageAmount,
                        Premium = premium,
                        PaymentFrequency = paymentFrequency,
                        TermYears = termYears,
                        StartDate = DateTime.UtcNow.AddMonths(-monthsAgo),
                        Status = random.Next(100) < 90 ? "Active" : (random.Next(2) == 0 ? "Pending" : "Expired")
                    };
                    
                    // 20% chance of having a claim
                    if (random.Next(100) < 20 && policy.Status == "Active")
                    {
                        var claimStatuses = new[] { "Approved", "Processing", "Rejected" };
                        var claimStatus = claimStatuses[random.Next(claimStatuses.Length)];
                        var claimAmount = random.Next(50, 500) * 100M;
                        var approvedAmount = claimStatus == "Approved" ? claimAmount * (decimal)(0.8 + random.NextDouble() * 0.2) : (decimal?)null;
                        
                        policy.Claims = new[]
                        {
                            new ClaimData
                            {
                                ClaimNumber = $"CLM-2024-{i:D3}-{p + 1}",
                                ClaimType = selectedProduct.ProductType,
                                ClaimAmount = claimAmount,
                                ClaimDate = DateTime.UtcNow.AddDays(-random.Next(5, 90)),
                                Status = claimStatus,
                                ApprovedAmount = approvedAmount,
                                Description = $"{selectedProduct.ProductType} claim - {(claimStatus == "Approved" ? "Approved" : claimStatus == "Processing" ? "Under review" : "Denied")}"
                            }
                        };
                    }
                    
                    customerPolicies.Add(policy);
                }
                
                if (customerPolicies.Count == 0) continue; // Skip if no policies
                
                await CreateCustomerWithPolicies(context, userManager, new
                {
                    Email = email,
                    Password = "Customer@123",
                    FirstName = fullName,
                    LastName = lastName,
                    PhoneNumber = $"09{random.Next(10000000, 99999999)}",
                    DateOfBirth = new DateTime(birthYear, birthMonth, birthDay),
                    Gender = gender,
                    Address = address,
                    City = city,
                    Country = "Vietnam",
                    NationalId = $"079{birthYear % 100:D2}{random.Next(1000000, 9999999)}",
                    Occupation = occupation,
                    MonthlyIncome = monthlyIncome
                }, customerPolicies.ToArray());
            }
        }

        // Helper class for policy data
        private class PolicyData
        {
            public string PolicyNumber { get; set; } = string.Empty;
            public InsuranceProduct? Product { get; set; }
            public decimal CoverageAmount { get; set; }
            public decimal Premium { get; set; }
            public string PaymentFrequency { get; set; } = "Monthly";
            public int TermYears { get; set; }
            public DateTime StartDate { get; set; }
            public string Status { get; set; } = "Active";
            public BeneficiaryData[]? Beneficiaries { get; set; }
            public ClaimData[]? Claims { get; set; }
        }

        private class BeneficiaryData
        {
            public string Name { get; set; } = string.Empty;
            public string Relationship { get; set; } = string.Empty;
            public int Percentage { get; set; }
        }

        private class ClaimData
        {
            public string ClaimNumber { get; set; } = string.Empty;
            public string ClaimType { get; set; } = string.Empty;
            public decimal ClaimAmount { get; set; }
            public DateTime ClaimDate { get; set; }
            public string Status { get; set; } = "Pending";
            public decimal? ApprovedAmount { get; set; }
            public string Description { get; set; } = string.Empty;
        }

        // Helper method to create customer with policies
        private static async Task<CustomerProfile?> CreateCustomerWithPolicies(
            AppDbContext context,
            UserManager<AppUser> userManager,
            dynamic customerData,
            PolicyData[] policiesData)
        {
            var existingUser = await userManager.FindByEmailAsync(customerData.Email);
            if (existingUser != null) return null;

            var user = new AppUser
            {
                UserName = customerData.Email,
                Email = customerData.Email,
                EmailConfirmed = true,
                ProfileType = "Customer",
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(user, customerData.Password);
            if (!result.Succeeded) return null;

            await userManager.AddToRoleAsync(user, AppRoles.Customer);

            var customerProfile = new CustomerProfile
            {
                UserId = user.Id,
                FirstName = customerData.FirstName,
                LastName = customerData.LastName,
                Email = customerData.Email,
                PhoneNumber = customerData.PhoneNumber,
                DateOfBirth = customerData.DateOfBirth,
                Gender = customerData.Gender,
                Address = customerData.Address,
                City = customerData.City,
                Country = customerData.Country,
                NationalId = customerData.NationalId,
                Occupation = customerData.Occupation,
                MonthlyIncome = customerData.MonthlyIncome
            };

            await context.CustomerProfiles.AddAsync(customerProfile);
            await context.SaveChangesAsync();

            user.ProfileId = customerProfile.Id;
            await context.SaveChangesAsync();

            // Create policies
            var policies = new List<InsurancePolicy>();
            foreach (var policyData in policiesData)
            {
                if (policyData.Product == null) continue;

                var policy = new InsurancePolicy
                {
                    PolicyNumber = policyData.PolicyNumber,
                    CustomerProfileId = customerProfile.Id,
                    ProductId = policyData.Product.Id,
                    CoverageAmount = policyData.CoverageAmount,
                    Premium = policyData.Premium,
                    PaymentFrequency = policyData.PaymentFrequency,
                    TermYears = policyData.TermYears,
                    StartDate = policyData.StartDate,
                    EndDate = policyData.StartDate.AddYears(policyData.TermYears),
                    ApplicationDate = policyData.StartDate.AddDays(-10),
                    ApprovalDate = policyData.Status == "Active" ? policyData.StartDate.AddDays(-2) : null,
                    Status = policyData.Status
                };

                policies.Add(policy);
            }

            await context.InsurancePolicies.AddRangeAsync(policies);
            await context.SaveChangesAsync();

            // Create beneficiaries, claims, and payments
            for (int i = 0; i < policiesData.Length; i++)
            {
                var policyData = policiesData[i];
                var policy = policies[i];

                // Note: Beneficiaries are linked to Applications, not Policies
                // So we skip beneficiary creation in this policy-based seed data
                
                // Create claims
                if (policyData.Claims != null && policyData.Claims.Length > 0)
                {
                    var claims = policyData.Claims.Select(c => new InsuranceClaim
                    {
                        ClaimNumber = c.ClaimNumber,
                        PolicyId = policy.Id,
                        ClaimType = c.ClaimType,
                        ClaimAmount = c.ClaimAmount,
                        ClaimDate = c.ClaimDate,
                        IncidentDate = c.ClaimDate.AddDays(-1), // Incident happened 1 day before claim
                        Status = c.Status,
                        ApprovedAmount = c.ApprovedAmount,
                        Description = c.Description,
                        ReviewedDate = c.Status != "Processing" ? c.ClaimDate.AddDays(7) : null
                    }).ToList();

                    await context.InsuranceClaims.AddRangeAsync(claims);
                }

                // Create payments for active policies
                if (policy.Status == "Active")
                {
                    var payments = new List<Payment>();
                    var monthsSinceStart = (int)((DateTime.UtcNow - policy.StartDate!.Value).TotalDays / 30);

                    if (policyData.PaymentFrequency == "Monthly" && monthsSinceStart > 0)
                    {
                        // Create past payments
                        for (int j = 0; j < Math.Min(monthsSinceStart, 6); j++)
                        {
                            payments.Add(new Payment
                            {
                                TransactionId = $"TXN-{policy.PolicyNumber}-{j + 1:D3}",
                                PolicyId = policy.Id,
                                Amount = policy.Premium,
                                DueDate = policy.StartDate.Value.AddMonths(j),
                                PaymentDate = policy.StartDate.Value.AddMonths(j).AddDays(2),
                                PaymentMethod = j % 3 == 0 ? "CreditCard" : j % 3 == 1 ? "BankTransfer" : "Cash",
                                Status = "Paid",
                                PaymentNote = $"Monthly premium payment #{j + 1}"
                            });
                        }

                        // Create upcoming payment
                        if (monthsSinceStart < policy.TermYears * 12)
                        {
                            payments.Add(new Payment
                            {
                                TransactionId = $"TXN-{policy.PolicyNumber}-{monthsSinceStart + 1:D3}",
                                PolicyId = policy.Id,
                                Amount = policy.Premium,
                                DueDate = DateTime.UtcNow.AddDays(15),
                                PaymentMethod = "BankTransfer",
                                Status = "Pending"
                            });
                        }
                    }
                    else if (policyData.PaymentFrequency == "Quarterly")
                    {
                        var quartersPassed = monthsSinceStart / 3;
                        for (int j = 0; j < quartersPassed; j++)
                        {
                            payments.Add(new Payment
                            {
                                TransactionId = $"TXN-{policy.PolicyNumber}-Q{j + 1}",
                                PolicyId = policy.Id,
                                Amount = policy.Premium,
                                DueDate = policy.StartDate.Value.AddMonths(j * 3),
                                PaymentDate = policy.StartDate.Value.AddMonths(j * 3).AddDays(3),
                                PaymentMethod = "BankTransfer",
                                Status = "Paid",
                                PaymentNote = $"Quarterly premium payment Q{j + 1}"
                            });
                        }

                        // Next quarterly payment
                        if (quartersPassed * 3 < policy.TermYears * 12)
                        {
                            payments.Add(new Payment
                            {
                                TransactionId = $"TXN-{policy.PolicyNumber}-Q{quartersPassed + 1}",
                                PolicyId = policy.Id,
                                Amount = policy.Premium,
                                DueDate = policy.StartDate.Value.AddMonths((quartersPassed + 1) * 3),
                                PaymentMethod = "BankTransfer",
                                Status = "Pending"
                            });
                        }
                    }
                    else if (policyData.PaymentFrequency == "Yearly")
                    {
                        var yearsPassed = monthsSinceStart / 12;
                        for (int j = 0; j <= yearsPassed && j < policy.TermYears; j++)
                        {
                            payments.Add(new Payment
                            {
                                TransactionId = $"TXN-{policy.PolicyNumber}-Y{j + 1}",
                                PolicyId = policy.Id,
                                Amount = policy.Premium,
                                DueDate = policy.StartDate.Value.AddYears(j),
                                PaymentDate = j < yearsPassed ? policy.StartDate.Value.AddYears(j).AddDays(5) : null,
                                PaymentMethod = "BankTransfer",
                                Status = j < yearsPassed ? "Paid" : "Pending",
                                PaymentNote = j < yearsPassed ? $"Annual premium payment Year {j + 1}" : null
                            });
                        }
                    }

                    if (payments.Any())
                    {
                        await context.Payments.AddRangeAsync(payments);
                    }
                }
            }

            await context.SaveChangesAsync();
            return customerProfile;
        }
        
        // =============================================
        // SEED MEDICAL INSURANCE PLANS
        // Specialized health insurance plans with detailed coverage
        // =============================================
        
        public static async Task SeedMedicalInsurancePlans(AppDbContext context)
        {
            if (!await context.MedicalInsurancePlans.AnyAsync())
            {
                var medicalPlans = new List<MedicalInsurancePlan>();
                
                // ========== HEALTH-001: UnitedHealth Global Medical ==========
                var product_HEALTH_001 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-001");
                if (product_HEALTH_001 != null)
                {
                    // Basic Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "Basic Health",
                        PlanCode = "MED-HEALTH-001-BASIC",
                        Description = "Essential health coverage for individuals - Affordable protection for basic medical needs",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 50000.00M,
                        LifetimeCoverageLimit = 500000.00M,
                        Deductible = 1000.00M,
                        CoPaymentPercentage = 20.00M,
                        OutOfPocketMaximum = 5000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 200.00M,
                        ICUDailyLimit = 500.00M,
                        HospitalizationCoveragePercentage = 80.00M,
                        MaxHospitalizationDays = 30,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 5000.00M,
                        DoctorVisitCopay = 30.00M,
                        SpecialistVisitCopay = 50.00M,
                        DiagnosticTestsCoveragePercentage = 70.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 2000.00M,
                        GenericDrugCopay = 10.00M,
                        BrandNameDrugCopay = 30.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = false,
                        MaternityCoverageLimit = null,
                        IncludesDentalBasic = false,
                        DentalAnnualLimit = null,
                        IncludesVisionBasic = false,
                        VisionAnnualLimit = null,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = false,
                        MentalHealthSessionLimit = null,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 100.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 10000.00M,
                        AccidentalInjuryCoverage = 5000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = true,
                        RequiresReferralForSpecialist = true,
                        PreAuthorizationRequired = true,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 30,
                        PreExistingConditionWaitingPeriodMonths = 24,
                        MaternityWaitingPeriodMonths = null,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 120.00M,
                        BasePremiumQuarterly = 350.00M,
                        BasePremiumSemiAnnual = 680.00M,
                        BasePremiumAnnual = 1300.00M,
                        BasePremiumLumpSum = 1300.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.80M,
                        AgeMultiplier56_65 = 2.50M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.00M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.20M,
                        OccupationHighRiskMultiplier = 1.50M,
                        
                        // Plan Limits and Rules
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        
                        // Display & Status
                        DisplayOrder = 1,
                        IsActive = true,
                        IsFeatured = false,
                        IsPopular = true
                    });
                    
                    // Standard Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "Standard Health",
                        PlanCode = "MED-HEALTH-001-STANDARD",
                        Description = "Comprehensive health coverage with enhanced benefits - Most popular choice for families",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 150000.00M,
                        LifetimeCoverageLimit = 1500000.00M,
                        Deductible = 750.00M,
                        CoPaymentPercentage = 15.00M,
                        OutOfPocketMaximum = 4000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 400.00M,
                        ICUDailyLimit = 1000.00M,
                        HospitalizationCoveragePercentage = 85.00M,
                        MaxHospitalizationDays = 60,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 10000.00M,
                        DoctorVisitCopay = 25.00M,
                        SpecialistVisitCopay = 40.00M,
                        DiagnosticTestsCoveragePercentage = 80.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 5000.00M,
                        GenericDrugCopay = 8.00M,
                        BrandNameDrugCopay = 25.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = true,
                        MaternityCoverageLimit = 15000.00M,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 1000.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 500.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 10,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 75.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 30000.00M,
                        AccidentalInjuryCoverage = 15000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = true,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 15,
                        PreExistingConditionWaitingPeriodMonths = 18,
                        MaternityWaitingPeriodMonths = 10,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 280.00M,
                        BasePremiumQuarterly = 820.00M,
                        BasePremiumSemiAnnual = 1600.00M,
                        BasePremiumAnnual = 3050.00M,
                        BasePremiumLumpSum = 3050.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.05M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.15M,
                        OccupationHighRiskMultiplier = 1.40M,
                        
                        // Plan Limits and Rules
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        
                        // Display & Status
                        DisplayOrder = 2,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = true
                    });
                    
                    // Premium Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "Premium Health",
                        PlanCode = "MED-HEALTH-001-PREMIUM",
                        Description = "Premium coverage with maximum benefits - Superior protection for comprehensive care",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 300000.00M,
                        LifetimeCoverageLimit = 3000000.00M,
                        Deductible = 500.00M,
                        CoPaymentPercentage = 10.00M,
                        OutOfPocketMaximum = 3000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 800.00M,
                        ICUDailyLimit = 2000.00M,
                        HospitalizationCoveragePercentage = 90.00M,
                        MaxHospitalizationDays = 90,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 20000.00M,
                        DoctorVisitCopay = 20.00M,
                        SpecialistVisitCopay = 30.00M,
                        DiagnosticTestsCoveragePercentage = 90.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 10000.00M,
                        GenericDrugCopay = 5.00M,
                        BrandNameDrugCopay = 20.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = true,
                        MaternityCoverageLimit = 30000.00M,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 2000.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 1000.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 20,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 50.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 60000.00M,
                        AccidentalInjuryCoverage = 30000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = false,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 0,
                        PreExistingConditionWaitingPeriodMonths = 12,
                        MaternityWaitingPeriodMonths = 9,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 520.00M,
                        BasePremiumQuarterly = 1530.00M,
                        BasePremiumSemiAnnual = 2990.00M,
                        BasePremiumAnnual = 5700.00M,
                        BasePremiumLumpSum = 5700.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.05M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.10M,
                        OccupationHighRiskMultiplier = 1.30M,
                        
                        // Plan Limits and Rules
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        
                        // Display & Status
                        DisplayOrder = 3,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = false
                    });
                    
                    // Platinum Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_001.Id,
                        PlanName = "Platinum Health",
                        PlanCode = "MED-HEALTH-001-PLATINUM",
                        Description = "Ultimate health coverage with exclusive benefits - VIP medical care with concierge services",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 500000.00M,
                        LifetimeCoverageLimit = null, // Unlimited
                        Deductible = 250.00M,
                        CoPaymentPercentage = 5.00M,
                        OutOfPocketMaximum = 2000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 1500.00M,
                        ICUDailyLimit = 3500.00M,
                        HospitalizationCoveragePercentage = 95.00M,
                        MaxHospitalizationDays = 120,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 40000.00M,
                        DoctorVisitCopay = 10.00M,
                        SpecialistVisitCopay = 20.00M,
                        DiagnosticTestsCoveragePercentage = 95.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 20000.00M,
                        GenericDrugCopay = 3.00M,
                        BrandNameDrugCopay = 15.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = true,
                        MaternityCoverageLimit = 50000.00M,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 5000.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 2000.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 50,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 25.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 100000.00M,
                        AccidentalInjuryCoverage = 50000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = false,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 0,
                        PreExistingConditionWaitingPeriodMonths = 6,
                        MaternityWaitingPeriodMonths = 6,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 950.00M,
                        BasePremiumQuarterly = 2800.00M,
                        BasePremiumSemiAnnual = 5500.00M,
                        BasePremiumAnnual = 10500.00M,
                        BasePremiumLumpSum = 10500.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.95M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.15M,
                        AgeMultiplier46_55 = 1.40M,
                        AgeMultiplier56_65 = 1.80M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.10M,
                        HealthPoorMultiplier = 1.25M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.05M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.05M,
                        OccupationHighRiskMultiplier = 1.25M,
                        
                        // Plan Limits and Rules
                        MinAge = 25,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        
                        // Display & Status
                        DisplayOrder = 4,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = false
                    });
                }
                
                // ========== HEALTH-002: Cigna Family Health Plus ==========
                var product_HEALTH_002 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-002");
                if (product_HEALTH_002 != null)
                {
                    // Basic Family Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Family Basic",
                        PlanCode = "MED-HEALTH-002-BASIC",
                        Description = "Affordable family health coverage - Essential protection for the whole family",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 75000.00M,
                        LifetimeCoverageLimit = 750000.00M,
                        Deductible = 1500.00M,
                        CoPaymentPercentage = 20.00M,
                        OutOfPocketMaximum = 6000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 250.00M,
                        ICUDailyLimit = 600.00M,
                        HospitalizationCoveragePercentage = 80.00M,
                        MaxHospitalizationDays = 40,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 6000.00M,
                        DoctorVisitCopay = 35.00M,
                        SpecialistVisitCopay = 55.00M,
                        DiagnosticTestsCoveragePercentage = 75.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 3000.00M,
                        GenericDrugCopay = 12.00M,
                        BrandNameDrugCopay = 35.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = true,
                        MaternityCoverageLimit = 10000.00M,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 800.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 400.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = false,
                        MentalHealthSessionLimit = null,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 120.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 15000.00M,
                        AccidentalInjuryCoverage = 8000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = true,
                        RequiresReferralForSpecialist = true,
                        PreAuthorizationRequired = true,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 30,
                        PreExistingConditionWaitingPeriodMonths = 24,
                        MaternityWaitingPeriodMonths = 12,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 180.00M,
                        BasePremiumQuarterly = 530.00M,
                        BasePremiumSemiAnnual = 1040.00M,
                        BasePremiumAnnual = 1980.00M,
                        BasePremiumLumpSum = 1980.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.30M,
                        AgeMultiplier46_55 = 1.70M,
                        AgeMultiplier56_65 = 2.20M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.50M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.00M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.20M,
                        OccupationHighRiskMultiplier = 1.50M,
                        
                        // Plan Limits and Rules
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        
                        // Display & Status
                        DisplayOrder = 1,
                        IsActive = true,
                        IsFeatured = false,
                        IsPopular = true
                    });
                    
                    // Standard Family Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Family Standard",
                        PlanCode = "MED-HEALTH-002-STANDARD",
                        Description = "Comprehensive family coverage with pediatric care - Complete protection for growing families",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 200000.00M,
                        LifetimeCoverageLimit = 2000000.00M,
                        Deductible = 1000.00M,
                        CoPaymentPercentage = 15.00M,
                        OutOfPocketMaximum = 5000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 500.00M,
                        ICUDailyLimit = 1200.00M,
                        HospitalizationCoveragePercentage = 85.00M,
                        MaxHospitalizationDays = 70,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 12000.00M,
                        DoctorVisitCopay = 25.00M,
                        SpecialistVisitCopay = 45.00M,
                        DiagnosticTestsCoveragePercentage = 85.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 6000.00M,
                        GenericDrugCopay = 8.00M,
                        BrandNameDrugCopay = 25.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = true,
                        MaternityCoverageLimit = 25000.00M,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 1500.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 750.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 15,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 80.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 40000.00M,
                        AccidentalInjuryCoverage = 20000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = true,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 15,
                        PreExistingConditionWaitingPeriodMonths = 18,
                        MaternityWaitingPeriodMonths = 10,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 380.00M,
                        BasePremiumQuarterly = 1120.00M,
                        BasePremiumSemiAnnual = 2190.00M,
                        BasePremiumAnnual = 4180.00M,
                        BasePremiumLumpSum = 4180.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.25M,
                        AgeMultiplier46_55 = 1.60M,
                        AgeMultiplier56_65 = 2.10M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.40M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.05M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.15M,
                        OccupationHighRiskMultiplier = 1.35M,
                        
                        // Plan Limits and Rules
                        MinAge = 18,
                        MaxAge = 65,
                        RequiresMedicalExam = false,
                        
                        // Display & Status
                        DisplayOrder = 2,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = true
                    });
                    
                    // Premium Family Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_002.Id,
                        PlanName = "Family Premium",
                        PlanCode = "MED-HEALTH-002-PREMIUM",
                        Description = "Premium family health plan with maternity excellence - Superior care for your loved ones",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 400000.00M,
                        LifetimeCoverageLimit = 4000000.00M,
                        Deductible = 500.00M,
                        CoPaymentPercentage = 10.00M,
                        OutOfPocketMaximum = 3500.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 1000.00M,
                        ICUDailyLimit = 2500.00M,
                        HospitalizationCoveragePercentage = 90.00M,
                        MaxHospitalizationDays = 100,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 25000.00M,
                        DoctorVisitCopay = 20.00M,
                        SpecialistVisitCopay = 35.00M,
                        DiagnosticTestsCoveragePercentage = 90.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 12000.00M,
                        GenericDrugCopay = 5.00M,
                        BrandNameDrugCopay = 20.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = true,
                        MaternityCoverageLimit = 40000.00M,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 3000.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 1500.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 30,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 50.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 75000.00M,
                        AccidentalInjuryCoverage = 40000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = false,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 0,
                        PreExistingConditionWaitingPeriodMonths = 12,
                        MaternityWaitingPeriodMonths = 9,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 720.00M,
                        BasePremiumQuarterly = 2120.00M,
                        BasePremiumSemiAnnual = 4150.00M,
                        BasePremiumAnnual = 7920.00M,
                        BasePremiumLumpSum = 7920.00M,
                        
                        // Age-based multipliers
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 1.00M,
                        AgeMultiplier36_45 = 1.20M,
                        AgeMultiplier46_55 = 1.50M,
                        AgeMultiplier56_65 = 2.00M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.30M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.00M,
                        FemaleMultiplier = 1.05M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.10M,
                        OccupationHighRiskMultiplier = 1.30M,
                        
                        // Plan Limits and Rules
                        MinAge = 21,
                        MaxAge = 65,
                        RequiresMedicalExam = true,
                        
                        // Display & Status
                        DisplayOrder = 3,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = false
                    });
                }
                
                // ========== HEALTH-003: Aetna Senior Care Elite ==========
                var product_HEALTH_003 = await context.InsuranceProducts.FirstOrDefaultAsync(p => p.ProductCode == "HEALTH-003");
                if (product_HEALTH_003 != null)
                {
                    // Senior Basic Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Senior Basic",
                        PlanCode = "MED-HEALTH-003-BASIC",
                        Description = "Essential senior health coverage - Affordable protection for seniors 50+",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 100000.00M,
                        LifetimeCoverageLimit = 1000000.00M,
                        Deductible = 2000.00M,
                        CoPaymentPercentage = 20.00M,
                        OutOfPocketMaximum = 7000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 300.00M,
                        ICUDailyLimit = 800.00M,
                        HospitalizationCoveragePercentage = 80.00M,
                        MaxHospitalizationDays = 50,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 8000.00M,
                        DoctorVisitCopay = 30.00M,
                        SpecialistVisitCopay = 50.00M,
                        DiagnosticTestsCoveragePercentage = 75.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 4000.00M,
                        GenericDrugCopay = 10.00M,
                        BrandNameDrugCopay = 30.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = false,
                        MaternityCoverageLimit = null,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 1200.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 600.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 12,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 100.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 25000.00M,
                        AccidentalInjuryCoverage = 12000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = true,
                        RequiresReferralForSpecialist = true,
                        PreAuthorizationRequired = true,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 30,
                        PreExistingConditionWaitingPeriodMonths = 36,
                        MaternityWaitingPeriodMonths = null,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 250.00M,
                        BasePremiumQuarterly = 735.00M,
                        BasePremiumSemiAnnual = 1440.00M,
                        BasePremiumAnnual = 2750.00M,
                        BasePremiumLumpSum = 2750.00M,
                        
                        // Age-based multipliers (adjusted for seniors)
                        AgeMultiplier18_25 = 0.80M,
                        AgeMultiplier26_35 = 0.90M,
                        AgeMultiplier36_45 = 1.00M,
                        AgeMultiplier46_55 = 1.20M,
                        AgeMultiplier56_65 = 1.50M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.90M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.25M,
                        HealthPoorMultiplier = 1.60M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 1.00M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.15M,
                        OccupationHighRiskMultiplier = 1.40M,
                        
                        // Plan Limits and Rules
                        MinAge = 50,
                        MaxAge = 75,
                        RequiresMedicalExam = true,
                        
                        // Display & Status
                        DisplayOrder = 1,
                        IsActive = true,
                        IsFeatured = false,
                        IsPopular = true
                    });
                    
                    // Senior Premium Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Senior Premium",
                        PlanCode = "MED-HEALTH-003-PREMIUM",
                        Description = "Comprehensive senior care with chronic disease management - Complete protection for golden years",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 250000.00M,
                        LifetimeCoverageLimit = 2500000.00M,
                        Deductible = 1000.00M,
                        CoPaymentPercentage = 15.00M,
                        OutOfPocketMaximum = 5000.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 700.00M,
                        ICUDailyLimit = 1800.00M,
                        HospitalizationCoveragePercentage = 85.00M,
                        MaxHospitalizationDays = 80,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 18000.00M,
                        DoctorVisitCopay = 20.00M,
                        SpecialistVisitCopay = 35.00M,
                        DiagnosticTestsCoveragePercentage = 85.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 8000.00M,
                        GenericDrugCopay = 7.00M,
                        BrandNameDrugCopay = 22.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = false,
                        MaternityCoverageLimit = null,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 2500.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 1200.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 25,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 60.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 50000.00M,
                        AccidentalInjuryCoverage = 25000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = true,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 15,
                        PreExistingConditionWaitingPeriodMonths = 24,
                        MaternityWaitingPeriodMonths = null,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 580.00M,
                        BasePremiumQuarterly = 1705.00M,
                        BasePremiumSemiAnnual = 3340.00M,
                        BasePremiumAnnual = 6380.00M,
                        BasePremiumLumpSum = 6380.00M,
                        
                        // Age-based multipliers (adjusted for seniors)
                        AgeMultiplier18_25 = 0.85M,
                        AgeMultiplier26_35 = 0.95M,
                        AgeMultiplier36_45 = 1.00M,
                        AgeMultiplier46_55 = 1.15M,
                        AgeMultiplier56_65 = 1.35M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.20M,
                        HealthPoorMultiplier = 1.45M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 1.00M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.10M,
                        OccupationHighRiskMultiplier = 1.30M,
                        
                        // Plan Limits and Rules
                        MinAge = 50,
                        MaxAge = 75,
                        RequiresMedicalExam = true,
                        
                        // Display & Status
                        DisplayOrder = 2,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = true
                    });
                    
                    // Senior Platinum Plan
                    medicalPlans.Add(new MedicalInsurancePlan
                    {
                        ProductId = product_HEALTH_003.Id,
                        PlanName = "Senior Platinum",
                        PlanCode = "MED-HEALTH-003-PLATINUM",
                        Description = "Elite senior healthcare with home nursing - VIP care with comprehensive geriatric services",
                        
                        // Coverage Limits
                        AnnualCoverageLimit = 500000.00M,
                        LifetimeCoverageLimit = null, // Unlimited
                        Deductible = 500.00M,
                        CoPaymentPercentage = 10.00M,
                        OutOfPocketMaximum = 3500.00M,
                        TermYears = 1,
                        
                        // Hospitalization Coverage
                        RoomAndBoardDailyLimit = 1200.00M,
                        ICUDailyLimit = 3000.00M,
                        HospitalizationCoveragePercentage = 90.00M,
                        MaxHospitalizationDays = 120,
                        
                        // Outpatient Coverage
                        OutpatientAnnualLimit = 35000.00M,
                        DoctorVisitCopay = 15.00M,
                        SpecialistVisitCopay = 25.00M,
                        DiagnosticTestsCoveragePercentage = 90.00M,
                        
                        // Medication Coverage
                        PrescriptionDrugAnnualLimit = 15000.00M,
                        GenericDrugCopay = 5.00M,
                        BrandNameDrugCopay = 18.00M,
                        
                        // Additional Benefits
                        IncludesMaternityBenefit = false,
                        MaternityCoverageLimit = null,
                        IncludesDentalBasic = true,
                        DentalAnnualLimit = 4000.00M,
                        IncludesVisionBasic = true,
                        VisionAnnualLimit = 2000.00M,
                        AnnualHealthCheckupIncluded = true,
                        PreventiveCareIncluded = true,
                        MentalHealthCoverageIncluded = true,
                        MentalHealthSessionLimit = 40,
                        
                        // Emergency & Critical Care
                        EmergencyRoomCopay = 40.00M,
                        AmbulanceServiceIncluded = true,
                        CriticalIllnessBenefit = 100000.00M,
                        AccidentalInjuryCoverage = 50000.00M,
                        
                        // Network & Restrictions
                        NetworkHospitalsOnly = false,
                        RequiresReferralForSpecialist = false,
                        PreAuthorizationRequired = false,
                        
                        // Waiting Periods
                        GeneralWaitingPeriodDays = 0,
                        PreExistingConditionWaitingPeriodMonths = 12,
                        MaternityWaitingPeriodMonths = null,
                        
                        // Premium Calculation
                        BasePremiumMonthly = 1100.00M,
                        BasePremiumQuarterly = 3235.00M,
                        BasePremiumSemiAnnual = 6340.00M,
                        BasePremiumAnnual = 12100.00M,
                        BasePremiumLumpSum = 12100.00M,
                        
                        // Age-based multipliers (adjusted for seniors)
                        AgeMultiplier18_25 = 0.90M,
                        AgeMultiplier26_35 = 0.95M,
                        AgeMultiplier36_45 = 1.00M,
                        AgeMultiplier46_55 = 1.10M,
                        AgeMultiplier56_65 = 1.25M,
                        
                        // Health status multipliers
                        HealthExcellentMultiplier = 0.85M,
                        HealthGoodMultiplier = 1.00M,
                        HealthFairMultiplier = 1.15M,
                        HealthPoorMultiplier = 1.35M,
                        
                        // Gender multipliers
                        MaleMultiplier = 1.05M,
                        FemaleMultiplier = 1.00M,
                        
                        // Occupation risk multipliers
                        OccupationLowRiskMultiplier = 1.00M,
                        OccupationMediumRiskMultiplier = 1.05M,
                        OccupationHighRiskMultiplier = 1.20M,
                        
                        // Plan Limits and Rules
                        MinAge = 50,
                        MaxAge = 80,
                        RequiresMedicalExam = true,
                        
                        // Display & Status
                        DisplayOrder = 3,
                        IsActive = true,
                        IsFeatured = true,
                        IsPopular = false
                    });
                }
                
                // Save all medical plans to database
                if (medicalPlans.Any())
                {
                    await context.MedicalInsurancePlans.AddRangeAsync(medicalPlans);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
