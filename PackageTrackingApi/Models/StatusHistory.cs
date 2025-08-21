namespace PackageTrackingApi.Models
{
    public class StatusHistory
    {
        public int Id { get; set; }
        public int PackageId { get; set; }
        public PackageStatus Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
