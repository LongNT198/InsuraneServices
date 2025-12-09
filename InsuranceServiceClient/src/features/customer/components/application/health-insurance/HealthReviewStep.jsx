import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Label } from '../../../../shared/components/ui/label';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { CheckCircle, User, Shield, Heart, FileText, ArrowLeft, Send, Loader2, AlertCircle, Activity, MapPin, Phone, Mail, Stethoscope } from 'lucide-react';

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

  const { applicant, productSelection, healthDeclaration, healthStatus, documents } = data;

  // Calculate summary statistics
  const uploadedDocsCount = Object.keys(documents || {}).filter(key => documents[key]).length;
  const hasMedicalConditions = healthDeclaration?.hasMedicalConditions || false;
  const hasChronicDiseases = healthDeclaration?.hasDiabetes || healthDeclaration?.hasHeartDisease || 
                             healthDeclaration?.hasHighBloodPressure || healthDeclaration?.hasCancer;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Your Health Insurance Application</h2>
              <p className="text-gray-600">Please carefully review all information before final submission</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
          <CardDescription>Applicant details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-900">
                {applicant?.firstName} {applicant?.lastName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {applicant?.dateOfBirth ? new Date(applicant.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-900 capitalize">{applicant?.gender}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">National ID</p>
              <p className="font-medium text-gray-900">{applicant?.nationalId || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Occupation</p>
              <p className="font-medium text-gray-900">{applicant?.occupation}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Annual Income</p>
              <p className="font-medium text-gray-900">
                {applicant?.annualIncome ? `₹${parseInt(applicant.annualIncome).toLocaleString('en-IN')}` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gray-400 mt-1" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{applicant?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{applicant?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div className="space-y-1 flex-1">
                <p className="text-sm text-gray-500">Residential Address</p>
                <p className="font-medium text-gray-900">
                  {applicant?.address}
                  {applicant?.city && `, ${applicant.city}`}
                  {applicant?.postalCode && ` - ${applicant.postalCode}`}
                </p>
              </div>
            </div>
          </div>
          
          {applicant?.emergencyContactName && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Emergency Contact
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-orange-700">Name</p>
                  <p className="font-medium text-orange-900">{applicant.emergencyContactName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-orange-700">Relationship</p>
                  <p className="font-medium text-orange-900">{applicant.emergencyContactRelationship}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-orange-700">Phone</p>
                  <p className="font-medium text-orange-900">{applicant.emergencyContactPhone}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-green-600" />
            Selected Health Insurance Plan
          </CardTitle>
          <CardDescription>Coverage details and premium information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Plan Type</p>
              <p className="font-semibold text-gray-900 text-lg capitalize">
                {productSelection?.planName || 'Selected Plan'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Coverage Amount (Sum Insured)</p>
              <p className="font-semibold text-gray-900 text-lg">
                ₹{parseInt(productSelection?.sumInsured || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Annual Premium</p>
                <p className="text-3xl font-bold text-blue-900">
                  ₹{parseInt(productSelection?.premium || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-blue-600 mt-1">Per year (inclusive of taxes)</p>
              </div>
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✓ Individual Coverage:</strong> This policy covers you only (no family members included)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Health Declaration Summary */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-red-600" />
            Health Declaration Summary
          </CardTitle>
          <CardDescription>Your health assessment and lifestyle information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Health Status Badge */}
          {healthStatus && (
            <div className={`p-4 rounded-lg border-2 ${
              healthStatus === 'Excellent' ? 'bg-green-50 border-green-300' :
              healthStatus === 'Good' ? 'bg-blue-50 border-blue-300' :
              healthStatus === 'Fair' ? 'bg-yellow-50 border-yellow-300' :
              'bg-orange-50 border-orange-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Health Status</p>
                  <p className={`text-2xl font-bold ${
                    healthStatus === 'Excellent' ? 'text-green-700' :
                    healthStatus === 'Good' ? 'text-blue-700' :
                    healthStatus === 'Fair' ? 'text-yellow-700' :
                    'text-orange-700'
                  }`}>
                    {healthStatus}
                  </p>
                </div>
                <Heart className={`h-12 w-12 ${
                  healthStatus === 'Excellent' ? 'text-green-500' :
                  healthStatus === 'Good' ? 'text-blue-500' :
                  healthStatus === 'Fair' ? 'text-yellow-500' :
                  'text-orange-500'
                }`} />
              </div>
            </div>
          )}

          {/* Key Health Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">BMI</p>
              <p className="font-semibold text-gray-900">{healthDeclaration?.BMI || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium text-gray-900">{healthDeclaration?.height ? `${healthDeclaration.height} cm` : 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium text-gray-900">{healthDeclaration?.weight ? `${healthDeclaration.weight} kg` : 'N/A'}</p>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Lifestyle Factors</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Smoking Status</p>
                <p className="font-medium text-gray-900 capitalize">
                  {healthDeclaration?.smokingStatus?.replace('-', ' ') || 'Not declared'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Alcohol Consumption</p>
                <p className="font-medium text-gray-900 capitalize">
                  {healthDeclaration?.alcoholConsumptionLevel || 'Not declared'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Exercise Level</p>
                <p className="font-medium text-gray-900 capitalize">
                  {healthDeclaration?.exerciseLevel || 'Not declared'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Diet Quality</p>
                <p className="font-medium text-gray-900 capitalize">
                  {healthDeclaration?.dietQuality || 'Not declared'}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Conditions */}
          {(hasMedicalConditions || hasChronicDiseases) && (
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2 text-yellow-900">
                <AlertCircle className="h-4 w-4" />
                Declared Medical Conditions
              </p>
              <div className="space-y-2 text-sm">
                {hasMedicalConditions && healthDeclaration?.medicalConditions?.length > 0 && (
                  <div>
                    <p className="font-medium text-yellow-800">Pre-existing Conditions:</p>
                    <ul className="list-disc list-inside text-yellow-700 ml-2">
                      {healthDeclaration.medicalConditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {healthDeclaration?.hasDiabetes && (
                  <p className="text-yellow-700">• Diabetes</p>
                )}
                {healthDeclaration?.hasHeartDisease && (
                  <p className="text-yellow-700">• Heart Disease</p>
                )}
                {healthDeclaration?.hasHighBloodPressure && (
                  <p className="text-yellow-700">• High Blood Pressure</p>
                )}
                {healthDeclaration?.hasCancer && (
                  <p className="text-yellow-700">• Cancer</p>
                )}
                {healthDeclaration?.isOnMedication && (
                  <div className="mt-2">
                    <p className="font-medium text-yellow-800">Current Medications:</p>
                    <ul className="list-disc list-inside text-yellow-700 ml-2">
                      {healthDeclaration.medications?.map((med, index) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Good Health Indicator */}
          {!hasMedicalConditions && !hasChronicDiseases && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <strong>No major medical conditions declared</strong> - You have indicated good overall health
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-purple-600" />
            Uploaded Documents
          </CardTitle>
          <CardDescription>
            {uploadedDocsCount} {uploadedDocsCount === 1 ? 'document' : 'documents'} uploaded and verified
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {uploadedDocsCount > 0 ? (
            <div className="space-y-3">
              {Object.entries(documents || {}).filter(([_, doc]) => doc).map(([docType, doc]) => (
                <div key={docType} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {docType.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {doc.originalFile || doc.fileName || 'File uploaded'}
                      {doc.fileSize && ` • ${(doc.fileSize / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                No documents uploaded yet. Please go back to upload required documents.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Terms and Declaration */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Terms & Conditions</CardTitle>
          <CardDescription>Please review and accept before submitting your application</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-5">
            <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                className="mt-1"
              />
              <div className="space-y-2 flex-1">
                <Label htmlFor="terms" className="cursor-pointer font-semibold text-gray-900 text-base">
                  I accept the Terms and Conditions <span className="text-red-600">*</span>
                </Label>
                <p className="text-sm text-gray-700 leading-relaxed">
                  I have read and agree to the <a href="#" className="text-blue-600 underline hover:text-blue-800">terms and conditions</a>, 
                  {' '}<a href="#" className="text-blue-600 underline hover:text-blue-800">privacy policy</a>, and premium payment terms of this health insurance policy. 
                  I understand my rights and obligations as a policyholder.
                </p>
                {errors.terms && (
                  <Alert className="bg-red-50 border-red-200 mt-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">{errors.terms}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id="declaration"
                checked={declarationAccepted}
                onCheckedChange={setDeclarationAccepted}
                className="mt-1"
              />
              <div className="space-y-2 flex-1">
                <Label htmlFor="declaration" className="cursor-pointer font-semibold text-gray-900 text-base">
                  Health Declaration <span className="text-red-600">*</span>
                </Label>
                <p className="text-sm text-gray-700 leading-relaxed">
                  I hereby declare that all the information provided in this health insurance application is <strong>true, complete, and accurate</strong> to the best of my knowledge. 
                  I understand that:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Any false information or misrepresentation may result in the <strong>rejection of claims</strong> or <strong>cancellation of the policy</strong></li>
                  <li>I authorize the insurance company to verify my information and access my medical records as required for underwriting</li>
                  <li>Pre-existing conditions may affect my coverage and premium rates</li>
                  <li>I must disclose any changes to my health status during the policy term</li>
                </ul>
                {errors.declaration && (
                  <Alert className="bg-red-50 border-red-200 mt-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">{errors.declaration}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-2 border-blue-300">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <p className="font-semibold mb-2">📋 What happens next?</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Your application will be reviewed by our underwriting team within <strong>24-48 hours</strong></li>
                <li>You will receive a confirmation email with your application reference number</li>
                <li>Additional medical tests or documents may be requested based on your health declaration</li>
                <li>Once approved, your policy documents will be issued and premium payment instructions will be sent</li>
              </ul>
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
