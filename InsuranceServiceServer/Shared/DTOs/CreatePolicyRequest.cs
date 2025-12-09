using System.ComponentModel.DataAnnotations;

namespace InsuranceServiceServer.Models.Insurance
{
    public class CreatePolicyRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1000, 100000000)]
        public decimal CoverageAmount { get; set; }

        [Required]
        [Range(1, 50)]
        public int TermYears { get; set; }

        [Required]
        public string PaymentFrequency { get; set; } = "Monthly";

        [Required]
        public DateTime StartDate { get; set; }
    }
}



