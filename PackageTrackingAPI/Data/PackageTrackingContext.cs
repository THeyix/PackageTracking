using Microsoft.EntityFrameworkCore;
using PackageTrackingAPI.Models;

namespace PackageTrackingAPI.Data
{
    public class PackageTrackingContext : DbContext
    {
        public PackageTrackingContext(DbContextOptions<PackageTrackingContext> options) : base(options)
        {
        }

        public DbSet<Package> Packages { get; set; }
        public DbSet<StatusHistory> StatusHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Package>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.TrackingNumber).IsRequired().HasMaxLength(50);
                entity.Property(p => p.SenderName).IsRequired().HasMaxLength(100);
                entity.Property(p => p.RecipientName).IsRequired().HasMaxLength(100);
                
                entity.HasMany(p => p.StatusHistories)
                      .WithOne(s => s.Package)
                      .HasForeignKey(s => s.PackageId);
            });

            modelBuilder.Entity<StatusHistory>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Notes).HasMaxLength(500);
            });
        }
    }
}
