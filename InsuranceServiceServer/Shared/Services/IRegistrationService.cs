using InsuranceServiceServer.Features.Customer.Models;
using InsuranceServiceServer.Shared.DTOs.Registration;

namespace InsuranceServiceServer.Shared.Services
{
    public interface IRegistrationService
    {
        // Session Management
        Task<RegistrationSession> CreateSessionAsync(string userId);
        Task<RegistrationSession?> GetSessionAsync(string sessionToken);
        Task<RegistrationStatusResponse> GetStatusAsync(string sessionToken);
        
        // Step 2: eKYC
        Task<KYCResponse> ProcessKYCAsync(string sessionToken, StartKYCRequest request);
        
        // Step 3: Complete Profile
        Task<bool> CompleteProfileAsync(string sessionToken, CompleteProfileRequest request);
        
        // Step 4: Select Product
        Task<ProductQuoteResponse> GetProductQuoteAsync(int productId, decimal coverageAmount, int termYears);
        Task<bool> SelectProductAsync(string sessionToken, SelectProductRequest request);
        
        // Step 5: Health Declaration
        Task<bool> SubmitHealthDeclarationAsync(string sessionToken, HealthDeclarationRequest request);
        
        // Step 6: Underwriting
        Task<UnderwritingResponse> ProcessUnderwritingAsync(string sessionToken);
        
        // Step 7: Payment
        Task<PaymentResponse> InitiatePaymentAsync(string sessionToken, InitiatePaymentRequest request);
        Task<bool> ConfirmPaymentAsync(string sessionToken, string paymentId);
        
        // Step 8: Policy Issuance
        Task<PolicyIssuanceResponse> IssuePolicyAsync(string sessionToken);
    }
}



