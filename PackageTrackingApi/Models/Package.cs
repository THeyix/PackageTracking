using System.ComponentModel.DataAnnotations;

namespace PackageTrackingApi.Models
{
    public class Package
    {
        public int Id { get; set; }

        [Required]
        public string TrackingNumber { get; set; } = string.Empty;

        [Required]
        public string SenderName { get; set; } = string.Empty;
        [Required]
        public string SenderAddress { get; set; } = string.Empty;
        [Required]
        public string SenderPhone { get; set; } = string.Empty;

        [Required]
        public string RecipientName { get; set; } = string.Empty;
        [Required]
        public string RecipientAddress { get; set; } = string.Empty;
        [Required]
        public string RecipientPhone { get; set; } = string.Empty;

        public PackageStatus CurrentStatus { get; set; } = PackageStatus.Created;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<StatusHistory> StatusHistory { get; set; } = new List<StatusHistory>();
    }
}
