import axiosInstance from '../axios';

export const applicationService = {
  // Get all applications for current user
  getApplications: async () => {
    const response = await axiosInstance.get('/api/applications');
    return response;
  },

  // Submit insurance application
  submitApplication: async (applicationData) => {
    try {
      console.log('📥 Received application data:', applicationData);
      
      // Validate required data
      if (!applicationData) {
        throw new Error('Application data is required');
      }
      
      if (!applicationData.applicant) {
        throw new Error('Applicant information is required');
      }
      
      // Transform applicant data to match backend DTO
      const applicant = applicationData.applicant || {};
      const transformedApplicant = {
        firstName: applicant.firstName || '',
        lastName: applicant.lastName || '',
        email: applicant.email || '',
        phone: applicant.phone || '',
        dateOfBirth: applicant.dateOfBirth || '',
        gender: applicant.gender || '',
        nationalId: applicant.nationalId || '',
        occupation: applicant.occupation || '',
        occupationOther: applicant.occupationOther || null,
        annualIncome: applicant.annualIncome ? parseFloat(applicant.annualIncome) : null,
        address: applicant.address || '',
        city: applicant.city || '',
        postalCode: applicant.postalCode || '',
        emergencyContactName: applicant.emergencyContactName || '',
        emergencyContactPhone: applicant.emergencyContactPhone || '',
        emergencyContactGender: applicant.emergencyContactGender || null,
        emergencyContactRelationship: applicant.emergencyContactRelationship || '',
        emergencyContactRelationshipOther: applicant.emergencyContactRelationshipOther || null
      };

      // Transform beneficiaries data
      const beneficiaries = (applicationData.beneficiaries || []).map(b => ({
        id: b.id || 0,
        type: b.type || 'Primary',
        fullName: b.fullName || '',
        relationship: b.relationship || '',
        relationshipOther: b.relationshipOther || null, // Added: specify when Relationship = "Other"
        dateOfBirth: b.dateOfBirth || '',
        nationalId: b.nationalId || '',
        ssn: b.ssn || '',
        email: b.email || '',
        phone: b.phone || '',
        address: b.address || '',
        city: b.city || '',
        state: b.state || '',
        postalCode: b.postalCode || '',
        percentage: parseFloat(b.percentage) || 0,
        isMinor: b.isMinor || false,
        trustee: b.trustee || '',
        trusteeRelationship: b.trusteeRelationship || '',
        trusteeRelationshipOther: b.trusteeRelationshipOther || null, // Added: specify when TrusteeRelationship = "Other"
        perStirpes: b.perStirpes || false,
        isIrrevocable: b.isIrrevocable || false,
      }));

      // Transform health declaration to ensure all boolean fields are proper booleans
      const healthDeclaration = applicationData.healthDeclaration || {};
      const transformedHealthDeclaration = {
        ...healthDeclaration,
        // Ensure all boolean fields are actual booleans, not strings
        hasMedicalConditions: Boolean(healthDeclaration.hasMedicalConditions),
        isOnMedication: Boolean(healthDeclaration.isOnMedication),
        hasHospitalization: Boolean(healthDeclaration.hasHospitalization),
        hasHeartDisease: Boolean(healthDeclaration.hasHeartDisease),
        hasStroke: Boolean(healthDeclaration.hasStroke),
        hasCancer: Boolean(healthDeclaration.hasCancer),
        hasDiabetes: Boolean(healthDeclaration.hasDiabetes),
        hasHighBloodPressure: Boolean(healthDeclaration.hasHighBloodPressure),
        hasHighCholesterol: Boolean(healthDeclaration.hasHighCholesterol),
        hasKidneyDisease: Boolean(healthDeclaration.hasKidneyDisease),
        hasLiverDisease: Boolean(healthDeclaration.hasLiverDisease),
        hasMentalHealthCondition: Boolean(healthDeclaration.hasMentalHealthCondition),
        hasHIV: Boolean(healthDeclaration.hasHIV),
        isSmoker: Boolean(healthDeclaration.isSmoker),
        consumesAlcohol: Boolean(healthDeclaration.consumesAlcohol),
        usesDrugs: Boolean(healthDeclaration.usesDrugs),
        hasOccupationalHazards: Boolean(healthDeclaration.hasOccupationalHazards),
        participatesInDangerousSports: Boolean(healthDeclaration.participatesInDangerousSports),
        isPregnant: Boolean(healthDeclaration.isPregnant),
        hasPregnancyComplications: Boolean(healthDeclaration.hasPregnancyComplications),
        hasDisability: Boolean(healthDeclaration.hasDisability),
        hasLifeThreateningCondition: Boolean(healthDeclaration.hasLifeThreateningCondition),
        hasSurgeryLast5Years: Boolean(healthDeclaration.hasSurgeryLast5Years),
        hasPendingMedicalTests: Boolean(healthDeclaration.hasPendingMedicalTests),
        hasPlannedProcedures: Boolean(healthDeclaration.hasPlannedProcedures),
        fatherDeceased: Boolean(healthDeclaration.fatherDeceased),
        motherDeceased: Boolean(healthDeclaration.motherDeceased),
      };

      const payload = {
        productId: parseInt(applicationData.productId) || null,
        coverageAmount: parseFloat(applicationData.coverageAmount) || 0,
        termYears: parseInt(applicationData.termYears) || 0,
        paymentFrequency: applicationData.paymentFrequency || 'Monthly',
        premiumAmount: parseFloat(applicationData.premiumAmount) || 0,
        
        // Personal info (transformed)
        applicant: transformedApplicant,
        
        // Health declaration (transformed to ensure proper types)
        healthDeclaration: transformedHealthDeclaration,
        
        // Beneficiaries (transformed)
        beneficiaries: beneficiaries,
        
        // Documents (file paths or base64)
        documents: applicationData.documents || {},
        
        // Terms acceptance
        termsAccepted: applicationData.termsAccepted || false,
        declarationAccepted: applicationData.declarationAccepted || false,
      };

      console.log('📤 Sending application payload:', payload);
      
      const response = await axiosInstance.post('/api/applications', payload);
      
      return response;
    } catch (error) {
      console.error('Failed to submit application:', error);
      console.error('Error details:', error.errors);
      console.error('Full error response:', error);
      throw error;
    }
  },

  // Get application by ID
  getApplication: async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/api/applications/${applicationId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch application:', error);
      throw error;
    }
  },

  // Get user's applications
  getMyApplications: async () => {
    try {
      const response = await axiosInstance.get('/api/applications/my-applications');
      return response;
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      throw error;
    }
  },

  // Save draft application
  saveDraft: async (applicationData) => {
    try {
      const response = await axiosInstance.post('/api/applications/draft', applicationData);
      return response;
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  },

  // Update existing application
  updateApplication: async (applicationId, applicationData) => {
    try {
      const response = await axiosInstance.patch(`/api/applications/${applicationId}`, applicationData);
      return response;
    } catch (error) {
      console.error('Failed to update application:', error);
      throw error;
    }
  },

  // Save beneficiaries for an application
  saveBeneficiaries: async (applicationId, beneficiaries) => {
    try {
      // Transform beneficiaries data to match backend DTO
      const transformedBeneficiaries = beneficiaries.map(b => ({
        type: b.type || 'Primary',
        fullName: b.fullName || '',
        relationship: b.relationship || '',
        relationshipOther: b.relationshipOther || null, // Added: specify when Relationship = "Other"
        dateOfBirth: b.dateOfBirth || '',
        nationalId: b.nationalId || '',
        ssn: b.ssn || '',
        email: b.email || '',
        phone: b.phone || '',
        address: b.address || '',
        city: b.city || '',
        state: b.state || '',
        postalCode: b.postalCode || '',
        percentage: parseFloat(b.percentage) || 0,
        isMinor: b.isMinor || false,
        trustee: b.trustee || '',
        trusteeRelationship: b.trusteeRelationship || '',
        trusteeRelationshipOther: b.trusteeRelationshipOther || null, // Added: specify when TrusteeRelationship = "Other"
        perStirpes: b.perStirpes || false,
        isIrrevocable: b.isIrrevocable || false,
      }));

      console.log('📤 Saving beneficiaries for application:', applicationId, transformedBeneficiaries);
      
      const response = await axiosInstance.post(
        `/api/applications/${applicationId}/beneficiaries`, 
        transformedBeneficiaries
      );
      
      console.log('✅ Beneficiaries saved successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Failed to save beneficiaries:', error);
      throw error;
    }
  },

  // Get beneficiaries for an application
  getBeneficiaries: async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/api/applications/${applicationId}/beneficiaries`);
      return response;
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error);
      throw error;
    }
  },

  // ========== Progressive Saving Methods ==========

  // Create draft application at the start of the flow
  createDraft: async (productId = null) => {
    try {
      console.log('📝 Creating draft application with productId:', productId);
      const data = await axiosInstance.post('/api/applications/create-draft', {
        productId: productId ? parseInt(productId) : null
      });
      console.log('✅ Draft created:', data);
      return data;
    } catch (error) {
      console.error('Failed to create draft:', error);
      throw error;
    }
  },

  // Update personal info (Step 1)
  updatePersonalInfo: async (applicationId, applicantData) => {
    try {
      console.log('📝 Updating personal info for application:', applicationId);
      const payload = {
        firstName: applicantData.firstName || '',
        lastName: applicantData.lastName || '',
        email: applicantData.email || '',
        phone: applicantData.phone || '',
        dateOfBirth: applicantData.dateOfBirth || '',
        gender: applicantData.gender || '',
        nationalId: applicantData.nationalId || '',
        occupation: applicantData.occupation || '',
        occupationOther: applicantData.occupationOther || null,
        annualIncome: applicantData.annualIncome ? parseFloat(applicantData.annualIncome) : null,
        address: applicantData.address || '',
        city: applicantData.city || '',
        postalCode: applicantData.postalCode || '',
        emergencyContactName: applicantData.emergencyContactName || '',
        emergencyContactPhone: applicantData.emergencyContactPhone || '',
        emergencyContactGender: applicantData.emergencyContactGender || null,
        emergencyContactRelationship: applicantData.emergencyContactRelationship || '',
        emergencyContactRelationshipOther: applicantData.emergencyContactRelationshipOther || null,
      };
      
      const data = await axiosInstance.put(`/api/applications/${applicationId}/personal-info`, payload);
      console.log('✅ Personal info updated');
      return data;
    } catch (error) {
      console.error('Failed to update personal info:', error);
      throw error;
    }
  },

  // Update health declaration (Step 2)
  updateHealthDeclaration: async (applicationId, healthData) => {
    try {
      console.log('📝 Updating health declaration for application:', applicationId);
      const data = await axiosInstance.put(`/api/applications/${applicationId}/health-declaration`, healthData);
      console.log('✅ Health declaration updated');
      return data;
    } catch (error) {
      console.error('Failed to update health declaration:', error);
      throw error;
    }
  },

  // Update product selection (Step 3)
  updateProduct: async (applicationId, productData) => {
    try {
      console.log('📝 Updating product selection for application:', applicationId);
      const payload = {
        productId: productData.productId ? parseInt(productData.productId) : null,
        coverageAmount: parseFloat(productData.coverageAmount) || 0,
        termYears: parseInt(productData.termYears) || 0,
        paymentFrequency: productData.paymentFrequency || 'Monthly',
        premiumAmount: parseFloat(productData.premiumAmount) || 0,
      };
      
      const data = await axiosInstance.put(`/api/applications/${applicationId}/product`, payload);
      console.log('✅ Product selection updated');
      return data;
    } catch (error) {
      console.error('Failed to update product selection:', error);
      throw error;
    }
  },
};
