using System;
using System.Text.Json;

namespace InsuranceServiceServer.Features.Customer.DTOs
{
    // Request DTO for creating/updating draft
    public class CreateDraftRequest
    {
        public string ApplicationType { get; set; } = "Life"; // "Life", "Health", etc.
        public JsonElement DraftData { get; set; } // Dynamic JSON data from frontend
        public string? Notes { get; set; }
    }

    // Response DTO
    public class ApplicationDraftResponse
    {
        public Guid Id { get; set; }
        public string ApplicationType { get; set; } = string.Empty;
        public JsonElement DraftData { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? Notes { get; set; }
    }

    // List response
    public class DraftListResponse
    {
        public Guid Id { get; set; }
        public string ApplicationType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Notes { get; set; }
    }
}
