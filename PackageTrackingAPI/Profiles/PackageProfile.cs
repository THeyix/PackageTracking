using AutoMapper;
using PackageTrackingAPI.DTOs;
using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.Profiles
{
    public class PackageProfile : Profile
    {
        public PackageProfile()
        {
            CreateMap<Package, PackageDto>();
            CreateMap<CreatePackageDto, Package>();
            CreateMap<StatusHistory, StatusHistoryDto>();
        }
    }
}
