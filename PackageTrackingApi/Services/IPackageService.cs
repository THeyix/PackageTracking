using PackageTrackingApi.DTOs;
using PackageTrackingApi.Models;

namespace PackageTrackingApi.Services
{
    public interface IPackageService
    {
        Task<IEnumerable<PackageDto>> GetAllPackagesAsync(PackageStatus? status);
        Task<PackageDto?> GetPackageByIdAsync(int id);
        Task<PackageDto> CreatePackageAsync(CreatePackageDto createPackageDto);
        Task<PackageDto?> UpdatePackageStatusAsync(int id, PackageStatus newStatus);
        Task<IEnumerable<PackageStatus>> GetValidStatusTransitionsAsync(int packageId);
    }
}
