import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { ArrowLeft, ArrowRight, Heart, Activity, Users, Briefcase, AlertTriangle, AlertCircle, Info, Sparkles, Save, Edit, Eye, Loader2 } from 'lucide-react';
import { 
  SMOKING_STATUS_OPTIONS, 
  ALCOHOL_OPTIONS,
  EXERCISE_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  STRESS_LEVEL_OPTIONS,
  DIET_QUALITY_OPTIONS,
  TREATMENT_STATUS_OPTIONS,
  calculateBMI, 
  getBMICategory,
  calculateHealthStatus,
  getHealthStatusExplanation,
  validateHeight,
  validateWeight,
  validateBloodPressure,
  validateCholesterol
} from '../../../utils/insuranceHelpers';
import { saveHealthDeclaration, getHealthDeclaration } from '../../../../shared/api/services/healthDeclarationService';
import { applicationService } from '../../../../shared/api/services/applicationService';
import { toast } from 'sonner';

export default function HealthInsuranceMedicalStep({ data, onChange, onNext, onPrevious, applicationId }) {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState(() => ({
    // Ensure all boolean fields have default values
    hasMedicalConditions: false,
    medicalConditions: [],
    medicalConditionDetails: [], // NEW: Detailed condition tracking
    isOnMedication: false,
    medications: [],
    hasHospitalization: false,
    hospitalizationHistory: '',
    
    // Specific Diseases - with diagnosis dates and treatment status
    hasHeartDisease: false,
    heartDiseaseDiagnosisDate: '',
    heartDiseaseTreatmentStatus: 'controlled',
    hasStroke: false,
    strokeDiagnosisDate: '',
    strokeTreatmentStatus: 'controlled',
    hasCancer: false,
    cancerDetails: '',
    cancerDiagnosisDate: '',
    cancerTreatmentStatus: 'controlled',
    hasDiabetes: false,
    diabetesType: '',
    diabetesDiagnosisDate: '',
    diabetesTreatmentStatus: 'controlled',
    diabetesHbA1c: '',
    hasHighBloodPressure: false,
    highBloodPressureDiagnosisDate: '',
    highBloodPressureTreatmentStatus: 'controlled',
    hasHighCholesterol: false,
    highCholesterolDiagnosisDate: '',
    highCholesterolTreatmentStatus: 'controlled',
    hasKidneyDisease: false,
    kidneyDiseaseDiagnosisDate: '',
    kidneyDiseaseTreatmentStatus: 'controlled',
    hasLiverDisease: false,
    liverDiseaseDiagnosisDate: '',
    liverDiseaseTreatmentStatus: 'controlled',
    hasMentalHealthCondition: false,
    mentalHealthDetails: '',
    mentalHealthDiagnosisDate: '',
    mentalHealthTreatmentStatus: 'controlled',
    hasHIV: false,
    hivDiagnosisDate: '',
    hivTreatmentStatus: 'controlled',
    lastMedicalCheckupDate: '',
    hasSurgeryLast5Years: false,
    surgeryDetails: '',
    hasPendingMedicalTests: false,
    pendingTestsDetails: '',
    hasPlannedProcedures: false,
    plannedProceduresDetails: '',
    familyHeartDisease: false,
    familyCancer: false,
    familyDiabetes: false,
    familyStroke: false,
    familyOtherConditions: '',
    fatherDeceased: false,
    fatherAgeAtDeath: '',
    fatherCauseOfDeath: '',
    motherDeceased: false,
    motherAgeAtDeath: '',
    motherCauseOfDeath: '',
    isSmoker: false,
    smokingPacksPerDay: '',
    smokingYears: '',
    alcoholConsumption: 'None',
    alcoholUnitsPerWeek: '',
    usesDrugs: false,
    drugDetails: '',
    occupation: '',
    hasOccupationalHazards: false,
    occupationHazardsDetails: '',
    participatesInDangerousSports: false,
    dangerousSportsDetails: '',
    height: '',
    weight: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    cholesterolLevel: '',
    isPregnant: false,
    pregnancyDueDate: '',
    hasPregnancyComplications: false,
    pregnancyComplicationDetails: '',
    hasDisability: false,
    disabilityDetails: '',
    hasLifeThreateningCondition: false,
    lifeThreateningConditionDetails: '',
    medicalRecordsConsent: false,
    // Enhanced lifestyle fields for premium calculation
    smokingStatus: data.healthDeclaration?.smokingStatus || 'non-smoker',
    alcoholConsumptionLevel: data.healthDeclaration?.alcoholConsumptionLevel || 'none',
    exerciseLevel: data.healthDeclaration?.exerciseLevel || 'moderate',
    exerciseHoursPerWeek: data.healthDeclaration?.exerciseHoursPerWeek || '',
    sleepQuality: data.healthDeclaration?.sleepQuality || 'good',
    averageSleepHours: data.healthDeclaration?.averageSleepHours || '',
    stressLevel: data.healthDeclaration?.stressLevel || 'moderate',
    dietQuality: data.healthDeclaration?.dietQuality || 'balanced',
    restingHeartRate: data.healthDeclaration?.restingHeartRate || '',
    // Merge with data from parent
    ...data.healthDeclaration,
  }));

  // Auto-calculated health metrics
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState(null);
  const [healthStatus, setHealthStatus] = useState(data.healthStatus || '');
  const [healthScore, setHealthScore] = useState(null);
  const [healthExplanation, setHealthExplanation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing health declaration data on component mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setIsLoadingData(true);
        const response = await getHealthDeclaration();
        
        console.log('🔍 Full response from service:', response);
        console.log('🔍 Has success field?', 'success' in response);
        console.log('🔍 Has hasMedicalConditions field?', 'hasMedicalConditions' in response);
        
        let actualData = null;
        
        // Handle two possible response formats:
        // Format 1: { success: true, data: {...} } - from backend wrapper
        // Format 2: {...} - direct DTO (if axios interceptor unwrapped too much)
        if (response && response.success && response.data) {
          // Format 1: Wrapped response
          console.log('📦 Wrapped response format detected');
          actualData = response.data;
        } else if (response && 'hasMedicalConditions' in response) {
          // Format 2: Direct DTO object (unwrapped)
          console.log('📋 Direct DTO format detected');
          actualData = response;
        } else if (response && response.success === false) {
          // Explicit failure from backend
          console.log('⚠️ Backend returned success=false (no data found)');
          setHasExistingData(false);
          setIsEditing(true);
          return;
        }
        
        if (actualData) {
          console.log('✅ Health declaration data loaded:', actualData);
          console.log('🔍 hasMedicalConditions:', actualData.hasMedicalConditions);
          console.log('🔍 medicalConditions (raw):', actualData.medicalConditions);
          console.log('🔍 medicalConditions type:', typeof actualData.medicalConditions);
          console.log('🔍 isOnMedication:', actualData.isOnMedication);
          console.log('🔍 medications (raw):', actualData.medications);
          console.log('✅ Setting hasExistingData = true');
          
          // Parse JSON fields back to arrays if they're strings
          // Convert all null values to empty strings or appropriate defaults
          const sanitizeValue = (value, defaultValue = '') => {
            return value === null || value === undefined ? defaultValue : value;
          };
          
          const loadedData = {
            ...actualData,
            // Arrays
            medicalConditions: Array.isArray(actualData.medicalConditions) 
              ? actualData.medicalConditions 
              : (actualData.medicalConditions ? JSON.parse(actualData.medicalConditions) : []),
            medications: Array.isArray(actualData.medications)
              ? actualData.medications
              : (actualData.medications ? JSON.parse(actualData.medications) : []),
            medicalConditionDetails: Array.isArray(actualData.medicalConditionDetails)
              ? actualData.medicalConditionDetails
              : (actualData.medicalConditionDetails ? JSON.parse(actualData.medicalConditionDetails) : []),
            
            // Auto-calculate boolean flags from arrays
            // Backend doesn't store these, so we derive them from the data
            hasMedicalConditions: (Array.isArray(actualData.medicalConditions) && actualData.medicalConditions.length > 0) ||
                                  (typeof actualData.medicalConditions === 'string' && actualData.medicalConditions && actualData.medicalConditions !== '[]'),
            isOnMedication: (Array.isArray(actualData.medications) && actualData.medications.length > 0) ||
                           (typeof actualData.medications === 'string' && actualData.medications && actualData.medications !== '[]'),
            hasHospitalization: actualData.hasHospitalization || 
                               (actualData.hospitalizationHistory && actualData.hospitalizationHistory.trim().length > 0),
            
            // Sanitize all string/number fields to prevent null values
            height: sanitizeValue(actualData.height),
            weight: sanitizeValue(actualData.weight),
            bloodPressureSystolic: sanitizeValue(actualData.bloodPressureSystolic),
            bloodPressureDiastolic: sanitizeValue(actualData.bloodPressureDiastolic),
            cholesterolLevel: sanitizeValue(actualData.cholesterolLevel),
            restingHeartRate: sanitizeValue(actualData.restingHeartRate),
            smokingPacksPerDay: sanitizeValue(actualData.smokingPacksPerDay),
            smokingYears: sanitizeValue(actualData.smokingYears),
            alcoholUnitsPerWeek: sanitizeValue(actualData.alcoholUnitsPerWeek),
            exerciseHoursPerWeek: sanitizeValue(actualData.exerciseHoursPerWeek),
            averageSleepHours: sanitizeValue(actualData.averageSleepHours),
            hospitalizationHistory: sanitizeValue(actualData.hospitalizationHistory),
            drugDetails: sanitizeValue(actualData.drugDetails),
            occupation: sanitizeValue(actualData.occupation),
            occupationHazardsDetails: sanitizeValue(actualData.occupationHazardsDetails),
            dangerousSportsDetails: sanitizeValue(actualData.dangerousSportsDetails),
            pregnancyDueDate: sanitizeValue(actualData.pregnancyDueDate),
            pregnancyComplicationDetails: sanitizeValue(actualData.pregnancyComplicationDetails),
            disabilityDetails: sanitizeValue(actualData.disabilityDetails),
            lifeThreateningConditionDetails: sanitizeValue(actualData.lifeThreateningConditionDetails),
            
            // Diagnosis dates and details
            heartDiseaseDiagnosisDate: sanitizeValue(actualData.heartDiseaseDiagnosisDate),
            strokeDiagnosisDate: sanitizeValue(actualData.strokeDiagnosisDate),
            cancerDetails: sanitizeValue(actualData.cancerDetails),
            cancerDiagnosisDate: sanitizeValue(actualData.cancerDiagnosisDate),
            diabetesType: sanitizeValue(actualData.diabetesType),
            diabetesDiagnosisDate: sanitizeValue(actualData.diabetesDiagnosisDate),
            diabetesHbA1c: sanitizeValue(actualData.diabetesHbA1c),
            highBloodPressureDiagnosisDate: sanitizeValue(actualData.highBloodPressureDiagnosisDate),
            highCholesterolDiagnosisDate: sanitizeValue(actualData.highCholesterolDiagnosisDate),
            kidneyDiseaseDiagnosisDate: sanitizeValue(actualData.kidneyDiseaseDiagnosisDate),
            liverDiseaseDiagnosisDate: sanitizeValue(actualData.liverDiseaseDiagnosisDate),
            mentalHealthDetails: sanitizeValue(actualData.mentalHealthDetails),
            mentalHealthDiagnosisDate: sanitizeValue(actualData.mentalHealthDiagnosisDate),
            hivDiagnosisDate: sanitizeValue(actualData.hivDiagnosisDate),
            lastMedicalCheckupDate: sanitizeValue(actualData.lastMedicalCheckupDate),
            surgeryDetails: sanitizeValue(actualData.surgeryDetails),
            pendingTestsDetails: sanitizeValue(actualData.pendingTestsDetails),
            plannedProceduresDetails: sanitizeValue(actualData.plannedProceduresDetails),
            familyOtherConditions: sanitizeValue(actualData.familyOtherConditions),
            fatherAgeAtDeath: sanitizeValue(actualData.fatherAgeAtDeath),
            fatherCauseOfDeath: sanitizeValue(actualData.fatherCauseOfDeath),
            motherAgeAtDeath: sanitizeValue(actualData.motherAgeAtDeath),
            motherCauseOfDeath: sanitizeValue(actualData.motherCauseOfDeath),
            
            // Treatment status fields (with default)
            heartDiseaseTreatmentStatus: sanitizeValue(actualData.heartDiseaseTreatmentStatus, 'controlled'),
            strokeTreatmentStatus: sanitizeValue(actualData.strokeTreatmentStatus, 'controlled'),
            cancerTreatmentStatus: sanitizeValue(actualData.cancerTreatmentStatus, 'controlled'),
            diabetesTreatmentStatus: sanitizeValue(actualData.diabetesTreatmentStatus, 'controlled'),
            highBloodPressureTreatmentStatus: sanitizeValue(actualData.highBloodPressureTreatmentStatus, 'controlled'),
            highCholesterolTreatmentStatus: sanitizeValue(actualData.highCholesterolTreatmentStatus, 'controlled'),
            kidneyDiseaseTreatmentStatus: sanitizeValue(actualData.kidneyDiseaseTreatmentStatus, 'controlled'),
            liverDiseaseTreatmentStatus: sanitizeValue(actualData.liverDiseaseTreatmentStatus, 'controlled'),
            mentalHealthTreatmentStatus: sanitizeValue(actualData.mentalHealthTreatmentStatus, 'controlled'),
            hivTreatmentStatus: sanitizeValue(actualData.hivTreatmentStatus, 'controlled'),
            
            // Lifestyle fields (with defaults)
            smokingStatus: sanitizeValue(actualData.smokingStatus, 'non-smoker'),
            alcoholConsumption: sanitizeValue(actualData.alcoholConsumption, 'None'),
            alcoholConsumptionLevel: sanitizeValue(actualData.alcoholConsumptionLevel, 'none'),
            exerciseLevel: sanitizeValue(actualData.exerciseLevel, 'moderate'),
            sleepQuality: sanitizeValue(actualData.sleepQuality, 'good'),
            stressLevel: sanitizeValue(actualData.stressLevel, 'moderate'),
            dietQuality: sanitizeValue(actualData.dietQuality, 'balanced'),
          };
          
          console.log('📦 LoadedData to be set:', loadedData);
          console.log('🔍 LoadedData.hasMedicalConditions:', loadedData.hasMedicalConditions);
          console.log('🔍 LoadedData.medicalConditions:', loadedData.medicalConditions);
          
          setFormData(prev => {
            const newFormData = {
              ...prev,
              ...loadedData
            };
            console.log('✅ New formData after merge:', newFormData);
            console.log('✅ formData.hasMedicalConditions:', newFormData.hasMedicalConditions);
            console.log('✅ formData.medicalConditions:', newFormData.medicalConditions);
            return newFormData;
          });
          
          setHasExistingData(true);
          setIsEditing(false); // Start in view/review mode
          console.log('🔒 Form is now in VIEW mode (disabled)');
        } else {
          console.log('⚠️ No valid data found, treating as new user');
          setHasExistingData(false);
          setIsEditing(true);
        }
      } catch (error) {
        // 404 is expected for new users - don't log as error
        if (error.status === 404) {
          console.log('ℹ️ No existing health declaration (new user)');
        } else {
          console.log('⚠️ Error loading health declaration:', error);
        }
        console.log('📝 Setting hasExistingData = false, isEditing = true');
        setHasExistingData(false);
        setIsEditing(true); // Start in edit mode if no existing data
      } finally {
        setIsLoadingData(false);
      }
    };

    loadExistingData();
  }, []);

  // Calculate BMI and health status when relevant fields change
  useEffect(() => {
    if (formData.height && formData.weight) {
      const calculatedBmi = calculateBMI(parseFloat(formData.height), parseFloat(formData.weight));
      setBmi(calculatedBmi);
      
      const category = getBMICategory(calculatedBmi);
      setBmiCategory(category);
    } else {
      setBmi(null);
      setBmiCategory(null);
    }
  }, [formData.height, formData.weight]);

  // Calculate health status when health factors change
  useEffect(() => {
    if (bmi) {
      const result = calculateHealthStatus({
        bmi,
        smokingStatus: formData.smokingStatus,
        alcoholConsumption: formData.alcoholConsumptionLevel,
        exerciseLevel: formData.exerciseLevel,
        sleepQuality: formData.sleepQuality,
        stressLevel: formData.stressLevel,
        dietQuality: formData.dietQuality,
        hasMedicalConditions: formData.hasMedicalConditions,
        hasChronicDiseases: formData.hasDiabetes || formData.hasHeartDisease || formData.hasHighBloodPressure,
        takingMedication: formData.isOnMedication,
      });
      
      setHealthStatus(result.status);
      setHealthScore(result.score);
      setHealthExplanation(getHealthStatusExplanation(result.status));
    }
  }, [
    bmi, 
    formData.smokingStatus, 
    formData.alcoholConsumptionLevel,
    formData.exerciseLevel,
    formData.sleepQuality,
    formData.stressLevel,
    formData.dietQuality,
    formData.hasMedicalConditions, 
    formData.hasDiabetes, 
    formData.hasHeartDisease, 
    formData.hasHighBloodPressure, 
    formData.isOnMedication
  ]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updates = {
        ...prev,
        [field]: value,
      };
      
      // Auto-clear related fields when user toggles boolean to false
      if (field === 'hasMedicalConditions' && value === false) {
        updates.medicalConditions = [];
        updates.medicalConditionDetails = [];
      }
      if (field === 'isOnMedication' && value === false) {
        updates.medications = [];
      }
      if (field === 'hasHospitalization' && value === false) {
        updates.hospitalizationHistory = '';
      }
      
      // Clear disease-specific fields when toggled off
      if (field === 'hasHeartDisease' && value === false) {
        updates.heartDiseaseDiagnosisDate = '';
        updates.heartDiseaseTreatmentStatus = 'controlled';
      }
      if (field === 'hasStroke' && value === false) {
        updates.strokeDiagnosisDate = '';
        updates.strokeTreatmentStatus = 'controlled';
      }
      if (field === 'hasCancer' && value === false) {
        updates.cancerDetails = '';
        updates.cancerDiagnosisDate = '';
        updates.cancerTreatmentStatus = 'controlled';
      }
      if (field === 'hasDiabetes' && value === false) {
        updates.diabetesType = '';
        updates.diabetesDiagnosisDate = '';
        updates.diabetesTreatmentStatus = 'controlled';
        updates.diabetesHbA1c = '';
      }
      if (field === 'hasHighBloodPressure' && value === false) {
        updates.highBloodPressureDiagnosisDate = '';
        updates.highBloodPressureTreatmentStatus = 'controlled';
      }
      if (field === 'hasHighCholesterol' && value === false) {
        updates.highCholesterolDiagnosisDate = '';
        updates.highCholesterolTreatmentStatus = 'controlled';
      }
      if (field === 'hasKidneyDisease' && value === false) {
        updates.kidneyDiseaseDiagnosisDate = '';
        updates.kidneyDiseaseTreatmentStatus = 'controlled';
      }
      if (field === 'hasLiverDisease' && value === false) {
        updates.liverDiseaseDiagnosisDate = '';
        updates.liverDiseaseTreatmentStatus = 'controlled';
      }
      if (field === 'hasMentalHealthCondition' && value === false) {
        updates.mentalHealthDetails = '';
        updates.mentalHealthDiagnosisDate = '';
        updates.mentalHealthTreatmentStatus = 'controlled';
      }
      if (field === 'hasHIV' && value === false) {
        updates.hivDiagnosisDate = '';
        updates.hivTreatmentStatus = 'controlled';
      }
      if (field === 'isSmoker' && value === false) {
        updates.smokingPacksPerDay = '';
        updates.smokingYears = '';
      }
      if (field === 'usesDrugs' && value === false) {
        updates.drugDetails = '';
      }
      if (field === 'hasOccupationalHazards' && value === false) {
        updates.occupationHazardsDetails = '';
      }
      if (field === 'participatesInDangerousSports' && value === false) {
        updates.dangerousSportsDetails = '';
      }
      if (field === 'isPregnant' && value === false) {
        updates.pregnancyDueDate = '';
        updates.hasPregnancyComplications = false;
        updates.pregnancyComplicationDetails = '';
      }
      if (field === 'hasPregnancyComplications' && value === false) {
        updates.pregnancyComplicationDetails = '';
      }
      if (field === 'hasDisability' && value === false) {
        updates.disabilityDetails = '';
      }
      if (field === 'hasLifeThreateningCondition' && value === false) {
        updates.lifeThreateningConditionDetails = '';
      }
      if (field === 'hasSurgeryLast5Years' && value === false) {
        updates.surgeryDetails = '';
      }
      if (field === 'hasPendingMedicalTests' && value === false) {
        updates.pendingTestsDetails = '';
      }
      if (field === 'hasPlannedProcedures' && value === false) {
        updates.plannedProceduresDetails = '';
      }
      if (field === 'fatherDeceased' && value === false) {
        updates.fatherAgeAtDeath = '';
        updates.fatherCauseOfDeath = '';
      }
      if (field === 'motherDeceased' && value === false) {
        updates.motherAgeAtDeath = '';
        updates.motherCauseOfDeath = '';
      }
      
      return updates;
    });
    
    // Real-time validation
    const errors = { ...validationErrors };
    
    if (field === 'height') {
      const error = validateHeight(value);
      if (error) errors.height = error;
      else delete errors.height;
    }
    
    if (field === 'weight') {
      const error = validateWeight(value);
      if (error) errors.weight = error;
      else delete errors.weight;
    }
    
    if (field === 'bloodPressureSystolic' || field === 'bloodPressureDiastolic') {
      const systolic = field === 'bloodPressureSystolic' ? value : formData.bloodPressureSystolic;
      const diastolic = field === 'bloodPressureDiastolic' ? value : formData.bloodPressureDiastolic;
      const error = validateBloodPressure(systolic, diastolic);
      if (error) errors.bloodPressure = error;
      else delete errors.bloodPressure;
    }
    
    if (field === 'cholesterolLevel') {
      const error = validateCholesterol(value);
      if (error) errors.cholesterol = error;
      else delete errors.cholesterol;
    }
    
    setValidationErrors(errors);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNext = async () => {
    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      // Validate required fields
      const errors = {};
      
      // Height and Weight are required for BMI calculation
      if (!formData.height || formData.height.trim() === '') {
        errors.height = 'Height is required';
      }
      if (!formData.weight || formData.weight.trim() === '') {
        errors.weight = 'Weight is required';
      }
      
      // Consent is required
      if (!formData.medicalRecordsConsent) {
        errors.consent = 'You must consent to medical records access';
      }

      // If there are validation errors, don't proceed
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        // Mark all error fields as touched
        const touchedFields = Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(prev => ({ ...prev, ...touchedFields }));
        setSaveError('Please fill in all required fields marked with *');
        toast.error('Validation Error', {
          description: 'Please fill in all required fields marked with *',
          duration: 4000,
        });
        setSaving(false);
        return;
      }

      // Prepare health declaration data with calculated metrics
      const healthDeclarationData = {
        ...formData,
        BMI: bmi,
        HealthStatus: healthStatus,
        HealthScore: healthScore
      };

      // Save to database
      const result = await saveHealthDeclaration(healthDeclarationData);
      console.log('✅ Health declaration saved to database:', result);
      
      // Progressive saving: Save to application if applicationId exists
      if (applicationId) {
        try {
          await applicationService.updateHealthDeclaration(applicationId, healthDeclarationData);
          console.log('✅ Health declaration saved to application');
        } catch (appError) {
          console.error('❌ Failed to save health declaration to application:', appError);
          // Don't block the flow - user can still proceed
        }
      }
      
      setSaveSuccess(true);
      setHasExistingData(true);
      setIsEditing(false); // Switch to view mode after save

      // Update parent with health declaration data and calculated health status
      onChange({ 
        healthDeclaration: formData,
        healthStatus: healthStatus // Pass calculated health status to parent
      });

      // Proceed to next step
      onNext();
    } catch (error) {
      console.error('❌ Error saving health declaration:', error);
      setSaveError(error.response?.data?.message || 'Failed to save health declaration. You can still proceed, but your data may not be saved.');
      
      // Still allow user to proceed even if save fails
      onChange({ 
        healthDeclaration: formData,
        healthStatus: healthStatus
      });
      onNext();
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      // Validate required fields before saving
      const errors = {};
      
      // Height and Weight are required for BMI calculation
      if (!formData.height || formData.height.trim() === '') {
        errors.height = 'Height is required';
      }
      if (!formData.weight || formData.weight.trim() === '') {
        errors.weight = 'Weight is required';
      }
      
      // Consent is required
      if (!formData.medicalRecordsConsent) {
        errors.consent = 'You must consent to medical records access';
      }

      // If there are validation errors, don't save
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        // Mark all error fields as touched
        const touchedFields = Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(prev => ({ ...prev, ...touchedFields }));
        setSaveError('Please fill in all required fields marked with *');
        toast.error('Validation Error', {
          description: 'Please fill in all required fields: Height, Weight, and Medical Records Consent.',
          duration: 4000,
        });
        setSaving(false);
        return;
      }

      console.log('💾 Starting save...');
      console.log('📋 Current formData:', formData);
      console.log('🔍 formData.hasMedicalConditions:', formData.hasMedicalConditions);
      console.log('🔍 formData.medicalConditions:', formData.medicalConditions);

      // Prepare health declaration data with calculated metrics
      const healthDeclarationData = {
        ...formData,
        BMI: bmi,
        HealthStatus: healthStatus,
        HealthScore: healthScore
      };

      console.log('📤 Data being sent to API:', healthDeclarationData);
      console.log('📤 hasMedicalConditions in payload:', healthDeclarationData.hasMedicalConditions);
      console.log('📤 medicalConditions in payload:', healthDeclarationData.medicalConditions);

      // Save to database
      const result = await saveHealthDeclaration(healthDeclarationData);
      console.log('✅ Save result:', result);
      console.log('✅ Health declaration updated:', result);
      
      setSaveSuccess(true);
      setIsEditing(false); // Switch to view mode after save
      setHasExistingData(true); // Mark as having data after successful save
      setValidationErrors({}); // Clear any validation errors
      
      // Update parent with health declaration data and calculated health status
      onChange({ 
        healthDeclaration: formData,
        healthStatus: healthStatus
      });
      
      // Reload data from server to verify it was saved
      console.log('🔄 Reloading data from server to verify save...');
      const reloadedData = await getHealthDeclaration();
      console.log('📥 Reloaded data:', reloadedData);
      
      toast.success('Health Declaration Saved', {
        description: 'Your health information has been saved successfully.',
        duration: 3000,
      });
      
      // Show success message briefly
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error updating health declaration:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update health declaration.';
      setSaveError(errorMsg);
      toast.error('Save Failed', {
        description: errorMsg,
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSaveError('');
    setSaveSuccess(false);
  };

  // Show loading state while fetching existing data
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health declaration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Please answer all questions honestly and completely. Incomplete or inaccurate information may result in claim denial or policy cancellation.
          <br />
          <span className="text-sm mt-2 inline-block">
            Fields marked with <span className="text-red-600 font-bold">*</span> are required.
          </span>
        </AlertDescription>
      </Alert>

      {/* Existing Data Notice - Prominent banner in view mode */}
      {!isEditing && hasExistingData && (
        <Alert className="border-green-300 bg-green-50 shadow-sm">
          <Info className="h-5 w-5 text-green-600" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div>
                <strong className="text-green-900 text-base">✓ Your Health Declaration is Loaded</strong>
                <p className="text-green-700 mt-2">
                  Your previously saved health information is shown below in <strong>read-only mode</strong>.
                </p>
                <p className="text-green-700 mt-1 text-sm">
                  👉 <strong>To make changes:</strong> Click the <strong>"Edit"</strong> button at the top-right corner of the first section.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Mode Notice - Show when editing existing data */}
      {isEditing && hasExistingData && (
        <Alert className="border-blue-300 bg-blue-50 shadow-sm">
          <Edit className="h-5 w-5 text-blue-600" />
          <AlertDescription>
            <div>
              <strong className="text-blue-900 text-base"> Editing Mode Active</strong>
              <p className="text-blue-700 mt-2">
                You can now update your health information below.
              </p>
              <p className="text-blue-700 mt-1 text-sm">
                Click <strong>"Save Changes"</strong> when done or <strong>"Cancel"</strong> to discard your edits.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Save Success Message */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✓ Health declaration saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Save Error Message */}
      {saveError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {saveError}
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Button - Show at top when not editing */}
      {!isEditing && (
        <Card className="bg-gray-50 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Health Declaration</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your health information has been saved. Click Edit to modify.
                </p>
              </div>
              <Button
                onClick={toggleEditMode}
                variant="outline"
                size="lg"
                type="button"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Health Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wrap all form inputs in fieldset for easy disable/enable */}
      <fieldset disabled={!isEditing} className={`${!isEditing ? 'opacity-75' : ''} space-y-6 ${hasExistingData ? 'mt-8' : 'mt-6'}`}>
        
      {/* Section 1: Basic Medical History */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-5 h-5 text-red-500" />
            Medical History
          </CardTitle>
          <CardDescription className="mt-2">
            Current and past medical conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pre-existing Conditions */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medicalConditions"
                checked={formData.hasMedicalConditions}
                onCheckedChange={(checked) => handleChange('hasMedicalConditions', checked)}
              />
              <Label htmlFor="medicalConditions" className="font-normal">
                Do you have any pre-existing medical conditions?
              </Label>
            </div>
            {formData.hasMedicalConditions && (
              <Input
                placeholder="Please list all conditions (e.g., asthma, arthritis, etc.)"
                value={formData.medicalConditions.join(', ')}
                onChange={(e) => handleChange('medicalConditions', e.target.value.split(',').map(s => s.trim()))}
                className="ml-6"
              />
            )}
          </div>

          {/* Current Medication */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medication"
                checked={formData.isOnMedication}
                onCheckedChange={(checked) => handleChange('isOnMedication', checked)}
              />
              <Label htmlFor="medication" className="font-normal">
                Are you currently taking any medication?
              </Label>
            </div>
            {formData.isOnMedication && (
              <Input
                placeholder="List medications with dosages (e.g., Lisinopril 10mg daily)"
                value={formData.medications.join(', ')}
                onChange={(e) => handleChange('medications', e.target.value.split(',').map(s => s.trim()))}
                className="ml-6"
              />
            )}
          </div>

          {/* Hospitalization */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hospitalization"
                checked={formData.hasHospitalization}
                onCheckedChange={(checked) => handleChange('hasHospitalization', checked)}
              />
              <Label htmlFor="hospitalization" className="font-normal">
                Have you been hospitalized in the last 5 years?
              </Label>
            </div>
            {formData.hasHospitalization && (
              <Input
                placeholder="Provide dates, reasons, and hospital names"
                value={formData.hospitalizationHistory}
                onChange={(e) => handleChange('hospitalizationHistory', e.target.value)}
                className="ml-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Specific Diseases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-blue-500" />
            Specific Health Conditions
          </CardTitle>
          <CardDescription>
            Please check if you have or have had any of the following
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Heart Disease */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="heartDisease"
                checked={formData.hasHeartDisease}
                onCheckedChange={(checked) => handleChange('hasHeartDisease', checked)}
              />
              <Label htmlFor="heartDisease" className="font-normal">
                Heart Disease / Heart Attack
              </Label>
            </div>

            {/* Stroke */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stroke"
                checked={formData.hasStroke}
                onCheckedChange={(checked) => handleChange('hasStroke', checked)}
              />
              <Label htmlFor="stroke" className="font-normal">
                Stroke / TIA
              </Label>
            </div>

            {/* High Blood Pressure */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="highBP"
                checked={formData.hasHighBloodPressure}
                onCheckedChange={(checked) => handleChange('hasHighBloodPressure', checked)}
              />
              <Label htmlFor="highBP" className="font-normal">
                High Blood Pressure
              </Label>
            </div>

            {/* High Cholesterol */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="highCholesterol"
                checked={formData.hasHighCholesterol}
                onCheckedChange={(checked) => handleChange('hasHighCholesterol', checked)}
              />
              <Label htmlFor="highCholesterol" className="font-normal">
                High Cholesterol
              </Label>
            </div>

            {/* Kidney Disease */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kidneyDisease"
                checked={formData.hasKidneyDisease}
                onCheckedChange={(checked) => handleChange('hasKidneyDisease', checked)}
              />
              <Label htmlFor="kidneyDisease" className="font-normal">
                Kidney Disease
              </Label>
            </div>

            {/* Liver Disease */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="liverDisease"
                checked={formData.hasLiverDisease}
                onCheckedChange={(checked) => handleChange('hasLiverDisease', checked)}
              />
              <Label htmlFor="liverDisease" className="font-normal">
                Liver Disease / Hepatitis
              </Label>
            </div>

            {/* HIV/AIDS */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hiv"
                checked={formData.hasHIV}
                onCheckedChange={(checked) => handleChange('hasHIV', checked)}
              />
              <Label htmlFor="hiv" className="font-normal">
                HIV / AIDS
              </Label>
            </div>
          </div>

          {/* Cancer - with details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cancer"
                checked={formData.hasCancer}
                onCheckedChange={(checked) => handleChange('hasCancer', checked)}
              />
              <Label htmlFor="cancer" className="font-normal">
                Cancer (any type)
              </Label>
            </div>
            {formData.hasCancer && (
              <Input
                placeholder="Specify type, stage, treatment dates, and current status"
                value={formData.cancerDetails}
                onChange={(e) => handleChange('cancerDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>

          {/* Diabetes - with enhanced details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diabetes"
                checked={formData.hasDiabetes}
                onCheckedChange={(checked) => handleChange('hasDiabetes', checked)}
              />
              <Label htmlFor="diabetes" className="font-normal">
                Diabetes
              </Label>
            </div>
            {formData.hasDiabetes && (
              <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm">Diabetes Type</Label>
                  <Input
                    placeholder="Type 1, Type 2, or Gestational"
                    value={formData.diabetesType}
                    onChange={(e) => handleChange('diabetesType', e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Diagnosis Date</Label>
                    <Input
                      type="date"
                      value={formData.diabetesDiagnosisDate}
                      onChange={(e) => handleChange('diabetesDiagnosisDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Latest HbA1c (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 6.5"
                      value={formData.diabetesHbA1c}
                      onChange={(e) => handleChange('diabetesHbA1c', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Treatment Status</Label>
                  <Select
                    value={formData.diabetesTreatmentStatus || 'controlled'}
                    onValueChange={(value) => handleChange('diabetesTreatmentStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TREATMENT_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span>{option.label}</span>
                            <span className="text-xs text-gray-500">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Mental Health */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mentalHealth"
                checked={formData.hasMentalHealthCondition}
                onCheckedChange={(checked) => handleChange('hasMentalHealthCondition', checked)}
              />
              <Label htmlFor="mentalHealth" className="font-normal">
                Mental Health Condition (Depression, Anxiety, etc.)
              </Label>
            </div>
            {formData.hasMentalHealthCondition && (
              <Input
                placeholder="Specify condition, treatment, and current status"
                value={formData.mentalHealthDetails}
                onChange={(e) => handleChange('mentalHealthDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Recent Medical Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Medical Events</CardTitle>
          <CardDescription>
            Surgeries, tests, and planned procedures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Surgeries */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="surgery"
                checked={formData.hasSurgeryLast5Years}
                onCheckedChange={(checked) => handleChange('hasSurgeryLast5Years', checked)}
              />
              <Label htmlFor="surgery" className="font-normal">
                Surgery or operation in the last 5 years?
              </Label>
            </div>
            {formData.hasSurgeryLast5Years && (
              <Input
                placeholder="Type of surgery, date, hospital, and outcome"
                value={formData.surgeryDetails}
                onChange={(e) => handleChange('surgeryDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>

          {/* Pending Tests */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pendingTests"
                checked={formData.hasPendingMedicalTests}
                onCheckedChange={(checked) => handleChange('hasPendingMedicalTests', checked)}
              />
              <Label htmlFor="pendingTests" className="font-normal">
                Medical tests with pending results?
              </Label>
            </div>
            {formData.hasPendingMedicalTests && (
              <Input
                placeholder="Test type and expected results date"
                value={formData.pendingTestsDetails}
                onChange={(e) => handleChange('pendingTestsDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>

          {/* Planned Procedures */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="plannedProcedures"
                checked={formData.hasPlannedProcedures}
                onCheckedChange={(checked) => handleChange('hasPlannedProcedures', checked)}
              />
              <Label htmlFor="plannedProcedures" className="font-normal">
                Scheduled medical procedures or treatments?
              </Label>
            </div>
            {formData.hasPlannedProcedures && (
              <Input
                placeholder="Procedure type and scheduled date"
                value={formData.plannedProceduresDetails}
                onChange={(e) => handleChange('plannedProceduresDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Family Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5 text-purple-500" />
            Family Medical History
          </CardTitle>
          <CardDescription>
            Medical conditions in immediate family (parents, siblings)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Family Conditions */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyHeart"
                checked={formData.familyHeartDisease}
                onCheckedChange={(checked) => handleChange('familyHeartDisease', checked)}
              />
              <Label htmlFor="familyHeart" className="font-normal">
                Heart Disease in family
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyCancer"
                checked={formData.familyCancer}
                onCheckedChange={(checked) => handleChange('familyCancer', checked)}
              />
              <Label htmlFor="familyCancer" className="font-normal">
                Cancer in family
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyDiabetes"
                checked={formData.familyDiabetes}
                onCheckedChange={(checked) => handleChange('familyDiabetes', checked)}
              />
              <Label htmlFor="familyDiabetes" className="font-normal">
                Diabetes in family
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyStroke"
                checked={formData.familyStroke}
                onCheckedChange={(checked) => handleChange('familyStroke', checked)}
              />
              <Label htmlFor="familyStroke" className="font-normal">
                Stroke in family
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Other family conditions (if any)</Label>
            <Input
              placeholder="Specify condition and relationship"
              value={formData.familyOtherConditions}
              onChange={(e) => handleChange('familyOtherConditions', e.target.value)}
            />
          </div>

          {/* Parents Health Info */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-sm">Parents' Health Information</h4>
            
            {/* Father */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fatherDeceased"
                  checked={formData.fatherDeceased}
                  onCheckedChange={(checked) => handleChange('fatherDeceased', checked)}
                />
                <Label htmlFor="fatherDeceased" className="font-normal">
                  Father deceased
                </Label>
              </div>
              {formData.fatherDeceased && (
                <div className="ml-6 grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Age at death</Label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={formData.fatherAgeAtDeath}
                      onChange={(e) => handleChange('fatherAgeAtDeath', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Cause of death</Label>
                    <Input
                      placeholder="Cause"
                      value={formData.fatherCauseOfDeath}
                      onChange={(e) => handleChange('fatherCauseOfDeath', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mother */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="motherDeceased"
                  checked={formData.motherDeceased}
                  onCheckedChange={(checked) => handleChange('motherDeceased', checked)}
                />
                <Label htmlFor="motherDeceased" className="font-normal">
                  Mother deceased
                </Label>
              </div>
              {formData.motherDeceased && (
                <div className="ml-6 grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Age at death</Label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={formData.motherAgeAtDeath}
                      onChange={(e) => handleChange('motherAgeAtDeath', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Cause of death</Label>
                    <Input
                      placeholder="Cause"
                      value={formData.motherCauseOfDeath}
                      onChange={(e) => handleChange('motherCauseOfDeath', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Lifestyle & Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-green-500" />
            Lifestyle & Habits
          </CardTitle>
          <CardDescription>
            Your lifestyle choices affect premium calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Height & Weight for BMI */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="e.g., 175 (100-250)"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                onBlur={() => handleBlur('height')}
                className={touched.height && validationErrors.height ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {touched.height && validationErrors.height && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.height}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70 (30-300)"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                onBlur={() => handleBlur('weight')}
                className={touched.weight && validationErrors.weight ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {touched.weight && validationErrors.weight && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.weight}</p>
              )}
            </div>
          </div>

          {/* BMI Display */}
          {bmi && bmiCategory && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>BMI: {bmi}</strong> - {bmiCategory.category}
                    <p className="text-sm text-gray-600 mt-1">{bmiCategory.healthImpact}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bmiCategory.category === 'Normal weight' ? 'bg-green-100 text-green-800' :
                    bmiCategory.category === 'Overweight' || bmiCategory.category === 'Underweight' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bmiCategory.category}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Smoking Status */}
          <div className="space-y-2">
            <Label htmlFor="smokingStatus">
              Smoking Status
              <span className="ml-2 text-xs text-gray-500">(impacts premium)</span>
            </Label>
            <Select
              value={formData.smokingStatus || 'non-smoker'}
              onValueChange={(value) => handleChange('smokingStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select smoking status" />
              </SelectTrigger>
              <SelectContent>
                {SMOKING_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">{option.healthImpact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alcohol Consumption */}
          <div className="space-y-2">
            <Label htmlFor="alcoholConsumptionLevel">
              Alcohol Consumption
              <span className="ml-2 text-xs text-gray-500">(impacts premium)</span>
            </Label>
            <Select
              value={formData.alcoholConsumptionLevel || 'none'}
              onValueChange={(value) => handleChange('alcoholConsumptionLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alcohol consumption level" />
              </SelectTrigger>
              <SelectContent>
                {ALCOHOL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">{option.healthImpact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Legacy fields for additional details */}
          {formData.smokingStatus !== 'non-smoker' && (
            <div className="ml-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smoker"
                  checked={formData.isSmoker}
                  onCheckedChange={(checked) => handleChange('isSmoker', checked)}
                />
                <Label htmlFor="smoker" className="font-normal text-sm">
                  Provide additional smoking details (optional)
                </Label>
              </div>
              {formData.isSmoker && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Packs per day</Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g., 1"
                      value={formData.smokingPacksPerDay}
                      onChange={(e) => handleChange('smokingPacksPerDay', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Years smoked</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.smokingYears}
                      onChange={(e) => handleChange('smokingYears', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Drugs */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drugs"
                checked={formData.usesDrugs}
                onCheckedChange={(checked) => handleChange('usesDrugs', checked)}
              />
              <Label htmlFor="drugs" className="font-normal">
                Use or have used recreational drugs
              </Label>
            </div>
            {formData.usesDrugs && (
              <Input
                placeholder="Specify type and usage pattern"
                value={formData.drugDetails}
                onChange={(e) => handleChange('drugDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>

          {/* NEW: Enhanced Lifestyle Factors */}
          <div className="border-t pt-6 mt-6 space-y-6">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              Enhanced Lifestyle Assessment
            </h3>
            <p className="text-sm text-gray-600">
              These factors significantly impact your health status and premium calculation
            </p>

            {/* Exercise Level */}
            <div className="space-y-2">
              <Label htmlFor="exerciseLevel">
                Physical Activity Level
                <span className="ml-2 text-xs text-gray-500">(impacts premium)</span>
              </Label>
              <Select
                value={formData.exerciseLevel || 'moderate'}
                onValueChange={(value) => handleChange('exerciseLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise level" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                <Label className="text-sm">Average exercise hours per week (optional)</Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="e.g., 5"
                  value={formData.exerciseHoursPerWeek}
                  onChange={(e) => handleChange('exerciseHoursPerWeek', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="space-y-2">
              <Label htmlFor="sleepQuality">
                Sleep Quality
                <span className="ml-2 text-xs text-gray-500">(impacts premium)</span>
              </Label>
              <Select
                value={formData.sleepQuality || 'good'}
                onValueChange={(value) => handleChange('sleepQuality', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sleep quality" />
                </SelectTrigger>
                <SelectContent>
                  {SLEEP_QUALITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                <Label className="text-sm">Average sleep hours per night (optional)</Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="e.g., 7"
                  value={formData.averageSleepHours}
                  onChange={(e) => handleChange('averageSleepHours', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-2">
              <Label htmlFor="stressLevel">
                Stress Level
                <span className="ml-2 text-xs text-gray-500">(impacts premium)</span>
              </Label>
              <Select
                value={formData.stressLevel || 'moderate'}
                onValueChange={(value) => handleChange('stressLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  {STRESS_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Diet Quality */}
            <div className="space-y-2">
              <Label htmlFor="dietQuality">
                Diet Quality
                <span className="ml-2 text-xs text-gray-500">(impacts premium)</span>
              </Label>
              <Select
                value={formData.dietQuality || 'balanced'}
                onValueChange={(value) => handleChange('dietQuality', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet quality" />
                </SelectTrigger>
                <SelectContent>
                  {DIET_QUALITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Health Status Summary - Enhanced with smooth animations and score */}
          {healthStatus && healthExplanation && healthScore !== null && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`
                relative overflow-hidden rounded-xl border-2 
                ${healthExplanation.borderColor} ${healthExplanation.bgColor}
                shadow-lg hover:shadow-xl transition-all duration-300
              `}>
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl -z-0"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    {/* Animated Icon with Score */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {/* Circular progress ring */}
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-gray-200"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className={`
                              ${healthStatus === 'Excellent' ? 'text-green-500' : ''}
                              ${healthStatus === 'Good' ? 'text-blue-500' : ''}
                              ${healthStatus === 'Fair' ? 'text-orange-500' : ''}
                              ${healthStatus === 'Poor' ? 'text-red-500' : ''}
                              transition-all duration-1000 ease-out
                            `}
                            strokeDasharray={`${(healthScore / 100) * 264} 264`}
                            style={{
                              animation: 'draw 1s ease-out forwards'
                            }}
                          />
                        </svg>
                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl animate-pulse">{healthExplanation.icon}</span>
                          <span className="text-xs font-bold text-gray-700 mt-0.5">{healthScore}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Title with badge */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-lg font-bold ${healthExplanation.textColor}`}>
                          Your Health Assessment
                        </h3>
                        <span className={`
                          inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
                          ${healthStatus === 'Excellent' ? 'bg-green-100 text-green-800 ring-2 ring-green-300' : ''}
                          ${healthStatus === 'Good' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300' : ''}
                          ${healthStatus === 'Fair' ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-300' : ''}
                          ${healthStatus === 'Poor' ? 'bg-red-100 text-red-800 ring-2 ring-red-300' : ''}
                          shadow-sm animate-in slide-in-from-right-2 duration-300 delay-200
                        `}>
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                          {healthStatus}
                        </span>
                      </div>
                      
                      {/* Score Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">Health Score</span>
                          <span className="font-bold text-gray-900">{healthScore}/100</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`
                              h-full rounded-full transition-all duration-1000 ease-out
                              ${healthStatus === 'Excellent' ? 'bg-gradient-to-r from-green-400 to-green-600' : ''}
                              ${healthStatus === 'Good' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : ''}
                              ${healthStatus === 'Fair' ? 'bg-gradient-to-r from-orange-400 to-orange-600' : ''}
                              ${healthStatus === 'Poor' ? 'bg-gradient-to-r from-red-400 to-red-600' : ''}
                              shadow-lg
                            `}
                            style={{ width: `${healthScore}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span className="text-gray-400">Poor</span>
                          <span className="text-gray-400">Fair</span>
                          <span className="text-gray-400">Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                      
                      {/* Message */}
                      <p className="text-base font-medium text-gray-800 leading-relaxed">
                        {healthExplanation.message}
                      </p>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {healthExplanation.description}
                      </p>
                      
                      {/* Info footer */}
                      <div className="flex items-start gap-2 pt-3 border-t border-gray-200/50">
                        <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          This assessment is automatically calculated based on BMI, lifestyle factors (exercise, sleep, stress, diet), 
                          smoking/alcohol habits, and medical conditions. It will be used for premium calculation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 6: Occupation & Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-5 h-5 text-orange-500" />
            Occupation & Activities
          </CardTitle>
          <CardDescription>
            Note: Occupation risk is already captured in Step 1
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current occupation</Label>
            <Input
              placeholder="Job title and brief description"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="occupationalHazards"
                checked={formData.hasOccupationalHazards}
                onCheckedChange={(checked) => handleChange('hasOccupationalHazards', checked)}
              />
              <Label htmlFor="occupationalHazards" className="font-normal">
                Work involves hazardous materials, heights, or dangerous conditions
              </Label>
            </div>
            {formData.hasOccupationalHazards && (
              <Input
                placeholder="Describe the hazards"
                value={formData.occupationHazardsDetails}
                onChange={(e) => handleChange('occupationHazardsDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dangerousSports"
                checked={formData.participatesInDangerousSports}
                onCheckedChange={(checked) => handleChange('participatesInDangerousSports', checked)}
              />
              <Label htmlFor="dangerousSports" className="font-normal">
                Participate in dangerous sports or hobbies (diving, flying, racing, etc.)
              </Label>
            </div>
            {formData.participatesInDangerousSports && (
              <Input
                placeholder="List activities and frequency"
                value={formData.dangerousSportsDetails}
                onChange={(e) => handleChange('dangerousSportsDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Physical Measurements & Vital Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Physical Measurements & Vital Statistics</CardTitle>
          <CardDescription>
            Provide accurate measurements for premium calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Height (cm) <span className="text-red-600">*</span> <span className="text-xs text-gray-500">(100-250)</span></Label>
              <Input
                type="number"
                required
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="170"
                className={validationErrors.height ? 'border-red-500' : ''}
              />
              {validationErrors.height && (
                <p className="text-xs text-red-600">{validationErrors.height}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Weight (kg) <span className="text-red-600">*</span> <span className="text-xs text-gray-500">(30-300)</span></Label>
              <Input
                type="number"
                required
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="70"
                className={validationErrors.weight ? 'border-red-500' : ''}
              />
              {validationErrors.weight && (
                <p className="text-xs text-red-600">{validationErrors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>BMI (Auto-calculated)</Label>
              <Input
                type="text"
                value={bmi || 'N/A'}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Systolic BP <span className="text-xs text-gray-500">(70-200 mmHg)</span></Label>
              <Input
                type="number"
                placeholder="120"
                value={formData.bloodPressureSystolic}
                onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
                className={validationErrors.bloodPressure ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Diastolic BP <span className="text-xs text-gray-500">(40-130 mmHg)</span></Label>
              <Input
                type="number"
                placeholder="80"
                value={formData.bloodPressureDiastolic}
                onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
                className={validationErrors.bloodPressure ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Cholesterol <span className="text-xs text-gray-500">(100-400 mg/dL)</span></Label>
              <Input
                type="number"
                placeholder="200"
                value={formData.cholesterolLevel}
                onChange={(e) => handleChange('cholesterolLevel', e.target.value)}
                className={validationErrors.cholesterol ? 'border-red-500' : ''}
              />
              {validationErrors.cholesterol && (
                <p className="text-xs text-red-600">{validationErrors.cholesterol}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Heart Rate <span className="text-xs text-gray-500">(40-120 bpm)</span></Label>
              <Input
                type="number"
                placeholder="70"
                value={formData.restingHeartRate}
                onChange={(e) => handleChange('restingHeartRate', e.target.value)}
              />
            </div>
          </div>

          {validationErrors.bloodPressure && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="size-4" />
              <AlertDescription>{validationErrors.bloodPressure}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Section 8: Reproductive Health (conditional) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Reproductive Health (if applicable)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pregnant"
                checked={formData.isPregnant}
                onCheckedChange={(checked) => handleChange('isPregnant', checked)}
              />
              <Label htmlFor="pregnant" className="font-normal">
                Currently pregnant
              </Label>
            </div>
            {formData.isPregnant && (
              <div className="ml-6 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Expected due date</Label>
                  <Input
                    type="date"
                    value={formData.pregnancyDueDate}
                    onChange={(e) => handleChange('pregnancyDueDate', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pregnancyComplications"
                      checked={formData.hasPregnancyComplications}
                      onCheckedChange={(checked) => handleChange('hasPregnancyComplications', checked)}
                    />
                    <Label htmlFor="pregnancyComplications" className="font-normal text-sm">
                      Any complications?
                    </Label>
                  </div>
                  {formData.hasPregnancyComplications && (
                    <Input
                      placeholder="Describe complications"
                      value={formData.pregnancyComplicationDetails}
                      onChange={(e) => handleChange('pregnancyComplicationDetails', e.target.value)}
                      className="ml-6"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Disability & Life-Threatening Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Additional Health Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Last Medical Checkup */}
          <div className="space-y-2">
            <Label htmlFor="lastCheckup">Last Medical Checkup Date</Label>
            <Input
              id="lastCheckup"
              type="date"
              value={formData.lastMedicalCheckupDate}
              onChange={(e) => handleChange('lastMedicalCheckupDate', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              When was your last complete physical examination?
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="disability"
                checked={formData.hasDisability}
                onCheckedChange={(checked) => handleChange('hasDisability', checked)}
              />
              <Label htmlFor="disability" className="font-normal">
                Have any disability or physical impairment
              </Label>
            </div>
            {formData.hasDisability && (
              <Input
                placeholder="Describe disability and impact on daily activities"
                value={formData.disabilityDetails}
                onChange={(e) => handleChange('disabilityDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lifeThreatening"
                checked={formData.hasLifeThreateningCondition}
                onCheckedChange={(checked) => handleChange('hasLifeThreateningCondition', checked)}
              />
              <Label htmlFor="lifeThreatening" className="font-normal">
                Have any condition that may affect life expectancy
              </Label>
            </div>
            {formData.hasLifeThreateningCondition && (
              <Input
                placeholder="Describe condition and prognosis"
                value={formData.lifeThreateningConditionDetails}
                onChange={(e) => handleChange('lifeThreateningConditionDetails', e.target.value)}
                className="ml-6"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Consent */}
      <Card className={validationErrors.consent ? 'border-red-500 border-2' : ''}>
        <CardHeader>
          <CardTitle className="text-xl">Medical Records Authorization <span className="text-red-600">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="medicalConsent"
              checked={formData.medicalRecordsConsent}
              onCheckedChange={(checked) => handleChange('medicalRecordsConsent', checked)}
              className="mt-1"
            />
            <Label htmlFor="medicalConsent" className="font-normal leading-relaxed">
              I authorize the insurance company to obtain my medical records from healthcare providers, hospitals, and laboratories for underwriting purposes. I understand this information will be kept confidential and used solely for policy evaluation.
            </Label>
          </div>
          {validationErrors.consent && (
            <p className="text-sm text-red-600 mt-2 font-semibold">{validationErrors.consent}</p>
          )}
        </CardContent>
      </Card>

      </fieldset> {/* End of disabled fieldset */}

      {/* Save/Cancel Buttons when editing */}
      {isEditing && (
        <div className="space-y-2">
          {(!formData.height || !formData.weight || !formData.medicalRecordsConsent) && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-sm text-yellow-800">
                Please fill in all required fields: Height, Weight, and Medical Records Consent
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveChanges}
              size="lg"
              className="flex-1"
              disabled={
                saving ||
                !formData.height || 
                !formData.weight || 
                !formData.medicalRecordsConsent
              }
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                hasExistingData ? 'Save Changes' : 'Save Health Declaration'
              )}
            </Button>
            {hasExistingData && (
              <Button
                onClick={toggleEditMode}
                variant="outline"
                size="lg"
                disabled={saving}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg" disabled={saving}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Personal Info
        </Button>
        
        <div className="space-y-2">
          {saveError && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription className="text-sm">
                {saveError}
              </AlertDescription>
            </Alert>
          )}
          {saveSuccess && (
            <Alert className="mb-2 bg-green-50 border-green-200">
              <AlertDescription className="text-sm text-green-800">
                ✓ Health declaration saved successfully
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleNext} 
            size="lg"
            disabled={
              saving ||
              !formData.height || 
              !formData.weight || 
              !formData.medicalRecordsConsent ||
              Object.keys(validationErrors).length > 0
            }
          >
            {saving && <Save className="w-4 h-4 mr-2 animate-spin" />}
            <span>{saving ? 'Saving...' : 'Continue to Product Selection'}</span>
            {!saving && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}


