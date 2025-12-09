using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InsuranceServiceServer.Features.Auth.Models;

namespace InsuranceServiceServer.Core.Models
{
    public class ApplicationDraft
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string ApplicationType { get; set; } = string.Empty; // "Life", "Health", "Motor", etc.

        [Required]
        public string DraftData { get; set; } = string.Empty; // JSON string of draft data

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ExpiresAt { get; set; } // Auto-delete after X days

        [MaxLength(500)]
        public string? Notes { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual AppUser? User { get; set; }
    }
}
