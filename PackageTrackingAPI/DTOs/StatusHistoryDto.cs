using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.DTOs
{
    public class StatusHistoryDto
    {
        public int Id { get; set; }
        public PackageStatus Status { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Notes { get; set; }
    }
}
