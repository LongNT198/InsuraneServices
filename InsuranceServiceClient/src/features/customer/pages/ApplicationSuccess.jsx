import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { CheckCircle, Home, FileText } from 'lucide-react';

export default function ApplicationSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="border-green-200">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-700">
              Application Submitted Successfully!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Application ID */}
            {applicationId && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Your Application ID</p>
                <p className="text-2xl font-bold text-green-700 font-mono">
                  #{applicationId}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please save this reference number for your records
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What Happens Next?</h3>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Application Review</p>
                    <p className="text-sm text-gray-600">
                      Our underwriting team will review your application within 2-3 business days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Email Notification</p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email about your application status and any additional requirements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Payment & Activation</p>
                    <p className="text-sm text-gray-600">
                      Once approved, complete the payment to activate your policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Need help?</strong> Contact our customer service at{' '}
                <a href="tel:1800-INSURANCE" className="text-blue-600 hover:underline">
                  1800-INSURANCE
                </a>{' '}
                or email{' '}
                <a href="mailto:support@insurance.com" className="text-blue-600 hover:underline">
                  support@insurance.com
                </a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/policies')}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                View My Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

