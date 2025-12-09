using InsuranceServiceServer.Features.Auth.Models;
using InsuranceServiceServer.Shared.DTOs;
using InsuranceServiceServer.Core.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace InsuranceServiceServer.Features.Admin.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class UsersController : ControllerBase
    {
        readonly UserManager<AppUser> _userManager;
        readonly RoleManager<IdentityRole> _roleManager;
        readonly ILogger<UsersController> _logger;

        public UsersController(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<UsersController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        /// <summary>
        /// Get all users - Admin only
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            try
            {
                var users = await _userManager.Users.ToListAsync();
                var userDTOs = new List<UserDTO>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    userDTOs.Add(new UserDTO
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        EmailConfirmed = user.EmailConfirmed,
                        LockoutEnabled = user.LockoutEnabled,
                        LockoutEnd = user.LockoutEnd,
                        CreatedDate = user.CreatedDate,
                        Roles = roles.ToList()
                    });
                }

                _logger.LogInformation($"Retrieved {userDTOs.Count} users");
                return Ok(userDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving users: {ex.Message}");
                throw new InternalServerException("Failed to retrieve users");
            }
        }

        /// <summary>
        /// Get user by ID - Admin or self
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                var roles = await _userManager.GetRolesAsync(user);
                var userDTO = new UserDTO
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    EmailConfirmed = user.EmailConfirmed,
                    LockoutEnabled = user.LockoutEnabled,
                    LockoutEnd = user.LockoutEnd,
                    CreatedDate = user.CreatedDate,
                    Roles = roles.ToList()
                };

                return Ok(userDTO);
            }
            catch (NotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving user {id}: {ex.Message}");
                throw new InternalServerException("Failed to retrieve user");
            }
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile/me")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCurrentProfile()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userId))
                    throw new UnauthorizedException("User not authenticated");

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    throw new NotFoundException("User not found");

                var roles = await _userManager.GetRolesAsync(user);
                var userDTO = new UserDTO
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    EmailConfirmed = user.EmailConfirmed,
                    CreatedDate = user.CreatedDate,
                    Roles = roles.ToList()
                };

                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving current profile: {ex.Message}");
                throw new InternalServerException("Failed to retrieve profile");
            }
        }

        /// <summary>
        /// Create new user - Admin only (Officer or Manager roles)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                        .ToDictionary(e => "model", e => new[] { e.ErrorMessage });
                    throw new ValidationException("Invalid user data", errors);
                }

                // Validate role - only Officer or Manager allowed
                var roleToAssign = string.IsNullOrWhiteSpace(model.Role) ? "Officer" : model.Role.Trim();
                if (!new[] { "Officer", "Manager" }.Contains(roleToAssign, StringComparer.OrdinalIgnoreCase))
                {
                    throw new ValidationException(
                        "Invalid role. Only 'Officer' or 'Manager' roles are allowed.",
                        new Dictionary<string, string[]> { { "role", new[] { "Only Officer or Manager roles are allowed" } } }
                    );
                }

                // Check if email already exists
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                    throw new ConflictException($"Email '{model.Email}' is already registered");

                var user = new AppUser
                {
                    UserName = string.IsNullOrWhiteSpace(model.UserName) ? model.Email : model.UserName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    EmailConfirmed = true, // Admin-created users are confirmed by admin
                    CreatedDate = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to create user", errors);
                }

                // Ensure role exists, create if not
                var roleExists = await _roleManager.RoleExistsAsync(roleToAssign);
                if (!roleExists)
                {
                    _logger.LogInformation($"Role '{roleToAssign}' does not exist. Creating...");
                    var createRoleResult = await _roleManager.CreateAsync(new IdentityRole(roleToAssign));
                    if (!createRoleResult.Succeeded)
                    {
                        _logger.LogWarning($"Failed to create role '{roleToAssign}': {string.Join(", ", createRoleResult.Errors.Select(e => e.Description))}");
                    }
                }

                // Assign specified role (Officer or Manager)
                var roleResult = await _userManager.AddToRoleAsync(user, roleToAssign);
                if (!roleResult.Succeeded)
                {
                    var errors = roleResult.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to assign role", errors);
                }

                _logger.LogInformation($"User '{user.Email}' created successfully with role '{roleToAssign}'");
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating user: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Update user - Admin only
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                // Check if new email is already taken
                if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
                {
                    var existingUser = await _userManager.FindByEmailAsync(model.Email);
                    if (existingUser != null)
                        throw new ConflictException($"Email '{model.Email}' is already in use");
                }

                // Update UserName if provided, otherwise keep current
                if (!string.IsNullOrWhiteSpace(model.UserName))
                    user.UserName = model.UserName;

                user.Email = model.Email ?? user.Email;
                user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to update user", errors);
                }

                _logger.LogInformation($"User '{user.Email}' updated successfully");
                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating user {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Delete user - Admin only
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                // Prevent deleting the current user
                var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (user.Id == currentUserId)
                    throw new ConflictException("Cannot delete your own account");

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to delete user", errors);
                }

                _logger.LogInformation($"User '{user.Email}' deleted successfully");
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting user {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Assign role to user - Admin only
        /// </summary>
        [HttpPost("{id}/roles/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignRole(string id, string role)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                if (string.IsNullOrWhiteSpace(role))
                    throw new ValidationException("Role cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                // Check if role exists
                if (!await _roleManager.RoleExistsAsync(role))
                    throw new NotFoundException($"Role '{role}' does not exist");

                // Check if user already has this role
                if (await _userManager.IsInRoleAsync(user, role))
                    throw new ConflictException($"User already has role '{role}'");

                var result = await _userManager.AddToRoleAsync(user, role);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to assign role", errors);
                }

                _logger.LogInformation($"Role '{role}' assigned to user '{user.Email}'");
                return Ok(new { message = $"Role '{role}' assigned successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error assigning role to user {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Remove role from user - Admin only
        /// </summary>
        [HttpDelete("{id}/roles/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveRole(string id, string role)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                if (string.IsNullOrWhiteSpace(role))
                    throw new ValidationException("Role cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                if (!await _userManager.IsInRoleAsync(user, role))
                    throw new ConflictException($"User does not have role '{role}'");

                var result = await _userManager.RemoveFromRoleAsync(user, role);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to remove role", errors);
                }

                _logger.LogInformation($"Role '{role}' removed from user '{user.Email}'");
                return Ok(new { message = $"Role '{role}' removed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error removing role from user {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Lock user account - Admin only
        /// </summary>
        [HttpPost("{id}/lock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> LockUser(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(1));
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to lock user", errors);
                }

                _logger.LogWarning($"User '{user.Email}' locked by admin");
                return Ok(new { message = "User locked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error locking user {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Unlock user account - Admin only
        /// </summary>
        [HttpPost("{id}/unlock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnlockUser(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ValidationException("User ID cannot be empty");

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    throw new NotFoundException($"User with ID '{id}' not found");

                var result = await _userManager.SetLockoutEndDateAsync(user, null);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
                    throw new ValidationException("Failed to unlock user", errors);
                }

                _logger.LogWarning($"User '{user.Email}' unlocked by admin");
                return Ok(new { message = "User unlocked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error unlocking user {id}: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Get dashboard statistics - Admin only
        /// </summary>
        [HttpGet("admin/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var totalUsers = await _userManager.Users.CountAsync();
                var totalRoles = await _roleManager.Roles.CountAsync();
                var lockedUsers = await _userManager.Users
                    .Where(u => u.LockoutEnd != null && u.LockoutEnd > DateTimeOffset.UtcNow)
                    .CountAsync();

                var stats = new
                {
                    totalUsers,
                    totalRoles,
                    lockedUsers,
                    activeUsers = totalUsers - lockedUsers
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving stats: {ex.Message}");
                throw new InternalServerException("Failed to retrieve statistics");
            }
        }
    }
}



