namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Customer Profile - For insurance customers
    /// </summary>
    public class CustomerProfile : BaseProfile
    {
        // Identification
        public string? NationalId { get; set; } // CMND/CCCD
        public string? PassportNumber { get; set; }
        public string? TaxCode { get; set; }
        
        // Address
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; } = "Vietnam";
        
        // Occupation & Financial
        public string? Occupation { get; set; }
        public string? OccupationOther { get; set; } // Specify when Occupation = "Other"
        public string? Company { get; set; }
        public string? Position { get; set; }
        public decimal? MonthlyIncome { get; set; }
        
        // KYC Status
        public string KycStatus { get; set; } = "Pending"; // Pending, Verified, Rejected
        public DateTime? KycVerifiedDate { get; set; }
        public string? KycVerifiedBy { get; set; }
        
        // Customer Management
        public string CustomerTier { get; set; } = "Bronze"; // Bronze, Silver, Gold, Platinum
        public decimal LifetimeValue { get; set; }
        public string? AssignedAgentId { get; set; } // EmployeeProfile Id
        
        // Emergency Contact
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public string? EmergencyContactGender { get; set; }
        public string? EmergencyContactRelationship { get; set; }
        public string? EmergencyContactRelationshipOther { get; set; } // Specify when EmergencyContactRelationship = "Other"
        
        // Marketing
        public bool AcceptMarketing { get; set; }
        public string PreferredContactMethod { get; set; } = "Email"; // Email, Phone, SMS
    }
}



