import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { Stepper } from '../../../../shared/components/ui/stepper';
import { Button } from '../../../../shared/components/ui/button';
import { Card, CardContent } from '../../../../shared/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { profileService } from '../../../../shared/api/services/profileService';
import axios from '../../../../shared/api/axios';
import { toast } from 'sonner';
import { PersonalInfoStep } from '../shared/PersonalInfoStep';
import HealthInsuranceProductStep from './HealthInsuranceProductStep';
import HealthInsuranceMedicalStep from './HealthInsuranceMedicalStep';
import HealthDocumentsStep from './HealthDocumentsStep';
import HealthReviewStep from './HealthReviewStep';

const STEPS = [
  {
    id: 'personal',
    title: 'Personal Info',
    description: 'Your details',
  },
  {
    id: 'medical',
    title: 'Medical Info',
    description: 'Health declaration',
  },
  {
    id: 'product',
    title: 'Product Selection',
    description: 'Choose your plan',
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

  // Load data from URL params or persistent localStorage (from registration flow)
  useEffect(() => {
    const productId = searchParams.get('productId');
    const planId = searchParams.get('planId');
    const coverageAmount = searchParams.get('coverageAmount');
    const premiumAmount = searchParams.get('premiumAmount');

    // Priority 1: URL Params (Direct link or immediate navigation)
    if (productId) {
      setFormData(prev => ({
        ...prev,
        productSelection: {
          ...prev.productSelection,
          planType: planId ? parseInt(planId) : '',
          sumInsured: coverageAmount || '',
          premium: parseFloat(premiumAmount) || 0
        }
      }));
    }
    // Priority 2: Pending Application Data (Returned from Registration/Login)
    else {
      const pendingData = localStorage.getItem('pendingMedicalApplication');
      if (pendingData) {
        try {
          const parsed = JSON.parse(pendingData);
          if (parsed.productId && parsed.planId) {
            console.log("📥 Restoring pending application data:", parsed);
            setFormData(prev => ({
              ...prev,
              productSelection: {
                ...prev.productSelection,
                planType: parsed.planId ? parseInt(parsed.planId) : '',
                sumInsured: parsed.coverageAmount?.toString() || '',
                premium: 0 // Will be calculated by Step 3 logic
              }
            }));
            // Optional: Clear it so it doesn't persist forever, 
            // but maybe keep it until submission? unique ID check?
            // For now, let's keep it until submission clears all drafts.
          }
        } catch (e) {
          console.error("Error parsing pending application data", e);
        }
      }
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
      toast.loading('Submitting your application...');

      const productId = searchParams.get('productId');
      const request = mapFormDataToRequest(formData, productId);
      
      console.log('🚀 Request payload:', request);
      console.log('📋 Health Declaration:', request.HealthDeclaration);

      const response = await axios.post('/api/applications', request);
      
      console.log('✅ Response:', response);
      console.log('📦 Response data:', response.data);

      toast.dismiss();
      
      // API returns data directly in response (not response.data)
      const result = response.data || response;
      
      if (result && result.success) {
        toast.success('Application Submitted Successfully!');

        // Clear draft from localStorage
        localStorage.removeItem('healthInsuranceApplication_draft');
        localStorage.removeItem('healthInsuranceApplication_currentStep');
        localStorage.removeItem('healthInsuranceApplication_completedSteps');
        localStorage.removeItem('pendingMedicalApplication'); // Clear persistent data

        navigate('/application-success', {
          state: {
            applicationId: result.id,
            applicationNumber: result.applicationNumber
          }
        });
      } else {
        console.error('⚠️ Unexpected response:', response);
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      toast.dismiss();
      toast.error(`Failed to submit application: ${error.response?.data?.message || error.response?.data?.title || error.message || 'Please try again.'}`);
    }
  };

  const mapFormDataToRequest = (data, productId) => {
    const { applicant, productSelection, healthDeclaration: healthDec, medicalInfo, nominees, documents, termsAccepted, declarationAccepted } = data;

    // Use healthDeclaration if available (from HealthInsuranceMedicalStep), otherwise map from medicalInfo (legacy)
    const medicalData = healthDec || medicalInfo;

    // Map Medical Conditions - handle both new format (healthDec) and old format (medicalInfo)
    let healthDeclaration;
    
    if (healthDec) {
      // New format from HealthInsuranceMedicalStep - map directly
      const medicalConditions = [];
      const medications = [];

      // Collect medical conditions
      if (healthDec.hasDiabetes) medicalConditions.push('Diabetes');
      if (healthDec.hasHeartDisease) medicalConditions.push('Heart Disease');
      if (healthDec.hasHighBloodPressure) medicalConditions.push('High Blood Pressure');
      if (healthDec.hasCancer) medicalConditions.push('Cancer');
      if (healthDec.hasKidneyDisease) medicalConditions.push('Kidney Disease');
      if (healthDec.hasLiverDisease) medicalConditions.push('Liver Disease');
      if (healthDec.hasAsthma) medicalConditions.push('Asthma');
      if (healthDec.hasThyroidDisorder) medicalConditions.push('Thyroid Disorder');

      // Add other medical conditions
      if (healthDec.otherMedicalConditions) {
        medicalConditions.push(healthDec.otherMedicalConditions);
      }

      // Collect medications
      if (healthDec.isOnMedication && healthDec.medications) {
        medications.push(healthDec.medications);
      }

      healthDeclaration = {
        Height: healthDec.height?.toString(),
        Weight: healthDec.weight?.toString(),
        SmokingStatus: healthDec.smokingStatus || 'non-smoker',
        AlcoholConsumption: healthDec.alcoholConsumptionLevel || 'none',
        IsSmoker: healthDec.smokingStatus === 'regular' || healthDec.smokingStatus === 'occasional',
        HasDiabetes: healthDec.hasDiabetes || false,
        HasHighBloodPressure: healthDec.hasHighBloodPressure || false,
        HasHeartDisease: healthDec.hasHeartDisease || false,
        HasKidneyDisease: healthDec.hasKidneyDisease || false,
        HasCancer: healthDec.hasCancer || false,
        MedicalConditions: medicalConditions,
        Medications: medications,
        MedicalRecordsConsent: healthDec.medicalRecordsConsent || false
      };
    } else if (medicalInfo) {
      // Legacy format - keep old mapping
      healthDeclaration = {
        Height: medicalInfo.lifestyle?.height?.toString(),
        Weight: medicalInfo.lifestyle?.weight?.toString(),
        SmokingStatus: medicalInfo.lifestyle?.smoking?.toLowerCase() === 'yes' ? 'regular' : 'non-smoker',
        AlcoholConsumption: medicalInfo.lifestyle?.alcohol?.toLowerCase() === 'yes' ? 'moderate' : 'none',
        IsSmoker: medicalInfo.lifestyle?.smoking?.toLowerCase() === 'yes',
        HasDiabetes: medicalInfo.preExistingConditions?.diabetes?.has || false,
        HasHighBloodPressure: medicalInfo.preExistingConditions?.hypertension?.has || false,
        HasHeartDisease: medicalInfo.preExistingConditions?.heartDisease?.has || false,
        HasKidneyDisease: medicalInfo.preExistingConditions?.kidneyDisease?.has || false,
        HasCancer: medicalInfo.preExistingConditions?.cancer?.has || false,
        MedicalConditions: [],
        Medications: [],
        MedicalRecordsConsent: medicalInfo.consent || false
      };

      // Add conditions to list
      if (medicalInfo.preExistingConditions?.asthma?.has) {
        healthDeclaration.MedicalConditions.push('Asthma');
        if (medicalInfo.preExistingConditions.asthma.medication) {
          healthDeclaration.Medications.push(`Asthma: ${medicalInfo.preExistingConditions.asthma.medication}`);
        }
      }
      if (medicalInfo.preExistingConditions?.thyroid?.has) {
        healthDeclaration.MedicalConditions.push('Thyroid Disorder');
        if (medicalInfo.preExistingConditions.thyroid.medication) {
          healthDeclaration.Medications.push(`Thyroid: ${medicalInfo.preExistingConditions.thyroid.medication}`);
        }
      }
      if (medicalInfo.covid19?.hadCovid === 'Yes') {
        healthDeclaration.MedicalConditions.push(`COVID-19 History`);
      }
    }

    return {
      ProductId: productId ? parseInt(productId) : (parseInt(data.productSelection.planType) || 0), // Fallback if planType is ID
      CoverageAmount: parseFloat(productSelection.sumInsured) || 0,
      TermYears: 1,
      PaymentFrequency: 'Annual',
      PremiumAmount: productSelection.premium,

      Applicant: {
        FirstName: applicant.firstName,
        LastName: applicant.lastName,
        Email: applicant.email,
        Phone: applicant.phone,
        DateOfBirth: applicant.dateOfBirth,
        Gender: applicant.gender,
        NationalId: applicant.nationalId,
        Occupation: applicant.occupation,
        AnnualIncome: parseFloat(applicant.annualIncome) || 0,
        Address: applicant.address,
        City: applicant.city,
        PostalCode: applicant.postalCode,
        EmergencyContactName: applicant.emergencyContactName,
        EmergencyContactPhone: applicant.emergencyContactPhone,
        EmergencyContactRelationship: applicant.emergencyContactRelationship
      },

      HealthDeclaration: healthDeclaration,

      Beneficiaries: [],

      TermsAccepted: termsAccepted,
      DeclarationAccepted: declarationAccepted
    };
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
          <HealthInsuranceMedicalStep
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
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
      case 4:
        return (
          <HealthDocumentsStep
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handlePrevious}
          />
        );
      case 5:
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
            Medical Insurance Application
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Complete your medical insurance application in a few simple steps
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
