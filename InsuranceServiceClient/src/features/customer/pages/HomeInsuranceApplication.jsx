import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Stepper } from '../../shared/components/ui/stepper';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent } from '../../shared/components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';
import { profileService } from '../../shared/api/services/profileService';
import { applicationService } from '../../shared/api/services/applicationService';

// Import Home Insurance specific steps
import { PersonalInfoStep } from '../components/application/shared/PersonalInfoStep';
import { PropertyDetailsStep } from '../components/application/home-insurance/PropertyDetailsStep';
import { DocumentUploadStep } from '../components/application/shared/DocumentUploadStep';

const HOME_INSURANCE_STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Your details' },
  { id: 'property', title: 'Property Details', description: 'Property information' },
  { id: 'coverage', title: 'Coverage', description: 'Select coverage' },
  { id: 'documents', title: 'Documents', description: 'Upload docs' },
  { id: 'review', title: 'Review & Submit', description: 'Final review' },
];

export function HomeInsuranceApplication() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [profileExists, setProfileExists] = useState(false);
  
  const [applicationData, setApplicationData] = useState(() => {
    const productId = searchParams.get('productId');
    const planId = searchParams.get('planId');
    const frequency = searchParams.get('frequency') || 'annual';
    const premium = searchParams.get('premium');

    return {
      insuranceType: 'Home',
      productId: productId || '',
      planId: planId || '',
      paymentFrequency: frequency,
      premiumAmount: premium || '',
      applicant: {
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationalId: '',
        occupation: '',
        annualIncome: '',
        address: '',
        city: '',
        postalCode: '',
      },
      propertyDetails: {
        propertyType: '',
        propertyUsage: 'residential',
        address: '',
        city: '',
        postalCode: '',
        yearBuilt: '',
        constructionType: '',
        numberOfFloors: '',
        carpetArea: '',
        buildingValue: '',
        contentsValue: '',
        hasSecuritySystem: false,
        hasFireAlarm: false,
        isInFloodZone: false,
      },
      homeProduct: {
        coverageType: 'comprehensive',
        addOns: [],
      },
      documents: [],
    };
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/apply-home');
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        if (profile && profile.firstName && profile.lastName) {
          setProfileExists(true);
          setApplicationData(prev => ({
            ...prev,
            applicant: {
              ...prev.applicant,
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              email: user?.email || profile.email || '',
              phone: profile.phoneNumber || '',
              dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
              gender: profile.gender || '',
              nationalId: profile.nationalId || '',
              occupation: profile.occupation || '',
              annualIncome: profile.monthlyIncome ? profile.monthlyIncome * 12 : '',
              address: profile.address || '',
              city: profile.city || '',
              postalCode: profile.postalCode || '',
              // Emergency Contact
              emergencyContactName: profile.emergencyContactName || '',
              emergencyContactPhone: profile.emergencyContactPhone || '',
              emergencyContactRelationship: profile.emergencyContactRelationship || '',
            },
            propertyDetails: {
              ...prev.propertyDetails,
              address: profile.address || '',
              city: profile.city || '',
              postalCode: profile.postalCode || '',
            }
          }));
        } else {
          setApplicationData(prev => ({
            ...prev,
            applicant: { ...prev.applicant, email: user?.email || '' }
          }));
        }
      } catch (error) {
        console.log('No existing profile');
        setApplicationData(prev => ({
          ...prev,
          applicant: { ...prev.applicant, email: user?.email || '' }
        }));
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, user?.email]);

  const handleNext = () => {
    if (currentStep < HOME_INSURANCE_STEPS.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDataChange = (stepData) => {
    setApplicationData(prev => ({ ...prev, ...stepData }));
  };

  const handleSubmit = async (finalData) => {
    try {
      const result = await applicationService.submitApplication(finalData || applicationData);
      navigate('/application-success', { state: { applicationId: result.id } });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={true}
            profileExists={profileExists}
          />
        );
      case 2:
        return (
          <PropertyDetailsStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Select Coverage</h3>
              <p className="text-gray-600 mb-4">Choose your home insurance coverage type</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { type: 'building', title: 'Building Only', price: '4,500' },
                  { type: 'contents', title: 'Contents Only', price: '3,000' },
                  { type: 'comprehensive', title: 'Building + Contents', price: '6,500', popular: true },
                ].map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      handleDataChange({ homeProduct: { ...applicationData.homeProduct, coverageType: option.type } });
                    }}
                    className={`p-4 rounded-lg border-2 text-left ${
                      applicationData.homeProduct?.coverageType === option.type
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {option.popular && <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">Popular</span>}
                    <div className="font-semibold mt-2">{option.title}</div>
                    <div className="text-lg font-bold text-orange-600 mt-2">${option.price}/year</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious}>Previous</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <DocumentUploadStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Review & Submit</h3>
              <p className="text-gray-600 mb-4">Please review your application before submitting.</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Personal Information</h4>
                  <p>{applicationData.applicant.firstName} {applicationData.applicant.lastName}</p>
                  <p>{applicationData.applicant.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Property Details</h4>
                  <p>{applicationData.propertyDetails.propertyType?.replace('-', ' ')}</p>
                  <p>{applicationData.propertyDetails.address}</p>
                  <p>Carpet Area: {applicationData.propertyDetails.carpetArea} sq ft</p>
                </div>
                <div>
                  <h4 className="font-semibold">Coverage</h4>
                  <p>{applicationData.homeProduct?.coverageType}</p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious}>Previous</Button>
                <Button onClick={handleSubmit}>Submit Application</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-5">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Home Insurance Application</h1>
              <p className="text-gray-600 text-sm mt-1">Protect your home and belongings</p>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Stepper steps={HOME_INSURANCE_STEPS} currentStep={currentStep} completedSteps={completedSteps} />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Info Notice */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Have your property documents ready for quick verification.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
