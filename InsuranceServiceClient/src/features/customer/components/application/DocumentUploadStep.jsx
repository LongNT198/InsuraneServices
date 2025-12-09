import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { Alert, AlertDescription } from '../../../shared/components/ui/alert';
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle, X, AlertCircle, Shield, Heart, DollarSign, Scale, FileCheck } from 'lucide-react';

export function DocumentUploadStep({ data, onChange, onNext, onPrevious }) {
  const [documents, setDocuments] = useState(() => ({
    // Identity Documents
    identityCardFront: null,
    identityCardBack: null,
    socialSecurityCard: null,
    // Health Documents
    medicalExamReport: null,
    labResults: null,
    prescriptionHistory: null,
    medicalRecordsForConditions: [],
    doctorStatement: null,
    hivTestResults: null,
    // Financial Documents
    taxReturn1: null,
    taxReturn2: null,
    bankStatements: [],
    employmentVerification: null,
    businessFinancials: null,
    investmentStatements: null,
    proofOfIncome: null,
    // Legal Documents
    marriageCertificate: null,
    birthCertificates: [],
    divorceDecree: null,
    trustDocuments: null,
    // Other Documents
    existingPolicies: [],
    proofOfResidence: null,
    signatureAuthorization: null,
    medicalExamAppointment: null,
    ...data.documents,
  }));

  // Determine required documents based on application data
  const requiresHealthDocs = useMemo(() => {
    const health = data.healthDeclaration || {};
    const coverage = parseFloat(data.productSelection?.coverageAmount) || 0;
    const personalInfo = data.personalInfo || {};
    
    // Calculate age
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
    
    return health.hasMedicalConditions || 
           health.isOnMedication || 
           health.hasHospitalization ||
           health.hasHeartDisease ||
           health.hasCancer ||
           health.hasDiabetes ||
           health.isSmoker ||
           age > 50 ||
           coverage > 500000 ||
           health.hasOccupationalHazards;
  }, [data.healthDeclaration, data.productSelection, data.personalInfo]);

  const requiresFinancialDocs = useMemo(() => {
    // Required for coverage >$250k OR self-employed
    const coverage = parseFloat(data.productSelection?.coverageAmount) || 0;
    const personalInfo = data.personalInfo || {};
    const health = data.healthDeclaration || {};
    const occupation = health.occupation?.toLowerCase() || '';
    
    const isSelfEmployed = occupation.includes('self-employed') || 
                          occupation.includes('business owner') ||
                          occupation.includes('freelance') ||
                          occupation.includes('entrepreneur');
    
    return coverage > 250000 || isSelfEmployed;
  }, [data.productSelection, data.healthDeclaration]);

  const requiresMarriageCert = useMemo(() => {
    return data.beneficiaries?.some(b => b.relationship === 'Spouse');
  }, [data.beneficiaries]);

  const requiresBirthCerts = useMemo(() => {
    return data.beneficiaries?.some(b => b.relationship === 'Child');
  }, [data.beneficiaries]);

  const requiresDivorceCert = useMemo(() => {
    // Check if divorced AND has ex-spouse related beneficiary or legal situation
    const personalInfo = data.personalInfo || {};
    return personalInfo.maritalStatus === 'Divorced';
  }, [data.personalInfo]);

  const requiresTrustDocs = useMemo(() => {
    return data.beneficiaries?.some(b => b.relationship === 'Trust');
  }, [data.beneficiaries]);

  const handleFileChange = (field, file, isArray = false) => {
    if (isArray) {
      setDocuments(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), file],
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const removeFile = (field, index = null) => {
    if (index !== null) {
      setDocuments(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleNext = () => {
    onChange({ documents });
    onNext();
  };

  // Check if required documents are uploaded
  const hasRequiredDocs = useMemo(() => {
    // Always required
    let allRequired = documents.identityCardFront && 
                      documents.identityCardBack && 
                      documents.socialSecurityCard;
    
    // Conditionally required - Legal docs
    if (requiresMarriageCert && !documents.marriageCertificate) allRequired = false;
    if (requiresDivorceCert && !documents.divorceDecree) allRequired = false;
    if (requiresTrustDocs && !documents.trustDocuments) allRequired = false;
    if (requiresBirthCerts && (!documents.birthCertificates || documents.birthCertificates.length === 0)) allRequired = false;
    
    return allRequired;
  }, [documents, requiresMarriageCert, requiresDivorceCert, requiresTrustDocs, requiresBirthCerts]);

  const FileUploadBox = ({ id, label, file, onChange, onRemove, required = false, accept = ".pdf,.jpg,.jpeg,.png", description }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
        {description && <span className="text-sm text-gray-500 ml-2">{description}</span>}
      </Label>
      <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-500 transition-colors">
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8"
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <label htmlFor={id} className="cursor-pointer block text-center py-2">
            <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
          </label>
        )}
      </div>
    </div>
  );

  const MultiFileUploadBox = ({ id, label, files = [], onChange, onRemove, required = false, description }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
        {description && <span className="text-sm text-gray-500 ml-2">{description}</span>}
      </Label>
      
      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="space-y-2 mb-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between border rounded p-2 bg-gray-50">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-8"
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload new file */}
      <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-500 transition-colors">
        <Input
          id={id}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onChange(e.target.files[0])}
          className="hidden"
        />
        <label htmlFor={id} className="cursor-pointer block text-center py-2">
          <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
          <p className="text-xs text-gray-600">Click to add more files</p>
          <p className="text-xs text-gray-400 mt-1">Max 5MB per file</p>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
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
              id="idFront"
              label="Photo ID - Front Side"
              file={documents.identityCardFront}
              onChange={(file) => handleFileChange('identityCardFront', file)}
              onRemove={() => removeFile('identityCardFront')}
              required
              description="(Driver's License, Passport, National ID)"
            />

            <FileUploadBox
              id="idBack"
              label="Photo ID - Back Side"
              file={documents.identityCardBack}
              onChange={(file) => handleFileChange('identityCardBack', file)}
              onRemove={() => removeFile('identityCardBack')}
              required
              description="(If applicable)"
            />
          </div>

          <FileUploadBox
            id="ssn"
            label="Social Security Card"
            file={documents.socialSecurityCard}
            onChange={(file) => handleFileChange('socialSecurityCard', file)}
            onRemove={() => removeFile('socialSecurityCard')}
            required
            description="(Or Tax ID documentation)"
          />
        </CardContent>
      </Card>

      {/* Section 2: Health Documents (Conditional) */}
      {requiresHealthDocs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="w-5 h-5 text-red-600" />
              Medical Documentation
            </CardTitle>
            <CardDescription>
              Required due to disclosed health conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Based on your health declaration, we need medical documentation to complete underwriting.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <FileUploadBox
                id="medicalExam"
                label="Medical Examination Report"
                file={documents.medicalExamReport}
                onChange={(file) => handleFileChange('medicalExamReport', file)}
                onRemove={() => removeFile('medicalExamReport')}
                description="(Within last 12 months)"
              />

              <FileUploadBox
                id="labResults"
                label="Laboratory Test Results"
                file={documents.labResults}
                onChange={(file) => handleFileChange('labResults', file)}
                onRemove={() => removeFile('labResults')}
                description="(Blood work, urinalysis)"
              />

              <FileUploadBox
                id="prescriptions"
                label="Prescription History"
                file={documents.prescriptionHistory}
                onChange={(file) => handleFileChange('prescriptionHistory', file)}
                onRemove={() => removeFile('prescriptionHistory')}
                description="(Last 24 months)"
              />

              <FileUploadBox
                id="doctorStatement"
                label="Doctor's Statement"
                file={documents.doctorStatement}
                onChange={(file) => handleFileChange('doctorStatement', file)}
                onRemove={() => removeFile('doctorStatement')}
                description="(For pre-existing conditions)"
              />
            </div>

            <MultiFileUploadBox
              id="medicalRecords"
              label="Medical Records"
              files={documents.medicalRecordsForConditions}
              onChange={(file) => handleFileChange('medicalRecordsForConditions', file, true)}
              onRemove={(index) => removeFile('medicalRecordsForConditions', index)}
              description="(For disclosed conditions - can upload multiple)"
            />

            <FileUploadBox
              id="hivTest"
              label="HIV Test Results"
              file={documents.hivTestResults}
              onChange={(file) => handleFileChange('hivTestResults', file)}
              onRemove={() => removeFile('hivTestResults')}
              description="(Required for coverage >$1M)"
            />
          </CardContent>
        </Card>
      )}

      {/* Section 3: Financial Documents (Conditional) */}
      {requiresFinancialDocs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              Financial Verification
            </CardTitle>
            <CardDescription>
              Required for coverage over $250,000 or self-employed applicants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Financial verification is required for coverage over $250,000 or if you are self-employed to ensure the policy is appropriate for your circumstances.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <FileUploadBox
                id="taxReturn1"
                label="Tax Return - Previous Year"
                file={documents.taxReturn1}
                onChange={(file) => handleFileChange('taxReturn1', file)}
                onRemove={() => removeFile('taxReturn1')}
                accept=".pdf"
              />

              <FileUploadBox
                id="taxReturn2"
                label="Tax Return - 2 Years Ago"
                file={documents.taxReturn2}
                onChange={(file) => handleFileChange('taxReturn2', file)}
                onRemove={() => removeFile('taxReturn2')}
                accept=".pdf"
              />

              <FileUploadBox
                id="employmentVerif"
                label="Employment Verification Letter"
                file={documents.employmentVerification}
                onChange={(file) => handleFileChange('employmentVerification', file)}
                onRemove={() => removeFile('employmentVerification')}
              />

              <FileUploadBox
                id="proofIncome"
                label="Recent Pay Stub"
                file={documents.proofOfIncome}
                onChange={(file) => handleFileChange('proofOfIncome', file)}
                onRemove={() => removeFile('proofOfIncome')}
                description="(Last 3 months)"
              />

              <FileUploadBox
                id="businessFinancials"
                label="Business Financials"
                file={documents.businessFinancials}
                onChange={(file) => handleFileChange('businessFinancials', file)}
                onRemove={() => removeFile('businessFinancials')}
                description="(If self-employed)"
              />

              <FileUploadBox
                id="investments"
                label="Investment Statements"
                file={documents.investmentStatements}
                onChange={(file) => handleFileChange('investmentStatements', file)}
                onRemove={() => removeFile('investmentStatements')}
                description="(Stocks, bonds, retirement)"
              />
            </div>

            <MultiFileUploadBox
              id="bankStatements"
              label="Bank Statements"
              files={documents.bankStatements}
              onChange={(file) => handleFileChange('bankStatements', file, true)}
              onRemove={(index) => removeFile('bankStatements', index)}
              description="(Last 3-6 months - can upload multiple)"
            />
          </CardContent>
        </Card>
      )}

      {/* Section 4: Legal Documents (Conditional) */}
      {(requiresMarriageCert || requiresBirthCerts || requiresDivorceCert || requiresTrustDocs) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Scale className="w-5 h-5 text-purple-600" />
              Legal Documents
            </CardTitle>
            <CardDescription>
              Required based on your beneficiary designations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {requiresMarriageCert && (
                <FileUploadBox
                  id="marriageCert"
                  label="Marriage Certificate"
                  file={documents.marriageCertificate}
                  onChange={(file) => handleFileChange('marriageCertificate', file)}
                  onRemove={() => removeFile('marriageCertificate')}
                  required
                  description="(Spouse is beneficiary)"
                />
              )}

              {requiresDivorceCert && (
                <FileUploadBox
                  id="divorceCert"
                  label="Divorce Decree"
                  file={documents.divorceDecree}
                  onChange={(file) => handleFileChange('divorceDecree', file)}
                  onRemove={() => removeFile('divorceDecree')}
                  required
                  description="(Marital status: Divorced)"
                />
              )}

              {requiresTrustDocs && (
                <FileUploadBox
                  id="trustDocs"
                  label="Trust Documents"
                  file={documents.trustDocuments}
                  onChange={(file) => handleFileChange('trustDocuments', file)}
                  onRemove={() => removeFile('trustDocuments')}
                  required
                  description="(Trust is beneficiary)"
                />
              )}
            </div>

            {requiresBirthCerts && (
              <MultiFileUploadBox
                id="birthCerts"
                label="Birth Certificates"
                files={documents.birthCertificates}
                onChange={(file) => handleFileChange('birthCertificates', file, true)}
                onRemove={(index) => removeFile('birthCertificates', index)}
                required
                description="(For child beneficiaries - upload one per child)"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Section 5: Other Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileCheck className="w-5 h-5 text-gray-600" />
            Additional Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FileUploadBox
              id="proofResidence"
              label="Proof of Residence"
              file={documents.proofOfResidence}
              onChange={(file) => handleFileChange('proofOfResidence', file)}
              onRemove={() => removeFile('proofOfResidence')}
              description="(Utility bill, lease agreement)"
            />

            <FileUploadBox
              id="medicalExamAppt"
              label="Medical Exam Appointment"
              file={documents.medicalExamAppointment}
              onChange={(file) => handleFileChange('medicalExamAppointment', file)}
              onRemove={() => removeFile('medicalExamAppointment')}
              description="(Confirmation if scheduled)"
            />
          </div>

          <MultiFileUploadBox
            id="existingPolicies"
            label="Existing Life Insurance Policies"
            files={documents.existingPolicies}
            onChange={(file) => handleFileChange('existingPolicies', file, true)}
            onRemove={(index) => removeFile('existingPolicies', index)}
            description="(If replacing or supplementing - upload policy pages)"
          />
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> All documents will be reviewed during underwriting. 
          Additional documents may be requested. Keep originals for your records.
        </AlertDescription>
      </Alert>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          size="lg"
          disabled={!hasRequiredDocs}
        >
          Continue to Review
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}


