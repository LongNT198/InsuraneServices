import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { Stepper } from '../../../../shared/components/ui/stepper';
import { Button } from '../../../../shared/components/ui/button';
import { Card, CardContent } from '../../../../shared/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { profileService } from '../../../../shared/api/services/profileService';
import { PersonalInfoStep } from '../shared/PersonalInfoStep';
import HealthInsuranceProductStep from './HealthInsuranceProductStep';
import HealthInsuranceMedicalStep from './HealthInsuranceMedicalStep';
import NomineesStep from './NomineesStep';
import HealthDocumentsStep from './HealthDocumentsStep';
import HealthReviewStep from './HealthReviewStep';

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Info',
    description: 'Your details',
  },
  {
    id: 'product',
    title: 'Product Selection',
    description: 'Choose your plan',
  },
  {
    id: 'medical',
    title: 'Medical Info',
    description: 'Health declaration',
  },
  {
    id: 'nominees',
    title: 'Nominees',
    description: 'Beneficiaries',
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Upload docs',
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Final review',
  },
];

export default function HealthInsuranceApplication() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('healthInsuranceApplication_currentStep');
    return saved ? parseInt(saved) : 1;
  });
  
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('healthInsuranceApplication_completedSteps');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [profileExists, setProfileExists] = useState(false);
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('healthInsuranceApplication_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
    return {
    // Personal Info - compatible with PersonalInfoStep
    applicant: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      nationalId: '',
      occupation: '',
      annualIncome: '',
      address: '',
      city: '',
      postalCode: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
    },
    
    // Product Selection
    productSelection: {
      planType: '',
      sumInsured: '',
      numberOfMembers: 1,
      members: [],
      premium: 0
    },
    
    // Medical Information
    medicalInfo: {
      currentHealth: '',
      recentHospitalization: false,
      hospitalizationDetails: '',
      preExistingConditions: {
        diabetes: { has: false, controlled: '', medication: '' },
        hypertension: { has: false, controlled: '', medication: '' },
        asthma: { has: false, controlled: '', medication: '' },
        heartDisease: { has: false, details: '' },
        thyroid: { has: false, controlled: '', medication: '' },
        kidneyDisease: { has: false, details: '' },
        cancer: { has: false, details: '' }
      },
      lifestyle: {
        smoking: '',
        alcohol: '',
        height: '',
        weight: '',
        bmi: ''
      },
      covid19: {
        hadCovid: '',
        dateOfRecovery: '',
        complications: ''
      },
      womensHealth: {
        pregnant: '',
        dueDate: '',
        complications: ''
      },
      consent: false
    },
    
    // Nominees
    nominees: [],
    
    // Documents
    documents: {},
    
    // Review
    termsAccepted: false,
    declarationAccepted: false
    };
  });

  // Auto-save draft to localStorage
  useEffect(() => {
    localStorage.setItem('healthInsuranceApplication_draft', JSON.stringify(formData));
    localStorage.setItem('healthInsuranceApplication_currentStep', currentStep.toString());
    localStorage.setItem('healthInsuranceApplication_completedSteps', JSON.stringify(completedSteps));
  }, [formData, currentStep, completedSteps]);

  // Load data from URL params when coming from Calculator
  useEffect(() => {
    const productId = searchParams.get('productId');
    const coverageAmount = searchParams.get('coverageAmount');
    const age = searchParams.get('age');
    const paymentFrequency = searchParams.get('paymentFrequency');
    const premiumAmount = searchParams.get('premiumAmount');
    const productType = searchParams.get('type');

    if (productId && premiumAmount) {
      setFormData(prev => ({
        ...prev,
        productSelection: {
          ...prev.productSelection,
          planType: productType || 'Individual',
          sumInsured: coverageAmount || '',
          premium: parseFloat(premiumAmount) || 0
        }
      }));
    }
    
    // Redirect to login if not authenticated, preserving all URL params
    if (!isAuthenticated) {
      const currentUrl = `/apply-health${window.location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
  }, [searchParams, isAuthenticated, navigate]);

  useEffect(() => {
    // Only load profile if authenticated
    if (!isAuthenticated) {
      return;
    }

    // Load existing profile
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        
        if (profile && profile.firstName && profile.lastName) {
          setProfileExists(true);
          
          setFormData(prev => ({
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
        }
      } catch (error) {
        console.log('No existing profile or error loading profile', error);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, user]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      // Mark current step as completed
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
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting health insurance application:', formData);
      // TODO: API call to submit health insurance application
      
      // Clear draft from localStorage
      localStorage.removeItem('healthInsuranceApplication_draft');
      localStorage.removeItem('healthInsuranceApplication_currentStep');
      localStorage.removeItem('healthInsuranceApplication_completedSteps');
      
      alert('Health Insurance Application Submitted Successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to submit application: ${error.message || 'Please try again.'}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={true}
            profileExists={profileExists}
          />
        );
      case 2:
        return (
          <HealthInsuranceProductStep
            data={formData}
            onNext={(stepData) => {
              handleDataChange(stepData);
              handleNext();
            }}
            onBack={handlePrevious}
          />
        );
      case 3:
        return (
          <HealthInsuranceMedicalStep
            data={formData}
            onNext={(stepData) => {
              handleDataChange(stepData);
              handleNext();
            }}
            onBack={handlePrevious}
          />
        );
      case 4:
        return (
          <NomineesStep
            data={formData}
            onNext={(stepData) => {
              handleDataChange(stepData);
              handleNext();
            }}
            onBack={handlePrevious}
          />
        );
      case 5:
        return (
          <HealthDocumentsStep
            data={formData}
            onNext={(stepData) => {
              handleDataChange(stepData);
              handleNext();
            }}
            onBack={handlePrevious}
          />
        );
      case 6:
        return (
          <HealthReviewStep
            data={formData}
            onSubmit={handleSubmit}
            onBack={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-5">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Health Insurance Application
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Complete your health insurance application in a few simple steps
          </p>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Stepper steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Save Progress Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <CheckCircle className="w-4 h-4" />
              <span>
                Your progress is automatically saved. You can return anytime to complete your application.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
