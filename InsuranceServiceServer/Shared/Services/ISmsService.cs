using System.Threading.Tasks;

namespace InsuranceServiceServer.Shared.Services
{
    public interface ISmsService
    {
        /// <summary>
        /// Send OTP via SMS
        /// </summary>
        Task<bool> SendOtpAsync(string phoneNumber, string otp, int expiryMinutes);
        
        /// <summary>
        /// Send custom SMS message
        /// </summary>
        Task<bool> SendSmsAsync(string phoneNumber, string message);
        
        /// <summary>
        /// Send notification SMS
        /// </summary>
        Task<bool> SendNotificationAsync(string phoneNumber, string message);
    }
}



