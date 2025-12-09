namespace InsuranceServiceServer.Core.Models
{
    public static class AppRoles
    {
        public const string Admin = "Admin";
        public const string Manager = "Manager";
        public const string Officer = "Officer";
        public const string Agent = "Agent";
        public const string Customer = "Customer";

        public static string[] GetAllRoles()
        {
            return new[] { Admin, Manager, Officer, Agent, Customer };
        }
    }
}



