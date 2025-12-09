import axiosInstance from '../axios';

/**
 * Health Declaration Service - API for managing health declarations
 */

const HEALTH_DECLARATION_API_URL = '/api/customer/HealthDeclaration';

/**
 * Normalize boolean values (convert string 'false'/'true' to actual boolean)
 */
const normalizeBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'True') return true;
    if (value === 'False') return false;
    return Boolean(value);
};

/**
 * List of known boolean fields in HealthDeclarationDto
 */
const BOOLEAN_FIELDS = new Set([
    'hasMedicalConditions', 'isOnMedication', 'hasHospitalization',
    'hasHeartDisease', 'hasStroke', 'hasCancer', 'hasDiabetes',
    'hasHighBloodPressure', 'hasHighCholesterol', 'hasKidneyDisease',
    'hasLiverDisease', 'hasMentalHealthCondition', 'hasHIV',
    'hasSurgeryLast5Years', 'hasPendingMedicalTests', 'hasPlannedProcedures',
    'familyHeartDisease', 'familyCancer', 'familyDiabetes', 'familyStroke',
    'fatherDeceased', 'motherDeceased', 'isSmoker', 'usesDrugs',
    'hasOccupationalHazards', 'participatesInDangerousSports',
    'isPregnant', 'hasPregnancyComplications', 'hasDisability',
    'hasLifeThreateningCondition', 'medicalRecordsConsent',
    'hasChronicDiseases', 'hasFamilyHistory', 'hadSurgeries', 'takingMedication'
]);

/**
 * Convert camelCase object keys to PascalCase for C# API and normalize boolean values
 */
const convertToPascalCase = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => convertToPascalCase(item));
    }
    
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
        // Convert first letter to uppercase (camelCase -> PascalCase)
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
        
        // Check if this is a boolean field using the explicit list
        const isBooleanField = BOOLEAN_FIELDS.has(key);
        
        // Recursively convert nested objects
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            converted[pascalKey] = convertToPascalCase(value);
        } else if (Array.isArray(value)) {
            converted[pascalKey] = value.map(item => 
                typeof item === 'object' ? convertToPascalCase(item) : item
            );
        } else {
            // Normalize boolean values for boolean fields only
            converted[pascalKey] = isBooleanField ? normalizeBoolean(value) : value;
        }
    }
    return converted;
};

/**
 * Save or update health declaration for current user
 * @param {Object} healthDeclarationData - Health declaration data
 * @returns {Promise<Object>} - Response with success status and health declaration ID
 */
export const saveHealthDeclaration = async (healthDeclarationData) => {
    try {
        console.log('📦 Original data (camelCase):', healthDeclarationData);
        console.log('📦 HasHospitalization original value:', healthDeclarationData.hasHospitalization, 'Type:', typeof healthDeclarationData.hasHospitalization);
        
        // Convert camelCase to PascalCase for C# backend
        const pascalCaseData = convertToPascalCase(healthDeclarationData);
        console.log('📤 Sending data to API (PascalCase):', pascalCaseData);
        console.log('📤 HasHospitalization converted value:', pascalCaseData.HasHospitalization, 'Type:', typeof pascalCaseData.HasHospitalization);
        console.log('📤 JSON stringified:', JSON.stringify(pascalCaseData).substring(0, 500));
        
        const response = await axiosInstance.post(`${HEALTH_DECLARATION_API_URL}/save`, pascalCaseData);
        console.log('✅ Health declaration saved:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error saving health declaration:', error);
        throw error;
    }
};

/**
 * Get health declaration for current user
 * @returns {Promise<Object>} - Health declaration data
 */
export const getHealthDeclaration = async () => {
    try {
        const response = await axiosInstance.get(HEALTH_DECLARATION_API_URL);
        console.log('✅ Full axios response:', response);
        console.log('✅ Response.data:', response.data);
        console.log('✅ Type of response.data:', typeof response.data);
        return response.data; // Returns { success: true, data: {...} }
    } catch (error) {
        // 404 is expected for new users without health declaration
        if (error.status === 404) {
            console.log('ℹ️ No health declaration found (new user)');
        } else {
            console.error('❌ Error getting health declaration:', error);
        }
        throw error;
    }
};

/**
 * Delete health declaration for current user
 * @returns {Promise<Object>} - Response with success status
 */
export const deleteHealthDeclaration = async () => {
    try {
        const response = await axiosInstance.delete(HEALTH_DECLARATION_API_URL);
        console.log('✅ Health declaration deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error deleting health declaration:', error);
        throw error;
    }
};
