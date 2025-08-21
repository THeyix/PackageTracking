using Microsoft.AspNetCore.Mvc;
using PackageTrackingApi.DTOs;
using PackageTrackingApi.Models;
using PackageTrackingApi.Services;

namespace PackageTrackingApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackagesController : ControllerBase
    {
        private readonly IPackageService _packageService;
        private readonly ILogger<PackagesController> _logger;

        public PackagesController(IPackageService packageService, ILogger<PackagesController> logger)
        {
            _packageService = packageService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetPackages([FromQuery] PackageStatus? status = null)
        {
            var packages = await _packageService.GetAllPackagesAsync(status);
            return Ok(packages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PackageDto>> GetPackage(int id)
        {
            var package = await _packageService.GetPackageByIdAsync(id);
            if (package == null)
            {
                return NotFound();
            }
            return Ok(package);
        }

        [HttpPost]
        public async Task<ActionResult<PackageDto>> CreatePackage(CreatePackageDto createPackageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newPackage = await _packageService.CreatePackageAsync(createPackageDto);
            return CreatedAtAction(nameof(GetPackage), new { id = newPackage.Id }, newPackage);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<PackageDto>> UpdatePackageStatus(int id, UpdateStatusDto updateStatusDto)
        {
            try
            {
                var updatedPackage = await _packageService.UpdatePackageStatusAsync(id, updateStatusDto.NewStatus);
                if (updatedPackage == null)
                {
                    return NotFound();
                }
                return Ok(updatedPackage);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating package status for ID {PackageId}", id);
                return StatusCode(500, "An internal error occurred.");
            }
        }

        [HttpGet("{id}/valid-transitions")]
        public async Task<ActionResult<IEnumerable<PackageStatus>>> GetValidStatusTransitions(int id)
        {
            try
            {
                var transitions = await _packageService.GetValidStatusTransitionsAsync(id);
                return Ok(transitions);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
