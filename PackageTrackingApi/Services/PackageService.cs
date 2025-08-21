using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PackageTrackingApi.Data;
using PackageTrackingApi.DTOs;
using PackageTrackingApi.Models;

namespace PackageTrackingApi.Services
{
    public class PackageService : IPackageService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<PackageService> _logger;

        public PackageService(ApplicationDbContext context, IMapper mapper, ILogger<PackageService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<PackageDto>> GetAllPackagesAsync(PackageStatus? status)
        {
            var query = _context.Packages.AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(p => p.CurrentStatus == status.Value);
            }
            
            var packages = await query.Include(p => p.StatusHistory).ToListAsync();
            return _mapper.Map<IEnumerable<PackageDto>>(packages);
        }

        public async Task<PackageDto?> GetPackageByIdAsync(int id)
        {
            var package = await _context.Packages
                .Include(p => p.StatusHistory)
                .FirstOrDefaultAsync(p => p.Id == id);
            return package == null ? null : _mapper.Map<PackageDto>(package);
        }

        public async Task<PackageDto> CreatePackageAsync(CreatePackageDto createPackageDto)
        {
            var package = _mapper.Map<Package>(createPackageDto);
            package.TrackingNumber = GenerateTrackingNumber();
            package.CurrentStatus = PackageStatus.Created;
            package.CreatedAt = DateTime.UtcNow;
            
            package.StatusHistory.Add(new StatusHistory
            {
                Status = PackageStatus.Created,
                Timestamp = DateTime.UtcNow
            });
            
            _context.Packages.Add(package);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Package created: {TrackingNumber}", package.TrackingNumber);
            return _mapper.Map<PackageDto>(package);
        }

        public async Task<PackageDto?> UpdatePackageStatusAsync(int id, PackageStatus newStatus)
        {
            var package = await _context.Packages.FindAsync(id);
            if (package == null) return null;

            var validTransitions = GetValidStatusTransitions(package.CurrentStatus);
            if (!validTransitions.Contains(newStatus))
            {
                throw new InvalidOperationException($"Cannot change status from {package.CurrentStatus} to {newStatus}.");
            }
            
            package.CurrentStatus = newStatus;
            package.StatusHistory.Add(new StatusHistory
            {
                Status = newStatus,
                Timestamp = DateTime.UtcNow,
                PackageId = package.Id
            });
            
            await _context.SaveChangesAsync();
            _logger.LogInformation("Package {TrackingNumber} status updated to {Status}", package.TrackingNumber, newStatus);
            
            var updatedPackage = await GetPackageByIdAsync(id);
            return updatedPackage;
        }

        public async Task<IEnumerable<PackageStatus>> GetValidStatusTransitionsAsync(int packageId)
        {
            var package = await _context.Packages.FindAsync(packageId);
            if (package == null)
            {
                throw new KeyNotFoundException("Package not found.");
            }
            return GetValidStatusTransitions(package.CurrentStatus);
        }

        private List<PackageStatus> GetValidStatusTransitions(PackageStatus currentStatus)
        {
            switch (currentStatus)
            {
                case PackageStatus.Created:
                    return new List<PackageStatus> { PackageStatus.Sent, PackageStatus.Canceled };
                case PackageStatus.Sent:
                    return new List<PackageStatus> { PackageStatus.Accepted, PackageStatus.Returned, PackageStatus.Canceled };
                case PackageStatus.Returned:
                    return new List<PackageStatus> { PackageStatus.Sent, PackageStatus.Canceled };
                case PackageStatus.Accepted:
                case PackageStatus.Canceled:
                    return new List<PackageStatus>();
                default:
                    return new List<PackageStatus>();
            }
        }

        private string GenerateTrackingNumber()
        {
            return $"PK{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{new Random().Next(100, 999)}";
        }
    }
}
