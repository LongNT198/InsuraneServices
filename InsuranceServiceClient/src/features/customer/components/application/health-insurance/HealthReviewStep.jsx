import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Label } from '../../../../shared/components/ui/label';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { CheckCircle, User, Shield, Heart, Users, FileText, ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react';

export default function HealthReviewStep({ data, onBack, onSubmit }) {
  const [termsAccepted, setTermsAccepted] = useState(data?.termsAccepted || false);
  const [declarationAccepted, setDeclarationAccepted] = useState(data?.declarationAccepted || false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    if (!declarationAccepted) {
      newErrors.declaration = 'You must accept the declaration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...data,
        termsAccepted,
        declarationAccepted,
        submittedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitting(false);
    }
  };

  const { personalInfo, productSelection, medicalInfo, nominees, documents } = data;

  // Calculate summary statistics
  const hasPreExistingConditions = Object.values(medicalInfo?.preExistingConditions || {}).some(c => c.has);
  const uploadedDocsCount = Object.keys(documents || {}).length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Review Your Application</h2>
              <p className="text-gray-600">Please review all information before submitting</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">
                {personalInfo?.firstName} {personalInfo?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">{personalInfo?.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{personalInfo?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{personalInfo?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium">{personalInfo?.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupation</p>
              <p className="font-medium">{personalInfo?.occupation}</p>
            </div>
          </div>
          
          {personalInfo?.emergencyContact && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm font-semibold mb-2">Emergency Contact</p>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{personalInfo.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Relationship</p>
                  <p className="font-medium">{personalInfo.emergencyContact.relationship}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{personalInfo.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">
              {personalInfo?.address}, {personalInfo?.city}, {personalInfo?.state} - {personalInfo?.zipCode}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Selected Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan Type</p>
              <p className="font-medium capitalize">{productSelection?.planType?.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sum Insured</p>
              <p className="font-medium">₹{parseInt(productSelection?.sumInsured || 0).toLocaleString('en-IN')}</p>
            </div>
            {productSelection?.planType !== 'individual' && (
              <div>
                <p className="text-sm text-gray-600">Number of Members</p>
                <p className="font-medium">{productSelection?.numberOfMembers}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Annual Premium</p>
              <p className="font-medium text-lg text-blue-600">₹{productSelection?.premium?.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {productSelection?.members && productSelection.members.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm font-semibold mb-2">Covered Members</p>
              <div className="space-y-2">
                {productSelection.members.map((member, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{member.name}</span>
                    <span className="text-gray-600">{member.relationship} • {member.age} years</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Information Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Health Status</p>
              <p className="font-medium">{medicalInfo?.currentHealth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recent Hospitalization</p>
              <p className="font-medium">{medicalInfo?.recentHospitalization ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pre-existing Conditions</p>
              <p className="font-medium">{hasPreExistingConditions ? 'Yes' : 'None'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <p className="font-medium">{medicalInfo?.lifestyle?.bmi || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Smoking</p>
              <p className="font-medium">{medicalInfo?.lifestyle?.smoking}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Alcohol Consumption</p>
              <p className="font-medium">{medicalInfo?.lifestyle?.alcohol}</p>
            </div>
          </div>

          {hasPreExistingConditions && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                Declared Pre-existing Conditions
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(medicalInfo?.preExistingConditions || {}).map(([condition, details]) => {
                  if (details.has) {
                    return (
                      <li key={condition} className="capitalize">
                        {condition.replace(/([A-Z])/g, ' $1').trim()}
                        {details.controlled && ` - ${details.controlled}`}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nominees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Nominees ({nominees?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nominees?.map((nominee, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{nominee.name}</p>
                    <p className="text-sm text-gray-600">
                      {nominee.relationship} • Age: {new Date().getFullYear() - new Date(nominee.dateOfBirth).getFullYear()} years
                    </p>
                    {nominee.hasPreExistingCondition && (
                      <p className="text-xs text-yellow-600 mt-1">Has pre-existing conditions</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{nominee.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Documents ({uploadedDocsCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(documents || {}).map(([docType, doc]) => (
              <div key={docType} className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{docType.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-600">{doc.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms and Declaration */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
              />
              <div className="space-y-1">
                <Label htmlFor="terms" className="cursor-pointer font-medium">
                  I accept the Terms and Conditions *
                </Label>
                <p className="text-sm text-gray-600">
                  I have read and agree to the terms and conditions, privacy policy, and premium payment terms of this health insurance policy.
                </p>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="declaration"
                checked={declarationAccepted}
                onCheckedChange={setDeclarationAccepted}
              />
              <div className="space-y-1">
                <Label htmlFor="declaration" className="cursor-pointer font-medium">
                  Declaration *
                </Label>
                <p className="text-sm text-gray-600">
                  I hereby declare that all the information provided in this application is true, complete, and accurate to the best of my knowledge. 
                  I understand that any false information or misrepresentation may result in the rejection of claims or cancellation of the policy. 
                  I authorize the insurance company to verify the information and medical records as required.
                </p>
                {errors.declaration && (
                  <p className="text-sm text-red-600">{errors.declaration}</p>
                )}
              </div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Important:</strong> Once submitted, your application will be reviewed by our underwriting team. 
              You will receive a confirmation email within 24-48 hours. Additional medical tests may be required based on your application.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
