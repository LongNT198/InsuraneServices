import { jwtDecode } from 'jwt-decode';

// Profile cache configuration
const PROFILE_CACHE_KEY = 'profile_cache';
const PROFILE_CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Get token from either localStorage or sessionStorage
 * @returns {string|null} Access token or null
 */
const getToken = () => {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
};

/**
 * Get storage type based on where token is stored
 * @returns {Storage} localStorage or sessionStorage
 */
const getActiveStorage = () => {
  return localStorage.getItem('accessToken') ? localStorage : sessionStorage;
};

/**
 * Decode JWT token and extract minimal user information
 * @param {string} token - JWT access token
 * @returns {object|null} Minimal user object from JWT or null if token is invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    
    // Extract only minimal JWT claims (immutable data)
    return {
      id: decoded.sub,
      email: decoded.email,
      roles: extractRoles(decoded),
      exp: decoded.exp,
      iat: decoded.iat,
    };
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Extract roles from JWT claims
 * @param {object} decoded - Decoded JWT payload
 * @returns {array} Array of role strings
 */
const extractRoles = (decoded) => {
  // Role claim can be a single string or array
  const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
  if (!roleClaim) return [];
  if (Array.isArray(roleClaim)) return roleClaim;
  return [roleClaim];
};

/**
 * Check if token is expired
 * @param {string} token - JWT access token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get minimal user data from stored access token
 * Checks both localStorage and sessionStorage
 * @returns {object|null} Minimal user object from JWT or null
 */
export const getUserFromToken = () => {
  const token = getToken();
  return decodeToken(token);
};

/**
 * Check if user is authenticated (has valid token)
 * Checks both localStorage and sessionStorage
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

/**
 * Cache profile data (name, avatar, etc.) with expiry
 * Stores in the same storage as the access token
 * @param {object} profile - Profile data to cache
 */
export const cacheProfile = (profile) => {
  const storage = getActiveStorage();
  const cacheData = {
    data: profile,
    timestamp: Date.now(),
  };
  storage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
};

/**
 * Get cached profile data if not expired
 * Checks both localStorage and sessionStorage
 * @returns {object|null} Cached profile or null if expired/not found
 */
export const getCachedProfile = () => {
  try {
    // Check active storage first
    const storage = getActiveStorage();
    let cached = storage.getItem(PROFILE_CACHE_KEY);
    
    // If not found, check the other storage
    if (!cached) {
      const otherStorage = storage === localStorage ? sessionStorage : localStorage;
      cached = otherStorage.getItem(PROFILE_CACHE_KEY);
    }
    
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    // Return cached data if not expired (30 minutes)
    if (age < PROFILE_CACHE_EXPIRY) {
      return data;
    }
    
    // Cache expired, remove it
    clearProfileCache();
    return null;
  } catch (error) {
    console.error('Failed to get cached profile:', error);
    return null;
  }
};

/**
 * Clear profile cache from both storages
 */
export const clearProfileCache = () => {
  localStorage.removeItem(PROFILE_CACHE_KEY);
  sessionStorage.removeItem(PROFILE_CACHE_KEY);
};

/**
 * Update specific fields in cached profile (e.g., avatar)
 * @param {object} updates - Fields to update
 */
export const updateCachedProfile = (updates) => {
  const cached = getCachedProfile();
  if (cached) {
    cacheProfile({ ...cached, ...updates });
  }
};

