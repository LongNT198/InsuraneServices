import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { ArrowLeft, ArrowRight, Activity, Heart, AlertCircle, Baby } from 'lucide-react';

const HEALTH_STATUS_OPTIONS = [
  'Excellent', 'Good', 'Fair', 'Poor'
];

const YES_NO_OPTIONS = ['Yes', 'No'];

const CONTROL_STATUS = ['Well Controlled', 'Partially Controlled', 'Uncontrolled'];

export default function HealthInsuranceMedicalStep({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    currentHealth: data?.medicalInfo?.currentHealth || '',
    recentHospitalization: data?.medicalInfo?.recentHospitalization || false,
    hospitalizationDetails: data?.medicalInfo?.hospitalizationDetails || '',
    
    preExistingConditions: {
      diabetes: data?.medicalInfo?.preExistingConditions?.diabetes || { 
        has: false, controlled: '', medication: '' 
      },
      hypertension: data?.medicalInfo?.preExistingConditions?.hypertension || { 
        has: false, controlled: '', medication: '' 
      },
      asthma: data?.medicalInfo?.preExistingConditions?.asthma || { 
        has: false, controlled: '', medication: '' 
      },
      heartDisease: data?.medicalInfo?.preExistingConditions?.heartDisease || { 
        has: false, details: '' 
      },
      thyroid: data?.medicalInfo?.preExistingConditions?.thyroid || { 
        has: false, controlled: '', medication: '' 
      },
      kidneyDisease: data?.medicalInfo?.preExistingConditions?.kidneyDisease || { 
        has: false, details: '' 
      },
      cancer: data?.medicalInfo?.preExistingConditions?.cancer || { 
        has: false, details: '' 
      }
    },
    
    lifestyle: data?.medicalInfo?.lifestyle || {
      smoking: '',
      alcohol: '',
      height: '',
      weight: '',
      bmi: ''
    },
    
    covid19: data?.medicalInfo?.covid19 || {
      hadCovid: '',
      dateOfRecovery: '',
      complications: ''
    },
    
    womensHealth: data?.medicalInfo?.womensHealth || {
      pregnant: '',
      dueDate: '',
      complications: ''
    },
    
    consent: data?.medicalInfo?.consent || false
  });

  const [errors, setErrors] = useState({});
  const [showWomensHealth, setShowWomensHealth] = useState(false);

  // Calculate BMI when height and weight change
  useEffect(() => {
    const { height, weight } = formData.lifestyle;
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          bmi: isNaN(bmi) ? '' : bmi
        }
      }));
    }
  }, [formData.lifestyle.height, formData.lifestyle.weight]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleLifestyleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, [field]: value }
    }));
    setErrors(prev => ({ ...prev, [`lifestyle_${field}`]: '' }));
  };

  const handleConditionChange = (condition, field, value) => {
    setFormData(prev => ({
      ...prev,
      preExistingConditions: {
        ...prev.preExistingConditions,
        [condition]: {
          ...prev.preExistingConditions[condition],
          [field]: value
        }
      }
    }));
    setErrors(prev => ({ ...prev, [`${condition}_${field}`]: '' }));
  };

  const handleCovidChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      covid19: { ...prev.covid19, [field]: value }
    }));
    setErrors(prev => ({ ...prev, [`covid_${field}`]: '' }));
  };

  const handleWomensHealthChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      womensHealth: { ...prev.womensHealth, [field]: value }
    }));
    setErrors(prev => ({ ...prev, [`womens_${field}`]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentHealth) {
      newErrors.currentHealth = 'Please select your current health status';
    }

    if (formData.recentHospitalization && !formData.hospitalizationDetails.trim()) {
      newErrors.hospitalizationDetails = 'Please provide hospitalization details';
    }

    // Validate lifestyle
    if (!formData.lifestyle.smoking) {
      newErrors.lifestyle_smoking = 'Please indicate smoking status';
    }
    if (!formData.lifestyle.alcohol) {
      newErrors.lifestyle_alcohol = 'Please indicate alcohol consumption';
    }
    if (!formData.lifestyle.height || formData.lifestyle.height <= 0) {
      newErrors.lifestyle_height = 'Please enter valid height';
    }
    if (!formData.lifestyle.weight || formData.lifestyle.weight <= 0) {
      newErrors.lifestyle_weight = 'Please enter valid weight';
    }

    // Validate pre-existing conditions
    Object.entries(formData.preExistingConditions).forEach(([condition, details]) => {
      if (details.has) {
        if (condition === 'diabetes' || condition === 'hypertension' || condition === 'asthma' || condition === 'thyroid') {
          if (!details.controlled) {
            newErrors[`${condition}_controlled`] = 'Please indicate control status';
          }
          if (!details.medication || !details.medication.trim()) {
            newErrors[`${condition}_medication`] = 'Please provide medication details';
          }
        } else {
          if (!details.details || !details.details.trim()) {
            newErrors[`${condition}_details`] = 'Please provide condition details';
          }
        }
      }
    });

    // Validate COVID-19
    if (!formData.covid19.hadCovid) {
      newErrors.covid_hadCovid = 'Please indicate if you had COVID-19';
    } else if (formData.covid19.hadCovid === 'Yes') {
      if (!formData.covid19.dateOfRecovery) {
        newErrors.covid_dateOfRecovery = 'Please provide recovery date';
      }
    }

    // Validate women's health if applicable
    if (showWomensHealth) {
      if (!formData.womensHealth.pregnant) {
        newErrors.womens_pregnant = 'Please indicate pregnancy status';
      } else if (formData.womensHealth.pregnant === 'Yes') {
        if (!formData.womensHealth.dueDate) {
          newErrors.womens_dueDate = 'Please provide due date';
        }
      }
    }

    // Validate consent
    if (!formData.consent) {
      newErrors.consent = 'You must provide consent to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ medicalInfo: formData });
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const bmiCategory = getBMICategory(formData.lifestyle.bmi);

  return (
    <div className="space-y-6">
      {/* Current Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Health Status
          </CardTitle>
          <CardDescription>
            Please provide accurate information about your current health
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentHealth">Overall Health Status *</Label>
            <Select value={formData.currentHealth} onValueChange={(value) => handleInputChange('currentHealth', value)}>
              <SelectTrigger id="currentHealth">
                <SelectValue placeholder="Select your health status" />
              </SelectTrigger>
              <SelectContent>
                {HEALTH_STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currentHealth && (
              <p className="text-sm text-red-600 mt-1">{errors.currentHealth}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recentHospitalization"
              checked={formData.recentHospitalization}
              onCheckedChange={(checked) => handleInputChange('recentHospitalization', checked)}
            />
            <Label htmlFor="recentHospitalization" className="cursor-pointer">
              Have you been hospitalized in the last 2 years?
            </Label>
          </div>

          {formData.recentHospitalization && (
            <div>
              <Label htmlFor="hospitalizationDetails">Hospitalization Details *</Label>
              <Textarea
                id="hospitalizationDetails"
                value={formData.hospitalizationDetails}
                onChange={(e) => handleInputChange('hospitalizationDetails', e.target.value)}
                placeholder="Please provide details (date, reason, hospital, treatment)"
                rows={3}
              />
              {errors.hospitalizationDetails && (
                <p className="text-sm text-red-600 mt-1">{errors.hospitalizationDetails}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-existing Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Pre-existing Conditions
          </CardTitle>
          <CardDescription>
            Please check all conditions that apply to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diabetes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diabetes"
                checked={formData.preExistingConditions.diabetes.has}
                onCheckedChange={(checked) => handleConditionChange('diabetes', 'has', checked)}
              />
              <Label htmlFor="diabetes" className="cursor-pointer font-medium">
                Diabetes
              </Label>
            </div>
            {formData.preExistingConditions.diabetes.has && (
              <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="diabetes_controlled">Control Status *</Label>
                  <Select
                    value={formData.preExistingConditions.diabetes.controlled}
                    onValueChange={(value) => handleConditionChange('diabetes', 'controlled', value)}
                  >
                    <SelectTrigger id="diabetes_controlled">
                      <SelectValue placeholder="Select control status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTROL_STATUS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.diabetes_controlled && (
                    <p className="text-sm text-red-600 mt-1">{errors.diabetes_controlled}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="diabetes_medication">Current Medications *</Label>
                  <Input
                    id="diabetes_medication"
                    value={formData.preExistingConditions.diabetes.medication}
                    onChange={(e) => handleConditionChange('diabetes', 'medication', e.target.value)}
                    placeholder="List medications"
                  />
                  {errors.diabetes_medication && (
                    <p className="text-sm text-red-600 mt-1">{errors.diabetes_medication}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hypertension */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hypertension"
                checked={formData.preExistingConditions.hypertension.has}
                onCheckedChange={(checked) => handleConditionChange('hypertension', 'has', checked)}
              />
              <Label htmlFor="hypertension" className="cursor-pointer font-medium">
                Hypertension (High Blood Pressure)
              </Label>
            </div>
            {formData.preExistingConditions.hypertension.has && (
              <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="hypertension_controlled">Control Status *</Label>
                  <Select
                    value={formData.preExistingConditions.hypertension.controlled}
                    onValueChange={(value) => handleConditionChange('hypertension', 'controlled', value)}
                  >
                    <SelectTrigger id="hypertension_controlled">
                      <SelectValue placeholder="Select control status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTROL_STATUS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.hypertension_controlled && (
                    <p className="text-sm text-red-600 mt-1">{errors.hypertension_controlled}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="hypertension_medication">Current Medications *</Label>
                  <Input
                    id="hypertension_medication"
                    value={formData.preExistingConditions.hypertension.medication}
                    onChange={(e) => handleConditionChange('hypertension', 'medication', e.target.value)}
                    placeholder="List medications"
                  />
                  {errors.hypertension_medication && (
                    <p className="text-sm text-red-600 mt-1">{errors.hypertension_medication}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Asthma */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="asthma"
                checked={formData.preExistingConditions.asthma.has}
                onCheckedChange={(checked) => handleConditionChange('asthma', 'has', checked)}
              />
              <Label htmlFor="asthma" className="cursor-pointer font-medium">
                Asthma
              </Label>
            </div>
            {formData.preExistingConditions.asthma.has && (
              <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="asthma_controlled">Control Status *</Label>
                  <Select
                    value={formData.preExistingConditions.asthma.controlled}
                    onValueChange={(value) => handleConditionChange('asthma', 'controlled', value)}
                  >
                    <SelectTrigger id="asthma_controlled">
                      <SelectValue placeholder="Select control status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTROL_STATUS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.asthma_controlled && (
                    <p className="text-sm text-red-600 mt-1">{errors.asthma_controlled}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="asthma_medication">Current Medications *</Label>
                  <Input
                    id="asthma_medication"
                    value={formData.preExistingConditions.asthma.medication}
                    onChange={(e) => handleConditionChange('asthma', 'medication', e.target.value)}
                    placeholder="List medications"
                  />
                  {errors.asthma_medication && (
                    <p className="text-sm text-red-600 mt-1">{errors.asthma_medication}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Thyroid */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="thyroid"
                checked={formData.preExistingConditions.thyroid.has}
                onCheckedChange={(checked) => handleConditionChange('thyroid', 'has', checked)}
              />
              <Label htmlFor="thyroid" className="cursor-pointer font-medium">
                Thyroid Disorder
              </Label>
            </div>
            {formData.preExistingConditions.thyroid.has && (
              <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="thyroid_controlled">Control Status *</Label>
                  <Select
                    value={formData.preExistingConditions.thyroid.controlled}
                    onValueChange={(value) => handleConditionChange('thyroid', 'controlled', value)}
                  >
                    <SelectTrigger id="thyroid_controlled">
                      <SelectValue placeholder="Select control status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTROL_STATUS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.thyroid_controlled && (
                    <p className="text-sm text-red-600 mt-1">{errors.thyroid_controlled}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="thyroid_medication">Current Medications *</Label>
                  <Input
                    id="thyroid_medication"
                    value={formData.preExistingConditions.thyroid.medication}
                    onChange={(e) => handleConditionChange('thyroid', 'medication', e.target.value)}
                    placeholder="List medications"
                  />
                  {errors.thyroid_medication && (
                    <p className="text-sm text-red-600 mt-1">{errors.thyroid_medication}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Heart Disease */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="heartDisease"
                checked={formData.preExistingConditions.heartDisease.has}
                onCheckedChange={(checked) => handleConditionChange('heartDisease', 'has', checked)}
              />
              <Label htmlFor="heartDisease" className="cursor-pointer font-medium">
                Heart Disease
              </Label>
            </div>
            {formData.preExistingConditions.heartDisease.has && (
              <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="heartDisease_details">Please provide details *</Label>
                <Textarea
                  id="heartDisease_details"
                  value={formData.preExistingConditions.heartDisease.details}
                  onChange={(e) => handleConditionChange('heartDisease', 'details', e.target.value)}
                  placeholder="Type of condition, treatments, medications"
                  rows={2}
                />
                {errors.heartDisease_details && (
                  <p className="text-sm text-red-600 mt-1">{errors.heartDisease_details}</p>
                )}
              </div>
            )}
          </div>

          {/* Kidney Disease */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kidneyDisease"
                checked={formData.preExistingConditions.kidneyDisease.has}
                onCheckedChange={(checked) => handleConditionChange('kidneyDisease', 'has', checked)}
              />
              <Label htmlFor="kidneyDisease" className="cursor-pointer font-medium">
                Kidney Disease
              </Label>
            </div>
            {formData.preExistingConditions.kidneyDisease.has && (
              <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="kidneyDisease_details">Please provide details *</Label>
                <Textarea
                  id="kidneyDisease_details"
                  value={formData.preExistingConditions.kidneyDisease.details}
                  onChange={(e) => handleConditionChange('kidneyDisease', 'details', e.target.value)}
                  placeholder="Type of condition, treatments, medications"
                  rows={2}
                />
                {errors.kidneyDisease_details && (
                  <p className="text-sm text-red-600 mt-1">{errors.kidneyDisease_details}</p>
                )}
              </div>
            )}
          </div>

          {/* Cancer */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cancer"
                checked={formData.preExistingConditions.cancer.has}
                onCheckedChange={(checked) => handleConditionChange('cancer', 'has', checked)}
              />
              <Label htmlFor="cancer" className="cursor-pointer font-medium">
                Cancer
              </Label>
            </div>
            {formData.preExistingConditions.cancer.has && (
              <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="cancer_details">Please provide details *</Label>
                <Textarea
                  id="cancer_details"
                  value={formData.preExistingConditions.cancer.details}
                  onChange={(e) => handleConditionChange('cancer', 'details', e.target.value)}
                  placeholder="Type, stage, treatments received, current status"
                  rows={2}
                />
                {errors.cancer_details && (
                  <p className="text-sm text-red-600 mt-1">{errors.cancer_details}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle & Physical Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smoking">Do you smoke? *</Label>
              <Select value={formData.lifestyle.smoking} onValueChange={(value) => handleLifestyleChange('smoking', value)}>
                <SelectTrigger id="smoking">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lifestyle_smoking && (
                <p className="text-sm text-red-600 mt-1">{errors.lifestyle_smoking}</p>
              )}
            </div>

            <div>
              <Label htmlFor="alcohol">Do you consume alcohol? *</Label>
              <Select value={formData.lifestyle.alcohol} onValueChange={(value) => handleLifestyleChange('alcohol', value)}>
                <SelectTrigger id="alcohol">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lifestyle_alcohol && (
                <p className="text-sm text-red-600 mt-1">{errors.lifestyle_alcohol}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                value={formData.lifestyle.height}
                onChange={(e) => handleLifestyleChange('height', e.target.value)}
                placeholder="170"
              />
              {errors.lifestyle_height && (
                <p className="text-sm text-red-600 mt-1">{errors.lifestyle_height}</p>
              )}
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.lifestyle.weight}
                onChange={(e) => handleLifestyleChange('weight', e.target.value)}
                placeholder="70"
              />
              {errors.lifestyle_weight && (
                <p className="text-sm text-red-600 mt-1">{errors.lifestyle_weight}</p>
              )}
            </div>

            <div>
              <Label>BMI</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.lifestyle.bmi}
                  readOnly
                  placeholder="Auto-calculated"
                  className="bg-gray-50"
                />
                {formData.lifestyle.bmi && (
                  <span className={`text-sm font-medium ${
                    bmiCategory === 'Normal' ? 'text-green-600' :
                    bmiCategory === 'Underweight' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {bmiCategory}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COVID-19 History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            COVID-19 History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hadCovid">Have you had COVID-19? *</Label>
            <Select value={formData.covid19.hadCovid} onValueChange={(value) => handleCovidChange('hadCovid', value)}>
              <SelectTrigger id="hadCovid">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {YES_NO_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.covid_hadCovid && (
              <p className="text-sm text-red-600 mt-1">{errors.covid_hadCovid}</p>
            )}
          </div>

          {formData.covid19.hadCovid === 'Yes' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dateOfRecovery">Date of Recovery *</Label>
                <Input
                  id="dateOfRecovery"
                  type="date"
                  value={formData.covid19.dateOfRecovery}
                  onChange={(e) => handleCovidChange('dateOfRecovery', e.target.value)}
                />
                {errors.covid_dateOfRecovery && (
                  <p className="text-sm text-red-600 mt-1">{errors.covid_dateOfRecovery}</p>
                )}
              </div>

              <div>
                <Label htmlFor="covidComplications">Any Complications? (Optional)</Label>
                <Textarea
                  id="covidComplications"
                  value={formData.covid19.complications}
                  onChange={(e) => handleCovidChange('complications', e.target.value)}
                  placeholder="e.g., prolonged symptoms, hospitalization"
                  rows={2}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Women's Health (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Women's Health (If Applicable)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showWomensHealth"
              checked={showWomensHealth}
              onCheckedChange={setShowWomensHealth}
            />
            <Label htmlFor="showWomensHealth" className="cursor-pointer">
              This section applies to me
            </Label>
          </div>

          {showWomensHealth && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="pregnant">Are you currently pregnant? *</Label>
                <Select value={formData.womensHealth.pregnant} onValueChange={(value) => handleWomensHealthChange('pregnant', value)}>
                  <SelectTrigger id="pregnant">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {YES_NO_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.womens_pregnant && (
                  <p className="text-sm text-red-600 mt-1">{errors.womens_pregnant}</p>
                )}
              </div>

              {formData.womensHealth.pregnant === 'Yes' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dueDate">Expected Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.womensHealth.dueDate}
                      onChange={(e) => handleWomensHealthChange('dueDate', e.target.value)}
                    />
                    {errors.womens_dueDate && (
                      <p className="text-sm text-red-600 mt-1">{errors.womens_dueDate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pregnancyComplications">Any Complications? (Optional)</Label>
                    <Textarea
                      id="pregnancyComplications"
                      value={formData.womensHealth.complications}
                      onChange={(e) => handleWomensHealthChange('complications', e.target.value)}
                      placeholder="e.g., gestational diabetes, pre-eclampsia"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Consent */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => handleInputChange('consent', checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="consent" className="cursor-pointer font-medium">
                Medical Information Consent *
              </Label>
              <p className="text-sm text-gray-600">
                I hereby declare that all the medical information provided above is true and accurate to the best of my knowledge. 
                I understand that any false information may result in claim rejection.
              </p>
              {errors.consent && (
                <p className="text-sm text-red-600">{errors.consent}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Continue to Nominees
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
