using InsuranceServiceServer.Core.Data;
using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Shared.Services;
using InsuranceServiceServer.Core.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
var envFile = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envFile))
{
    var lines = File.ReadAllLines(envFile);
    foreach (var line in lines)
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#"))
            continue;

        // Use Split without RemoveEmptyEntries to preserve empty values
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var value = parts[1].Trim();
            // Set the environment variable even if value is empty
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}

// Build connection string from environment variables
var dbServer = Environment.GetEnvironmentVariable("DB_SERVER") ?? ".";
var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "InsuranceServiceDb";
var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "";
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";

// Use Windows authentication (Integrated Security) by default
// Only use SQL Server authentication if BOTH user and password are explicitly provided
var useIntegratedSecurity = string.IsNullOrWhiteSpace(dbUser) || string.IsNullOrWhiteSpace(dbPassword);
var connectionString = useIntegratedSecurity
    ? $"Server={dbServer};Database={dbName};Integrated Security=true;TrustServerCertificate=True;"
    : $"Server={dbServer};Database={dbName};User={dbUser};Password={dbPassword};TrustServerCertificate=True;";

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(connectionString));

// for identity
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    // Disable cookie redirects for API
    options.SignIn.RequireConfirmedAccount = false;
    
    // Password requirements - Production-level security
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 4;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    // Allow spaces and special characters in usernames
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";
    
    // Token lifespan - Email verification expires in 24 hours
    options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Configure token lifespan (24 hours for email verification)
builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromHours(24);
});

// Configure authentication to use JWT as default and prevent redirects
builder.Services.ConfigureApplicationCookie(options =>
{
    // Disable automatic redirects for API calls
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthentication(options =>
{
    // Set JWT as default scheme
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
        ?? builder.Configuration["Jwt:SecretKey"]
        ?? "InsuranceServiceOnlineSem3FPTAptech@2024"; // 256-bit key (32 characters minimum)
    var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
        ?? builder.Configuration["Jwt:Issuer"]
        ?? "insurance-service";
    var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
        ?? builder.Configuration["Jwt:Audience"]
        ?? "insurance-service-client";

    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
    };
});

builder.Services.AddAuthorization(o =>
{
    o.AddPolicy(
        "AdminOnly",
        policy => policy.RequireRole("Admin"));
});

builder.Services.AddTransient<ITokenService, TokenService>();

// Add Memory Cache for rate limiting
builder.Services.AddMemoryCache();

// Add CORS
builder.Services.AddCors(options =>
{
    var corsOriginsEnv = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS");
    var allowedOrigins = corsOriginsEnv?.Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(o => o.Trim())
        .ToArray()
        ?? new[] { "http://localhost:5173" };

    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();
builder.Services.AddSingleton<IRateLimitService, RateLimitService>();

// Add Premium Calculation Service (centralized logic for entire app)
builder.Services.AddScoped<IPremiumCalculationService, PremiumCalculationService>();

// Add Premium Quote Service for payment frequency calculations
builder.Services.AddScoped<InsuranceServiceServer.Features.Customer.Services.PremiumQuoteService>();

// Configure Controllers with JSON options for camelCase support
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Allow camelCase from frontend to map to PascalCase in DTOs
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await InsuranceServiceServer.Core.Data.SeedData.CreateRoles(services, userManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Add global exception middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseHttpsRedirection();

// Enable static files for avatar uploads
// Serve files from wwwroot folder (e.g., /uploads/avatars/xxx.jpg)
app.UseStaticFiles();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed initial roles and admin user on startup (non-blocking)
_ = Task.Run(async () =>
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            await SeedData.CreateRoles(services, userManager);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Warning: Seeding failed: {ex.Message}");
    }
});

app.Run();


