import axiosInstance from '../axios';

export const documentService = {
  /**
   * Upload a single document file
   * @param {File} file - The file to upload
   * @param {string} documentType - Type of document (identity, health, financial, legal, other)
   * @param {string} category - Specific category (e.g., 'identityCardFront', 'medicalReport')
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Upload response with file URL and metadata
   */
  uploadDocument: async (file, documentType, category, onProgress) => {
    try {
      // Validate file object
      if (!file || !file.name) {
        console.error('❌ Invalid file object:', file);
        throw new Error('Invalid file. Please select a valid file.');
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/heic',
        'image/heif' // Also accept HEIF
      ];

      // Validate by MIME type if available, otherwise by extension
      const fileTypeLower = (file.type || '').toLowerCase();
      const fileExtension = file.name ? file.name.split('.').pop().toLowerCase() : '';
      const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif'];
      
      const isValidType = allowedTypes.includes(fileTypeLower);
      const isValidExtension = allowedExtensions.includes(fileExtension);
      
      if (!isValidType && !isValidExtension) {
        console.warn(`❌ File type rejected: ${file.type || 'unknown'} / .${fileExtension} (${file.name || 'unknown'})`);
        throw new Error(`File type not allowed. Accepted: PDF, JPG, PNG, HEIC`);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('category', category);
      formData.append('fileName', file.name);

      console.log(`📤 Uploading document: ${category} (${file.name})`);

      // Upload with progress tracking
      const response = await axiosInstance.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });

      console.log(`✅ Document uploaded successfully:`, response);

      return {
        success: true,
        fileUrl: response.fileUrl || response.filePath,
        fileName: response.fileName || file.name,
        fileSize: file.size,
        fileType: file.type,
        category: category,
        uploadedAt: new Date().toISOString(),
        documentId: response.id,
      };
    } catch (error) {
      console.error('❌ Failed to upload document:', error);
      throw error;
    }
  },

  /**
   * Upload multiple documents
   * @param {Array} files - Array of {file, documentType, category}
   * @param {Function} onProgress - Progress callback
   */
  uploadMultipleDocuments: async (files, onProgress) => {
    const results = [];
    const total = files.length;
    
    for (let i = 0; i < files.length; i++) {
      const { file, documentType, category } = files[i];
      
      try {
        const result = await documentService.uploadDocument(
          file,
          documentType,
          category,
          (progress) => {
            if (onProgress) {
              const overallProgress = Math.round(((i + progress / 100) / total) * 100);
              onProgress(overallProgress, i + 1, total);
            }
          }
        );
        
        results.push({ ...result, success: true });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          category,
          fileName: file.name,
        });
      }
    }

    return results;
  },

  /**
   * Delete a document
   * @param {number} documentId - Document ID to delete
   */
  deleteDocument: async (documentId) => {
    try {
      const response = await axiosInstance.delete(`/api/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  },

  /**
   * Get document by ID
   * @param {number} documentId - Document ID
   */
  getDocument: async (documentId) => {
    try {
      const response = await axiosInstance.get(`/api/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch document:', error);
      throw error;
    }
  },

  /**
   * Get all documents for current user
   */
  getMyDocuments: async () => {
    try {
      const response = await axiosInstance.get('/api/documents/my-documents');
      return response;
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw error;
    }
  },
};
