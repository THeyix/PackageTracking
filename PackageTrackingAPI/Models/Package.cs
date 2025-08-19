namespace PackageTrackingAPI.Models
{
    public class Package
    {
        public int Id { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        
        // Sender Information
        public string SenderName { get; set; } = string.Empty;
        public string SenderAddress { get; set; } = string.Empty;
        public string SenderPhone { get; set; } = string.Empty;
        
        // Recipient Information
        public string RecipientName { get; set; } = string.Empty;
        public string RecipientAddress { get; set; } = string.Empty;
        public string RecipientPhone { get; set; } = string.Empty;
        
        // Status Information
        public PackageStatus CurrentStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdated { get; set; }
        
        // Navigation property for status history
        public List<StatusHistory> StatusHistories { get; set; } = new List<StatusHistory>();
    }
}
