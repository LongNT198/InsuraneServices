namespace InsuranceServiceServer.Shared.DTOs
{
    public class CreateUserRequest
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; } // Role for the new user (Officer or Manager)
    }
}



