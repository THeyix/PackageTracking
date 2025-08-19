namespace PackageTrackingAPI.DTOs
{
    public class CreatePackageDto
    {
        public string SenderName { get; set; } = string.Empty;
        public string SenderAddress { get; set; } = string.Empty;
        public string SenderPhone { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string RecipientAddress { get; set; } = string.Empty;
        public string RecipientPhone { get; set; } = string.Empty;
    }
}
