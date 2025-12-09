import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../shared/api/services';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      console.log('Forgot password response:', response);
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      
      // Handle rate limit errors
      if (err.status === 429 || err.message?.includes('Rate limit')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="size-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Email Sent!</CardTitle>
            <CardDescription className="text-base">
              Please check your inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Mail className="size-5 text-blue-600" />
                </div>
                <p className="font-medium text-gray-900">
                  We've sent a password reset link to:
                </p>
              </div>
              <p className="font-semibold text-blue-600 text-center text-lg">{email}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">??</span>
                <span>Check your <strong>Spam/Junk</strong> folder if you don't see the email</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">?</span>
                <span>The link will expire in <strong>24 hours</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">??</span>
                <span>The link can only be used <strong>once</strong></span>
              </p>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600 text-center mb-3">
                Didn't receive the email?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
              >
                Resend Email
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="size-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-blue-100 p-3">
              <Shield className="size-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription className="text-base">
            Enter your email to receive a password reset link
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
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="h-11"
              />
              <p className="text-xs text-gray-500">
                Enter the email address associated with your account
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <p className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <span>??</span> Important:
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Maximum <strong>3 requests per 10 minutes</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Your email must be <strong>verified</strong></span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">?</span>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Send Reset Link
                </span>
              )}
            </Button>
            
            <Link 
              to="/login" 
              className="text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center gap-2 justify-center font-medium"
            >
              <ArrowLeft className="size-4" />
              Back to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



