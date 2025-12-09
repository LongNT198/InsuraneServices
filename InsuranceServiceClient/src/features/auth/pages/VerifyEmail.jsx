import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authService } from '../../shared/api/services/authService';
import { useAuth } from '../../../core/contexts/AuthContext';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, expired
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthFromTokens } = useAuth();

  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const email = searchParams.get('email'); // For resend functionality

  useEffect(() => {
    if (!token || !userId) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    verifyEmail();
  }, [token, userId]);

  const verifyEmail = async () => {
    try {
      setStatus('verifying');
      const response = await authService.verifyEmail(userId, token);
      
      if (response.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Auto-login if tokens are provided
        if (response.accessToken && response.refreshToken) {
          // Save tokens and user info
          setAuthFromTokens(response.accessToken, response.refreshToken, response.user);
          
          // Check if profile is complete
          try {
            const profileResponse = await fetch('/api/profile', {
              headers: {
                'Authorization': `Bearer ${response.accessToken}`
              }
            });
            
            if (profileResponse.ok) {
              const profile = await profileResponse.json();
              
              // Check if profile needs completion
              if (!profile.name || !profile.dateOfBirth) {
                // Restore product selection from localStorage
                const pendingSelection = localStorage.getItem('pendingProductSelection');
                let applyUrl = '/apply-life';
                
                if (pendingSelection) {
                  try {
                    const selection = JSON.parse(pendingSelection);
                    const params = new URLSearchParams();
                    
                    if (selection.productId) params.append('productId', selection.productId);
                    if (selection.planId) params.append('planId', selection.planId);
                    if (selection.paymentFrequency) params.append('paymentFrequency', selection.paymentFrequency);
                    
                    applyUrl = `/apply-life?${params.toString()}`;
                    
                    // Clear after use
                    localStorage.removeItem('pendingProductSelection');
                  } catch (e) {
                    console.error('Failed to parse pending selection:', e);
                  }
                }
                
                setTimeout(() => {
                  navigate(applyUrl, {
                    state: {
                      message: 'Please complete your profile to continue.'
                    }
                  });
                }, 2000);
              } else {
                // Profile complete, check for pending product selection
                const pendingSelection = localStorage.getItem('pendingProductSelection');
                
                if (pendingSelection) {
                  try {
                    const selection = JSON.parse(pendingSelection);
                    const params = new URLSearchParams();
                    
                    if (selection.productId) params.append('productId', selection.productId);
                    if (selection.planId) params.append('planId', selection.planId);
                    if (selection.paymentFrequency) params.append('paymentFrequency', selection.paymentFrequency);
                    
                    const applyUrl = `/apply-life?${params.toString()}`;
                    
                    localStorage.removeItem('pendingProductSelection');
                    
                    setTimeout(() => {
                      navigate(applyUrl);
                    }, 2000);
                    return;
                  } catch (e) {
                    console.error('Failed to parse pending selection:', e);
                  }
                }
                
                // No pending selection, go to dashboard
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              }
            } else {
              // Profile API error, restore product selection if available
              const pendingSelection = localStorage.getItem('pendingProductSelection');
              let applyUrl = '/apply-life';
              
              if (pendingSelection) {
                try {
                  const selection = JSON.parse(pendingSelection);
                  const params = new URLSearchParams();
                  
                  if (selection.productId) params.append('productId', selection.productId);
                  if (selection.planId) params.append('planId', selection.planId);
                  if (selection.paymentFrequency) params.append('paymentFrequency', selection.paymentFrequency);
                  
                  applyUrl = `/apply-life?${params.toString()}`;
                  localStorage.removeItem('pendingProductSelection');
                } catch (e) {
                  console.error('Failed to parse pending selection:', e);
                }
              }
              
              setTimeout(() => {
                navigate(applyUrl);
              }, 2000);
            }
          } catch (error) {
            console.error('Profile check error:', error);
            // Fallback to dashboard
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }
        } else {
          // Old API response without auto-login
          setTimeout(() => {
            navigate('/login', { 
              state: { message: 'Email verified! Please login to continue.' }
            });
          }, 3000);
        }
      } else {
        setStatus('error');
        setMessage(response.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error.response?.data?.message?.includes('expired')) {
        setStatus('expired');
        setMessage('This verification link has expired. Please request a new one.');
      } else {
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred during verification.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await authService.resendVerificationEmail(email);
      if (response.success) {
        setMessage('A new verification email has been sent. Please check your inbox.');
      }
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verifying your email...</h3>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <Alert className="bg-green-50 border-green-200 mb-4">
              <AlertDescription className="text-green-800">
                Logging you in and redirecting...
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard Now
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-yellow-600 mb-2">Link Expired</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              onClick={handleResendVerification}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification}
                disabled={loading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            Confirm your email address to activate your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}



