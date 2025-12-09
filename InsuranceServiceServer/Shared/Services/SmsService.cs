using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace InsuranceServiceServer.Shared.Services
{
    /// <summary>
    /// SMS Service - Mock implementation (replace with real SMS gateway)
    /// Supported providers: Twilio, AWS SNS, Vonage (Nexmo), Firebase
    /// </summary>
    public class SmsService : ISmsService
    {
        private readonly ILogger<SmsService> _logger;
        private readonly IConfiguration _configuration;
        private readonly bool _isDevelopment;
        private readonly bool _enableRealSms;
        private readonly string _twilioAccountSid;
        private readonly string _twilioAuthToken;
        private readonly string _twilioPhoneNumber;

        public SmsService(
            ILogger<SmsService> logger,
            IConfiguration configuration,
            IWebHostEnvironment environment)
        {
            _logger = logger;
            _configuration = configuration;
            _isDevelopment = environment.IsDevelopment();
            
            // Load Twilio configuration
            // Load Twilio configuration with Env Var priority
            _enableRealSms = _configuration.GetValue<bool>("Twilio:EnableRealSms", false); // Keep config but maybe add env var later if needed
            
            _twilioAccountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID") 
                                ?? _configuration["Twilio:AccountSid"] 
                                ?? "";
                                
            _twilioAuthToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN") 
                               ?? _configuration["Twilio:AuthToken"] 
                               ?? "";
                               
            _twilioPhoneNumber = Environment.GetEnvironmentVariable("TWILIO_PHONE_NUMBER") 
                                 ?? _configuration["Twilio:PhoneNumber"] 
                                 ?? "";
            
            // Initialize Twilio client if enabled
            if (_enableRealSms && !string.IsNullOrEmpty(_twilioAccountSid) && !string.IsNullOrEmpty(_twilioAuthToken))
            {
                TwilioClient.Init(_twilioAccountSid, _twilioAuthToken);
                _logger.LogInformation("Twilio SMS Service initialized successfully");
            }
        }

        public async Task<bool> SendOtpAsync(string phoneNumber, string otp, int expiryMinutes)
        {
            try
            {
                var message = $"Your verification code is: {otp}. Valid for {expiryMinutes} minutes. Do not share this code with anyone.";
                
                // Always log to console in development
                if (_isDevelopment)
                {
                    _logger.LogInformation($"[DEV MODE] SMS to {phoneNumber}: {message}");
                    Console.WriteLine($"\n╔════════════════════════════════════════╗");
                    Console.WriteLine($"║  SMS OTP SENT {(_enableRealSms ? "(Real SMS)" : "(Mock)")}          ║");
                    Console.WriteLine($"╠════════════════════════════════════════╣");
                    Console.WriteLine($"║  Phone: {phoneNumber,-28} ║");
                    Console.WriteLine($"║  OTP: {otp,-32} ║");
                    Console.WriteLine($"║  Expires in: {expiryMinutes} minutes{new string(' ', 19)} ║");
                    Console.WriteLine($"╚════════════════════════════════════════╝\n");
                }
                
                // Send real SMS if enabled
                if (_enableRealSms)
                {
                    return await SendViaTwilio(phoneNumber, message);
                }
                
                // Mock mode - just return success
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send OTP SMS to {phoneNumber}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendSmsAsync(string phoneNumber, string message)
        {
            try
            {
                if (_isDevelopment)
                {
                    _logger.LogInformation($"[DEV MODE] SMS to {phoneNumber}: {message}");
                    Console.WriteLine($"\n[SMS {(_enableRealSms ? "REAL" : "MOCK")}] To: {phoneNumber}\n[SMS] Message: {message}\n");
                }
                
                if (_enableRealSms)
                {
                    return await SendViaTwilio(phoneNumber, message);
                }
                
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send SMS to {phoneNumber}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendNotificationAsync(string phoneNumber, string message)
        {
            return await SendSmsAsync(phoneNumber, message);
        }

        /// <summary>
        /// Send SMS via Twilio gateway
        /// </summary>
        private async Task<bool> SendViaTwilio(string phoneNumber, string message)
        {
            try
            {
                if (string.IsNullOrEmpty(_twilioAccountSid) || string.IsNullOrEmpty(_twilioAuthToken))
                {
                    _logger.LogWarning("Twilio credentials not configured. SMS not sent.");
                    return false;
                }
                
                if (string.IsNullOrEmpty(_twilioPhoneNumber))
                {
                    _logger.LogWarning("Twilio phone number not configured. SMS not sent.");
                    return false;
                }
                
                // Normalize phone number to E.164 format
                var normalizedPhone = NormalizePhoneNumber(phoneNumber);
                
                _logger.LogInformation($"Sending SMS via Twilio to {normalizedPhone}");
                
                var messageResource = await MessageResource.CreateAsync(
                    body: message,
                    from: new PhoneNumber(_twilioPhoneNumber),
                    to: new PhoneNumber(normalizedPhone)
                );
                
                _logger.LogInformation($"Twilio SMS sent successfully. SID: {messageResource.Sid}, Status: {messageResource.Status}");
                
                return messageResource.Status != MessageResource.StatusEnum.Failed && 
                       messageResource.Status != MessageResource.StatusEnum.Undelivered;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Twilio SMS error: {ex.Message}");
                _logger.LogError($"Twilio SMS error details: {ex.ToString()}");
                if (ex.InnerException != null)
                {
                    _logger.LogError($"Twilio SMS inner error: {ex.InnerException.Message}");
                }
                return false;
            }
        }
        
        /// <summary>
        /// Normalize phone number to E.164 format
        /// </summary>
        private string NormalizePhoneNumber(string phoneNumber)
        {
            // Remove all non-digit characters
            var digits = new string(phoneNumber.Where(char.IsDigit).ToArray());
            
            // If starts with 0 (Vietnam local format), convert to +84
            if (digits.StartsWith("0"))
            {
                digits = "84" + digits.Substring(1);
            }
            
            // Add + if not present
            if (!phoneNumber.StartsWith("+"))
            {
                return "+" + digits;
            }
            
            return phoneNumber;
        }
    }
}



