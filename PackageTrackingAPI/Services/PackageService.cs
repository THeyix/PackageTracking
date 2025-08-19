using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PackageTrackingAPI.Data;
using PackageTrackingAPI.DTOs;
using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.Services
{
    public class PackageService : IPackageService
    {
        private readonly PackageTrackingContext _context;
        private readonly IMapper _mapper;

        public PackageService(PackageTrackingContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PackageDto>> GetAllPackagesAsync()
        {
            var packages = await _context.Packages
                .Include(p => p.StatusHistories)
                .ToListAsync();
            
            return _mapper.Map<IEnumerable<PackageDto>>(packages);
        }

        public async Task<PackageDto?> GetPackageByIdAsync(int id)
        {
            var package = await _context.Packages
                .Include(p => p.StatusHistories)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            return package == null ? null : _mapper.Map<PackageDto>(package);
        }

        public async Task<PackageDto?> GetPackageByTrackingNumberAsync(string trackingNumber)
        {
            var package = await _context.Packages
                .Include(p => p.StatusHistories)
                .FirstOrDefaultAsync(p => p.TrackingNumber == trackingNumber);
            
            return package == null ? null : _mapper.Map<PackageDto>(package);
        }

        public async Task<PackageDto> CreatePackageAsync(CreatePackageDto createPackageDto)
        {
            var package = _mapper.Map<Package>(createPackageDto);
            package.TrackingNumber = GenerateTrackingNumber();
            package.CurrentStatus = PackageStatus.Created;
            package.CreatedDate = DateTime.UtcNow;
            package.LastUpdated = DateTime.UtcNow;

            package.StatusHistories.Add(new StatusHistory
            {
                Status = PackageStatus.Created,
                Timestamp = DateTime.UtcNow,
                Notes = "Package created"
            });

            _context.Packages.Add(package);
            await _context.SaveChangesAsync();

            return _mapper.Map<PackageDto>(package);
        }

        public async Task<bool> UpdatePackageStatusAsync(int id, UpdateStatusDto updateStatusDto)
        {
            var package = await _context.Packages
                .Include(p => p.StatusHistories)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (package == null)
                return false;

            if (!IsValidStatusTransition(package.CurrentStatus, updateStatusDto.NewStatus))
                return false;

            package.CurrentStatus = updateStatusDto.NewStatus;
            package.LastUpdated = DateTime.UtcNow;

            package.StatusHistories.Add(new StatusHistory
            {
                Status = updateStatusDto.NewStatus,
                Timestamp = DateTime.UtcNow,
                Notes = updateStatusDto.Notes
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PackageDto>> SearchPackagesAsync(string? trackingNumber, PackageStatus? status)
        {
            var query = _context.Packages.Include(p => p.StatusHistories).AsQueryable();

            if (!string.IsNullOrEmpty(trackingNumber))
            {
                query = query.Where(p => p.TrackingNumber.Contains(trackingNumber));
            }

            if (status.HasValue)
            {
                query = query.Where(p => p.CurrentStatus == status.Value);
            }

            var packages = await query.ToListAsync();
            return _mapper.Map<IEnumerable<PackageDto>>(packages);
        }

        private static string GenerateTrackingNumber()
        {
            return $"PKG{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(1000, 9999)}";
        }

        private static bool IsValidStatusTransition(PackageStatus current, PackageStatus newStatus)
        {
            return current switch
            {
                PackageStatus.Created => newStatus is PackageStatus.Sent or PackageStatus.Canceled,
                PackageStatus.Sent => newStatus is PackageStatus.Accepted or PackageStatus.Returned or PackageStatus.Canceled,
                PackageStatus.Returned => newStatus is PackageStatus.Sent or PackageStatus.Canceled,
                PackageStatus.Accepted or PackageStatus.Canceled => false, // Final states
                _ => false
            };
        }
    }
}
