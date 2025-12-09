import axiosInstance from '../axios';

/**
 * Plans Service - API for insurance plans
 * Real-world insurance uses fixed packages, not custom amounts
 */

const PLANS_API_URL = '/api/Plans';

/**
 * Get all active plans for a specific product
 * @param {number} productId - The product ID
 * @returns {Promise<Array>} - Array of insurance plans
 */
export const getPlansByProduct = async (productId) => {
    try {
        const response = await axiosInstance.get(`${PLANS_API_URL}/product/${productId}`);
        console.log(`🔍 Raw response for product ${productId}:`, response);
        console.log(`🔍 Response type:`, typeof response, Array.isArray(response));
        
        // Handle different response formats (direct array or wrapped in data property)
        const plans = Array.isArray(response) 
            ? response 
            : (response?.value || response?.plans || response?.data || []);
        console.log(`✅ Retrieved ${plans.length} plan(s) for product ${productId}`);
        return plans;
    } catch (error) {
        // Only log error if it's not a 404 (no plans available is normal)
        if (error.status !== 404) {
            console.error(`❌ Error getting plans for product ${productId}:`, error);
        }
        return []; // Return empty array instead of throwing to prevent UI crash
    }
};

/**
 * Get a specific plan by ID
 * @param {number} planId - The plan ID
 * @returns {Promise<Object>} - Plan details
 */
export const getPlan = async (planId) => {
    try {
        const response = await axiosInstance.get(`${PLANS_API_URL}/${planId}`);
        console.log('✅ Retrieved plan:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error getting plan ${planId}:`, error);
        return null; // Return null instead of throwing
    }
};

/**
 * Calculate premium for a specific plan based on user characteristics
 * @param {Object} params - Calculation parameters
 * @param {number} params.planId - The plan ID
 * @param {number} params.age - User's age
 * @param {string} params.gender - User's gender (Male/Female)
 * @param {string} params.healthStatus - Health status (Excellent/Good/Fair/Poor)
 * @param {string} params.occupationRisk - Occupation risk level (Low/Medium/High)
 * @param {string} params.paymentFrequency - Payment frequency (LumpSum/Annual/Semi-Annual/Quarterly/Monthly)
 * @returns {Promise<Object>} - Calculated premium and plan details
 */
export const calculatePlanPremium = async (params) => {
    try {
        const payload = {
            planId: params.planId,
            age: params.age,
            gender: params.gender || 'Male',
            healthStatus: params.healthStatus || 'Good',
            occupationRisk: params.occupationRisk || 'Low',
            paymentFrequency: params.paymentFrequency || 'Annual'
        };

        // Note: axios interceptor already returns response.data
        const data = await axiosInstance.post(`${PLANS_API_URL}/calculate`, payload);
        console.log('✅ Premium calculated:', data);
        return data;
    } catch (error) {
        console.error('❌ Error calculating premium:', error);
        throw error;
    }
};

/**
 * Get featured/popular plans
 * @returns {Promise<Array>} - Array of featured plans
 */
export const getFeaturedPlans = async () => {
    try {
        const response = await axiosInstance.get(`${PLANS_API_URL}/featured`);
        const plans = Array.isArray(response.data) 
            ? response.data 
            : (response.data?.value || response.data?.plans || response.data?.data || []);
        console.log(`✅ Retrieved ${plans.length} featured plan(s)`);
        return plans;
    } catch (error) {
        console.error('❌ Error getting featured plans:', error);
        return []; // Return empty array instead of throwing
    }
};

export default {
    getPlansByProduct,
    getPlan,
    calculatePlanPremium,
    getFeaturedPlans
};
