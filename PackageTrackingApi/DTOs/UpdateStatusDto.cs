using PackageTrackingApi.Models;

namespace PackageTrackingApi.DTOs
{
    public class UpdateStatusDto
    {
        public PackageStatus NewStatus { get; set; }
    }
}
