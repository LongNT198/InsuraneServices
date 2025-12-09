/**
 * Validation helpers for insurance application forms
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Invalid phone number (minimum 10 digits)';
  return null;
};

// Date validation
export const validateDateOfBirth = (dob) => {
  if (!dob) return 'Date of birth is required';
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  if (birthDate > today) return 'Date of birth cannot be in the future';
  
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const actualAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) ? age - 1 : age;
  
  if (actualAge < 18) return 'You must be at least 18 years old';
  if (actualAge > 100) return 'Invalid date of birth';
  
  return null;
};

// National ID validation
export const validateNationalId = (nationalId) => {
  if (!nationalId) return 'National ID is required';
  if (nationalId.length < 6) return 'National ID must be at least 6 characters';
  return null;
};

// Postal code validation
export const validatePostalCode = (postalCode) => {
  if (!postalCode) return 'Postal code is required';
  const postalRegex = /^[0-9]{4,10}$/;
  if (!postalRegex.test(postalCode.replace(/\s/g, ''))) return 'Invalid postal code format';
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Personal Info Step Validation
export const validatePersonalInfo = (formData) => {
  const errors = {};
  
  errors.firstName = validateRequired(formData.firstName, 'First name');
  errors.lastName = validateRequired(formData.lastName, 'Last name');
  // Email is verified and read-only, skip validation
  errors.phone = validatePhone(formData.phone);
  errors.dateOfBirth = validateDateOfBirth(formData.dateOfBirth);
  errors.gender = validateRequired(formData.gender, 'Gender');
  errors.nationalId = validateNationalId(formData.nationalId);
  errors.occupation = validateRequired(formData.occupation, 'Occupation');
  errors.address = validateRequired(formData.address, 'Address');
  errors.city = validateRequired(formData.city, 'City');
  errors.postalCode = validatePostalCode(formData.postalCode);
  
  // Validate "Other" occupation field if occupation is "other"
  if (formData.occupation === 'other') {
    errors.occupationOther = validateRequired(formData.occupationOther, 'Occupation details');
  }
  
  // Emergency contact validation
  errors.emergencyContactName = validateRequired(formData.emergencyContactName, 'Emergency contact name');
  errors.emergencyContactPhone = validatePhone(formData.emergencyContactPhone);
  errors.emergencyContactRelationship = validateRequired(formData.emergencyContactRelationship, 'Emergency contact relationship');
  
  if (formData.emergencyContactRelationship === 'Other') {
    errors.emergencyContactRelationshipOther = validateRequired(formData.emergencyContactRelationshipOther, 'Relationship details');
  }
  
  // Filter out null values (valid fields)
  return Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== null)
  );
};

// Health Declaration Step Validation
export const validateHealthDeclaration = (formData) => {
  const errors = {};
  
  // Basic health metrics
  errors.height = validateRequired(formData.height, 'Height');
  errors.weight = validateRequired(formData.weight, 'Weight');
  errors.smokingStatus = validateRequired(formData.smokingStatus, 'Smoking status');
  errors.alcoholConsumption = validateRequired(formData.alcoholConsumption, 'Alcohol consumption');
  
  // If smoker, validate smoking details
  if (formData.isSmoker) {
    errors.smokingPacksPerDay = validateRequired(formData.smokingPacksPerDay, 'Packs per day');
    errors.smokingYears = validateRequired(formData.smokingYears, 'Years of smoking');
  }
  
  // If has medical conditions, validate details
  if (formData.hasMedicalConditions && formData.medicalConditions.length === 0) {
    errors.medicalConditions = 'Please specify your medical conditions';
  }
  
  // If on medication, validate medication list
  if (formData.isOnMedication && formData.medications.length === 0) {
    errors.medications = 'Please list your medications';
  }
  
  // Validate specific disease details if checked
  if (formData.hasDiabetes) {
    errors.diabetesType = validateRequired(formData.diabetesType, 'Diabetes type');
    errors.diabetesDiagnosisDate = validateRequired(formData.diabetesDiagnosisDate, 'Diagnosis date');
  }
  
  if (formData.hasCancer) {
    errors.cancerDetails = validateRequired(formData.cancerDetails, 'Cancer details');
    errors.cancerDiagnosisDate = validateRequired(formData.cancerDiagnosisDate, 'Diagnosis date');
  }
  
  // Filter out null values
  return Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== null)
  );
};

// Beneficiaries Step Validation
export const validateBeneficiaries = (beneficiaries) => {
  const errors = [];
  
  if (beneficiaries.length === 0) {
    return [{ general: 'At least one beneficiary is required' }];
  }
  
  beneficiaries.forEach((beneficiary, index) => {
    const beneficiaryErrors = {};
    
    beneficiaryErrors.fullName = validateRequired(beneficiary.fullName, 'Full name');
    beneficiaryErrors.relationship = validateRequired(beneficiary.relationship, 'Relationship');
    beneficiaryErrors.dateOfBirth = validateDateOfBirth(beneficiary.dateOfBirth);
    beneficiaryErrors.gender = validateRequired(beneficiary.gender, 'Gender');
    beneficiaryErrors.phone = validatePhone(beneficiary.phone);
    beneficiaryErrors.percentage = validateRequired(beneficiary.percentage, 'Percentage');
    
    if (beneficiary.relationship === 'Other') {
      beneficiaryErrors.relationshipOther = validateRequired(beneficiary.relationshipOther, 'Relationship details');
    }
    
    // Validate percentage range
    const percentage = parseFloat(beneficiary.percentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      beneficiaryErrors.percentage = 'Percentage must be between 1 and 100';
    }
    
    // If minor, validate trustee
    if (beneficiary.isMinor) {
      beneficiaryErrors.trustee = validateRequired(beneficiary.trustee, 'Trustee name');
      beneficiaryErrors.trusteeRelationship = validateRequired(beneficiary.trusteeRelationship, 'Trustee relationship');
    }
    
    // Filter out null values
    const filteredErrors = Object.fromEntries(
      Object.entries(beneficiaryErrors).filter(([_, value]) => value !== null)
    );
    
    if (Object.keys(filteredErrors).length > 0) {
      errors[index] = filteredErrors;
    }
  });
  
  // Validate total percentage
  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    errors.totalPercentage = `Total percentage must equal 100% (current: ${totalPercentage.toFixed(1)}%)`;
  }
  
  return errors;
};

// Product Selection Step Validation
export const validateProductSelection = (formData, premium) => {
  const errors = {};
  
  errors.productId = validateRequired(formData.productId, 'Product');
  errors.planId = validateRequired(formData.planId, 'Plan');
  errors.paymentFrequency = validateRequired(formData.paymentFrequency, 'Payment frequency');
  errors.paymentMethod = validateRequired(formData.paymentMethod, 'Payment method');
  
  if (premium === 0 || !premium) {
    errors.premium = 'Please calculate your premium';
  }
  
  // Filter out null values
  return Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== null)
  );
};

// Get first error message from errors object
export const getFirstError = (errors) => {
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors[0];
  if (typeof errors === 'object' && errors !== null) {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) return errors[firstKey];
  }
  return null;
};

// Check if errors object has any errors
export const hasErrors = (errors) => {
  if (!errors) return false;
  if (typeof errors === 'string') return true;
  if (Array.isArray(errors)) return errors.length > 0;
  if (typeof errors === 'object') return Object.keys(errors).length > 0;
  return false;
};
