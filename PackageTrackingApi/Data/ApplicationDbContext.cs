using Microsoft.EntityFrameworkCore;
using PackageTrackingApi.Models;

namespace PackageTrackingApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Package> Packages { get; set; }
        public DbSet<StatusHistory> StatusHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Package>()
                .HasIndex(p => p.TrackingNumber)
                .IsUnique();

            modelBuilder.Entity<Package>()
                .HasMany(p => p.StatusHistory)
                .WithOne()
                .HasForeignKey("PackageId");
        }
    }
}
