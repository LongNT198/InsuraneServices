import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Shield, Mail, CheckCircle } from 'lucide-react';
import { PasswordStrength } from '../../shared/components/PasswordStrength';
import { Checkbox } from '../../shared/components/ui/checkbox';

export function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Capture and save product selection to localStorage
  useEffect(() => {
    const productId = searchParams.get('productId');
    const planId = searchParams.get('planId');
    const paymentFrequency = searchParams.get('paymentFrequency') || searchParams.get('frequency');
    
    if (productId) {
      const productSelection = {
        productId,
        planId: planId || null,
        paymentFrequency: paymentFrequency || null,
        timestamp: Date.now()
      };
      
      localStorage.setItem('pendingProductSelection', JSON.stringify(productSelection));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.acceptedTerms) {
      setError('You must accept the Terms & Conditions to continue');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Strong password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      setError('Password must contain at least one special character');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      if (result.success) {
        setSuccess(true);
        setError('');
        
        // Redirect to check-email page, preserving redirect URL
        setTimeout(() => {
          navigate('/check-email', { 
            state: { 
              email: formData.email,
              redirectUrl: redirectUrl // Preserve redirect URL for after email verification
            } 
          });
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="size-16 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Registration Successful!</CardTitle>
            <CardDescription>Please check your email to verify your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="size-4" />
              <AlertDescription>
                We've sent a verification email to <strong>{formData.email}</strong>.
                Please check your inbox and verify your account.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600 text-center">
              Redirecting to instructions page...
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="size-12 text-blue-600" />
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Step 1: Register with email and password
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <p className="text-xs text-gray-500">
                You'll receive a verification email at this address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <PasswordStrength password={formData.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Next steps after registration:</strong>
              </p>
              <ol className="text-xs text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Verify your email address</li>
                <li>Login to your account</li>
                <li>Complete your profile (name, phone, etc.)</li>
                <li>Verify phone number via SMS</li>
                <li>Start using insurance services</li>
              </ol>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 border-t pt-4">
              <Checkbox
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptedTerms: checked })}
                required
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="acceptedTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I accept the Terms & Conditions and Privacy Policy
                </label>
                <p className="text-xs text-gray-500">
                  By registering, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline" target="_blank">
                    Privacy Policy
                  </Link>
                  . We'll store your data securely in accordance with GDPR regulations.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading || !formData.acceptedTerms}>
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}





