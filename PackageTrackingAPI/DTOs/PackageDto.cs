using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.DTOs
{
    public class PackageDto
    {
        public int Id { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SenderAddress { get; set; } = string.Empty;
        public string SenderPhone { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string RecipientAddress { get; set; } = string.Empty;
        public string RecipientPhone { get; set; } = string.Empty;
        public PackageStatus CurrentStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public List<StatusHistoryDto> StatusHistories { get; set; } = new List<StatusHistoryDto>();
    }
}
