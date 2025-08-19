using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.DTOs
{
    public class UpdateStatusDto
    {
        public PackageStatus NewStatus { get; set; }
        public string? Notes { get; set; }
    }
}
