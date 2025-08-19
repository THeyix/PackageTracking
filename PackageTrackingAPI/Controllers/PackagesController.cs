using Microsoft.AspNetCore.Mvc;
using PackageTrackingAPI.DTOs;
using PackageTrackingAPI.Models;
using PackageTrackingAPI.Services;

namespace PackageTrackingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackagesController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackagesController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetPackages([FromQuery] string? trackingNumber, [FromQuery] PackageStatus? status)
        {
            if (!string.IsNullOrEmpty(trackingNumber) || status.HasValue)
            {
                var searchResults = await _packageService.SearchPackagesAsync(trackingNumber, status);
                return Ok(searchResults);
            }

            var packages = await _packageService.GetAllPackagesAsync();
            return Ok(packages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PackageDto>> GetPackage(int id)
        {
            var package = await _packageService.GetPackageByIdAsync(id);
            
            if (package == null)
                return NotFound();

            return Ok(package);
        }

        [HttpGet("tracking/{trackingNumber}")]
        public async Task<ActionResult<PackageDto>> GetPackageByTracking(string trackingNumber)
        {
            var package = await _packageService.GetPackageByTrackingNumberAsync(trackingNumber);
            
            if (package == null)
                return NotFound();

            return Ok(package);
        }

        [HttpPost]
        public async Task<ActionResult<PackageDto>> CreatePackage(CreatePackageDto createPackageDto)
        {
            var package = await _packageService.CreatePackageAsync(createPackageDto);
            return CreatedAtAction(nameof(GetPackage), new { id = package.Id }, package);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdatePackageStatus(int id, UpdateStatusDto updateStatusDto)
        {
            var success = await _packageService.UpdatePackageStatusAsync(id, updateStatusDto);
            
            if (!success)
                return BadRequest("Invalid status transition or package not found");

            return NoContent();
        }
    }
}
