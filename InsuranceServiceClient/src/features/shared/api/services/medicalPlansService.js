import axiosInstance from '../axios';

/**
 * Medical Plans Service - API for medical insurance plans
 * Uses specialized medical insurance plan endpoints
 */

const MEDICAL_PLANS_API_URL = '/api/MedicalPlans';

/**
 * Get all active medical plans for a specific product
 * @param {number} productId - The product ID
 * @returns {Promise<Array>} - Array of medical insurance plans
 */
export const getMedicalPlansByProduct = async (productId) => {
    try {
        const response = await axiosInstance.get(`${MEDICAL_PLANS_API_URL}/product/${productId}`);
        console.log(`🏥 Raw response for medical product ${productId}:`, response);

        // Handle different response formats
        const plans = Array.isArray(response)
            ? response
            : (response?.value || response?.plans || response?.data || []);
        console.log(`✅ Retrieved ${plans.length} medical plan(s) for product ${productId}`);
        return plans;
    } catch (error) {
        // Only log error if it's not a 404
        if (error.status !== 404) {
            console.error(`❌ Error getting medical plans for product ${productId}:`, error);
        }
        return [];
    }
};

/**
 * Get a specific medical plan by ID
 * @param {number} planId - The plan ID
 * @returns {Promise<Object>} - Medical plan details
 */
export const getMedicalPlan = async (planId) => {
    try {
        const response = await axiosInstance.get(`${MEDICAL_PLANS_API_URL}/${planId}`);
        console.log('✅ Retrieved medical plan:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error getting medical plan ${planId}:`, error);
        return null;
    }
};

/**
 * Calculate premium for a specific medical plan
 * @param {Object} params - Calculation parameters
 * @param {number} params.planId - The plan ID
 * @param {number} params.age - User's age
 * @param {string} params.gender - User's gender (Male/Female)
 * @param {string} params.healthStatus - Health status (Excellent/Good/Fair/Poor)
 * @param {string} params.occupationRisk - Occupation risk level (Low/Medium/High)
 * @param {string} params.paymentFrequency - Payment frequency (LumpSum/Annual/Semi-Annual/Quarterly/Monthly)
 * @returns {Promise<Object>} - Calculated premium and medical plan details
 */
export const calculateMedicalPlanPremium = async (params) => {
    try {
        const payload = {
            planId: params.planId,
            age: params.age,
            gender: params.gender || 'Male',
            healthStatus: params.healthStatus || 'Good',
            occupationRisk: params.occupationRisk || 'Low',
            paymentFrequency: params.paymentFrequency || 'Annual'
        };

        const data = await axiosInstance.post(`${MEDICAL_PLANS_API_URL}/calculate`, payload);
        console.log('✅ Medical premium calculated:', data);
        return data;
    } catch (error) {
        console.error('❌ Error calculating medical premium:', error);
        throw error;
    }
};

export default {
    getMedicalPlansByProduct,
    getMedicalPlan,
    calculateMedicalPlanPremium
};
