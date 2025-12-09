using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Models;
using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Shared.DTOs;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly UserManager<AppUser> userManager;
        private readonly ILogger<ProfileController> logger;

        public ProfileController(
            AppDbContext dbContext,
            UserManager<AppUser> userManager,
            ILogger<ProfileController> logger)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.logger = logger;
        }

        /// <summary>
        /// Get current user's profile
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var profile = await dbContext.CustomerProfiles
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (profile == null)
                {
                    // Return empty profile if not exists
                    return Ok(new UserProfileDTO
                    {
                        UserId = userId,
                        IsProfileCompleted = false,
                        ProfileCompletionPercentage = 0,
                        KycStatus = "Pending"
                    });
                }

                var profileDto = new UserProfileDTO
                {
                    Id = profile.Id,
                    UserId = profile.UserId,
                    FirstName = profile.FirstName,
                    LastName = profile.LastName,
                    FullName = profile.FullName,
                    DateOfBirth = profile.DateOfBirth,
                    PhoneNumber = profile.PhoneNumber,
                    Gender = profile.Gender,
                    Address = profile.Address,
                    City = profile.City,
                    District = profile.District,
                    Ward = profile.Ward,
                    PostalCode = profile.PostalCode,
                    Occupation = profile.Occupation,
                    OccupationOther = profile.OccupationOther,
                    Company = profile.Company,
                    MonthlyIncome = profile.MonthlyIncome,
                    NationalId = profile.NationalId,
                    Avatar = profile.Avatar,
                    EmergencyContactName = profile.EmergencyContactName,
                    EmergencyContactPhone = profile.EmergencyContactPhone,
                    EmergencyContactGender = profile.EmergencyContactGender,
                    EmergencyContactRelationship = profile.EmergencyContactRelationship,
                    EmergencyContactRelationshipOther = profile.EmergencyContactRelationshipOther, // Map Other field
                    KycStatus = profile.KycStatus,
                    KycVerifiedDate = profile.KycVerifiedDate,
                    IsProfileCompleted = CalculateProfileCompletion(profile) == 100,
                    ProfileCompletionPercentage = CalculateProfileCompletion(profile)
                };

                return Ok(profileDto);
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Get profile unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Get profile error: {ex.Message}");
                throw new InternalServerException("Failed to get profile");
            }
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .GroupBy(e => "model")
                        .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
                    throw new ValidationException("Invalid profile data", errors);
                }

                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                // Validate age (must be 18+)
                var age = DateTime.UtcNow.Year - request.DateOfBirth.Year;
                if (request.DateOfBirth > DateTime.UtcNow.AddYears(-age)) age--;
                
                if (age < 18)
                {
                    throw new ValidationException(
                        "Bạn phải đủ 18 tuổi để đăng ký bảo hiểm",
                        new Dictionary<string, string[]> {
                            { "dateOfBirth", new[] { "Must be at least 18 years old" } }
                        }
                    );
                }

                var profile = await dbContext.CustomerProfiles
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (profile == null)
                {
                    // Create new profile
                    profile = new CustomerProfile
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        Email = User.Identity?.Name ?? "",
                        CreatedDate = DateTime.UtcNow
                    };
                    dbContext.CustomerProfiles.Add(profile);
                }

                // Update profile fields
                profile.FirstName = request.FirstName;
                profile.LastName = request.LastName;
                profile.DateOfBirth = request.DateOfBirth;
                profile.PhoneNumber = request.PhoneNumber;
                profile.Gender = request.Gender;
                profile.Address = request.Address;
                profile.City = request.City;
                profile.District = request.District;
                profile.Ward = request.Ward;
                profile.PostalCode = request.PostalCode;
                profile.Occupation = request.Occupation;
                profile.OccupationOther = request.OccupationOther;
                profile.Company = request.Company;
                profile.MonthlyIncome = request.MonthlyIncome;
                profile.NationalId = request.NationalId;
                
                // Update emergency contact
                profile.EmergencyContactName = request.EmergencyContactName;
                profile.EmergencyContactPhone = request.EmergencyContactPhone;
                profile.EmergencyContactGender = request.EmergencyContactGender;
                profile.EmergencyContactRelationship = request.EmergencyContactRelationship;
                profile.EmergencyContactRelationshipOther = request.EmergencyContactRelationshipOther; // Map Other field
                
                profile.UpdatedDate = DateTime.UtcNow;

                // Update user's ProfileId reference
                var user = await userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    user.ProfileType = "Customer";
                    user.ProfileId = profile.Id;
                    await userManager.UpdateAsync(user);
                }

                await dbContext.SaveChangesAsync();

                logger.LogInformation($"Profile updated for user {userId}");

                var profileDto = new UserProfileDTO
                {
                    Id = profile.Id,
                    UserId = profile.UserId,
                    FullName = profile.FullName,
                    DateOfBirth = profile.DateOfBirth,
                    PhoneNumber = profile.PhoneNumber,
                    Gender = profile.Gender,
                    Address = profile.Address,
                    City = profile.City,
                    District = profile.District,
                    Ward = profile.Ward,
                    PostalCode = profile.PostalCode,
                    Occupation = profile.Occupation,
                    OccupationOther = profile.OccupationOther,
                    Company = profile.Company,
                    MonthlyIncome = profile.MonthlyIncome,
                    NationalId = profile.NationalId,
                    EmergencyContactName = profile.EmergencyContactName,
                    EmergencyContactPhone = profile.EmergencyContactPhone,
                    EmergencyContactRelationship = profile.EmergencyContactRelationship,
                    KycStatus = profile.KycStatus,
                    KycVerifiedDate = profile.KycVerifiedDate,
                    IsProfileCompleted = CalculateProfileCompletion(profile) == 100,
                    ProfileCompletionPercentage = CalculateProfileCompletion(profile)
                };

                return Ok(new
                {
                    success = true,
                    message = "Profile updated successfully",
                    profile = profileDto
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Update profile validation error: {ex.Message}");
                throw;
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Update profile unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Update profile error: {ex.Message}");
                throw new InternalServerException("Failed to update profile");
            }
        }

        private int CalculateProfileCompletion(CustomerProfile profile)
        {
            int totalFields = 10;
            int completedFields = 0;

            if (!string.IsNullOrEmpty(profile.FirstName)) completedFields++;
            if (!string.IsNullOrEmpty(profile.LastName)) completedFields++;
            if (profile.DateOfBirth != default) completedFields++;
            if (!string.IsNullOrEmpty(profile.PhoneNumber)) completedFields++;
            if (!string.IsNullOrEmpty(profile.Gender)) completedFields++;
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++;
            if (!string.IsNullOrEmpty(profile.City)) completedFields++;
            if (!string.IsNullOrEmpty(profile.Occupation)) completedFields++;
            if (profile.MonthlyIncome.HasValue) completedFields++;
            if (!string.IsNullOrEmpty(profile.NationalId)) completedFields++;

            return (int)((completedFields / (double)totalFields) * 100);
        }

        /// <summary>
        /// Get user verification status (email, phone, KYC)
        /// </summary>
        [HttpGet("verification-status")]
        public async Task<IActionResult> GetVerificationStatus()
        {
            try
            {
                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    throw new NotFoundException("User not found");
                }

                var profile = await dbContext.CustomerProfiles
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                return Ok(new
                {
                    emailVerified = user.EmailConfirmed,
                    phoneVerified = user.PhoneNumberConfirmed,
                    kycStatus = profile?.KycStatus ?? "Pending",
                    kycVerifiedDate = profile?.KycVerifiedDate,
                    profileCompleted = profile != null && CalculateProfileCompletion(profile) == 100
                });
            }
            catch (Exception ex)
            {
                logger.LogError($"Get verification status error: {ex.Message}");
                throw new InternalServerException("Failed to get verification status");
            }
        }

        /// <summary>
        /// Upload profile avatar
        /// </summary>
        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            try
            {
                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                if (file == null || file.Length == 0)
                {
                    throw new ValidationException("No file uploaded");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    throw new ValidationException("Only image files (jpg, png, gif) are allowed");
                }

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    throw new ValidationException("File size must not exceed 5MB");
                }

                // Create uploads directory if not exists
                var uploadsPath = Path.Combine("wwwroot", "uploads", "avatars");
                Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileName = $"{userId}_{DateTime.UtcNow.Ticks}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update profile with avatar URL
                var profile = await dbContext.CustomerProfiles
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (profile != null)
                {
                    // Delete old avatar file if exists
                    if (!string.IsNullOrEmpty(profile.Avatar))
                    {
                        var oldFilePath = Path.Combine("wwwroot", profile.Avatar.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    profile.Avatar = $"/uploads/avatars/{fileName}";
                    profile.UpdatedDate = DateTime.UtcNow;
                    await dbContext.SaveChangesAsync();
                }

                logger.LogInformation($"Avatar uploaded for user {userId}");

                return Ok(new
                {
                    success = true,
                    message = "Avatar uploaded successfully",
                    avatarUrl = $"/uploads/avatars/{fileName}"
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Upload avatar validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Upload avatar error: {ex.Message}");
                throw new InternalServerException("Failed to upload avatar");
            }
        }
    }
}



