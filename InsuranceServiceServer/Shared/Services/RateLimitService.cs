using Microsoft.Extensions.Caching.Memory;

namespace InsuranceServiceServer.Shared.Services
{
    public interface IRateLimitService
    {
        bool IsRateLimited(string key, int maxAttempts, TimeSpan duration);
        void RecordAttempt(string key, TimeSpan duration);
        int GetRemainingAttempts(string key, int maxAttempts);
        TimeSpan? GetRetryAfter(string key);
    }

    public class RateLimitService : IRateLimitService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<RateLimitService> _logger;

        public RateLimitService(IMemoryCache cache, ILogger<RateLimitService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public bool IsRateLimited(string key, int maxAttempts, TimeSpan duration)
        {
            var cacheKey = $"rate_limit_{key}";
            
            if (_cache.TryGetValue(cacheKey, out RateLimitData? data))
            {
                if (data != null && data.Attempts >= maxAttempts)
                {
                    _logger.LogWarning($"Rate limit exceeded for key: {key}. Attempts: {data.Attempts}/{maxAttempts}");
                    return true;
                }
            }

            return false;
        }

        public void RecordAttempt(string key, TimeSpan duration)
        {
            var cacheKey = $"rate_limit_{key}";
            
            if (_cache.TryGetValue(cacheKey, out RateLimitData? data))
            {
                if (data != null)
                {
                    data.Attempts++;
                    data.LastAttempt = DateTime.UtcNow;
                    _cache.Set(cacheKey, data, duration);
                }
            }
            else
            {
                var newData = new RateLimitData
                {
                    Attempts = 1,
                    FirstAttempt = DateTime.UtcNow,
                    LastAttempt = DateTime.UtcNow
                };
                _cache.Set(cacheKey, newData, duration);
            }

            _logger.LogInformation($"Rate limit attempt recorded for key: {key}");
        }

        public int GetRemainingAttempts(string key, int maxAttempts)
        {
            var cacheKey = $"rate_limit_{key}";
            
            if (_cache.TryGetValue(cacheKey, out RateLimitData? data))
            {
                if (data != null)
                {
                    return Math.Max(0, maxAttempts - data.Attempts);
                }
            }

            return maxAttempts;
        }

        public TimeSpan? GetRetryAfter(string key)
        {
            var cacheKey = $"rate_limit_{key}";
            
            if (_cache.TryGetValue(cacheKey, out RateLimitData? data))
            {
                if (data != null)
                {
                    // Estimate based on when the first attempt will expire
                    // Assumes a standard duration (e.g., 10 minutes)
                    var elapsed = DateTime.UtcNow - data.FirstAttempt;
                    var standardDuration = TimeSpan.FromMinutes(10);
                    var remaining = standardDuration - elapsed;
                    
                    return remaining > TimeSpan.Zero ? remaining : TimeSpan.Zero;
                }
            }

            return null;
        }

        private class RateLimitData
        {
            public int Attempts { get; set; }
            public DateTime FirstAttempt { get; set; }
            public DateTime LastAttempt { get; set; }
        }
    }
}



