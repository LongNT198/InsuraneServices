import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowLeft, ArrowRight } from 'lucide-react';

const DOCUMENT_TYPES = [
  {
    id: 'id_proof',
    name: 'ID Proof',
    description: 'Aadhar Card, PAN Card, Passport, or Driving License',
    required: true,
    maxSize: 5 // MB
  },
  {
    id: 'address_proof',
    name: 'Address Proof',
    description: 'Utility bill, Bank statement, or Rental agreement',
    required: true,
    maxSize: 5
  },
  {
    id: 'age_proof',
    name: 'Age Proof',
    description: 'Birth certificate, School certificate, or Passport',
    required: true,
    maxSize: 5
  },
  {
    id: 'medical_reports',
    name: 'Recent Medical Reports',
    description: 'Blood test, ECG, or any recent medical examination reports (if applicable)',
    required: false,
    maxSize: 10
  },
  {
    id: 'prescription',
    name: 'Prescription (if any)',
    description: 'Current medications or treatment prescriptions',
    required: false,
    maxSize: 5
  },
  {
    id: 'previous_policy',
    name: 'Previous Health Insurance Policy',
    description: 'Copy of previous health insurance policy (if applicable)',
    required: false,
    maxSize: 5
  }
];

export default function HealthDocumentsStep({ data, onNext, onBack }) {
  const [documents, setDocuments] = useState(data?.documents || {});
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({});

  const handleFileSelect = async (docType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const docConfig = DOCUMENT_TYPES.find(d => d.id === docType);
    const maxSizeBytes = docConfig.maxSize * 1024 * 1024;

    // Validate file size
    if (file.size > maxSizeBytes) {
      setErrors(prev => ({
        ...prev,
        [docType]: `File size must be less than ${docConfig.maxSize}MB`
      }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [docType]: 'Only JPG, PNG, or PDF files are allowed'
      }));
      return;
    }

    // Simulate upload
    setUploading(prev => ({ ...prev, [docType]: true }));
    setErrors(prev => ({ ...prev, [docType]: '' }));

    try {
      // In a real application, you would upload to a server here
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Convert to base64 for storage (in production, you'd store the file path/URL)
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [docType]: {
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
            // In production: url: responseFromServer.url
          }
        }));
        setUploading(prev => ({ ...prev, [docType]: false }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [docType]: 'Upload failed. Please try again.'
      }));
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const handleRemoveFile = (docType) => {
    setDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[docType];
      return newDocs;
    });
    setErrors(prev => ({ ...prev, [docType]: '' }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validate = () => {
    const newErrors = {};

    // Check required documents
    DOCUMENT_TYPES.forEach(docType => {
      if (docType.required && !documents[docType.id]) {
        newErrors[docType.id] = `${docType.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ documents });
    }
  };

  const uploadedCount = Object.keys(documents).length;
  const requiredCount = DOCUMENT_TYPES.filter(d => d.required).length;
  const totalCount = DOCUMENT_TYPES.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Please upload all required documents. Files must be in JPG, PNG, or PDF format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Summary */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span>
                  Uploaded: <strong>{uploadedCount}</strong> of <strong>{totalCount}</strong> documents
                </span>
                <span className="text-sm text-gray-600">
                  Required: {requiredCount} | Optional: {totalCount - requiredCount}
                </span>
              </div>
            </AlertDescription>
          </Alert>

          {/* Document Upload Sections */}
          {DOCUMENT_TYPES.map((docType) => {
            const isUploaded = !!documents[docType.id];
            const isUploading = uploading[docType.id];

            return (
              <Card key={docType.id} className={`p-4 ${isUploaded ? 'border-green-200 bg-green-50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">
                        {docType.name}
                        {docType.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      {isUploaded && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{docType.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Max size: {docType.maxSize}MB</p>
                  </div>
                </div>

                {isUploaded ? (
                  <div className="mt-3 p-3 bg-white rounded border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">{documents[docType.id].name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(documents[docType.id].size)} • 
                            Uploaded on {new Date(documents[docType.id].uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(docType.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <Label
                      htmlFor={`file_${docType.id}`}
                      className={`flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-lg cursor-pointer ${
                        errors[docType.id]
                          ? 'border-red-300 bg-red-50 hover:bg-red-100'
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="space-y-2 text-center">
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-600">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                            </div>
                            <p className="text-xs text-gray-500">JPG, PNG or PDF (max {docType.maxSize}MB)</p>
                          </>
                        )}
                      </div>
                      <Input
                        id={`file_${docType.id}`}
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileSelect(docType.id, e)}
                        disabled={isUploading}
                      />
                    </Label>
                    {errors[docType.id] && (
                      <div className="flex items-center gap-2 mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{errors[docType.id]}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {/* Important Note */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>All documents must be clear and legible</li>
                <li>Documents should not be older than 3 months (except ID proof)</li>
                <li>Ensure all information is visible in the uploaded documents</li>
                <li>Original documents may be requested during verification</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Continue to Review
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
