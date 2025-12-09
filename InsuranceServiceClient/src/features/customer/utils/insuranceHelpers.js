/**
 * Insurance Application Helper - Occupation and Health Status Mapping
 * Based on industry standard risk assessment
 */

// Occupation Categories with Risk Levels
export const OCCUPATION_CATEGORIES = [
  // Low Risk Occupations
  { value: 'accountant', label: 'Accountant', risk: 'Low' },
  { value: 'teacher', label: 'Teacher / Professor', risk: 'Low' },
  { value: 'software_developer', label: 'Software Developer / IT Professional', risk: 'Low' },
  { value: 'office_admin', label: 'Office Administrator', risk: 'Low' },
  { value: 'manager', label: 'Manager / Executive', risk: 'Low' },
  { value: 'consultant', label: 'Consultant / Analyst', risk: 'Low' },
  { value: 'banker', label: 'Banker / Financial Advisor', risk: 'Low' },
  { value: 'lawyer', label: 'Lawyer / Legal Professional', risk: 'Low' },
  { value: 'doctor_office', label: 'Doctor / Medical Professional (Office)', risk: 'Low' },
  { value: 'engineer_office', label: 'Engineer (Office-based)', risk: 'Low' },
  
  // Medium Risk Occupations
  { value: 'driver', label: 'Driver / Delivery Person', risk: 'Medium' },
  { value: 'mechanic', label: 'Mechanic / Technician', risk: 'Medium' },
  { value: 'electrician', label: 'Electrician', risk: 'Medium' },
  { value: 'plumber', label: 'Plumber', risk: 'Medium' },
  { value: 'sales_field', label: 'Sales Representative (Field)', risk: 'Medium' },
  { value: 'nurse', label: 'Nurse / Healthcare Worker', risk: 'Medium' },
  { value: 'chef', label: 'Chef / Cook', risk: 'Medium' },
  { value: 'retail_manager', label: 'Retail / Store Manager', risk: 'Medium' },
  { value: 'warehouse', label: 'Warehouse Worker', risk: 'Medium' },
  
  // High Risk Occupations
  { value: 'construction', label: 'Construction Worker', risk: 'High' },
  { value: 'miner', label: 'Miner', risk: 'High' },
  { value: 'firefighter', label: 'Firefighter', risk: 'High' },
  { value: 'police', label: 'Police Officer / Security (Armed)', risk: 'High' },
  { value: 'pilot', label: 'Pilot / Flight Crew', risk: 'High' },
  { value: 'offshore_worker', label: 'Offshore / Maritime Worker', risk: 'High' },
  { value: 'military', label: 'Military Personnel', risk: 'High' },
  { value: 'logger', label: 'Logger / Forestry Worker', risk: 'High' },
  { value: 'roofer', label: 'Roofer / Height Work', risk: 'High' },
  
  // Other
  { value: 'student', label: 'Student', risk: 'Low' },
  { value: 'retired', label: 'Retired', risk: 'Low' },
  { value: 'homemaker', label: 'Homemaker', risk: 'Low' },
  { value: 'unemployed', label: 'Currently Unemployed', risk: 'Low' },
  { value: 'other', label: 'Other (Specify below)', risk: 'Medium' },
];

// Get occupation risk level
export const getOccupationRisk = (occupationValue) => {
  const occupation = OCCUPATION_CATEGORIES.find(occ => occ.value === occupationValue);
  return occupation?.risk || 'Medium';
};

// Get occupation label
export const getOccupationLabel = (occupationValue) => {
  const occupation = OCCUPATION_CATEGORIES.find(occ => occ.value === occupationValue);
  return occupation?.label || occupationValue;
};

// Smoking Status Options
export const SMOKING_STATUS_OPTIONS = [
  { value: 'non-smoker', label: 'Non-Smoker', healthImpact: 'positive' },
  { value: 'former-smoker', label: 'Former Smoker (Quit >1 year ago)', healthImpact: 'neutral' },
  { value: 'occasional-smoker', label: 'Occasional Smoker (<5 cigarettes/day)', healthImpact: 'negative' },
  { value: 'regular-smoker', label: 'Regular Smoker (≥5 cigarettes/day)', healthImpact: 'high-negative' },
];

// Alcohol Consumption Options
export const ALCOHOL_OPTIONS = [
  { value: 'none', label: 'None', healthImpact: 'positive' },
  { value: 'occasional', label: 'Occasional (1-3 drinks/week)', healthImpact: 'neutral' },
  { value: 'moderate', label: 'Moderate (4-7 drinks/week)', healthImpact: 'neutral' },
  { value: 'regular', label: 'Regular (8-14 drinks/week)', healthImpact: 'negative' },
  { value: 'heavy', label: 'Heavy (>14 drinks/week)', healthImpact: 'high-negative' },
];

// Exercise Level Options
export const EXERCISE_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', healthImpact: 'negative' },
  { value: 'light', label: 'Light Activity', description: '1-2 hours/week', healthImpact: 'neutral' },
  { value: 'moderate', label: 'Moderate Activity', description: '3-5 hours/week', healthImpact: 'positive' },
  { value: 'active', label: 'Active', description: '6-8 hours/week', healthImpact: 'positive' },
  { value: 'very-active', label: 'Very Active', description: '>8 hours/week', healthImpact: 'positive' },
];

// Sleep Quality Options
export const SLEEP_QUALITY_OPTIONS = [
  { value: 'poor', label: 'Poor', description: 'Frequent sleep issues', healthImpact: 'negative' },
  { value: 'fair', label: 'Fair', description: 'Occasional sleep issues', healthImpact: 'neutral' },
  { value: 'good', label: 'Good', description: 'Generally sleep well', healthImpact: 'positive' },
  { value: 'excellent', label: 'Excellent', description: 'Consistently restful sleep', healthImpact: 'positive' },
];

// Stress Level Options
export const STRESS_LEVEL_OPTIONS = [
  { value: 'low', label: 'Low', description: 'Well-managed, minimal stress', healthImpact: 'positive' },
  { value: 'moderate', label: 'Moderate', description: 'Normal daily stress', healthImpact: 'neutral' },
  { value: 'high', label: 'High', description: 'Frequent stress', healthImpact: 'negative' },
  { value: 'very-high', label: 'Very High', description: 'Chronic, severe stress', healthImpact: 'high-negative' },
];

// Diet Quality Options
export const DIET_QUALITY_OPTIONS = [
  { value: 'poor', label: 'Poor', description: 'Mostly processed/fast food', healthImpact: 'negative' },
  { value: 'fair', label: 'Fair', description: 'Mixed diet, some healthy choices', healthImpact: 'neutral' },
  { value: 'balanced', label: 'Balanced', description: 'Well-rounded, nutritious meals', healthImpact: 'positive' },
  { value: 'healthy', label: 'Healthy', description: 'Mostly whole foods, vegetables', healthImpact: 'positive' },
  { value: 'very-healthy', label: 'Very Healthy', description: 'Organic, plant-based, optimized', healthImpact: 'positive' },
];

// Treatment Status Options
export const TREATMENT_STATUS_OPTIONS = [
  { value: 'controlled', label: 'Well Controlled', description: 'Stable with treatment' },
  { value: 'uncontrolled', label: 'Not Controlled', description: 'Unstable or worsening' },
  { value: 'remission', label: 'In Remission', description: 'No active symptoms' },
  { value: 'cured', label: 'Cured/Resolved', description: 'No longer present' },
  { value: 'unknown', label: 'Unknown', description: 'Status unclear' },
];

// Calculate BMI
export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
};

// Get BMI Category
export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return { category: 'Underweight', healthImpact: 'negative' };
  if (bmiNum < 25) return { category: 'Normal', healthImpact: 'positive' };
  if (bmiNum < 30) return { category: 'Overweight', healthImpact: 'neutral' };
  if (bmiNum < 35) return { category: 'Obese Class I', healthImpact: 'negative' };
  if (bmiNum < 40) return { category: 'Obese Class II', healthImpact: 'high-negative' };
  return { category: 'Obese Class III', healthImpact: 'high-negative' };
};

/**
 * Calculate Health Status based on multiple factors
 * Returns: { status: "Excellent" | "Good" | "Fair" | "Poor", score: number }
 */
export const calculateHealthStatus = ({
  bmi,
  smokingStatus,
  alcoholConsumption,
  exerciseLevel = 'moderate',
  sleepQuality = 'good',
  stressLevel = 'moderate',
  dietQuality = 'balanced',
  hasMedicalConditions = false,
  hasChronicDiseases = false,
  takingMedication = false,
}) => {
  let score = 100; // Start with perfect score
  
  // BMI Impact (0 to -30 points)
  const bmiCategory = getBMICategory(bmi);
  if (bmiCategory) {
    if (bmiCategory.healthImpact === 'high-negative') score -= 30;
    else if (bmiCategory.healthImpact === 'negative') score -= 20;
    else if (bmiCategory.healthImpact === 'neutral') score -= 10;
    else if (bmiCategory.healthImpact === 'positive') score -= 0;
  }
  
  // Smoking Impact (0 to -30 points)
  const smoking = SMOKING_STATUS_OPTIONS.find(s => s.value === smokingStatus);
  if (smoking) {
    if (smoking.healthImpact === 'high-negative') score -= 30;
    else if (smoking.healthImpact === 'negative') score -= 15;
    else if (smoking.healthImpact === 'neutral') score -= 5;
  }
  
  // Alcohol Impact (0 to -20 points)
  const alcohol = ALCOHOL_OPTIONS.find(a => a.value === alcoholConsumption);
  if (alcohol) {
    if (alcohol.healthImpact === 'high-negative') score -= 20;
    else if (alcohol.healthImpact === 'negative') score -= 10;
  }
  
  // Exercise Impact (+5 to -10 points)
  const exercise = EXERCISE_OPTIONS.find(e => e.value === exerciseLevel);
  if (exercise) {
    if (exercise.healthImpact === 'positive') score += 5;
    else if (exercise.healthImpact === 'negative') score -= 10;
  }
  
  // Sleep Quality Impact (+3 to -8 points)
  const sleep = SLEEP_QUALITY_OPTIONS.find(s => s.value === sleepQuality);
  if (sleep) {
    if (sleep.healthImpact === 'positive') score += 3;
    else if (sleep.healthImpact === 'negative') score -= 8;
  }
  
  // Stress Level Impact (+5 to -15 points)
  const stress = STRESS_LEVEL_OPTIONS.find(s => s.value === stressLevel);
  if (stress) {
    if (stress.healthImpact === 'positive') score += 5;
    else if (stress.healthImpact === 'high-negative') score -= 15;
    else if (stress.healthImpact === 'negative') score -= 8;
  }
  
  // Diet Quality Impact (+5 to -10 points)
  const diet = DIET_QUALITY_OPTIONS.find(d => d.value === dietQuality);
  if (diet) {
    if (diet.healthImpact === 'positive') score += 5;
    else if (diet.healthImpact === 'negative') score -= 10;
  }
  
  // Medical Conditions Impact (0 to -25 points)
  if (hasChronicDiseases) score -= 25;
  else if (hasMedicalConditions) score -= 15;
  
  // Medication Impact (0 to -10 points)
  if (takingMedication) score -= 10;
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  // Determine status based on final score
  let status;
  if (score >= 85) status = 'Excellent';
  else if (score >= 65) status = 'Good';
  else if (score >= 40) status = 'Fair';
  else status = 'Poor';
  
  return { status, score };
};

/**
 * Get health status explanation for user
 */
export const getHealthStatusExplanation = (healthStatus) => {
  const explanations = {
    'Excellent': {
      icon: '🌟',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      message: 'Excellent health! You qualify for the best premium rates.',
      description: 'Healthy BMI, non-smoker, minimal/no alcohol, active lifestyle, good sleep, balanced diet, no medical conditions'
    },
    'Good': {
      icon: '✅',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      message: 'Good health status. You qualify for favorable premium rates.',
      description: 'Healthy lifestyle with minor factors that slightly affect premium'
    },
    'Fair': {
      icon: '⚠️',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      message: 'Fair health status. Premium may be higher due to health factors.',
      description: 'Some health concerns or lifestyle factors that moderately impact premium calculation'
    },
    'Poor': {
      icon: '❌',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      message: 'Health concerns detected. Premium will reflect higher risk.',
      description: 'Multiple health factors or chronic conditions significantly impact premium. Consider health improvements.'
    }
  };
  
  return explanations[healthStatus] || explanations['Good'];
};

// Validation Functions
export const validateHeight = (height) => {
  const h = parseFloat(height);
  if (isNaN(h)) return 'Height must be a valid number';
  if (h < 100 || h > 250) return 'Height must be between 100 and 250 cm';
  return null;
};

export const validateWeight = (weight) => {
  const w = parseFloat(weight);
  if (isNaN(w)) return 'Weight must be a valid number';
  if (w < 30 || w > 300) return 'Weight must be between 30 and 300 kg';
  return null;
};

export const validateBloodPressure = (systolic, diastolic) => {
  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);
  
  if (systolic && isNaN(sys)) return 'Systolic BP must be a valid number';
  if (diastolic && isNaN(dia)) return 'Diastolic BP must be a valid number';
  
  if (sys < 70 || sys > 200) return 'Systolic BP must be between 70 and 200 mmHg';
  if (dia < 40 || dia > 130) return 'Diastolic BP must be between 40 and 130 mmHg';
  
  if (sys && dia && sys <= dia) return 'Systolic BP must be higher than diastolic BP';
  
  return null;
};

export const validateCholesterol = (cholesterol) => {
  const c = parseInt(cholesterol);
  if (isNaN(c)) return 'Cholesterol must be a valid number';
  if (c < 100 || c > 400) return 'Cholesterol must be between 100 and 400 mg/dL';
  return null;
};
