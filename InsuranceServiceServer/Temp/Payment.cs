using System;
using System.Collections.Generic;

namespace InsuranceServiceServer.Temp;

public partial class Payment
{
    public int Id { get; set; }

    public string TransactionId { get; set; } = null!;

    public int PolicyId { get; set; }

    public decimal Amount { get; set; }

    public DateTime DueDate { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string PaymentFrequency { get; set; } = null!;

    public bool IsLumpSum { get; set; }

    public int? PaymentNumber { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string? ReceiptUrl { get; set; }

    public string? PaymentNote { get; set; }

    public virtual InsurancePolicy Policy { get; set; } = null!;
}
