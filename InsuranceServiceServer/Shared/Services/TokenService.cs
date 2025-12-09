using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Shared.DTOs;
using InsuranceServiceServer.Core.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace InsuranceServiceServer.Shared.Services
{
    public class TokenService : ITokenService
    {
        readonly IConfiguration config;
        readonly UserManager<AppUser> userManager;
        readonly AppDbContext dbContext;
        readonly ILogger<TokenService> logger;

        public TokenService(IConfiguration config, UserManager<AppUser> userManager, AppDbContext dbContext, ILogger<TokenService> logger)
        {
            this.config = config;
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.logger = logger;
        }

        public async Task<TokenResponse> GenerateTokenAsync(AppUser user, bool rememberMe = false)
        {
            try
            {
                if (user == null)
                    throw new ValidationException("User cannot be null");

                var accessToken = await GenerateAccessTokenAsync(user, rememberMe);
                var refreshToken = await GenerateRefreshTokenAsync(user, rememberMe);

                // Remember Me: 30 days, Normal: Read from ENV or Config (default 1 hour)
                var envExpiry = Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS");
                int configExpiry = 1;
                
                if (!string.IsNullOrEmpty(envExpiry) && int.TryParse(envExpiry, out int envHours))
                {
                    configExpiry = envHours;
                }
                else
                {
                    int.TryParse(config["Jwt:ExpiryHours"], out configExpiry);
                    if (configExpiry == 0) configExpiry = 1;
                }

                var expiryHours = rememberMe ? 24 * 30 : configExpiry;

                return new TokenResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    TokenType = "Bearer",
                    ExpiresIn = expiryHours * 3600, // Convert hours to seconds
                    ExpiresAt = DateTime.UtcNow.AddHours(expiryHours)
                };
            }
            catch (Exception ex)
            {
                logger.LogError($"Error generating token for user: {ex.Message}");
                throw;
            }
        }

        private async Task<string> GenerateAccessTokenAsync(AppUser user, bool rememberMe = false)
        {
            try
            {
                if (user == null)
                    throw new ValidationException("User cannot be null");

                if (string.IsNullOrWhiteSpace(user.Id))
                    throw new ValidationException("User ID cannot be empty");

                // Minimal JWT claims - only immutable/rarely changing data
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                // Add user roles
                var roles = await userManager.GetRolesAsync(user);
                if (roles != null)
                {
                    foreach (var role in roles)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, role));
                    }
                }

                var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
                                ?? config["Jwt:SecretKey"];
                
                if (string.IsNullOrWhiteSpace(secretKey))
                    throw new InternalServerException("JWT secret key is not configured");

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                // Remember Me: 30 days, Normal: Read from ENV or Config (default 1 hour)
                var envExpiry = Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS");
                int configExpiry = 1;
                
                if (!string.IsNullOrEmpty(envExpiry) && int.TryParse(envExpiry, out int envHours))
                {
                    configExpiry = envHours;
                }
                else
                {
                    int.TryParse(config["Jwt:ExpiryHours"], out configExpiry);
                    if (configExpiry == 0) configExpiry = 1;
                }

                var expiryHours = rememberMe ? 24 * 30 : configExpiry;

                var token = new JwtSecurityToken(
                    issuer: config["Jwt:Issuer"],
                    audience: config["Jwt:Audience"],
                    claims: claims,
                    notBefore: DateTime.UtcNow,
                    expires: DateTime.UtcNow.AddHours(expiryHours),
                    signingCredentials: creds);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (ValidationException)
            {
                throw;
            }
            catch (InternalServerException)
            {
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError($"Error generating access token: {ex.Message}");
                throw new InternalServerException("Failed to generate access token");
            }
        }

        public async Task<string> GenerateRefreshTokenAsync(AppUser user, bool rememberMe = false)
        {
            try
            {
                if (user == null)
                    throw new ValidationException("User cannot be null");

                if (string.IsNullOrWhiteSpace(user.Id))
                    throw new ValidationException("User ID cannot be empty");

                // Generate random refresh token
                var randomNumber = new byte[64];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomNumber);
                }
                var refreshToken = Convert.ToBase64String(randomNumber);

                // Remember Me: 30 days, Normal: 7 days
                var expiryDays = rememberMe ? 30 : 7;

                // Save to database
                var refreshTokenEntity = new RefreshToken
                {
                    UserId = user.Id,
                    Token = refreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(expiryDays),
                    IsRevoked = false,
                    CreatedDate = DateTime.UtcNow
                };

                dbContext.RefreshTokens.Add(refreshTokenEntity);
                await dbContext.SaveChangesAsync();

                logger.LogInformation($"Refresh token generated for user '{user.Email}' (RememberMe: {rememberMe}, Expiry: {expiryDays} days)");
                return refreshToken;
            }
            catch (ValidationException)
            {
                throw;
            }
            catch (DbUpdateException ex)
            {
                logger.LogError($"Database error while generating refresh token: {ex.Message}");
                throw new InternalServerException("Failed to save refresh token");
            }
            catch (Exception ex)
            {
                logger.LogError($"Error generating refresh token: {ex.Message}");
                throw new InternalServerException("Failed to generate refresh token");
            }
        }

        public async Task<TokenResponse> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(refreshToken))
                    throw new ValidationException("Refresh token cannot be empty");

                // Find the refresh token in database
                var storedToken = await dbContext.RefreshTokens
                    .Include(rt => rt.AppUser)
                    .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

                if (storedToken == null)
                {
                    logger.LogWarning("Refresh token not found in database");
                    throw new UnauthorizedException("Invalid refresh token");
                }

                if (storedToken.IsRevoked)
                {
                    logger.LogWarning($"Refresh token has been revoked for user '{storedToken.AppUser?.Email}'");
                    throw new UnauthorizedException("Refresh token has been revoked");
                }

                if (storedToken.ExpiryDate < DateTime.UtcNow)
                {
                    logger.LogWarning($"Refresh token has expired for user '{storedToken.AppUser?.Email}'");
                    throw new UnauthorizedException("Refresh token has expired");
                }

                // Determine if this was a "Remember Me" token based on expiry duration
                var tokenLifetime = (storedToken.ExpiryDate - storedToken.CreatedDate).TotalDays;
                var wasRememberMe = tokenLifetime > 14; // If lifetime > 14 days, consider it a remember me token

                // Generate new tokens
                var user = storedToken.AppUser;
                if (user == null)
                    throw new InternalServerException("User associated with token not found");

                var newAccessToken = await GenerateAccessTokenAsync(user, wasRememberMe);
                var newRefreshToken = await GenerateRefreshTokenAsync(user, wasRememberMe);

                // Revoke old refresh token
                storedToken.IsRevoked = true;
                dbContext.RefreshTokens.Update(storedToken);
                await dbContext.SaveChangesAsync();

                // Determine expiry hours from ENV or config
                var envExpiry = Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS");
                int configExpiry = 1;

                if (!string.IsNullOrEmpty(envExpiry) && int.TryParse(envExpiry, out int envHours))
                {
                    configExpiry = envHours;
                }
                else
                {
                    int.TryParse(config["Jwt:ExpiryHours"], out configExpiry);
                    if (configExpiry == 0) configExpiry = 1;
                }

                var expiryHours = wasRememberMe ? 24 * 30 : configExpiry;

                logger.LogInformation($"Token refreshed successfully for user '{user.Email}' (RememberMe: {wasRememberMe})");
                return new TokenResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    TokenType = "Bearer",
                    ExpiresIn = expiryHours * 3600,
                    ExpiresAt = DateTime.UtcNow.AddHours(expiryHours)
                };
            }
            catch (UnauthorizedException)
            {
                throw;
            }
            catch (ValidationException)
            {
                throw;
            }
            catch (InternalServerException)
            {
                throw;
            }
            catch (DbUpdateException ex)
            {
                logger.LogError($"Database error while refreshing token: {ex.Message}");
                throw new InternalServerException("Failed to refresh token");
            }
            catch (Exception ex)
            {
                logger.LogError($"Error refreshing token: {ex.Message}");
                throw new InternalServerException("Token refresh failed");
            }
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(refreshToken))
                    throw new ValidationException("Refresh token cannot be empty");

                var token = await dbContext.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

                if (token != null)
                {
                    token.IsRevoked = true;
                    dbContext.RefreshTokens.Update(token);
                    await dbContext.SaveChangesAsync();
                    logger.LogInformation("Refresh token revoked successfully");
                }
            }
            catch (ValidationException)
            {
                throw;
            }
            catch (DbUpdateException ex)
            {
                logger.LogError($"Database error while revoking token: {ex.Message}");
                throw new InternalServerException("Failed to revoke token");
            }
            catch (Exception ex)
            {
                logger.LogError($"Error revoking token: {ex.Message}");
                throw new InternalServerException("Token revocation failed");
            }
        }

        // Keep old method for backward compatibility
        [Obsolete("Use GenerateTokenAsync instead")]
        public async Task<string> GenerateToken(AppUser user)
        {
            return (await GenerateTokenAsync(user)).AccessToken;
        }
    }
}



