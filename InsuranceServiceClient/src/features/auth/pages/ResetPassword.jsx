import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../../shared/api/services';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    // Get email and token from URL
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam && tokenParam) {
      setEmail(decodeURIComponent(emailParam));
      setToken(decodeURIComponent(tokenParam));
      
      // Validate token
      validateToken(decodeURIComponent(emailParam), decodeURIComponent(tokenParam));
    } else {
      setError('Invalid password reset link. Please request a new one.');
      setValidating(false);
    }
  }, [searchParams]);

  const validateToken = async (email, token) => {
    try {
      await authService.validateResetToken(email, token);
      setTokenValid(true);
    } catch (err) {
      setTokenValid(false);
      
      if (err.message?.includes('expired')) {
        setError('This link has expired. Please request a new password reset link.');
      } else {
        setError('Invalid or already used reset link.');
      }
    } finally {
      setValidating(false);
    }
  };

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid()) {
      setError('Password does not meet the requirements below.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        token,
        newPassword,
        confirmPassword,
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successfully. Please login with your new password.' }
        });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (validating) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="py-10 text-center">
            <Loader2 className="size-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-medium">Validating reset link...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="size-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-700">Password Reset Successful!</CardTitle>
            <CardDescription className="text-base text-gray-600">
              You can now login with your new password
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                ?? Your password has been changed successfully
              </p>
              <p className="text-xs text-gray-600">
                Redirecting to login page...
              </p>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Login Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="size-16 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-700">Invalid Link</CardTitle>
            <CardDescription className="text-base text-gray-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="mb-2">?? This could happen if:</p>
              <ul className="text-xs space-y-1 text-left ml-4">
                <li>� The link has expired (24 hours)</li>
                <li>� The link was already used</li>
                <li>� The link is invalid or corrupted</li>
              </ul>
            </div>
            <Button
              onClick={() => navigate('/forgot-password')}
              className="w-full"
            >
              Request New Reset Link
            </Button>
            <Link 
              to="/login" 
              className="block text-sm text-blue-600 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-blue-100 p-3">
              <Shield className="size-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-base">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                ?? Password Requirements:
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center gap-2 text-sm transition-colors ${passwordStrength.hasMinLength ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${passwordStrength.hasMinLength ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}">
                    {passwordStrength.hasMinLength ? '?' : '?'}
                  </span>
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 text-sm transition-colors ${passwordStrength.hasUpperCase ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${passwordStrength.hasUpperCase ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}">
                    {passwordStrength.hasUpperCase ? '?' : '?'}
                  </span>
                  One uppercase letter (A-Z)
                </li>
                <li className={`flex items-center gap-2 text-sm transition-colors ${passwordStrength.hasLowerCase ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${passwordStrength.hasLowerCase ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}">
                    {passwordStrength.hasLowerCase ? '?' : '?'}
                  </span>
                  One lowercase letter (a-z)
                </li>
                <li className={`flex items-center gap-2 text-sm transition-colors ${passwordStrength.hasNumber ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${passwordStrength.hasNumber ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}">
                    {passwordStrength.hasNumber ? '?' : '?'}
                  </span>
                  One number (0-9)
                </li>
                <li className={`flex items-center gap-2 text-sm transition-colors ${passwordStrength.hasSpecialChar ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${passwordStrength.hasSpecialChar ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}">
                    {passwordStrength.hasSpecialChar ? '?' : '?'}
                  </span>
                  One special character (!@#$%...)
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={loading || !isPasswordValid() || newPassword !== confirmPassword}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </Button>
            <Link 
              to="/login" 
              className="text-sm text-gray-600 hover:text-blue-600 hover:underline text-center font-medium"
            >
              Back to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



