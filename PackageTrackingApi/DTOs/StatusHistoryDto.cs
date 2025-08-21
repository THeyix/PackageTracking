using PackageTrackingApi.Models;

namespace PackageTrackingApi.DTOs
{
    public class StatusHistoryDto
    {
        public int Id { get; set; }
        public PackageStatus Status { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
