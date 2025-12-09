using System.Threading.Tasks;

namespace InsuranceServiceServer.Shared.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string userName, string verificationLink);
        Task SendWelcomeEmailAsync(string email, string userName);
        Task SendPasswordResetEmailAsync(string email, string userName, string resetLink);
        Task SendOTPEmailAsync(string email, string userName, string otp, int expiryMinutes);
        Task SendApplicationConfirmationEmailAsync(string email, string userName, string applicationId, string productName, string planName, decimal premiumAmount, string paymentFrequency);
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
    }
}



