using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace InsuranceServiceServer.Shared.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly IConfiguration _configuration;

        public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                // Support both naming conventions
                // Support both naming conventions and Env Vars (Prioritize Env Vars)
                var senderEmail = Environment.GetEnvironmentVariable("GMAIL_EMAIL") 
                                  ?? _configuration["Gmail:FromEmail"] 
                                  ?? _configuration["Gmail:SenderEmail"];
                                  
                var senderName = Environment.GetEnvironmentVariable("GMAIL_DISPLAY_NAME") 
                                 ?? _configuration["Gmail:FromName"] 
                                 ?? _configuration["Gmail:SenderName"];
                                 
                var smtpServer = Environment.GetEnvironmentVariable("GMAIL_SMTP_SERVER") 
                                 ?? _configuration["Gmail:SmtpServer"] 
                                 ?? "smtp.gmail.com";
                                 
                var smtpPortStr = Environment.GetEnvironmentVariable("GMAIL_SMTP_PORT") 
                                  ?? _configuration["Gmail:SmtpPort"] 
                                  ?? "587";
                var smtpPort = int.Parse(smtpPortStr);
                
                var username = Environment.GetEnvironmentVariable("GMAIL_USERNAME") 
                               ?? _configuration["Gmail:Username"] 
                               ?? senderEmail; // Fallback to senderEmail logic if needed, or null
                               
                var password = Environment.GetEnvironmentVariable("GMAIL_PASSWORD") 
                               ?? _configuration["Gmail:Password"];

                _logger.LogInformation($"Attempting to send email to {toEmail} from {senderEmail}");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(username, password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
                throw;
            }
        }

        public async Task SendVerificationEmailAsync(string email, string userName, string verificationLink)
        {
            try
            {
                _logger.LogInformation($"Sending verification email to {email}");

                var emailBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #2196f3; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .button {{ display: inline-block; padding: 12px 30px; background-color: #2196f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Insurance Services</h1>
        </div>
        <div class='content'>
            <h2>Verify Your Account</h2>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>Thank you for registering an account with Insurance Services.</p>
            <p>Please click the button below to verify your email address:</p>
            <div style='text-align: center;'>
                <a href='{verificationLink}' class='button'>Verify Account</a>
            </div>
            <p>Or copy this link into your browser:</p>
            <p style='word-break: break-all; background-color: #eee; padding: 10px; font-size: 12px;'>{verificationLink}</p>
            <p><strong>Note:</strong> This link will expire in 24 hours.</p>
            <p>If you did not request this registration, please ignore this email.</p>
        </div>
        <div class='footer'>
            <p>Best regards,<br/>Insurance Services Team</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>";

                await SendEmailAsync(email, "Verify Your Account - Insurance Services", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send verification email to {email}");
                throw;
            }
        }

        public async Task SendWelcomeEmailAsync(string email, string userName)
        {
            try
            {
                _logger.LogInformation($"Sending welcome email to {email}");

                var emailBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4caf50; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .feature {{ background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4caf50; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Welcome to Insurance Services!</h1>
        </div>
        <div class='content'>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>Your account has been successfully verified!</p>
            <p>You now have full access to our services:</p>
            <div class='feature'>📋 <strong>Online Insurance Application</strong></div>
            <div class='feature'>📊 <strong>Manage Insurance Policies</strong></div>
            <div class='feature'>💼 <strong>Submit Claims</strong></div>
            <div class='feature'>📞 <strong>24/7 Support</strong></div>
            <p style='margin-top: 20px;'>If you need assistance, please contact us:</p>
            <p>📧 Email: support@insuranceservices.com<br/>📞 Phone: 1-800-INSURANCE</p>
        </div>
        <div class='footer'>
            <p>Best regards,<br/>Insurance Services Team</p>
        </div>
    </div>
</body>
</html>";

                await SendEmailAsync(email, "Welcome to Insurance Services!", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send welcome email to {email}");
            }
        }

        public async Task SendPasswordResetEmailAsync(string email, string userName, string resetLink)
        {
            try
            {
                _logger.LogInformation($"Sending password reset email to {email}");

                var emailBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #ff9800; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .button {{ display: inline-block; padding: 12px 30px; background-color: #ff9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .warning {{ background-color: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 15px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔐 Reset Password</h1>
        </div>
        <div class='content'>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>We received a request to reset the password for your account.</p>
            <p>Click the button below to reset your password:</p>
            <div style='text-align: center;'>
                <a href='{resetLink}' class='button'>Reset Password</a>
            </div>
            <div class='warning'>
                <strong>⚠️ Important Notes:</strong>
                <ul>
                    <li>This link is valid for <strong>1 hour</strong> only</li>
                    <li>If you did not request a password reset, please ignore this email</li>
                    <li>Do not share this link with anyone</li>
                </ul>
            </div>
        </div>
        <div class='footer'>
            <p>Best regards,<br/>Insurance Services Team</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>";

                await SendEmailAsync(email, "Reset Password - Insurance Services", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send password reset email to {email}");
                throw;
            }
        }

        public async Task SendOTPEmailAsync(string email, string userName, string otp, int expiryMinutes)
        {
            try
            {
                _logger.LogInformation($"Sending OTP email to {email}");

                var emailBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4caf50; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .otp-box {{ background-color: #fff; border: 2px solid #4caf50; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4caf50; font-family: 'Courier New', monospace; }}
        .warning {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔐 Insurance Services</h1>
        </div>
        <div class='content'>
            <h2>Your Email Verification Code</h2>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>Here is your OTP code to verify your email address:</p>
            
            <div class='otp-box'>
                <div class='otp-code'>{otp}</div>
            </div>

            <p style='text-align: center; color: #666; font-size: 14px;'>
                Enter this code in the verification form to complete your registration
            </p>
            
            <div class='warning'>
                <strong>⚠️ Important Notes:</strong>
                <ul>
                    <li>This OTP code is valid for <strong>{expiryMinutes} minutes</strong></li>
                    <li>Do not share this code with anyone</li>
                    <li>If you did not request this code, please ignore this email</li>
                </ul>
            </div>
        </div>
        <div class='footer'>
            <p>Best regards,<br/>Insurance Services Team</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>";

                await SendEmailAsync(email, "Email Verification Code - Insurance Services", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send OTP email to {email}");
                throw;
            }
        }

        public async Task SendApplicationConfirmationEmailAsync(string email, string userName, string applicationId, string productName, string planName, decimal premiumAmount, string paymentFrequency)
        {
            try
            {
                _logger.LogInformation($"Sending application confirmation email to {email}");

                var emailBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 650px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 40px 30px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 28px; font-weight: 600; }}
        .header p {{ margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }}
        .content {{ padding: 40px 30px; background-color: #f8f9fa; }}
        .success-icon {{ text-align: center; margin-bottom: 20px; }}
        .success-icon span {{ display: inline-block; background-color: #4caf50; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; font-size: 30px; }}
        .greeting {{ font-size: 18px; color: #333; margin-bottom: 20px; }}
        .message {{ font-size: 15px; color: #555; margin-bottom: 25px; line-height: 1.8; }}
        .info-box {{ background-color: white; border-left: 4px solid #2196f3; padding: 20px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .info-box h3 {{ margin: 0 0 15px 0; color: #2196f3; font-size: 16px; }}
        .info-row {{ display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }}
        .info-row:last-child {{ border-bottom: none; }}
        .info-label {{ font-weight: 600; color: #666; }}
        .info-value {{ color: #333; font-weight: 500; }}
        .application-id {{ background-color: #e3f2fd; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }}
        .application-id strong {{ color: #1976d2; font-size: 18px; letter-spacing: 1px; }}
        .next-steps {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; }}
        .next-steps h3 {{ margin: 0 0 15px 0; color: #856404; font-size: 16px; }}
        .next-steps ul {{ margin: 10px 0; padding-left: 20px; }}
        .next-steps li {{ margin: 8px 0; color: #856404; }}
        .support {{ background-color: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 5px; }}
        .support p {{ margin: 5px 0; font-size: 14px; color: #666; }}
        .footer {{ background-color: #263238; color: #b0bec5; padding: 30px; text-align: center; font-size: 13px; }}
        .footer a {{ color: #64b5f6; text-decoration: none; }}
        .divider {{ height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🛡️ Insurance Services</h1>
            <p>Life Insurance Application Confirmed</p>
        </div>
        
        <div class='content'>
            <div class='success-icon'>
                <span>✓</span>
            </div>
            
            <div class='greeting'>
                Dear <strong>{userName}</strong>,
            </div>
            
            <div class='message'>
                Thank you for submitting your life insurance application with Insurance Services. We have successfully received your application and it is now being processed by our underwriting team.
            </div>

            <div class='application-id'>
                <p style='margin: 0 0 5px 0; color: #666; font-size: 14px;'>Your Application ID</p>
                <strong>{applicationId}</strong>
                <p style='margin: 10px 0 0 0; color: #666; font-size: 12px;'>Please save this ID for your records</p>
            </div>

            <div class='info-box'>
                <h3>📋 Application Summary</h3>
                <div class='info-row'>
                    <span class='info-label'>Product:</span>
                    <span class='info-value'>{productName}</span>
                </div>
                <div class='info-row'>
                    <span class='info-label'>Plan:</span>
                    <span class='info-value'>{planName}</span>
                </div>
                <div class='info-row'>
                    <span class='info-label'>Premium Amount:</span>
                    <span class='info-value'>${premiumAmount:N2}</span>
                </div>
                <div class='info-row'>
                    <span class='info-label'>Payment Frequency:</span>
                    <span class='info-value'>{paymentFrequency}</span>
                </div>
            </div>

            <div class='next-steps'>
                <h3>📌 What Happens Next?</h3>
                <ul>
                    <li><strong>Application Review:</strong> Our underwriting team will review your application within 3-5 business days.</li>
                    <li><strong>Medical Examination:</strong> If required, we will contact you to schedule a medical examination.</li>
                    <li><strong>Status Updates:</strong> We will keep you informed via email about your application status.</li>
                    <li><strong>Final Decision:</strong> You will receive a notification once your application is approved or if we need additional information.</li>
                </ul>
            </div>

            <div class='divider'></div>

            <div class='message'>
                <strong>Important:</strong> Please ensure you have provided accurate and complete information. Any discrepancies may delay the processing of your application.
            </div>

            <div class='support'>
                <p><strong>Need Help?</strong></p>
                <p>If you have any questions about your application, please don't hesitate to contact us:</p>
                <p>📧 Email: support@insuranceservices.com</p>
                <p>📞 Phone: 1-800-INSURANCE (1-800-467-8726)</p>
                <p>⏰ Business Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
            </div>
        </div>
        
        <div class='footer'>
            <p><strong>Insurance Services</strong></p>
            <p>Protecting what matters most to you</p>
            <p style='margin-top: 15px;'>
                <a href='#'>Privacy Policy</a> | 
                <a href='#'>Terms of Service</a> | 
                <a href='#'>Contact Us</a>
            </p>
            <p style='margin-top: 15px; font-size: 11px; color: #90a4ae;'>
                © 2025 Insurance Services. All rights reserved.<br>
                This is an automated email. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>";

                await SendEmailAsync(email, "Application Received - Insurance Services", emailBody);
                _logger.LogInformation($"Application confirmation email sent successfully to {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send application confirmation email to {email}");
                throw;
            }
        }
    }
}



