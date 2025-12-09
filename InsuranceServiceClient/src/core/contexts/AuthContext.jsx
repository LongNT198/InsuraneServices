import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../features/shared/api/services';
import { 
  getUserFromToken, 
  isAuthenticated as checkTokenValid,
  getCachedProfile,
  cacheProfile,
  clearProfileCache,
  updateCachedProfile
} from '../../features/shared/utils/jwt';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get token from both storages
  const getToken = () => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  };

  // Restore user from JWT token + cached profile when app starts
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        
        if (token) {
          // Get minimal data from JWT
          const userFromToken = getUserFromToken();
          
          if (userFromToken) {
            // Try to get cached profile first
            const cachedProfile = getCachedProfile();
            
            if (cachedProfile) {
              // Use cached profile (name, avatar)
              setUser({ ...userFromToken, ...cachedProfile });
            } else {
              // Cache expired or not found, fetch fresh profile
              try {
                const profile = await authService.getCurrentUser();
                const fullUser = {
                  ...userFromToken,
                  name: profile.name,
                  avatar: profile.avatar,
                };
                setUser(fullUser);
                cacheProfile({ name: profile.name, avatar: profile.avatar });
              } catch (error) {
                // API failed (like 401), use JWT data onl
                setUser(userFromToken);
              }
            }
          } else {
            // Token invalid or expired, clear auth
            logout();
          }
        } 
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      // Sau khi đăng ký thành công, có thể tự động login
      if (response.user) {
        setUser(response.user);
      }
      
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Display user-friendly error
      const errorMessage = error.data?.message 
        || error.message 
        || (error.errors && Object.values(error.errors).flat().join(', '))
        || 'Registration failed. Please try again.';
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true)
      
      const response = await authService.login(credentials);
      
      // Wait a bit for token to be saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get minimal data from JWT
      const userFromToken = getUserFromToken();
      
      if (userFromToken) {
        
        // Set user from JWT first (quick)
        setUser(userFromToken);
        
        // Then fetch full profile in background (optional)
        try {
          const profile = await authService.getCurrentUser();
          const fullUser = {
            ...userFromToken,
            name: profile.name,
            avatar: profile.avatar,
          };
          setUser(fullUser);
          
          // Cache profile data (30 min expiry)
          cacheProfile({ name: profile.name, avatar: profile.avatar });
        } catch (profileError) {
          // If profile fetch fails (like 401), keep using JWT data
          console.warn('⚠️ Failed to fetch profile, using JWT data only:', profileError);
          // Don't fail login just because profile fetch failed
        }
      } else {
        console.error('❌ Failed to decode JWT token');
        // Still set basic user data to avoid redirect loop
        setUser({ email: credentials.email });
      }
      
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Set auth from already-obtained tokens (e.g., after email verification)
  const setAuthFromTokens = (accessToken, refreshToken, userData) => {
    try {
      // Save tokens to localStorage by default
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Set user data
      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        phoneNumber: userData.phoneNumber
      });
    } catch (error) {
      console.error('❌ Error setting auth from tokens:', error);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('⚠️ Logout error:', error);
    } finally {
      setUser(null);
      clearProfileCache();
    }
  };

  const updateUser = (updatedData) => {
    // Update user state with new data (e.g., after avatar upload)
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
    
    // Update cache with new data
    updateCachedProfile(updatedData);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    setAuthFromTokens,
    isAuthenticated: checkTokenValid(),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

