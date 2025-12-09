using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Shared.DTOs;
using InsuranceServiceServer.Models;
using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Shared.Services;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceServiceServer.Features.Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly UserManager<AppUser> userManager;
        readonly SignInManager<AppUser> signInManager;
        readonly ITokenService tokenService;
        readonly IEmailService emailService;
        readonly ISmsService smsService;
        readonly ILogger<AuthController> logger;
        readonly IConfiguration configuration;
        readonly IRateLimitService rateLimitService;
        readonly AppDbContext dbContext;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService,
            ISmsService smsService,
            ILogger<AuthController> logger,
            IConfiguration configuration,
            IRateLimitService rateLimitService,
            AppDbContext dbContext)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
            this.emailService = emailService;
            this.smsService = smsService;
            this.logger = logger;
            this.configuration = configuration;
            this.rateLimitService = rateLimitService;
            this.dbContext = dbContext;
        }

        /// <summary>
        /// Register a new user account
        /// </summary>
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                // Rate limiting - 3 registration attempts per IP per hour
                var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                var rateLimitKey = $"register_{clientIp}";
                
                if (rateLimitService.IsRateLimited(rateLimitKey, 3, TimeSpan.FromHours(1)))
                {
                    var retryAfter = rateLimitService.GetRetryAfter(rateLimitKey);
                    throw new TooManyRequestsException(
                        $"Too many registration attempts. Please try again in {retryAfter?.Minutes ?? 60} minutes.");
                }
                
                rateLimitService.RecordAttempt(rateLimitKey, TimeSpan.FromHours(1));
                
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid registration data", errors);
                }

                // Check if user already exists
                var existingUser = await userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    throw new ConflictException($"User with email '{model.Email}' already exists");
                }

                var user = new AppUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    EmailConfirmed = false
                };

                var result = await userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    var errors = result.Errors
                        .GroupBy(e => "password")
                        .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
                    throw new ValidationException("Registration failed", errors);
                }

                // Assign default "Customer" role
                await userManager.AddToRoleAsync(user, AppRoles.Customer);

                // Generate email verification token
                var verificationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var clientUrl = configuration["ClientUrl"] ?? "http://localhost:5173";
                var verificationLink = $"{clientUrl}/verify-email?userId={user.Id}&token={Uri.EscapeDataString(verificationToken)}";

                // Send verification email asynchronously (fire-and-forget)
                // Don't await - let it run in background to return response faster
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await emailService.SendVerificationEmailAsync(user.Email, user.UserName ?? user.Email, verificationLink);
                        logger.LogInformation($"Verification email sent to '{user.Email}'");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError($"Failed to send verification email to '{user.Email}': {ex.Message}");
                    }
                });

                logger.LogInformation($"User '{user.Email}' registered successfully. Verification email queued.");
                
                return Ok(new
                {
                    success = true,
                    message = "Registration successful. Please check your email to verify your account.",
                    userId = user.Id,
                    email = user.Email,
                    requiresEmailVerification = true,
                    nextStep = "verifyEmail"
                });
            }
            catch (ConflictException ex)
            {
                logger.LogWarning($"Registration conflict: {ex.Message}");
                throw;
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Registration validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Registration error: {ex.Message}");
                throw new InternalServerException("Registration failed. Please try again later.");
            }
        }

        /// <summary>
        /// Complete registration profile after email verification
        /// </summary>
        [HttpPost]
        [Route("complete-profile")]
        [Authorize]
        public async Task<IActionResult> CompleteRegistrationProfile([FromBody] CompleteRegistrationProfileRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid profile data", errors);
                }

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

                // Update user profile
                if (!string.IsNullOrEmpty(request.PhoneNumber))
                {
                    user.PhoneNumber = request.PhoneNumber;
                    // Note: Phone will be verified later via SMS OTP
                    user.PhoneNumberConfirmed = false;
                }

                await userManager.UpdateAsync(user);

                // Create or update CustomerProfile
                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var profile = await dbContext.CustomerProfiles
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (profile == null)
                {
                    // Split FullName into FirstName and LastName
                    var nameParts = request.FullName?.Split(' ', 2) ?? new[] { "", "" };
                    var firstName = nameParts.Length > 0 ? nameParts[0] : "";
                    var lastName = nameParts.Length > 1 ? nameParts[1] : "";

                    profile = new CustomerProfile
                    {
                        UserId = userId,
                        FirstName = firstName,
                        LastName = lastName,
                        Email = user.Email ?? "",
                        PhoneNumber = request.PhoneNumber ?? "",
                        DateOfBirth = request.DateOfBirth ?? DateTime.MinValue,
                        Address = request.Address ?? "",
                        CreatedDate = DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow
                    };
                    dbContext.CustomerProfiles.Add(profile);
                }
                else
                {
                    // Update profile - split FullName into FirstName and LastName
                    if (!string.IsNullOrEmpty(request.FullName))
                    {
                        var nameParts = request.FullName.Split(' ', 2);
                        profile.FirstName = nameParts.Length > 0 ? nameParts[0] : profile.FirstName;
                        profile.LastName = nameParts.Length > 1 ? nameParts[1] : profile.LastName;
                    }
                    profile.PhoneNumber = request.PhoneNumber ?? profile.PhoneNumber;
                    profile.DateOfBirth = request.DateOfBirth ?? profile.DateOfBirth;
                    profile.Address = request.Address ?? profile.Address;
                    profile.UpdatedDate = DateTime.UtcNow;
                }

                await dbContext.SaveChangesAsync();

                logger.LogInformation($"Profile completed for user '{user.Email}'");

                var requiresPhoneVerification = !string.IsNullOrEmpty(request.PhoneNumber) && !user.PhoneNumberConfirmed;

                return Ok(new
                {
                    success = true,
                    message = "Profile completed successfully",
                    profile = new
                    {
                        fullName = profile.FullName,
                        email = profile.Email,
                        phoneNumber = profile.PhoneNumber,
                        dateOfBirth = profile.DateOfBirth,
                        address = profile.Address
                    },
                    requiresPhoneVerification,
                    nextStep = requiresPhoneVerification ? "verifyPhone" : "dashboard"
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Complete profile validation error: {ex.Message}");
                throw;
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Complete profile unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Complete profile error: {ex.Message}");
                throw new InternalServerException("Failed to complete profile");
            }
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid login data", errors);
                }

                var user = await userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    logger.LogWarning($"Login failed: User '{model.Email}' not found");
                    throw new UnauthorizedException("Invalid email or password");
                }

                // Check if email is verified
                if (!user.EmailConfirmed)
                {
                    logger.LogWarning($"Login failed: Email not verified for user '{model.Email}'");
                    throw new UnauthorizedException("Email chưa được xác thực. Vui lòng kiểm tra email của bạn.");
                }

                var passwordValid = await userManager.CheckPasswordAsync(user, model.Password);
                if (!passwordValid)
                {
                    logger.LogWarning($"Login failed: Invalid password for user '{model.Email}'");
                    throw new UnauthorizedException("Invalid email or password");
                }

                // Update last login date
                user.LastLoginDate = DateTime.UtcNow;
                await userManager.UpdateAsync(user);

                // Generate token with RememberMe support
                var tokenResponse = await tokenService.GenerateTokenAsync(user, model.RememberMe);
                
                logger.LogInformation($"User '{user.Email}' logged in successfully (RememberMe: {model.RememberMe})");
                
                return Ok(tokenResponse);
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Login unauthorized: {ex.Message}");
                throw;
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Login validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Login error: {ex.Message}");
                throw new InternalServerException("Login failed. Please try again later.");
            }
        }

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new ValidationException("Invalid refresh token request");
                }

                if (string.IsNullOrWhiteSpace(request.RefreshToken))
                {
                    throw new ValidationException("Refresh token cannot be empty");
                }

                var tokenResponse = await tokenService.RefreshTokenAsync(request.RefreshToken);
                logger.LogInformation("Token refreshed successfully");
                return Ok(tokenResponse);
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Token refresh unauthorized: {ex.Message}");
                throw;
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Token refresh validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Token refresh error: {ex.Message}");
                throw new InternalServerException("Token refresh failed. Please login again.");
            }
        }

        /// <summary>
        /// Logout and revoke refresh token
        /// </summary>
        [HttpPost]
        [Route("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.RefreshToken))
                {
                    throw new ValidationException("Refresh token cannot be empty");
                }

                await tokenService.RevokeRefreshTokenAsync(request.RefreshToken);
                logger.LogInformation("User logged out successfully");
                return Ok(new { message = "Logged out successfully" });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Logout validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Logout error: {ex.Message}");
                throw new InternalServerException("Logout failed");
            }
        }

        /// <summary>
        /// Get current authenticated user information
        /// </summary>
        [HttpGet]
        [Route("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    throw new NotFoundException("User not found");
                }

                var roles = await userManager.GetRolesAsync(user);

                // Get profile information based on profile type
                string? fullName = null;
                string? avatar = null;

                if (user.ProfileType == "Customer")
                {
                    var profile = await dbContext.CustomerProfiles
                        .FirstOrDefaultAsync(p => p.UserId == userId);
                    if (profile != null)
                    {
                        fullName = profile.FullName;
                        avatar = profile.Avatar;
                    }
                }
                else if (user.ProfileType == "Employee")
                {
                    var profile = await dbContext.EmployeeProfiles
                        .FirstOrDefaultAsync(p => p.UserId == userId);
                    if (profile != null)
                    {
                        fullName = profile.FullName;
                        avatar = profile.Avatar;
                    }
                }

                var userResponse = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = fullName ?? user.UserName ?? user.Email,
                    userName = user.UserName,
                    phoneNumber = user.PhoneNumber,
                    avatar = avatar,
                    emailConfirmed = user.EmailConfirmed,
                    phoneNumberConfirmed = user.PhoneNumberConfirmed,
                    roles = roles,
                    createdDate = user.CreatedDate,
                    lastLoginDate = user.LastLoginDate,
                    isActive = user.IsActive,
                    profileType = user.ProfileType,
                    profileId = user.ProfileId
                };

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                logger.LogError($"Get current user error: {ex.Message}");
                throw new InternalServerException("Failed to retrieve user information");
            }
        }

        /// <summary>
        /// Verify email address
        /// </summary>
        [HttpGet]
        [Route("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string userId, [FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
                {
                    throw new ValidationException("Invalid verification parameters");
                }

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    throw new NotFoundException("User not found");
                }

                if (user.EmailConfirmed)
                {
                    return Ok(new { 
                        success = true, 
                        message = "Email already verified",
                        alreadyVerified = true
                    });
                }

                var result = await userManager.ConfirmEmailAsync(user, token);
                if (!result.Succeeded)
                {
                    throw new ValidationException("Invalid or expired verification token");
                }

                // Send welcome email asynchronously (fire-and-forget)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await emailService.SendWelcomeEmailAsync(user.Email!, user.UserName ?? user.Email!);
                        logger.LogInformation($"Welcome email sent to '{user.Email}'");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError($"Failed to send welcome email to '{user.Email}': {ex.Message}");
                    }
                });

                // Auto-login after email verification
                var tokenResponse = await tokenService.GenerateTokenAsync(user);

                logger.LogInformation($"Email verified successfully for user '{user.Email}', auto-login token generated");
                
                return Ok(new { 
                    success = true, 
                    message = "Email verified successfully. Logging you in...",
                    email = user.Email,
                    accessToken = tokenResponse.AccessToken,
                    refreshToken = tokenResponse.RefreshToken,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        username = user.UserName,
                        phoneNumber = user.PhoneNumber
                    }
                });
            }
            catch (NotFoundException ex)
            {
                logger.LogWarning($"Email verification failed: {ex.Message}");
                throw;
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Email verification validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Email verification error: {ex.Message}");
                throw new InternalServerException("Email verification failed");
            }
        }

        /// <summary>
        /// Resend verification email
        /// </summary>
        [HttpPost]
        [Route("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    throw new ValidationException("Email is required");
                }

                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    // Don't reveal if user exists for security
                    return Ok(new { 
                        success = true, 
                        message = "If the email exists, a verification link has been sent." 
                    });
                }

                if (user.EmailConfirmed)
                {
                    return Ok(new { 
                        success = true, 
                        message = "Email already verified",
                        alreadyVerified = true
                    });
                }

                // Generate new verification token
                var verificationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var clientUrl = configuration["ClientUrl"] ?? "http://localhost:5173";
                var verificationLink = $"{clientUrl}/verify-email?userId={user.Id}&token={Uri.EscapeDataString(verificationToken)}";

                // Send verification email asynchronously (fire-and-forget)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await emailService.SendVerificationEmailAsync(user.Email!, user.UserName ?? user.Email!, verificationLink);
                        logger.LogInformation($"Verification email resent to '{user.Email}'");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError($"Failed to resend verification email to '{user.Email}': {ex.Message}");
                    }
                });

                logger.LogInformation($"Verification email resend queued for '{user.Email}'");
                return Ok(new { 
                    success = true, 
                    message = "Verification email sent. Please check your inbox." 
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Resend verification validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Resend verification error: {ex.Message}");
                throw new InternalServerException("Failed to resend verification email");
            }
        }

        /// <summary>
        /// Request password reset - sends reset link to email
        /// </summary>
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid request", errors);
                }

                // Rate limiting: 3 requests per email per 10 minutes
                var emailKey = $"forgot_password_email_{request.Email.ToLower()}";
                var rateLimitDuration = TimeSpan.FromMinutes(10);
                var maxAttempts = 3;

                if (rateLimitService.IsRateLimited(emailKey, maxAttempts, rateLimitDuration))
                {
                    var retryAfter = rateLimitService.GetRetryAfter(emailKey);
                    var waitMinutes = retryAfter?.TotalMinutes ?? 10;
                    
                    logger.LogWarning($"Rate limit exceeded for email: {request.Email}");
                    throw new ValidationException(
                        $"Quá nhiều yêu cầu. Vui lòng chờ {Math.Ceiling(waitMinutes)} phút trước khi thử lại.",
                        new Dictionary<string, string[]> 
                        { 
                            { "email", new[] { $"Rate limit exceeded. Please wait {Math.Ceiling(waitMinutes)} minutes." } } 
                        }
                    );
                }

                // Rate limiting: 10 requests per IP per 10 minutes
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                var ipKey = $"forgot_password_ip_{ipAddress}";
                var maxIpAttempts = 10;

                if (rateLimitService.IsRateLimited(ipKey, maxIpAttempts, rateLimitDuration))
                {
                    logger.LogWarning($"Rate limit exceeded for IP: {ipAddress}");
                    throw new ValidationException(
                        "Quá nhiều yêu cầu từ địa chỉ IP này. Vui lòng thử lại sau.",
                        new Dictionary<string, string[]> 
                        { 
                            { "ip", new[] { "Rate limit exceeded for this IP address." } } 
                        }
                    );
                }

                // Record attempts
                rateLimitService.RecordAttempt(emailKey, rateLimitDuration);
                rateLimitService.RecordAttempt(ipKey, rateLimitDuration);

                var user = await userManager.FindByEmailAsync(request.Email);
                
                // Don't reveal if user exists for security
                if (user == null)
                {
                    logger.LogWarning($"Password reset requested for non-existent email: {request.Email}");
                    return Ok(new
                    {
                        success = true,
                        message = "If the email exists, a password reset link has been sent."
                    });
                }

                // Check if email is verified
                if (!user.EmailConfirmed)
                {
                    logger.LogWarning($"Password reset requested for unverified email: {request.Email}");
                    return Ok(new
                    {
                        success = true,
                        message = "If the email exists, a password reset link has been sent."
                    });
                }

                // Generate password reset token
                var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                var clientUrl = configuration["ClientUrl"] ?? "http://localhost:5173";
                var resetLink = $"{clientUrl}/reset-password?email={Uri.EscapeDataString(user.Email ?? string.Empty)}&token={Uri.EscapeDataString(resetToken)}";

                // Send password reset email
                await emailService.SendPasswordResetEmailAsync(user.Email!, user.UserName ?? user.Email ?? "User", resetLink);

                logger.LogInformation($"Password reset email sent to '{user.Email}'");
                return Ok(new
                {
                    success = true,
                    message = "If the email exists, a password reset link has been sent."
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Forgot password validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Forgot password error: {ex.Message}");
                throw new InternalServerException("Failed to process password reset request");
            }
        }

        /// <summary>
        /// Validate password reset token
        /// </summary>
        [HttpPost]
        [Route("validate-reset-token")]
        public async Task<IActionResult> ValidateResetToken([FromBody] ValidateResetTokenRequest request)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    return BadRequest(new { message = "Invalid reset token" });
                }

                var isValid = await userManager.VerifyUserTokenAsync(
                    user,
                    userManager.Options.Tokens.PasswordResetTokenProvider,
                    "ResetPassword",
                    request.Token
                );

                if (!isValid)
                {
                    return BadRequest(new { message = "Token has expired or is invalid" });
                }

                return Ok(new { message = "Token is valid" });
            }
            catch (Exception ex)
            {
                logger.LogError($"Validate reset token error: {ex.Message}");
                return BadRequest(new { message = "Invalid reset token" });
            }
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid request", errors);
                }

                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    throw new UnauthorizedException("Invalid password reset request");
                }

                // Reset password
                var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
                if (!result.Succeeded)
                {
                    var errors = result.Errors
                        .GroupBy(e => "password")
                        .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
                    throw new ValidationException("Password reset failed", errors);
                }

                logger.LogInformation($"Password reset successfully for '{user.Email}'");
                return Ok(new
                {
                    success = true,
                    message = "Password has been reset successfully. You can now login with your new password."
                });
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Reset password unauthorized: {ex.Message}");
                throw;
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Reset password validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Reset password error: {ex.Message}");
                throw new InternalServerException("Failed to reset password");
            }
        }

        /// <summary>
        /// Send OTP to email for verification
        /// </summary>
        [HttpPost]
        [Route("send-otp")]
        public async Task<IActionResult> SendOTP([FromBody] SendOTPRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid request data", errors);
                }

                // Rate limiting: 3 OTP requests per email per 10 minutes
                var emailKey = $"send_otp_email_{request.Email.ToLower()}";
                var rateLimitDuration = TimeSpan.FromMinutes(10);
                var maxAttempts = 3;

                if (rateLimitService.IsRateLimited(emailKey, maxAttempts, rateLimitDuration))
                {
                    var retryAfter = rateLimitService.GetRetryAfter(emailKey);
                    var waitMinutes = retryAfter?.TotalMinutes ?? 10;
                    throw new ValidationException(
                        $"Quá nhiều yêu cầu gửi OTP. Vui lòng chờ {Math.Ceiling(waitMinutes)} phút trước khi thử lại.",
                        new Dictionary<string, string[]> { 
                            { "email", new[] { $"Rate limit exceeded. Please wait {Math.Ceiling(waitMinutes)} minutes." } } 
                        }
                    );
                }

                // Find user by email
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    // Security: Don't reveal if email exists
                    logger.LogWarning($"OTP requested for non-existent email: {request.Email}");
                    return Ok(new OTPResponse
                    {
                        Success = true,
                        Message = "If this email exists, an OTP has been sent.",
                        ExpiresAt = DateTime.UtcNow.AddMinutes(10)
                    });
                }

                // Record rate limit attempt
                rateLimitService.RecordAttempt(emailKey, rateLimitDuration);

                // Generate 6-digit OTP
                var otp = new Random().Next(100000, 999999).ToString();
                var expiryMinutes = 10;
                var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

                // Save OTP to database
                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                
                // Remove old OTPs for this email
                var oldOTPs = dbContext.EmailVerifications
                    .Where(ev => ev.Email == request.Email && ev.OTP != null)
                    .ToList();
                dbContext.EmailVerifications.RemoveRange(oldOTPs);

                // Create new OTP record
                var emailVerification = new EmailVerification
                {
                    UserId = user.Id,
                    Email = request.Email,
                    OTP = otp,
                    VerificationToken = "", // Not used for OTP flow
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = expiresAt,
                    IsVerified = false,
                    AttemptCount = 0
                };

                dbContext.EmailVerifications.Add(emailVerification);
                await dbContext.SaveChangesAsync();

                // Send OTP email asynchronously (fire-and-forget)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await emailService.SendOTPEmailAsync(
                            user.Email!,
                            user.UserName ?? user.Email!,
                            otp,
                            expiryMinutes
                        );
                        logger.LogInformation($"OTP email sent to '{request.Email}'");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError($"Failed to send OTP email to '{request.Email}': {ex.Message}");
                    }
                });

                logger.LogInformation($"OTP generated for '{request.Email}', email queued");

                return Ok(new OTPResponse
                {
                    Success = true,
                    Message = "OTP has been sent to your email.",
                    ExpiresAt = expiresAt
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Send OTP validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Send OTP error: {ex.Message}");
                throw new InternalServerException("Failed to send OTP");
            }
        }

        /// <summary>
        /// Verify OTP code
        /// </summary>
        [HttpPost]
        [Route("verify-otp")]
        public async Task<IActionResult> VerifyOTP([FromBody] VerifyOTPRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid request data", errors);
                }

                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();

                // Find OTP record
                var otpRecord = await dbContext.EmailVerifications
                    .Where(ev => ev.Email == request.Email && ev.OTP == request.OTP && !ev.IsVerified)
                    .OrderByDescending(ev => ev.CreatedAt)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                {
                    logger.LogWarning($"Invalid OTP for email: {request.Email}");
                    throw new ValidationException(
                        "Mã OTP không hợp lệ.",
                        new Dictionary<string, string[]> { 
                            { "otp", new[] { "Invalid OTP code" } } 
                        }
                    );
                }

                // Check if OTP expired
                if (otpRecord.ExpiresAt < DateTime.UtcNow)
                {
                    logger.LogWarning($"Expired OTP for email: {request.Email}");
                    throw new ValidationException(
                        "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.",
                        new Dictionary<string, string[]> { 
                            { "otp", new[] { "OTP has expired" } } 
                        }
                    );
                }

                // Check attempt count (max 5 attempts)
                if (otpRecord.AttemptCount >= 5)
                {
                    logger.LogWarning($"Too many OTP attempts for email: {request.Email}");
                    throw new ValidationException(
                        "Quá nhiều lần thử. Vui lòng yêu cầu mã OTP mới.",
                        new Dictionary<string, string[]> { 
                            { "otp", new[] { "Too many attempts" } } 
                        }
                    );
                }

                // Increment attempt count
                otpRecord.AttemptCount++;
                otpRecord.LastAttemptAt = DateTime.UtcNow;

                // Mark as verified
                otpRecord.IsVerified = true;
                otpRecord.VerifiedAt = DateTime.UtcNow;

                // Mark user email as confirmed
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user != null)
                {
                    user.EmailConfirmed = true;
                    await userManager.UpdateAsync(user);
                }

                await dbContext.SaveChangesAsync();

                logger.LogInformation($"OTP verified successfully for {request.Email}");

                return Ok(new OTPResponse
                {
                    Success = true,
                    Message = "Email verified successfully!"
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Verify OTP validation error: {ex.Message}");
                
                // Still increment attempt count on failure
                try
                {
                    var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                    var otpRecord = await dbContext.EmailVerifications
                        .Where(ev => ev.Email == request.Email && !ev.IsVerified)
                        .OrderByDescending(ev => ev.CreatedAt)
                        .FirstOrDefaultAsync();
                    
                    if (otpRecord != null)
                    {
                        otpRecord.AttemptCount++;
                        otpRecord.LastAttemptAt = DateTime.UtcNow;
                        await dbContext.SaveChangesAsync();
                    }
                }
                catch { /* Ignore errors when updating attempt count */ }
                
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Verify OTP error: {ex.Message}");
                throw new InternalServerException("Failed to verify OTP");
            }
        }

        // ========================================
        // PHONE/SMS OTP VERIFICATION
        // ========================================

        /// <summary>
        /// Send OTP to phone number via SMS
        /// </summary>
        [HttpPost]
        [Route("phone/send-otp")]
        [Authorize]
        public async Task<IActionResult> SendPhoneOtp([FromBody] SendPhoneOtpRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid phone number", errors);
                }

                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();

                // Check rate limiting (max 3 SMS per hour)
                var oneHourAgo = DateTime.UtcNow.AddHours(-1);
                var recentSms = await dbContext.Set<PhoneVerification>()
                    .Where(pv => pv.UserId == userId && pv.CreatedAt > oneHourAgo)
                    .CountAsync();

                if (recentSms >= 3)
                {
                    logger.LogWarning($"Phone OTP rate limit exceeded for user {userId}");
                    throw new ValidationException(
                        "Too many SMS requests. Please try again later.",
                        new Dictionary<string, string[]> { 
                            { "phone", new[] { "Rate limit exceeded" } } 
                        }
                    );
                }

                // Check if phone already verified
                var existingVerified = await dbContext.Set<PhoneVerification>()
                    .AnyAsync(pv => pv.PhoneNumber == request.PhoneNumber && pv.IsVerified);

                if (existingVerified)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "This phone number is already verified",
                        alreadyVerified = true
                    });
                }

                // Generate 6-digit OTP
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString();

                // Store OTP in database
                var phoneVerification = new PhoneVerification
                {
                    UserId = userId,
                    PhoneNumber = request.PhoneNumber,
                    OTP = otp,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(5), // 5 minutes expiry
                    IsVerified = false,
                    AttemptCount = 0,
                    ResendCount = recentSms + 1,
                    DeliveryStatus = "Pending"
                };

                dbContext.Set<PhoneVerification>().Add(phoneVerification);
                await dbContext.SaveChangesAsync();

                // Send OTP via SMS
                var smsSent = await smsService.SendOtpAsync(request.PhoneNumber, otp, 5);

                // Update delivery status
                phoneVerification.DeliveryStatus = smsSent ? "Sent" : "Failed";
                await dbContext.SaveChangesAsync();

                if (!smsSent)
                {
                    logger.LogError($"Failed to send SMS OTP to {request.PhoneNumber}");
                    throw new InternalServerException("Failed to send SMS. Please try again.");
                }

                logger.LogInformation($"SMS OTP sent to {request.PhoneNumber} for user {userId}");

                return Ok(new
                {
                    success = true,
                    message = "OTP has been sent to your phone number",
                    phoneNumber = MaskPhoneNumber(request.PhoneNumber),
                    expiresIn = 300, // 5 minutes in seconds
                    attemptsRemaining = 5
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Send phone OTP validation error: {ex.Message}");
                throw;
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Send phone OTP unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Send phone OTP error: {ex.Message}");
                throw new InternalServerException("Failed to send phone OTP");
            }
        }

        /// <summary>
        /// Verify phone OTP code
        /// </summary>
        [HttpPost]
        [Route("phone/verify-otp")]
        [Authorize]
        public async Task<IActionResult> VerifyPhoneOtp([FromBody] VerifyPhoneOtpRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid request data", errors);
                }

                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();

                // Find OTP record
                var otpRecord = await dbContext.Set<PhoneVerification>()
                    .Where(pv => pv.UserId == userId && 
                                 pv.PhoneNumber == request.PhoneNumber && 
                                 pv.OTP == request.OTP && 
                                 !pv.IsVerified)
                    .OrderByDescending(pv => pv.CreatedAt)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                {
                    logger.LogWarning($"Invalid phone OTP for user {userId}");
                    throw new ValidationException(
                        "Invalid OTP code.",
                        new Dictionary<string, string[]> { 
                            { "otp", new[] { "Invalid OTP code" } } 
                        }
                    );
                }

                // Check if OTP expired
                if (otpRecord.ExpiresAt < DateTime.UtcNow)
                {
                    logger.LogWarning($"Expired phone OTP for user {userId}");
                    throw new ValidationException(
                        "OTP has expired. Please request a new code.",
                        new Dictionary<string, string[]> { 
                            { "otp", new[] { "OTP has expired" } } 
                        }
                    );
                }

                // Check attempt count (max 5 attempts)
                if (otpRecord.AttemptCount >= 5)
                {
                    logger.LogWarning($"Too many phone OTP attempts for user {userId}");
                    throw new ValidationException(
                        "Too many attempts. Please request a new OTP.",
                        new Dictionary<string, string[]> { 
                            { "otp", new[] { "Too many attempts" } } 
                        }
                    );
                }

                // Mark as verified
                otpRecord.IsVerified = true;
                otpRecord.VerifiedAt = DateTime.UtcNow;
                otpRecord.AttemptCount++;
                otpRecord.LastAttemptAt = DateTime.UtcNow;

                // Update user phone number
                var user = await userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    user.PhoneNumber = request.PhoneNumber;
                    user.PhoneNumberConfirmed = true;
                    await userManager.UpdateAsync(user);
                }

                await dbContext.SaveChangesAsync();

                logger.LogInformation($"Phone OTP verified successfully for user {userId}");

                return Ok(new
                {
                    success = true,
                    message = "Phone number verified successfully!",
                    phoneNumber = request.PhoneNumber,
                    verifiedAt = DateTime.UtcNow
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Verify phone OTP validation error: {ex.Message}");
                
                // Increment attempt count on failure
                try
                {
                    var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                    var userId = userManager.GetUserId(User);
                    var otpRecord = await dbContext.Set<PhoneVerification>()
                        .Where(pv => pv.UserId == userId && 
                                     pv.PhoneNumber == request.PhoneNumber && 
                                     !pv.IsVerified)
                        .OrderByDescending(pv => pv.CreatedAt)
                        .FirstOrDefaultAsync();
                    
                    if (otpRecord != null)
                    {
                        otpRecord.AttemptCount++;
                        otpRecord.LastAttemptAt = DateTime.UtcNow;
                        await dbContext.SaveChangesAsync();
                    }
                }
                catch { /* Ignore errors when updating attempt count */ }
                
                throw;
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Verify phone OTP unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Verify phone OTP error: {ex.Message}");
                throw new InternalServerException("Failed to verify phone OTP");
            }
        }

        /// <summary>
        /// Get phone verification status
        /// </summary>
        [HttpGet]
        [Route("phone/status")]
        [Authorize]
        public async Task<IActionResult> GetPhoneVerificationStatus()
        {
            try
            {
                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var user = await userManager.FindByIdAsync(userId);

                var latestVerification = await dbContext.Set<PhoneVerification>()
                    .Where(pv => pv.UserId == userId)
                    .OrderByDescending(pv => pv.CreatedAt)
                    .FirstOrDefaultAsync();

                var status = new PhoneVerificationStatusDTO
                {
                    IsVerified = user?.PhoneNumberConfirmed ?? false,
                    PhoneNumber = user?.PhoneNumber,
                    VerifiedAt = latestVerification?.VerifiedAt,
                    AttemptsRemaining = latestVerification != null ? Math.Max(0, 5 - latestVerification.AttemptCount) : 5,
                    CanResend = true,
                    SecondsUntilResend = 0
                };

                // Check if can resend (60 seconds cooldown)
                if (latestVerification != null && !latestVerification.IsVerified)
                {
                    var secondsSinceLastSend = (DateTime.UtcNow - latestVerification.CreatedAt).TotalSeconds;
                    if (secondsSinceLastSend < 60)
                    {
                        status.CanResend = false;
                        status.SecondsUntilResend = (int)(60 - secondsSinceLastSend);
                    }
                }

                return Ok(status);
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Get phone verification status unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Get phone verification status error: {ex.Message}");
                throw new InternalServerException("Failed to get phone verification status");
            }
        }

        /// <summary>
        /// Resend phone OTP
        /// </summary>
        [HttpPost]
        [Route("phone/resend-otp")]
        [Authorize]
        public async Task<IActionResult> ResendPhoneOtp([FromBody] SendPhoneOtpRequest request)
        {
            try
            {
                var userId = userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();

                // Check cooldown (60 seconds between resends)
                var latestOtp = await dbContext.Set<PhoneVerification>()
                    .Where(pv => pv.UserId == userId && pv.PhoneNumber == request.PhoneNumber)
                    .OrderByDescending(pv => pv.CreatedAt)
                    .FirstOrDefaultAsync();

                if (latestOtp != null)
                {
                    var secondsSinceLastSend = (DateTime.UtcNow - latestOtp.CreatedAt).TotalSeconds;
                    if (secondsSinceLastSend < 60)
                    {
                        throw new ValidationException(
                            $"Please wait {60 - (int)secondsSinceLastSend} seconds before requesting a new OTP.",
                            new Dictionary<string, string[]> { 
                                { "phone", new[] { "Too soon to resend" } } 
                            }
                        );
                    }
                }

                // Reuse the send OTP logic
                return await SendPhoneOtp(request);
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Resend phone OTP validation error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Resend phone OTP error: {ex.Message}");
                throw new InternalServerException("Failed to resend phone OTP");
            }
        }

        /// <summary>
        /// Change password for authenticated user
        /// </summary>
        [HttpPost]
        [Route("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .GroupBy(e => "model")
                        .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
                    throw new ValidationException("Invalid password data", errors);
                }

                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    throw new NotFoundException("User not found");
                }

                // Verify current password
                var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
                
                if (!result.Succeeded)
                {
                    var errors = result.Errors.GroupBy(e => "password")
                        .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
                    throw new ValidationException("Failed to change password", errors);
                }

                logger.LogInformation($"Password changed successfully for user {user.Email}");

                // Send password change notification email (fire-and-forget)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var changeTime = DateTime.Now.ToString("MMMM dd, yyyy 'at' HH:mm");
                        var emailBody = $@"
                            <html>
                            <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                                    <h2 style='color: #2563eb;'>Password Changed Successfully</h2>
                                    <p>Hi {user.Email},</p>
                                    <p>Your password was successfully changed on {changeTime}.</p>
                                    <div style='background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                                        <p style='margin: 0;'><strong>Account:</strong> {user.Email}</p>
                                        <p style='margin: 0;'><strong>Date & Time:</strong> {changeTime}</p>
                                    </div>
                                    <p><strong>If you did not make this change:</strong></p>
                                    <p>Please contact our support team immediately at <a href='mailto:support@insurance.com'>support@insurance.com</a> or call us at 1-800-XXX-XXXX.</p>
                                    <p style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;'>
                                        This is an automated security notification from Insurance Services.<br>
                                        For your security, please do not reply to this email.
                                    </p>
                                </div>
                            </body>
                            </html>
                        ";

                        await emailService.SendEmailAsync(
                            user.Email ?? string.Empty,
                            "Password Changed - Security Notification",
                            emailBody
                        );
                    }
                    catch (Exception emailEx)
                    {
                        logger.LogError($"Failed to send password change email: {emailEx.Message}");
                    }
                });
                
                return Ok(new { 
                    success = true,
                    message = "Password changed successfully. A confirmation email has been sent." 
                });
            }
            catch (ValidationException ex)
            {
                logger.LogWarning($"Change password validation error: {ex.Message}");
                throw;
            }
            catch (UnauthorizedException ex)
            {
                logger.LogWarning($"Change password unauthorized: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Change password error: {ex.Message}");
                throw new InternalServerException("Failed to change password");
            }
        }

        // Helper method to mask phone number
        private string MaskPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber) || phoneNumber.Length < 4)
                return phoneNumber;

            var visibleDigits = 2;
            var maskedLength = phoneNumber.Length - (visibleDigits * 2);
            var masked = phoneNumber.Substring(0, visibleDigits) + 
                        new string('*', maskedLength) + 
                        phoneNumber.Substring(phoneNumber.Length - visibleDigits);
            return masked;
        }
    }
}



