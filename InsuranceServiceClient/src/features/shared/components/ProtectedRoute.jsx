import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the full URL they were trying to access (including query params)
    const fullPath = `${location.pathname}${location.search}`;
    const redirectUrl = encodeURIComponent(fullPath);
    
    // IMPORTANT: If this is a Life Insurance application with URL params, save to localStorage
    // This ensures params survive email verification and registration flow
    // Only save base plan selection (productId, planId, frequency) - NOT premium
    // Premium will be recalculated based on user's actual age in Step 3
    if (location.pathname === '/apply-life' && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const productId = searchParams.get('productId');
      const planId = searchParams.get('planId');
      const frequency = searchParams.get('frequency');
      
      if (productId || planId) {
        const quoteData = {
          productId,
          planId,
          paymentFrequency: frequency,
          timestamp: Date.now()
        };
        localStorage.setItem('lifeInsuranceQuote', JSON.stringify(quoteData));
        console.log('💾 ProtectedRoute: Saved base quote params to localStorage (without premium)', quoteData);
      }
    }
    
    console.log('🔒 ProtectedRoute: User not authenticated, redirecting to login', {
      originalPath: location.pathname,
      originalSearch: location.search,
      fullPath,
      encodedRedirect: redirectUrl
    });
    
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  return <>{children}</>;
}


