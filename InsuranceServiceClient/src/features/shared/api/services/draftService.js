import axiosInstance from '../axios';

/**
 * Draft Service - API methods for managing application drafts
 * Professional backend-based draft persistence
 */

const DRAFT_API_URL = '/api/ApplicationDraft';

/**
 * Save or update an application draft
 * @param {Object} draftData - The draft data to save
 * @param {string} draftData.applicationType - Type of application (e.g., 'LifeInsurance', 'HealthInsurance')
 * @param {Object} draftData.data - The actual draft data (will be JSON stringified)
 * @param {string} [draftData.notes] - Optional notes
 * @returns {Promise<Object>} - Saved draft with ID
 */
export const saveDraft = async (draftData) => {
    try {
        const payload = {
            applicationType: draftData.applicationType,
            draftData: JSON.stringify(draftData.data),
            notes: draftData.notes || null
        };

        const response = await axiosInstance.post(DRAFT_API_URL, payload);
        console.log('✅ Draft saved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error saving draft:', error);
        throw error;
    }
};

/**
 * Get a specific draft by ID
 * @param {string} draftId - The draft ID (GUID)
 * @returns {Promise<Object>} - Draft with parsed data
 */
export const getDraft = async (draftId) => {
    try {
        const response = await axiosInstance.get(`${DRAFT_API_URL}/${draftId}`);
        const draft = response.data;
        
        // Parse the JSON string back to object
        if (draft.draftData) {
            draft.parsedData = JSON.parse(draft.draftData);
        }
        
        console.log('✅ Draft retrieved:', draft);
        return draft;
    } catch (error) {
        console.error('❌ Error getting draft:', error);
        throw error;
    }
};

/**
 * Get all drafts for current user (optionally filtered by application type)
 * @param {string} [applicationType] - Optional filter by application type
 * @returns {Promise<Array>} - Array of drafts with parsed data
 */
export const getUserDrafts = async (applicationType = null) => {
    try {
        let url = DRAFT_API_URL;
        if (applicationType) {
            url += `?applicationType=${encodeURIComponent(applicationType)}`;
        }

        const response = await axiosInstance.get(url);
        const drafts = response.data;

        // Parse JSON data for each draft
        const parsedDrafts = drafts.map(draft => ({
            ...draft,
            parsedData: draft.draftData ? JSON.parse(draft.draftData) : null
        }));

        console.log(`✅ Retrieved ${parsedDrafts.length} draft(s)`, parsedDrafts);
        return parsedDrafts;
    } catch (error) {
        console.error('❌ Error getting user drafts:', error);
        throw error;
    }
};

/**
 * Delete a draft by ID
 * @param {string} draftId - The draft ID (GUID)
 * @returns {Promise<void>}
 */
export const deleteDraft = async (draftId) => {
    try {
        await axiosInstance.delete(`${DRAFT_API_URL}/${draftId}`);
        console.log('✅ Draft deleted successfully:', draftId);
    } catch (error) {
        console.error('❌ Error deleting draft:', error);
        throw error;
    }
};

/**
 * Save calculator parameters as draft
 * Convenience method for Calculator component
 * @param {Object} params - Calculator parameters
 * @returns {Promise<Object>} - Saved draft
 */
export const saveCalculatorDraft = async (params) => {
    return saveDraft({
        applicationType: params.applicationType || 'LifeInsurance',
        data: {
            ...params,
            source: 'calculator',
            timestamp: Date.now()
        },
        notes: 'Auto-saved from calculator'
    });
};

/**
 * Get most recent calculator draft
 * @param {string} [applicationType='LifeInsurance'] - Application type
 * @returns {Promise<Object|null>} - Latest calculator draft or null
 */
export const getLatestCalculatorDraft = async (applicationType = 'LifeInsurance') => {
    try {
        const drafts = await getUserDrafts(applicationType);
        
        // Filter for calculator drafts and get most recent
        const calculatorDrafts = drafts
            .filter(d => d.parsedData?.source === 'calculator')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        if (calculatorDrafts.length > 0) {
            return calculatorDrafts[0];
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting latest calculator draft:', error);
        return null;
    }
};

export default {
    saveDraft,
    getDraft,
    getUserDrafts,
    deleteDraft,
    saveCalculatorDraft,
    getLatestCalculatorDraft
};
