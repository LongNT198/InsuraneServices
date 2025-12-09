import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Phone, CheckCircle, RefreshCw } from 'lucide-react';
import axios from '../../shared/api/axios';

export function VerifyPhone() {
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login', { state: { message: 'Please login first' } });
    }
  }, [navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/phone/send-otp', {
        phoneNumber,
      });

      if (response.success) {
        setSuccess(`OTP sent to ${response.phoneNumber}`);
        setStep('verify');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err) {
      setError(err.response?.data?.errors?.phone?.[0] || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/phone/verify-otp', {
        phoneNumber,
        otp,
      });

      if (response.success) {
        setSuccess('Phone verified successfully!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.errors?.otp?.[0] || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/phone/resend-otp', {
        phoneNumber,
      });

      if (response.success) {
        setSuccess('OTP resent successfully');
        setCountdown(60);
        setCanResend(false);
        setOtp('');
      }
    } catch (err) {
      setError(err.response?.data?.errors?.phone?.[0] || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (success && step === 'verify' && otp.length === 6) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="size-16 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Phone Verified!</CardTitle>
            <CardDescription>You can now access all features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center">
              Redirecting to dashboard...
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
            <Phone className="size-12 text-blue-600" />
          </div>
          <CardTitle>Verify Phone Number</CardTitle>
          <CardDescription>
            {step === 'input' 
              ? 'Enter your phone number to receive OTP' 
              : 'Enter the 6-digit code sent to your phone'}
          </CardDescription>
        </CardHeader>

        {step === 'input' ? (
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0987654321 or +84987654321"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                />
                <p className="text-xs text-gray-500">
                  Vietnamese format: 0987654321 or +84987654321
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
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
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && !error && (
                <Alert>
                  <CheckCircle className="size-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setStep('input');
                    setOtp('');
                    setError('');
                  }}
                  className="p-0"
                >
                  Change number
                </Button>
                
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResend}
                    className="p-0"
                  >
                    <RefreshCw className="size-3 mr-1" />
                    Resend OTP
                  </Button>
                ) : (
                  <span className="text-gray-500">
                    Resend in {countdown}s
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
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
        )}
      </Card>
    </div>
  );
}



