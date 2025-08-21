using Microsoft.EntityFrameworkCore;
using PackageTrackingApi.Data;
using PackageTrackingApi.Mappings;
using PackageTrackingApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("PackageTrackingDb"));

builder.Services.AddScoped<IPackageService, PackageService>();

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // We disable this for simple local development

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
