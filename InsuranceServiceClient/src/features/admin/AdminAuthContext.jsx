import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../features/shared/api/services';
import { 
  getUserFromToken, 
  isAuthenticated as checkTokenValid 
} from '../../features/shared/utils/jwt';

const AdminAuthContext = createContext(undefined);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Admin access roles: Admin account, Officers, and Managers can access admin panel
  const ALLOWED_ROLES = ['Admin', 'Officer', 'Manager', 'Staff', 'Agent'];

  const getToken = () => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  };

  // Restore admin from JWT token when app starts
  useEffect(() => {
    const initAdminAuth = async () => {
      try {
        const token = getToken();
        
        if (token && checkTokenValid()) {
          const userFromToken = getUserFromToken();
          
          // Check if user has admin role - JWT returns roles as array
          if (userFromToken) {
            const userRoles = Array.isArray(userFromToken.roles) ? userFromToken.roles : [];
            const hasAdminAccess = userRoles.some(role => ALLOWED_ROLES.includes(role));
            
            if (hasAdminAccess) {
              try {
                const profile = await authService.getCurrentUser();
                setAdmin({
                  ...userFromToken,
                  role: userRoles[0],
                  name: profile.name,
                  avatar: profile.avatar,
                });
                console.log('✅ AdminAuthContext: Admin loaded');
              } catch (error) {
                console.error('Failed to load admin profile:', error);
                setAdmin({
                  ...userFromToken,
                  role: userRoles[0],
                });
              }
            } else {
              // User doesn't have admin role
              setAdmin(null);
            }
          }
        }
      } catch (error) {
        console.error('Admin auth init error:', error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    initAdminAuth();
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      // Get user from JWT token after login
      const userFromToken = getUserFromToken();
      
      if (!userFromToken) {
        throw new Error('Failed to get user information');
      }
      
      // Check role - JWT returns roles as array
      const userRoles = Array.isArray(userFromToken.roles) ? userFromToken.roles : [];
      const hasAdminAccess = userRoles.some(role => ALLOWED_ROLES.includes(role));
      
      if (!hasAdminAccess) {
        // Clear token if not admin
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        throw new Error('You do not have admin access');
      }

      // Get full profile
      try {
        const profile = await authService.getCurrentUser();
        const fullAdmin = {
          ...userFromToken,
          role: userRoles[0], // Primary role for compatibility
          name: profile.name,
          avatar: profile.avatar,
        };
        setAdmin(fullAdmin);
      } catch (error) {
        // If profile fetch fails, use token data
        console.warn('Failed to fetch admin profile, using token data');
        setAdmin({
          ...userFromToken,
          role: userRoles[0],
        });
      }
      
      return { user: { ...userFromToken, role: userRoles[0] } };
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const logoutAdmin = async () => {
    try {
      await authService.logout(); // Revoke refresh token on server
    } catch (error) {
      console.error('⚠️ Admin logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('refreshToken');
      setAdmin(null);
      navigate('/admin/login');
    }
  };

  const value = {
    admin,
    loading,
    isAdminAuthenticated: !!admin,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
