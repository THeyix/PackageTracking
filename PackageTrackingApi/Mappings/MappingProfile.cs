using AutoMapper;
using PackageTrackingApi.DTOs;
using PackageTrackingApi.Models;

namespace PackageTrackingApi.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Package, PackageDto>()
                .ForMember(dest => dest.StatusHistory, opt => opt.MapFrom(src => src.StatusHistory.OrderBy(sh => sh.Timestamp)));

            CreateMap<CreatePackageDto, Package>();

            CreateMap<StatusHistory, StatusHistoryDto>();
        }
    }
}
