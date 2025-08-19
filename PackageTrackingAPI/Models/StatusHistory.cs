namespace PackageTrackingAPI.Models
{
    public class StatusHistory
    {
        public int Id { get; set; }
        public int PackageId { get; set; }
        public PackageStatus Status { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Notes { get; set; }
        
        public Package Package { get; set; } = null!;
    }
}
