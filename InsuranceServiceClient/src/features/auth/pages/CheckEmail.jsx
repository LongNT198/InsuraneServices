import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../shared/api/services/authService';

export function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const email = location.state?.email || '';

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Email address not found. Please register again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await authService.resendVerificationEmail(email);
      if (response.success) {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium text-blue-900">
                  📧 Verification email sent to:
                </p>
                <p className="text-blue-700 font-semibold break-all">
                  {email || 'your email address'}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Click the verification link in the email</p>
                <p className="text-gray-600">Check your inbox and spam folder</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Verify your email address</p>
                <p className="text-gray-600">Click the link to confirm your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Login to your account</p>
                <p className="text-gray-600">After verification, you can login</p>
              </div>
            </div>
          </div>

          {message && (
            <Alert className={message.includes('sent') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              <AlertDescription className={message.includes('sent') ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleResendEmail}
              disabled={loading || !email}
              variant="outline"
              className="w-full"
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
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Didn't receive the email?{' '}
              <button
                onClick={handleResendEmail}
                disabled={loading || !email}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline disabled:opacity-50"
              >
                Click here to resend
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



