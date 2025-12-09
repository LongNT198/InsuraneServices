import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Label } from '../../../../shared/components/ui/label';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ReviewSubmitStep({ data, onChange, onSubmit, onPrevious }) {
  const [termsAccepted, setTermsAccepted] = useState(data.termsAccepted || false);
  const [declarationAccepted, setDeclarationAccepted] = useState(data.declarationAccepted || false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!termsAccepted || !declarationAccepted) {
      const errorMsg = 'Please accept all terms and declarations';
      setError(errorMsg);
      toast.error('Acceptance Required', {
        description: errorMsg,
        duration: 4000,
      });
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      // Merge terms with all application data
      const completeData = {
        ...data,
        termsAccepted,
        declarationAccepted
      };
      
      console.log('📋 Complete application data before submit:', completeData);
      
      // Pass complete data to parent
      onChange({ termsAccepted, declarationAccepted });
      
      toast.loading('Submitting Application', {
        description: 'Please wait while we process your application...',
        id: 'submit-application',
      });
      
      await onSubmit(completeData);
      
      toast.success('Application Submitted Successfully!', {
        description: 'You will receive an email confirmation shortly.',
        duration: 5000,
        id: 'submit-application',
      });
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit application';
      setError(errorMsg);
      
      toast.error('Submission Failed', {
        description: errorMsg,
        duration: 5000,
        id: 'submit-application',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Application</CardTitle>
          <CardDescription>
            Please review all information before submitting your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Summary */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Product Selection</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-600">Coverage Amount:</span> <span className="font-medium">${parseFloat(data.coverageAmount).toLocaleString()}</span></div>
              <div><span className="text-gray-600">Term:</span> <span className="font-medium">{data.termYears} years</span></div>
              <div><span className="text-gray-600">Payment Frequency:</span> <span className="font-medium">{data.paymentFrequency}</span></div>
              <div><span className="text-gray-600">Payment Method:</span> <span className="font-medium">{data.paymentMethod || 'Bank Transfer'}</span></div>
              <div className="md:col-span-2"><span className="text-gray-600">Premium:</span> <span className="font-medium text-green-600 text-lg">${parseFloat(data.premiumAmount || 0).toFixed(2)}</span></div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Personal Information</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Name:</span> {data.applicant.firstName} {data.applicant.lastName}</p>
              <p><span className="text-gray-600">Email:</span> {data.applicant.email}</p>
              <p><span className="text-gray-600">Phone:</span> {data.applicant.phone}</p>
              <p><span className="text-gray-600">Date of Birth:</span> {data.applicant.dateOfBirth}</p>
              {data.applicant.emergencyContactName && (
                <div className="mt-3 pt-3 border-t">
                  <p className="font-medium text-gray-700">🚨 Emergency Contact</p>
                  <p><span className="text-gray-600">Name:</span> {data.applicant.emergencyContactName}</p>
                  <p><span className="text-gray-600">Relationship:</span> {data.applicant.emergencyContactRelationship}</p>
                  <p><span className="text-gray-600">Phone:</span> {data.applicant.emergencyContactPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Beneficiaries */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Beneficiaries</h3>
            {data.beneficiaries.map((b, i) => (
              <div key={b.id} className="text-sm mb-2 pb-2 border-b last:border-0">
                <p className="font-medium">{b.type} - {b.fullName} ({b.relationship}) - {b.percentage}%</p>
                {b.email && <p className="text-xs text-gray-600">Email: {b.email}</p>}
                {b.phone && <p className="text-xs text-gray-600">Phone: {b.phone}</p>}
                {b.dateOfBirth && <p className="text-xs text-gray-600">DOB: {b.dateOfBirth}</p>}
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Terms and Declarations */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
              />
              <Label htmlFor="terms" className="font-normal text-sm leading-relaxed">
                I have read and agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="declaration"
                checked={declarationAccepted}
                onCheckedChange={setDeclarationAccepted}
              />
              <Label htmlFor="declaration" className="font-normal text-sm leading-relaxed">
                I hereby declare that all information provided is true and accurate to the best of my knowledge. I understand that any misrepresentation may result in policy cancellation or claim denial.
              </Label>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your application will be reviewed within 2-3 business days</li>
                  <li>You'll receive an email notification about the status</li>
                  <li>If approved, you'll proceed to payment</li>
                  <li>Once payment is confirmed, your policy will be activated</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline" size="lg" disabled={submitting}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Document 
        </Button>
        <Button onClick={handleSubmit} size="lg" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Application'}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}


