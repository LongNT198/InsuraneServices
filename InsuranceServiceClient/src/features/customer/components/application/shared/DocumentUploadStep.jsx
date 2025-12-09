import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { Progress } from '../../../../shared/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../shared/components/ui/dialog';
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle, X, AlertCircle, Shield, Heart, DollarSign, Scale, FileCheck, Loader2, CloudUpload, Trash2 } from 'lucide-react';
import { documentService } from '../../../../shared/api/services/documentService';
import { toast } from 'sonner';

export function DocumentUploadStep({ data, onChange, onNext, onPrevious }) {
  // Local file selections (chưa upload lên server)
  const [selectedFiles, setSelectedFiles] = useState({});

  // Uploaded documents metadata (đã lên server)
  const [uploadedDocs, setUploadedDocs] = useState(() => data.documents || {});

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    field: null,
    index: null,
    fileName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if có file nào đã chọn chưa upload
  const hasUnuploadedFiles = useMemo(() => {
    return Object.values(selectedFiles).some(f => f !== null && (Array.isArray(f) ? f.length > 0 : true));
  }, [selectedFiles]);

  // Count số file đã chọn
  const selectedCount = useMemo(() => {
    return Object.entries(selectedFiles).reduce((count, [key, value]) => {
      if (Array.isArray(value)) return count + value.length;
      return value ? count + 1 : count;
    }, 0);
  }, [selectedFiles]);

  // Determine required documents based on application data
  const requiresHealthDocs = useMemo(() => {
    const health = data.healthDeclaration || {};
    const coverage = parseFloat(data.productSelection?.coverageAmount) || 0;
    const personalInfo = data.personalInfo || {};

    let age = 0;
    if (personalInfo.dateOfBirth) {
      const birthDate = new Date(personalInfo.dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    return health.hasMedicalConditions || health.isOnMedication || health.hasHospitalization ||
      health.hasHeartDisease || health.hasCancer || health.hasDiabetes || health.isSmoker ||
      age > 50 || coverage > 500000 || health.hasOccupationalHazards;
  }, [data.healthDeclaration, data.productSelection, data.personalInfo]);

  const requiresFinancialDocs = useMemo(() => {
    const coverage = parseFloat(data.productSelection?.coverageAmount) || 0;
    return coverage > 250000;
  }, [data.productSelection]);

  const requiresMarriageCert = useMemo(() => {
    return data.beneficiaries?.some(b => b.relationship === 'Spouse');
  }, [data.beneficiaries]);

  const requiresBirthCerts = useMemo(() => {
    return data.beneficiaries?.some(b => b.relationship === 'Child');
  }, [data.beneficiaries]);

  const requiresDivorceCert = useMemo(() => {
    const personalInfo = data.personalInfo || {};
    return personalInfo.maritalStatus === 'Divorced';
  }, [data.personalInfo]);

  const requiresTrustDocs = useMemo(() => {
    return data.beneficiaries?.some(b => b.relationship === 'Trust');
  }, [data.beneficiaries]);

  // Chọn file local (chưa upload)
  const handleFileSelect = (field, file, isArray = false) => {
    if (!file) return;

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadErrors(prev => ({
        ...prev,
        [field]: `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      }));
      return;
    }

    // Create preview URL for images
    const fileData = {
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    };

    if (isArray) {
      setSelectedFiles(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), fileData],
      }));
    } else {
      setSelectedFiles(prev => ({
        ...prev,
        [field]: fileData,
      }));
    }

    setUploadErrors(prev => ({ ...prev, [field]: null }));
  };

  // Upload tất cả files lên server
  const handleUploadAll = async () => {
    setUploading(true);
    setUploadErrors({});

    const newUploadedDocs = { ...uploadedDocs };
    let hasError = false;

    try {
      for (const [field, fileData] of Object.entries(selectedFiles)) {
        if (!fileData) continue;

        // Determine document type
        let documentType = 'other';
        if (field.includes('identity') || field.includes('Security')) {
          documentType = 'identity';
        } else if (field.includes('medical') || field.includes('health') || field.includes('lab') || field.includes('hiv') || field.includes('prescription') || field.includes('doctor')) {
          documentType = 'health';
        } else if (field.includes('tax') || field.includes('bank') || field.includes('financial') || field.includes('income') || field.includes('employment') || field.includes('business') || field.includes('investment')) {
          documentType = 'financial';
        } else if (field.includes('marriage') || field.includes('birth') || field.includes('divorce') || field.includes('trust')) {
          documentType = 'legal';
        }

        if (Array.isArray(fileData)) {
          const uploadedArray = [];
          for (const item of fileData) {
            try {
              setUploadProgress(prev => ({ ...prev, [`${field}_${item.name}`]: 0 }));

              const result = await documentService.uploadDocument(
                item.file,
                documentType,
                field,
                (progress) => {
                  setUploadProgress(prev => ({ ...prev, [`${field}_${item.name}`]: progress }));
                }
              );

              uploadedArray.push({
                documentId: result.documentId,
                fileName: result.fileName,
                fileUrl: result.fileUrl,
                fileSize: result.fileSize,
                fileType: result.fileType,
                uploadedAt: result.uploadedAt,
                category: field,
                originalFile: item.name,
              });
            } catch (error) {
              console.error(`❌ Failed to upload ${item.name}:`, error);
              setUploadErrors(prev => ({
                ...prev,
                [field]: `Failed: ${item.name} - ${error.message}`
              }));
              hasError = true;
            }
          }
          if (uploadedArray.length > 0) {
            newUploadedDocs[field] = [...(newUploadedDocs[field] || []), ...uploadedArray];
          }
        } else {
          try {
            setUploadProgress(prev => ({ ...prev, [field]: 0 }));

            const result = await documentService.uploadDocument(
              fileData.file,
              documentType,
              field,
              (progress) => {
                setUploadProgress(prev => ({ ...prev, [field]: progress }));
              }
            );

            newUploadedDocs[field] = {
              documentId: result.documentId,
              fileName: result.fileName,
              fileUrl: result.fileUrl,
              fileSize: result.fileSize,
              fileType: result.fileType,
              uploadedAt: result.uploadedAt,
              category: field,
              originalFile: fileData.name,
            };
          } catch (error) {
            console.error(`❌ Failed to upload ${field}:`, error);
            setUploadErrors(prev => ({
              ...prev,
              [field]: error.message || 'Upload failed'
            }));
            hasError = true;
          }
        }
      }

      if (!hasError) {
        setUploadedDocs(newUploadedDocs);
        onChange({ documents: newUploadedDocs });
        setSelectedFiles({});
        console.log('✅ All documents uploaded successfully');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeSelectedFile = (field, index = null) => {
    if (index !== null) {
      setSelectedFiles(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else {
      // Revoke preview URL if exists
      if (selectedFiles[field]?.previewUrl) {
        URL.revokeObjectURL(selectedFiles[field].previewUrl);
      }
      setSelectedFiles(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const removeUploadedFile = (field, index = null) => {
    // Get document info for confirmation dialog
    const docToDelete = index !== null
      ? uploadedDocs[field][index]
      : uploadedDocs[field];

    const fileName = docToDelete?.originalFile || docToDelete?.fileName || 'this document';

    // Open confirmation dialog
    setDeleteDialog({
      open: true,
      field,
      index,
      fileName
    });
  };

  const confirmDelete = async () => {
    const { field, index } = deleteDialog;
    setIsDeleting(true);

    try {
      // Get the document to delete
      const docToDelete = index !== null
        ? uploadedDocs[field][index]
        : uploadedDocs[field];

      console.log('📄 Document to delete:', docToDelete);
      console.log('🔑 Document ID:', docToDelete?.documentId);
      console.log('🔑 Document Id (lowercase):', docToDelete?.documentId || docToDelete?.id);

      // Delete from server if documentId exists
      const docId = docToDelete?.documentId || docToDelete?.id;
      if (docId) {
        console.log(`🗑️ Deleting document from server with ID: ${docId}`);
        const response = await documentService.deleteDocument(docId);
        console.log('✅ Server delete response:', response);
        toast.success('Document deleted successfully from server');
      } else {
        console.warn('⚠️ No document ID found, only removing from local state');
        toast.info('Document removed from application (was not uploaded to server)');
      }

      // Update local state
      if (index !== null) {
        const updated = {
          ...uploadedDocs,
          [field]: uploadedDocs[field].filter((_, i) => i !== index),
        };
        setUploadedDocs(updated);
        onChange({ documents: updated });
      } else {
        const updated = {
          ...uploadedDocs,
          [field]: null,
        };
        setUploadedDocs(updated);
        onChange({ documents: updated });
      }

      console.log('✅ Document removed from local state');

      // Close dialog
      setDeleteDialog({ open: false, field: null, index: null, fileName: '' });
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      toast.error(`Failed to delete document: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNext = () => {
    onChange({ documents: uploadedDocs });
    onNext();
  };

  // Check if required documents are uploaded
  const hasRequiredDocs = useMemo(() => {
    const allRequired =
      uploadedDocs.identityCardFront &&
      uploadedDocs.identityCardBack &&
      uploadedDocs.socialSecurityCard;

    return allRequired;
  }, [uploadedDocs]);

  const FileUploadBox = ({ id, label, required = false, description }) => {
    const selectedFile = selectedFiles[id];
    const uploadedFile = uploadedDocs[id];
    const progress = uploadProgress[id] || 0;
    const error = uploadErrors[id];
    const isUploading = uploading && progress > 0;

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
          {description && <span className="text-sm text-gray-500 ml-2">{description}</span>}
        </Label>

        {/* Uploaded file (đã lên server - màu xanh) */}
        {uploadedFile && (
          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {uploadedFile.originalFile || uploadedFile.fileName}
                  </span>
                  <span className="text-xs text-green-600">({(uploadedFile.fileSize / 1024).toFixed(1)} KB)</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">✓ Uploaded</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadedFile(id)}
                  className="h-8"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              {uploadedFile.fileType?.startsWith('image/') && uploadedFile.fileUrl && (
                <div className="border rounded overflow-hidden bg-white">
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'https://localhost:7001'}${uploadedFile.fileUrl}`}
                    alt={uploadedFile.fileName}
                    className="w-full h-48 object-contain"
                  />
                </div>
              )}

              {uploadedFile.fileType === 'application/pdf' && uploadedFile.fileUrl && (
                <a
                  href={`${import.meta.env.VITE_API_URL || 'https://localhost:7001'}${uploadedFile.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>View PDF</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Selected file (chưa upload - màu vàng) */}
        {!uploadedFile && (
          <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-500 transition-colors">
            <Input
              id={id}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleFileSelect(id, file, false);
                }
                e.target.value = '';
              }}
              className="hidden"
              disabled={uploading}
            />
            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">⏳ Pending</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSelectedFile(id)}
                    className="h-8"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                {selectedFile.previewUrl && (
                  <div className="border rounded overflow-hidden bg-gray-50">
                    <img
                      src={selectedFile.previewUrl}
                      alt={selectedFile.name}
                      className="w-full h-48 object-contain"
                    />
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading... {progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            ) : (
              <label htmlFor={id} className="cursor-pointer block text-center py-2">
                <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                <p className="text-xs text-gray-600">Click to select file</p>
                <p className="text-xs text-gray-400 mt-1">Max 5MB • PDF, JPG, PNG</p>
              </label>
            )}
          </div>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Status Alert */}
      {hasUnuploadedFiles && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <span className="text-yellow-800">
              <strong>{selectedCount} file(s)</strong> selected. Click "Upload All Documents" below to save to server.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Required Documents Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Required:</strong> Please upload clear, legible copies of all required documents.
          Some documents may be required based on your health declaration and coverage amount.
        </AlertDescription>
      </Alert>

      {/* Section 1: Identity Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-blue-600" />
            Identity Verification (Required)
          </CardTitle>
          <CardDescription>
            Government-issued identification for identity verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FileUploadBox
              id="identityCardFront"
              label="Photo ID - Front Side"
              required
              description="(Driver's License, Passport, National ID)"
            />

            <FileUploadBox
              id="identityCardBack"
              label="Photo ID - Back Side"
              required
              description="(If applicable)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FileUploadBox
              id="socialSecurityCard"
              label="Social Security Card"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Health Documents (Conditional) */}
      {requiresHealthDocs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="w-5 h-5 text-red-500" />
              Health Documentation
            </CardTitle>
            <CardDescription>
              Medical records required based on your health declaration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FileUploadBox
                id="medicalExamReport"
                label="Medical Examination Report"
                description="(Recent physical exam within 6 months)"
              />

              <FileUploadBox
                id="labResults"
                label="Laboratory Test Results"
                description="(Blood work, urinalysis, etc.)"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FileUploadBox
                id="prescriptionHistory"
                label="Prescription Medication History"
                description="(List of current medications)"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Financial Documents (Conditional) */}
      {requiresFinancialDocs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              Financial Documentation
            </CardTitle>
            <CardDescription>
              Required for coverage amounts over $250,000
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FileUploadBox
                id="taxReturn1"
                label="Tax Return - Most Recent Year"
              />

              <FileUploadBox
                id="taxReturn2"
                label="Tax Return - Previous Year"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FileUploadBox
                id="employmentVerification"
                label="Employment Verification Letter"
                description="(From employer on company letterhead)"
              />

              <FileUploadBox
                id="proofOfIncome"
                label="Proof of Income"
                description="(Pay stubs, W-2, 1099, etc.)"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 4: Legal Documents (Conditional) */}
      {(requiresMarriageCert || requiresBirthCerts || requiresDivorceCert || requiresTrustDocs) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Scale className="w-5 h-5 text-purple-600" />
              Legal Documentation
            </CardTitle>
            <CardDescription>
              Required based on your beneficiary selections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {requiresMarriageCert && (
                <FileUploadBox
                  id="marriageCertificate"
                  label="Marriage Certificate"
                  description="(If spouse is beneficiary)"
                />
              )}

              {requiresDivorceCert && (
                <FileUploadBox
                  id="divorceDecree"
                  label="Divorce Decree"
                  description="(Final divorce documentation)"
                />
              )}

              {requiresTrustDocs && (
                <FileUploadBox
                  id="trustDocuments"
                  label="Trust Documents"
                  description="(If trust is beneficiary)"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 5: Additional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileCheck className="w-5 h-5 text-gray-600" />
            Additional Documents (Optional)
          </CardTitle>
          <CardDescription>
            Other supporting documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FileUploadBox
              id="proofOfResidence"
              label="Proof of Residence"
              description="(Utility bill, lease agreement, etc.)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload All Documents Button */}
      {hasUnuploadedFiles && (
        <div className="flex gap-3">
          <Button
            onClick={handleUploadAll}
            size="lg"
            className="flex-1"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4 mr-2" />
                Upload All Documents ({selectedCount})
              </>
            )}
          </Button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Beneficiaries
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          disabled={!hasRequiredDocs || hasUnuploadedFiles}
        >
          Continue to Review & Submit
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !isDeleting && setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <span>Delete Document?</span>
            </DialogTitle>
            <DialogDescription className="pt-3 text-left">
              You are about to delete <span className="font-semibold text-gray-900">{deleteDialog.fileName}</span>. This action will permanently remove the file from the server and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, field: null, index: null, fileName: '' })}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


