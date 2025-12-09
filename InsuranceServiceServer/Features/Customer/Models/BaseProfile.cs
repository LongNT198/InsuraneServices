namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// PROFILE LAYER - Base Profile for all users
    /// </summary>
    public abstract class BaseProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        
        // Personal Information
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty; // Male, Female, Other
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        
        // Timestamps
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}



