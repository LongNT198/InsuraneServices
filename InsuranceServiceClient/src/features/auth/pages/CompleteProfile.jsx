import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { User, Phone, Calendar, MapPin, CheckCircle, Info } from 'lucide-react';
import axios from '../../shared/api/axios';

export function CompleteProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get message and redirect URL from navigation state
  const infoMessage = location.state?.message;
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login', { state: { message: 'Please login first' } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/complete-profile', {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth || null,
        address: formData.address || null,
      });

      if (response.success) {
        setSuccess(true);
        
        // Redirect based on next step
        setTimeout(() => {
          if (response.requiresPhoneVerification) {
            navigate('/verify-phone', { 
              state: { from: location.state?.from } 
            });
          } else {
            // Redirect to intended page or dashboard
            navigate(redirectTo, { replace: true });
          }
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile. Please try again.');
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
            <CardTitle className="text-green-600">Profile Completed!</CardTitle>
            <CardDescription>
              {formData.phoneNumber 
                ? 'Next: Verify your phone number' 
                : 'You can now access all services'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center">
              Redirecting...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <User className="size-12 text-blue-600" />
          </div>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Step 2: Add your personal information
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {infoMessage && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{infoMessage}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0987654321 or +84987654321"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="pl-10"
                  autoComplete="tel"
                />
              </div>
              <p className="text-xs text-gray-500">
                Optional: You'll need to verify via SMS if provided
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="pl-10"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10"
                  autoComplete="street-address"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Why we need this information:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Required for insurance policy creation</li>
                <li>Used for KYC (Know Your Customer) verification</li>
                <li>Phone verification ensures account security</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Skip for Now
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



