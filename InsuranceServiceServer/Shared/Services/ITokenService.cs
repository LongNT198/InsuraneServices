using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Shared.DTOs;

namespace InsuranceServiceServer.Shared.Services
{
    public interface ITokenService
    {
        Task<TokenResponse> GenerateTokenAsync(AppUser user, bool rememberMe = false);
        Task<string> GenerateRefreshTokenAsync(AppUser user, bool rememberMe = false);
        Task<TokenResponse> RefreshTokenAsync(string refreshToken);
        Task RevokeRefreshTokenAsync(string refreshToken);
    }
}



