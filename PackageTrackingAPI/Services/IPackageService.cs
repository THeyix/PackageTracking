using PackageTrackingAPI.DTOs;
using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.Services
{
    public interface IPackageService
    {
        Task<IEnumerable<PackageDto>> GetAllPackagesAsync();
        Task<PackageDto?> GetPackageByIdAsync(int id);
        Task<PackageDto?> GetPackageByTrackingNumberAsync(string trackingNumber);
        Task<PackageDto> CreatePackageAsync(CreatePackageDto createPackageDto);
        Task<bool> UpdatePackageStatusAsync(int id, UpdateStatusDto updateStatusDto);
        Task<IEnumerable<PackageDto>> SearchPackagesAsync(string? trackingNumber, PackageStatus? status);
    }
}
