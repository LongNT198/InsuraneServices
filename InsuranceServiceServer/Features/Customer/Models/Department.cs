namespace InsuranceServiceServer.Features.Customer.Models
{
    /// <summary>
    /// Department - Company departments
    /// </summary>
    public class Department
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // SALES, UNDERWRITING, CLAIMS, ADMIN
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        
        // Navigation
        public ICollection<EmployeeProfile> Employees { get; set; } = new List<EmployeeProfile>();
    }
}



