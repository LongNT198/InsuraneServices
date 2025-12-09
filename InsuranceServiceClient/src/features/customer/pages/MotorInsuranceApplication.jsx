import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Stepper } from '../../shared/components/ui/stepper';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent } from '../../shared/components/ui/card';
import { ArrowLeft, Car } from 'lucide-react';
import { profileService } from '../../shared/api/services/profileService';
import { applicationService } from '../../shared/api/services/applicationService';

// Import Motor Insurance specific steps
import { PersonalInfoStep } from '../components/application/shared/PersonalInfoStep';
import { VehicleDetailsStep } from '../components/application/motor-insurance/VehicleDetailsStep';
import { MotorProductSelectionStep } from '../components/application/motor-insurance/MotorProductSelectionStep';
import { DocumentUploadStep } from '../components/application/shared/DocumentUploadStep';

const MOTOR_INSURANCE_STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Your details' },
  { id: 'vehicle', title: 'Vehicle Details', description: 'Vehicle information' },
  { id: 'product', title: 'Coverage', description: 'Select coverage' },
  { id: 'documents', title: 'Documents', description: 'Upload docs' },
  { id: 'review', title: 'Review & Submit', description: 'Final review' },
];

export function MotorInsuranceApplication() {
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
      insuranceType: 'Motor',
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
      vehicleDetails: {
        vehicleType: '',
        registrationNumber: '',
        make: '',
        model: '',
        variant: '',
        yearOfManufacture: '',
        engineNumber: '',
        chassisNumber: '',
        fuelType: '',
        seatingCapacity: '',
        cubicCapacity: '',
        currentIDV: '',
        registrationDate: '',
        previousPolicyNumber: '',
        claimInLastYear: false,
        ncbPercentage: '0',
      },
      motorProduct: {
        coverageType: 'comprehensive',
        addOns: [],
      },
      documents: [],
    };
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/apply-motor');
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
    if (currentStep < MOTOR_INSURANCE_STEPS.length) {
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
          <VehicleDetailsStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <MotorProductSelectionStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
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
                  <h4 className="font-semibold">Vehicle Details</h4>
                  <p>{applicationData.vehicleDetails.make} {applicationData.vehicleDetails.model}</p>
                  <p>Registration: {applicationData.vehicleDetails.registrationNumber}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-5">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Motor Insurance Application</h1>
              <p className="text-gray-600 text-sm mt-1">Protect your vehicle on the road</p>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Stepper steps={MOTOR_INSURANCE_STEPS} currentStep={currentStep} completedSteps={completedSteps} />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Info Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Have your vehicle registration certificate (RC) handy for quick filling.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
