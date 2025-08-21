using System.ComponentModel.DataAnnotations;

namespace PackageTrackingApi.DTOs
{
    public class CreatePackageDto
    {
        [Required] public string SenderName { get; set; } = string.Empty;
        [Required] public string SenderAddress { get; set; } = string.Empty;
        [Required] public string SenderPhone { get; set; } = string.Empty;
        [Required] public string RecipientName { get; set; } = string.Empty;
        [Required] public string RecipientAddress { get; set; } = string.Empty;
        [Required] public string RecipientPhone { get; set; } = string.Empty;
    }
}
