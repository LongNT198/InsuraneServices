import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Stepper } from '../../shared/components/ui/stepper';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent } from '../../shared/components/ui/card';
import { ArrowLeft, Heart } from 'lucide-react';
import { applicationService } from '../../shared/api/services/applicationService';
import { profileService } from '../../shared/api/services/profileService';
import { getLatestCalculatorDraft } from '../../shared/api/services/draftService';

// Import Life Insurance specific steps
import { ProductSelectionStep } from '../components/application/life-insurance/ProductSelectionStep';
import { PersonalInfoStep } from '../components/application/shared/PersonalInfoStep';
import { HealthDeclarationStep } from '../components/application/life-insurance/HealthDeclarationStep';
import { BeneficiariesStep } from '../components/application/life-insurance/BeneficiariesStep';
import { DocumentUploadStep } from '../components/application/shared/DocumentUploadStep';
import { ReviewSubmitStep } from '../components/application/life-insurance/ReviewSubmitStep';

const LIFE_INSURANCE_STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Your details' },
  { id: 'health', title: 'Health Declaration', description: 'Medical history' },
  { id: 'product', title: 'Product & Quote', description: 'Select plan' },
  { id: 'beneficiaries', title: 'Beneficiaries', description: 'Nominees' },
  { id: 'documents', title: 'Documents', description: 'Upload docs' },
  { id: 'review', title: 'Review & Submit', description: 'Final review' },
];

export function LifeInsuranceApplication() {
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
    // NOTE: No longer reading premium from URL - will be auto-calculated in Step 3

    // Map frequency values from URL to internal format
    const frequencyMap = {
      'annual': 'Annual',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'semi-annual': 'Semi-Annual',
      'single': 'LumpSum'
    };
    const paymentFrequency = frequencyMap[frequency?.toLowerCase()] || 'Annual';

    // If URL has params, save to localStorage for persistence across tabs (email verification)
    // Only save plan selection - premium will be auto-calculated based on user's actual data
    if (productId || planId) {
      const quoteData = {
        productId,
        planId,
        paymentFrequency,
        timestamp: Date.now() // Add timestamp to auto-expire after 24 hours
      };
      localStorage.setItem('lifeInsuranceQuote', JSON.stringify(quoteData));
    }

    // Try to restore from localStorage if URL doesn't have params
    let restoredProductId = productId;
    let restoredPlanId = planId;
    let restoredFrequency = paymentFrequency;

    if (!productId && !planId) {
      const saved = localStorage.getItem('lifeInsuranceQuote');

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          // Check if data is not expired (24 hours)
          const isExpired = parsed.timestamp && (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000);

          if (isExpired) {
            localStorage.removeItem('lifeInsuranceQuote');
          } else {
            restoredProductId = parsed.productId;
            restoredPlanId = parsed.planId;
            restoredFrequency = parsed.paymentFrequency || paymentFrequency;
            // Note: Premium will be recalculated in Step 3 based on actual user age
          }
        } catch (e) {
          console.error('❌ Failed to parse localStorage:', e);
        }
      } else {
        console.log('⚠️ No saved quote in localStorage');
      }
    } else {
      console.log('✅ Using URL params, no need to restore from localStorage');
    }


    return {
      insuranceType: 'Life',
      productId: restoredProductId || '',
      planId: restoredPlanId || '',
      paymentFrequency: restoredFrequency,
      premiumAmount: '', // Will be AUTO-CALCULATED in Step 3 based on user's actual age, gender, and health
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
      healthDeclaration: {
        height: '',
        weight: '',
        isSmoker: false,
        alcoholConsumption: '',
        hasChronicDiseases: false,
        chronicDiseases: [],
        hasFamilyHistory: false,
        familyHistory: [],
        takingMedication: false,
        medications: [],
        hadSurgeries: false,
        surgeries: [],
      },
      beneficiaries: [],
      documents: [],
    };
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Save URL params to localStorage before redirecting to login
      if (window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productId');
        const planId = urlParams.get('planId');
        const frequency = urlParams.get('frequency');
        // NOTE: No longer saving premium - will be auto-calculated after login

        if (productId || planId) {
          const paramsToSave = {
            productId,
            planId,
            type: 'Life',
            applicationType: 'LifeInsurance',
            paymentFrequency: frequency,
            timestamp: Date.now(),
            source: 'url-params'
          };
          localStorage.setItem('calculatorParams', JSON.stringify(paramsToSave));
        }
      }

      // Preserve query parameters when redirecting to login
      const currentUrl = `/apply-life${window.location.search}`;
      const redirectUrl = encodeURIComponent(currentUrl);
      navigate(`/login?redirect=${redirectUrl}`);
      return;
    }

    const loadProfile = async () => {
      try {
        // PRIORITY 1: Always check URL params first (highest priority)
        const urlProductId = searchParams.get('productId');
        const urlPlanId = searchParams.get('planId');
        const urlFrequency = searchParams.get('frequency');
        // NOTE: No longer reading premium from URL - will be auto-calculated in Step 3

        let restoredFromUrl = false;
        if (urlProductId || urlPlanId) {
          // Map frequency values from URL to internal format
          const frequencyMap = {
            'annual': 'Annual',
            'monthly': 'Monthly',
            'quarterly': 'Quarterly',
            'semi-annual': 'Semi-Annual',
            'single': 'LumpSum'
          };
          const mappedFrequency = frequencyMap[urlFrequency?.toLowerCase()] || 'Annual';

          setApplicationData(prev => ({
            ...prev,
            productId: urlProductId || prev.productId,
            planId: urlPlanId || prev.planId,
            paymentFrequency: mappedFrequency,
            premiumAmount: '', // Will be auto-calculated in Step 3
          }));

          restoredFromUrl = true;
        }

        // PRIORITY 2: Check localStorage only if NO URL params
        if (!restoredFromUrl) {
          const savedParams = localStorage.getItem('calculatorParams');

          let restoredFromStorage = false;

          if (savedParams) {
            try {
              const params = JSON.parse(savedParams);

              // Only restore if the params are for Life insurance and match current context
              if (params.type === 'Life' || params.applicationType === 'LifeInsurance') {
                setApplicationData(prev => ({
                  ...prev,
                  productId: params.productId?.toString() || prev.productId,
                  planId: params.planId?.toString() || prev.planId,
                  paymentFrequency: params.paymentFrequency || prev.paymentFrequency,
                  premiumAmount: params.premiumAmount?.toString() || prev.premiumAmount,
                }));

                restoredFromStorage = true;

                // Clear the saved params after restoration
                localStorage.removeItem('calculatorParams');
              }
            } catch (parseError) {
              localStorage.removeItem('calculatorParams');
            }
          }

          // PRIORITY 3: Try loading from API only if no URL and no localStorage
          if (!restoredFromStorage) {
            try {
              const latestDraft = await getLatestCalculatorDraft('LifeInsurance');
              if (latestDraft && latestDraft.parsedData) {
                const draftData = latestDraft.parsedData;

                setApplicationData(prev => ({
                  ...prev,
                  productId: draftData.productId?.toString() || prev.productId,
                  planId: draftData.planId?.toString() || prev.planId,
                  paymentFrequency: draftData.paymentFrequency || prev.paymentFrequency,
                  premiumAmount: draftData.premiumAmount?.toString() || prev.premiumAmount,
                }));

                console.log('✅ Restored Life insurance quote data from API draft');
              } else {
                console.log('ℹ️ No calculator draft found in API');
              }
            } catch (draftError) {
              console.error('⚠️ Error loading draft from API:', draftError);
              // Continue anyway - not a critical error
            }
          }
        }

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
              occupationOther: profile.occupationOther || '',
              annualIncome: profile.monthlyIncome ? profile.monthlyIncome * 12 : '',
              address: profile.address || '',
              city: profile.city || '',
              postalCode: profile.postalCode || '',
              // Emergency Contact - support both camelCase and PascalCase
              emergencyContactName: profile.emergencyContactName || profile.EmergencyContactName || '',
              emergencyContactPhone: profile.emergencyContactPhone || profile.EmergencyContactPhone || '',
              emergencyContactGender: profile.emergencyContactGender || profile.EmergencyContactGender || '',
              emergencyContactRelationship: profile.emergencyContactRelationship || profile.EmergencyContactRelationship || '',
              emergencyContactRelationshipOther: profile.emergencyContactRelationshipOther || profile.EmergencyContactRelationshipOther || '',
            }
          }));
        } else {
          // No profile exists, but still set email from user
          setApplicationData(prev => ({
            ...prev,
            applicant: {
              ...prev.applicant,
              email: user?.email || '',
            }
          }));
        }
      } catch (error) {
        console.log('No existing profile');
        // Still set email even if profile fetch fails
        setApplicationData(prev => ({
          ...prev,
          applicant: {
            ...prev.applicant,
            email: user?.email || '',
          }
        }));
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, user?.email]);

  // Separate effect to ensure URL params are preserved on initial load only
  useEffect(() => {
    const urlProductId = searchParams.get('productId');
    const urlPlanId = searchParams.get('planId');
    const urlFrequency = searchParams.get('frequency');
    // NOTE: No longer reading premium from URL - will be auto-calculated in Step 3

    // Only update if URL params exist AND BOTH productId AND planId are empty (initial load)
    if ((urlProductId || urlPlanId) && !applicationData.productId && !applicationData.planId) {

      const frequencyMap = {
        'annual': 'Annual',
        'monthly': 'Monthly',
        'quarterly': 'Quarterly',
        'semi-annual': 'Semi-Annual',
        'single': 'LumpSum'
      };
      const mappedFrequency = frequencyMap[urlFrequency?.toLowerCase()] || 'Annual';

      setApplicationData(prev => ({
        ...prev,
        productId: urlProductId || prev.productId,
        planId: urlPlanId || prev.planId,
        paymentFrequency: mappedFrequency,
        premiumAmount: '', // Will be auto-calculated in Step 3
      }));
    }
  }, [searchParams, applicationData.productId, applicationData.planId]);

  const handleNext = () => {
    if (currentStep < LIFE_INSURANCE_STEPS.length) {
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
    setApplicationData(prev => {
      const updated = { ...prev, ...stepData };
      return updated;
    });
  };

  const handleSubmit = async (finalData) => {
    try {
      const result = await applicationService.submitApplication(finalData);

      // Clear saved quote data after successful submission
      localStorage.removeItem('lifeInsuranceQuote')

      // Navigate to success page with application details
      navigate('/application-success', {
        state: {
          applicationId: result.id,
          applicationNumber: result.applicationNumber
        }
      });
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
          <HealthDeclarationStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ProductSelectionStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <BeneficiariesStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <DocumentUploadStep
            data={applicationData}
            onChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <ReviewSubmitStep
            data={applicationData}
            onChange={handleDataChange}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-5">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Life Insurance Application</h1>
              <p className="text-gray-600 text-sm mt-1">Secure your family's financial future</p>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Stepper steps={LIFE_INSURANCE_STEPS} currentStep={currentStep} completedSteps={completedSteps} />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Info Notice */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Your progress is automatically saved. You can return to complete this application later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
