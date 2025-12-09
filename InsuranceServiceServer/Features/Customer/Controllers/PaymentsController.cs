using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Core.Exceptions;
// using InsuranceServiceServer.Models.Insurance;
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
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(AppDbContext context, ILogger<PaymentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all payments for current user
        /// </summary>
        [HttpGet]
        [Route("my-payments")]
        public async Task<IActionResult> GetMyPayments()
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
                    return Ok(new { payments = new List<object>() });
                }

                var payments = await _context.Payments
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Product)
                    .Where(p => p.Policy!.CustomerProfileId == customerProfile.Id)
                    .OrderByDescending(p => p.DueDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.TransactionId,
                        p.Amount,
                        p.DueDate,
                        PaymentDate = p.PaymentDate,
                        p.Status,
                        p.PaymentMethod,
                        PolicyNumber = p.Policy!.PolicyNumber,
                        ProductName = p.Policy.Product!.ProductName,
                        ProductType = p.Policy.Product.ProductType
                    })
                    .ToListAsync();

                return Ok(new { success = true, payments });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user payments");
                throw;
            }
        }

        /// <summary>
        /// Get payment details by ID
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetPayment(int id)
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

                var payment = await _context.Payments
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Product)
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Customer)
                    .FirstOrDefaultAsync(p => p.Id == id && p.Policy!.CustomerProfileId == customerProfile.Id);

                if (payment == null)
                {
                    throw new NotFoundException("Payment not found");
                }

                var result = new
                {
                    payment.Id,
                    payment.TransactionId,
                    payment.Amount,
                    payment.DueDate,
                    PaymentDate = payment.PaymentDate,
                    payment.Status,
                    payment.PaymentMethod,
                    PaymentNote = payment.PaymentNote,
                    Policy = new
                    {
                        payment.Policy!.Id,
                        payment.Policy.PolicyNumber,
                        payment.Policy.Premium,
                        payment.Policy.PaymentFrequency,
                        Product = new
                        {
                            Name = payment.Policy.Product!.ProductName,
                            Type = payment.Policy.Product.ProductType
                        }
                    }
                };

                return Ok(new { success = true, payment = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment details");
                throw;
            }
        }

        /// <summary>
        /// Make a payment
        /// </summary>
        [HttpPost]
        [Route("make-payment")]
        public async Task<IActionResult> MakePayment([FromBody] MakePaymentRequest request)
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

                // Find the payment record
                var payment = await _context.Payments
                    .Include(p => p.Policy)
                    .FirstOrDefaultAsync(p => p.Id == request.PaymentId && 
                                            p.Policy!.CustomerProfileId == customerProfile.Id &&
                                            p.Status == "Pending");

                if (payment == null)
                {
                    throw new NotFoundException("Pending payment not found");
                }

                // Update payment
                payment.Status = "Paid";
                payment.PaymentDate = DateTime.UtcNow;
                payment.PaymentMethod = request.PaymentMethod;
                payment.TransactionId = request.TransactionId ?? $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}";
                payment.PaymentNote = request.Notes;
                var policy = payment.Policy;
if (policy != null && policy.Status == "Pending")
{
    // Kiểm tra xem đã có payment nào khác "Paid" chưa
    var hasOtherPaid = await _context.Payments
        .AnyAsync(p =>
            p.PolicyId == policy.Id &&
            p.Status == "Paid" &&
            p.Id != payment.Id);

    if (!hasOtherPaid)
    {
        policy.Status = "Active";
        if (policy.ApprovalDate == null)
        {
            policy.ApprovalDate = DateTime.UtcNow;
        }
    }
}
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Payment completed successfully",
                    payment = new
                    {
                        payment.Id,
                        payment.TransactionId,
                        payment.Amount,
                        PaymentDate = payment.PaymentDate,
                        payment.Status
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment");
                throw;
            }
        }

        /// <summary>
        /// Get upcoming payments (next 30 days)
        /// </summary>
        [HttpGet]
        [Route("upcoming")]
        public async Task<IActionResult> GetUpcomingPayments()
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
                    return Ok(new { payments = new List<object>() });
                }

                var today = DateTime.UtcNow.Date;
                var nextMonth = today.AddDays(30);

                var payments = await _context.Payments
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Product)
                    .Where(p => p.Policy!.CustomerProfileId == customerProfile.Id &&
                               p.Status == "Pending" &&
                               p.DueDate >= today &&
                               p.DueDate <= nextMonth)
                    .OrderBy(p => p.DueDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.TransactionId,
                        p.Amount,
                        p.DueDate,
                        p.Status,
                        PolicyNumber = p.Policy!.PolicyNumber,
                        ProductName = p.Policy.Product!.ProductName,
                        DaysUntilDue = (p.DueDate - today).Days
                    })
                    .ToListAsync();

                return Ok(new { success = true, payments });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting upcoming payments");
                throw;
            }
        }

        /// <summary>
        /// Get payment history (completed payments)
        /// </summary>
        [HttpGet]
        [Route("history")]
        public async Task<IActionResult> GetPaymentHistory()
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
                    return Ok(new { payments = new List<object>() });
                }

                var payments = await _context.Payments
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Product)
                    .Where(p => p.Policy!.CustomerProfileId == customerProfile.Id &&
                               (p.Status == "Paid" || p.Status == "Failed"))
                    .OrderByDescending(p => p.PaymentDate ?? p.DueDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.TransactionId,
                        p.Amount,
                        p.DueDate,
                        PaymentDate = p.PaymentDate,
                        p.Status,
                        p.PaymentMethod,
                        PolicyNumber = p.Policy!.PolicyNumber,
                        ProductName = p.Policy.Product!.ProductName
                    })
                    .ToListAsync();

                return Ok(new { success = true, payments });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment history");
                throw;
            }
        }

        /// <summary>
        /// Get all payments for admin
        /// </summary>
        [HttpGet]
        [Route("admin/all")]
        [Authorize(Roles = "Admin,Manager,Officer")]
        public async Task<IActionResult> GetAllPayments([FromQuery] string? status = null)
        {
            try
            {
                var query = _context.Payments
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Product)
                    .Include(p => p.Policy)
                        .ThenInclude(p => p!.Customer)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(p => p.Status == status);
                }

                var payments = await query
                    .OrderByDescending(p => p.PaymentDate ?? p.DueDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.TransactionId,
                        p.Amount,
                        p.DueDate,
                        PaymentDate = p.PaymentDate,
                        p.Status,
                        p.PaymentMethod,
                        PolicyNumber = p.Policy!.PolicyNumber,
                        ProductName = p.Policy.Product!.ProductName,
                        CustomerName = p.Policy.Customer!.FirstName + " " + p.Policy.Customer.LastName
                    })
                    .ToListAsync();

                return Ok(new { success = true, payments });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all payments");
                throw;
            }
        }

        /// <summary>
        /// Process/confirm a pending payment (Admin)
        /// </summary>
        [HttpPost]
[Route("{id}/confirm")]
[Authorize(Roles = "Admin,Manager,Officer")]
public async Task<IActionResult> ConfirmPayment(int id, [FromBody] ConfirmPaymentRequest request)
{
    try
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
        {
            throw new NotFoundException($"Payment with ID {id} not found");
        }

        if (payment.Status != "Pending")
        {
            throw new ValidationException("Only pending payments can be confirmed");
        }

        payment.Status = "Paid"; // ✅ thống nhất với Payment.cs
        payment.PaymentDate = DateTime.UtcNow;
        payment.TransactionId = request.TransactionId ?? payment.TransactionId;
        payment.PaymentNote = request.Notes;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Payment confirmed successfully",
            payment = new
            {
                payment.Id,
                payment.TransactionId,
                payment.Status,
                payment.PaymentDate
            }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Error confirming payment {id}");
        throw;
    }
}


        /// <summary>
        /// Refund a payment (Admin)
        /// </summary>
        [HttpPost]
[Route("{id}/refund")]
[Authorize(Roles = "Admin,Manager")]
public async Task<IActionResult> RefundPayment(int id, [FromBody] RefundPaymentRequest request)
{
    try
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
        {
            throw new NotFoundException($"Payment with ID {id} not found");
        }

        if (payment.Status != "Paid")
        {
            throw new ValidationException("Only paid payments can be refunded");
        }

        payment.Status = "Refunded";
        payment.PaymentNote = $"Refunded: {request.Reason}. {payment.PaymentNote}";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Payment refunded successfully",
            payment = new
            {
                payment.Id,
                payment.Status
            }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Error refunding payment {id}");
        throw;
    }
}
    }

    public class ConfirmPaymentRequest
    {
        public string? TransactionId { get; set; }
        public string? Notes { get; set; }
    }

    public class RefundPaymentRequest
    {
        [Required]
        public string Reason { get; set; } = string.Empty;
    }

    public class MakePaymentRequest
    {
        [Required]
        public int PaymentId { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        public string? TransactionId { get; set; }

        public string? Notes { get; set; }
    }
}

