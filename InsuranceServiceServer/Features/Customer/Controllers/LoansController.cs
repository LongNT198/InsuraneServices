using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
using InsuranceServiceServer.Features.Customer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using ValidationException = InsuranceServiceServer.Core.Exceptions.ValidationException;

namespace InsuranceServiceServer.Features.Customer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LoansController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LoansController> _logger;

        public LoansController(AppDbContext context, ILogger<LoansController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all loans for current user
        /// </summary>
        [HttpGet]
        [Route("my-loans")]
        public async Task<IActionResult> GetMyLoans()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    return Ok(new { loans = new List<object>() });
                }

                var loans = await _context.PolicyLoans
                    .Include(l => l.Policy)
                        .ThenInclude(p => p!.Product)
                    .Where(l => l.Policy!.CustomerProfileId == customerProfile.Id)
                    .OrderByDescending(l => l.ApplicationDate)
                    .Select(l => new
                    {
                        l.Id,
                        l.LoanNumber,
                        l.LoanAmount,
                        l.InterestRate,
                        l.RepaymentMonths,
                        l.MonthlyRepayment,
                        l.OutstandingAmount,
                        l.Status,
                        l.ApplicationDate,
                        l.ApprovalDate,
                        l.DisbursementDate,
                        PolicyNumber = l.Policy!.PolicyNumber,
                        ProductName = l.Policy.Product!.ProductName
                    })
                    .ToListAsync();

                return Ok(new { success = true, loans });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user loans");
                throw;
            }
        }

        /// <summary>
        /// Get loan details by ID
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetLoan(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    throw new NotFoundException("Customer profile not found");
                }

                var loan = await _context.PolicyLoans
                    .Include(l => l.Policy)
                        .ThenInclude(p => p!.Product)
                    .Include(l => l.Policy)
                        .ThenInclude(p => p!.Customer)
                    .FirstOrDefaultAsync(l => l.Id == id && l.Policy!.CustomerProfileId == customerProfile.Id);

                if (loan == null)
                {
                    throw new NotFoundException("Loan not found");
                }

                var result = new
                {
                    loan.Id,
                    loan.LoanNumber,
                    loan.LoanAmount,
                    loan.InterestRate,
                    loan.MaxLoanAmount,
                    loan.RepaymentMonths,
                    loan.MonthlyRepayment,
                    loan.OutstandingAmount,
                    loan.Status,
                    loan.ApplicationDate,
                    loan.ApprovalDate,
                    loan.DisbursementDate,
                    loan.RejectionReason,
                    Policy = new
                    {
                        loan.Policy!.Id,
                        loan.Policy.PolicyNumber,
                        loan.Policy.CoverageAmount,
                        loan.Policy.Status,
                        Product = new
                        {
                            Name = loan.Policy.Product!.ProductName,
                            Type = loan.Policy.Product.ProductType
                        }
                    }
                };

                return Ok(new { success = true, loan = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting loan details");
                throw;
            }
        }

        /// <summary>
        /// Request a new loan against policy
        /// </summary>
        [HttpPost]
        [Route("request-loan")]
        public async Task<IActionResult> RequestLoan([FromBody] RequestLoanRequest request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    throw new NotFoundException("Customer profile not found");
                }

                // Validate policy
                var policy = await _context.InsurancePolicies
                    .Include(p => p.Product)
                    .FirstOrDefaultAsync(p => p.Id == request.PolicyId && 
                                            p.CustomerProfileId == customerProfile.Id &&
                                            p.Status == "Active");

                if (policy == null)
                {
                    throw new ValidationException("Policy not found or not active");
                }

                // Check for existing active loans
                var existingLoan = await _context.PolicyLoans
                    .AnyAsync(l => l.PolicyId == request.PolicyId && 
                                  (l.Status == "Active" || l.Status == "Pending"));

                if (existingLoan)
                {
                    throw new ValidationException("An active or pending loan already exists for this policy");
                }

                // Calculate max loan amount (typically 70-90% of policy's cash value)
                // For simplicity, using 70% of coverage amount
                decimal maxLoanAmount = policy.CoverageAmount * 0.70m;

                if (request.LoanAmount > maxLoanAmount)
                {
                    throw new ValidationException($"Loan amount cannot exceed {maxLoanAmount:C}");
                }

                // Calculate monthly repayment
                // Simple interest calculation: Total = Principal * (1 + (rate * time))
                decimal totalAmount = request.LoanAmount * (1 + (request.InterestRate / 100m) * (request.RepaymentMonths / 12m));
                decimal monthlyRepayment = totalAmount / request.RepaymentMonths;

                // Generate loan number
                var loanCount = await _context.PolicyLoans.CountAsync();
                var loanNumber = $"LOAN-{policy.Product!.ProductType.ToUpper()}-{(loanCount + 1):D4}";

                var loan = new PolicyLoan
                {
                    LoanNumber = loanNumber,
                    PolicyId = request.PolicyId,
                    LoanAmount = request.LoanAmount,
                    InterestRate = request.InterestRate,
                    MaxLoanAmount = maxLoanAmount,
                    RepaymentMonths = request.RepaymentMonths,
                    MonthlyRepayment = Math.Round(monthlyRepayment, 2),
                    OutstandingAmount = request.LoanAmount,
                    Status = "Pending",
                    ApplicationDate = DateTime.UtcNow
                };

                _context.PolicyLoans.Add(loan);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Loan request submitted successfully",
                    loan = new
                    {
                        loan.Id,
                        loan.LoanNumber,
                        loan.LoanAmount,
                        loan.InterestRate,
                        loan.RepaymentMonths,
                        loan.MonthlyRepayment,
                        loan.Status
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error requesting loan");
                throw;
            }
        }

        /// <summary>
        /// Get eligible policies for loan
        /// </summary>
        [HttpGet]
        [Route("eligible-policies")]
        public async Task<IActionResult> GetEligiblePolicies()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedException("User not authenticated");
                }

                var customerProfile = await _context.CustomerProfiles
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (customerProfile == null)
                {
                    return Ok(new { policies = new List<object>() });
                }

                // Get active policies without active loans
                var eligiblePolicies = await _context.InsurancePolicies
                    .Include(p => p.Product)
                    .Where(p => p.CustomerProfileId == customerProfile.Id && 
                               p.Status == "Active" &&
                               !_context.PolicyLoans.Any(l => l.PolicyId == p.Id && 
                                                             (l.Status == "Active" || l.Status == "Pending")))
                    .Select(p => new
                    {
                        p.Id,
                        p.PolicyNumber,
                        p.CoverageAmount,
                        MaxLoanAmount = p.CoverageAmount * 0.70m,
                        ProductName = p.Product!.ProductName,
                        ProductType = p.Product.ProductType,
                        p.StartDate,
                        p.EndDate
                    })
                    .ToListAsync();

                return Ok(new { success = true, policies = eligiblePolicies });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting eligible policies");
                throw;
            }
        }

        /// <summary>
        /// Admin: Get all loans
        /// </summary>
        [HttpGet]
        [Route("admin/all")]
        [Authorize(Roles = "Admin,LoanOfficer")]
        public async Task<IActionResult> GetAllLoans([FromQuery] string? status = null)
        {
            try
            {
                var query = _context.PolicyLoans
                    .Include(l => l.Policy)
                        .ThenInclude(p => p!.Product)
                    .Include(l => l.Policy)
                        .ThenInclude(p => p!.Customer)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(l => l.Status == status);
                }

                var loans = await query
                    .OrderByDescending(l => l.ApplicationDate)
                    .Select(l => new
                    {
                        l.Id,
                        l.LoanNumber,
                        l.LoanAmount,
                        l.InterestRate,
                        l.RepaymentMonths,
                        l.MonthlyRepayment,
                        l.OutstandingAmount,
                        l.Status,
                        l.ApplicationDate,
                        l.ApprovalDate,
                        PolicyNumber = l.Policy!.PolicyNumber,
                        ProductName = l.Policy.Product!.ProductName,
                        CustomerName = l.Policy.Customer!.FullName,
                        CustomerEmail = l.Policy.Customer.Email
                    })
                    .ToListAsync();

                return Ok(new { success = true, loans });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all loans");
                throw;
            }
        }

        /// <summary>
        /// Admin: Approve or reject loan
        /// </summary>
        [HttpPut]
        [Route("{id}/status")]
        [Authorize(Roles = "Admin,LoanOfficer")]
        public async Task<IActionResult> UpdateLoanStatus(int id, [FromBody] UpdateLoanStatusRequest request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var loan = await _context.PolicyLoans
                    .FirstOrDefaultAsync(l => l.Id == id);

                if (loan == null)
                {
                    throw new NotFoundException("Loan not found");
                }

                if (loan.Status != "Pending")
                {
                    throw new ValidationException("Only pending loans can be updated");
                }

                loan.Status = request.Status;
                loan.ApprovalDate = DateTime.UtcNow;
                loan.ApprovedBy = userId;

                if (request.Status == "Approved")
                {
                    loan.DisbursementDate = DateTime.UtcNow;
                }
                else if (request.Status == "Rejected")
                {
                    loan.RejectionReason = request.RejectionReason;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = $"Loan {request.Status.ToLower()} successfully",
                    loan = new
                    {
                        loan.Id,
                        loan.LoanNumber,
                        loan.Status,
                        loan.ApprovalDate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating loan status");
                throw;
            }
        }
    }

    public class RequestLoanRequest
    {
        [Required]
        public int PolicyId { get; set; }

        [Required]
        [Range(1000, double.MaxValue, ErrorMessage = "Loan amount must be at least 1,000")]
        public decimal LoanAmount { get; set; }

        [Required]
        [Range(1, 25, ErrorMessage = "Interest rate must be between 1% and 25%")]
        public decimal InterestRate { get; set; }

        [Required]
        [Range(6, 120, ErrorMessage = "Repayment period must be between 6 and 120 months")]
        public int RepaymentMonths { get; set; }
    }

    public class UpdateLoanStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Approved, Rejected

        public string? RejectionReason { get; set; }
    }
}



