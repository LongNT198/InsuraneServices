import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { ArrowLeft, ArrowRight, Users, Plus, Trash2, AlertCircle, Shield, Baby, Loader2 } from 'lucide-react';
import { applicationService } from '../../../../shared/api/services/applicationService';
import { toast } from 'sonner';

export function BeneficiariesStep({ data, onChange, onNext, onPrevious }) {
  const [isEditing, setIsEditing] = useState(() => {
    // If no beneficiaries saved yet, start in edit mode
    return !data.beneficiaries || data.beneficiaries.length === 0;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [applicationId, setApplicationId] = useState(data.applicationId || null);
  const [validationErrors, setValidationErrors] = useState([]);
  
  const [beneficiaries, setBeneficiaries] = useState(() => {
    const existingBeneficiaries = data.beneficiaries || [];
    
    // If no beneficiaries exist, create one Primary beneficiary by default
    if (existingBeneficiaries.length === 0) {
      return [{
        id: Date.now(),
        type: 'Primary',
        fullName: '',
        relationship: '',
        relationshipOther: '',
        dateOfBirth: '',
        gender: '',
        nationalId: '',
        ssn: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        percentage: 100,
        isMinor: false,
        trustee: '',
        trusteeRelationship: '',
        trusteeRelationshipOther: '',
        perStirpes: false,
        isIrrevocable: false,
      }];
    }
    
    return existingBeneficiaries.map(b => ({
      type: 'Primary',
      fullName: '',
      relationship: '',
      relationshipOther: '',
      dateOfBirth: '',
      gender: '',
      nationalId: '',
      ssn: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      percentage: 0,
      isMinor: false,
      trustee: '',
      trusteeRelationship: '',
      trusteeRelationshipOther: '',
      perStirpes: false,
      isIrrevocable: false,
      ...b,
    }));
  });

  // Calculate total percentage
  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
  const isValidAllocation = Math.abs(totalPercentage - 100) < 0.01;

  // Check if beneficiary is minor (under 18)
  const checkIfMinor = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return (age - 1) < 18;
    }
    return age < 18;
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        id: Date.now(),
        type: 'Contingent',
        fullName: '',
        relationship: '',
        relationshipOther: '',
        dateOfBirth: '',
        gender: '',
        nationalId: '',
        ssn: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        percentage: 0,
        isMinor: false,
        trustee: '',
        trusteeRelationship: '',
        trusteeRelationshipOther: '',
        perStirpes: false,
        isIrrevocable: false,
      },
    ]);
  };

  const removeBeneficiary = (id) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const updateBeneficiary = (id, field, value) => {
    setBeneficiaries(beneficiaries.map(b => {
      if (b.id === id) {
        const updated = { ...b, [field]: value };
        // Auto-detect minor status when DOB changes
        if (field === 'dateOfBirth') {
          updated.isMinor = checkIfMinor(value);
        }
        // Clear "Other" specification field when changing from "Other" to a predefined option
        if (field === 'relationship' && value !== 'Other') {
          updated.relationshipOther = '';
        }
        if (field === 'trusteeRelationship' && value !== 'Other') {
          updated.trusteeRelationshipOther = '';
        }
        return updated;
      }
      return b;
    }));
  };

  // Validation function
  const validateBeneficiaries = () => {
    const errors = [];
    
    // Check if at least one beneficiary exists
    if (beneficiaries.length === 0) {
      errors.push('At least one beneficiary is required.');
      return errors;
    }

    // Validate each beneficiary
    beneficiaries.forEach((ben, index) => {
      const benNumber = index + 1;
      
      // Required fields
      if (!ben.type || ben.type.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Type is required.`);
      }
      if (!ben.fullName || ben.fullName.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Full Name is required.`);
      }
      if (!ben.relationship || ben.relationship.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Relationship is required.`);
      }
      if (ben.relationship === 'Other' && (!ben.relationshipOther || ben.relationshipOther.trim() === '')) {
        errors.push(`Beneficiary ${benNumber}: Please specify the relationship.`);
      }
      if (!ben.dateOfBirth || ben.dateOfBirth.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Date of Birth is required.`);
      }
      if (!ben.gender || ben.gender.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Gender is required.`);
      }
      
      if (ben.percentage === undefined || ben.percentage === null || ben.percentage === '') {
        errors.push(`Beneficiary ${benNumber}: Allocation percentage is required.`);
      } else {
        const pct = parseFloat(ben.percentage);
        if (isNaN(pct) || pct < 0 || pct > 100) {
          errors.push(`Beneficiary ${benNumber}: Allocation must be between 0 and 100.`);
        }
      }

      // Contact Information - Required
      if (!ben.email || ben.email.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Email is required.`);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(ben.email)) {
          errors.push(`Beneficiary ${benNumber}: Invalid email format.`);
        }
      }

      if (!ben.phone || ben.phone.trim() === '') {
        errors.push(`Beneficiary ${benNumber}: Phone Number is required.`);
      } else {
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(ben.phone) || ben.phone.replace(/\D/g, '').length < 10) {
          errors.push(`Beneficiary ${benNumber}: Invalid phone format (min 10 digits).`);
        }
      }

      // Trustee validation for minors
      if (ben.isMinor) {
        if (!ben.trustee || ben.trustee.trim() === '') {
          errors.push(`Beneficiary ${benNumber}: Trustee Name is required for minor beneficiaries.`);
        }
        if (!ben.trusteeRelationship || ben.trusteeRelationship.trim() === '') {
          errors.push(`Beneficiary ${benNumber}: Trustee Relationship is required for minor beneficiaries.`);
        }
        if (ben.trusteeRelationship === 'Other' && (!ben.trusteeRelationshipOther || ben.trusteeRelationshipOther.trim() === '')) {
          errors.push(`Beneficiary ${benNumber}: Please specify the trustee relationship.`);
        }
      }
    });

    // Validate total percentage equals 100%
    const total = beneficiaries.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
    if (Math.abs(total - 100) >= 0.01) {
      errors.push(`Total allocation must equal 100% (currently ${total.toFixed(2)}%).`);
    }

    return errors;
  };

  const handleSave = async () => {
    // Validate before saving
    const validationErrors = validateBeneficiaries();
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      toast.error('Validation Error', {
        description: validationErrors[0],
        duration: 4000,
      });
      return;
    }

    setIsSaving(true);
    try {
      // First, save to local state
      onChange({ beneficiaries });

      // If we have an applicationId, save to database
      if (applicationId) {
        const response = await applicationService.saveBeneficiaries(applicationId, beneficiaries);
        
        if (response.data.success) {
          setValidationErrors([]);
          setIsEditing(false);
          toast.success('Beneficiaries Saved', {
            description: `Saved ${beneficiaries.length} beneficiary(ies) successfully.`,
            duration: 3000,
          });
        }
      } else {
        // If no applicationId, need to create draft application first
        // For now, just save to local state and show warning
        console.warn('No applicationId found. Beneficiaries saved to local state only.');
        setValidationErrors([]);
        setIsEditing(false);
        toast.info('Saved Locally', {
          description: 'Beneficiaries saved. Will be submitted with application.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error saving beneficiaries:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save beneficiaries';
      toast.error('Save Failed', {
        description: errorMsg,
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValidationErrors([]);
  };

  const handleNext = () => {
    // Validate before proceeding
    const errors = validateBeneficiaries();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Validation Error', {
        description: `Please fix ${errors.length} error(s) before continuing.`,
        duration: 4000,
      });
      return;
    }
    
    setValidationErrors([]);
    // Auto-save before moving to next step
    onChange({ beneficiaries });
    onNext();
  };

  // Separate primary and contingent beneficiaries
  const primaryBeneficiaries = beneficiaries.filter(b => b.type === 'Primary');
  const contingentBeneficiaries = beneficiaries.filter(b => b.type === 'Contingent');

  const renderBeneficiary = (beneficiary, index) => (
    <div key={beneficiary.id} className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">
              {beneficiary.type} Beneficiary #{index + 1}
            </h4>
            {beneficiary.isMinor && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1">
                <Baby className="w-3 h-3" />
                Minor
              </span>
            )}
            {beneficiary.isIrrevocable && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Irrevocable
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Allocation: {beneficiary.percentage}%
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeBeneficiary(beneficiary.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      {/* Beneficiary Type */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Beneficiary Type *</Label>
          <Select
            value={beneficiary.type}
            onValueChange={(value) => updateBeneficiary(beneficiary.id, 'type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Contingent">Contingent (Secondary)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Allocation (%) <span className="text-red-600">*</span></Label>
          <Input
            type="number"
            value={beneficiary.percentage}
            onChange={(e) => updateBeneficiary(beneficiary.id, 'percentage', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      {/* Personal Information */}
      <div className="border-t pt-4">
        <h5 className="font-medium mb-3">Personal Information</h5>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Legal Name <span className="text-red-600">*</span></Label>
              <Input
                value={beneficiary.fullName}
                onChange={(e) => updateBeneficiary(beneficiary.id, 'fullName', e.target.value)}
                placeholder="First Middle Last"
              />
            </div>

            <div className="space-y-2">
              <Label>Relationship to Insured <span className="text-red-600">*</span></Label>
              <Select
                value={beneficiary.relationship}
                onValueChange={(value) => updateBeneficiary(beneficiary.id, 'relationship', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Grandchild">Grandchild</SelectItem>
                  <SelectItem value="Niece/Nephew">Niece/Nephew</SelectItem>
                  <SelectItem value="Partner">Domestic Partner</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Trust">Trust</SelectItem>
                  <SelectItem value="Charity">Charity/Organization</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional: If Relationship is Other, show text input */}
          {beneficiary.relationship === 'Other' && (
            <div className="space-y-2">
              <Label>Please specify relationship <span className="text-red-600">*</span></Label>
              <Input
                value={beneficiary.relationshipOther || ''}
                onChange={(e) => updateBeneficiary(beneficiary.id, 'relationshipOther', e.target.value)}
                placeholder="e.g., Cousin, Uncle, Business Partner"
                maxLength="50"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth <span className="text-red-600">*</span></Label>
              <Input
                type="date"
                value={beneficiary.dateOfBirth}
                onChange={(e) => updateBeneficiary(beneficiary.id, 'dateOfBirth', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender <span className="text-red-600">*</span></Label>
              <Select
                value={beneficiary.gender}
                onValueChange={(value) => updateBeneficiary(beneficiary.id, 'gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SSN / Tax ID</Label>
              <Input
                value={beneficiary.ssn}
                onChange={(e) => updateBeneficiary(beneficiary.id, 'ssn', e.target.value)}
                placeholder="XXX-XX-XXXX"
                maxLength="11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-4">
        <h5 className="font-medium mb-3">Contact Information</h5>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email <span className="text-red-600">*</span></Label>
            <Input
              type="email"
              value={beneficiary.email}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'email', e.target.value)}
              placeholder="beneficiary@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number <span className="text-red-600">*</span></Label>
            <Input
              type="tel"
              value={beneficiary.phone}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Street Address</Label>
            <Input
              value={beneficiary.address}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={beneficiary.city}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'city', e.target.value)}
              placeholder="City"
            />
          </div>

          <div className="space-y-2">
            <Label>State/Province</Label>
            <Input
              value={beneficiary.state}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'state', e.target.value)}
              placeholder="State"
            />
          </div>

          <div className="space-y-2">
            <Label>Postal Code</Label>
            <Input
              value={beneficiary.postalCode}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'postalCode', e.target.value)}
              placeholder="12345"
            />
          </div>

          <div className="space-y-2">
            <Label>National ID / Passport</Label>
            <Input
              value={beneficiary.nationalId}
              onChange={(e) => updateBeneficiary(beneficiary.id, 'nationalId', e.target.value)}
              placeholder="ID Number"
            />
          </div>
        </div>
      </div>

      {/* Minor Beneficiary - Trustee Information */}
      {beneficiary.isMinor && (
        <div className="border-t pt-4">
          <Alert className="mb-3">
            <Baby className="h-4 w-4" />
            <AlertDescription>
              This beneficiary is a minor. A trustee/guardian must be designated to manage benefits until they reach legal age.
            </AlertDescription>
          </Alert>
          <h5 className="font-medium mb-3">Trustee/Guardian Information</h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trustee Full Name *</Label>
              <Input
                value={beneficiary.trustee}
                onChange={(e) => updateBeneficiary(beneficiary.id, 'trustee', e.target.value)}
                placeholder="Trustee name"
              />
            </div>

            <div className="space-y-2">
              <Label>Relationship to Minor *</Label>
              <Select
                value={beneficiary.trusteeRelationship}
                onValueChange={(value) => updateBeneficiary(beneficiary.id, 'trusteeRelationship', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Guardian">Legal Guardian</SelectItem>
                  <SelectItem value="Grandparent">Grandparent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: If Trustee Relationship is Other, show text input */}
            {beneficiary.trusteeRelationship === 'Other' && (
              <div className="space-y-2 md:col-span-2">
                <Label>Please specify trustee relationship <span className="text-red-600">*</span></Label>
                <Input
                  value={beneficiary.trusteeRelationshipOther}
                  onChange={(e) => updateBeneficiary(beneficiary.id, 'trusteeRelationshipOther', e.target.value)}
                  placeholder="e.g., Family Friend, Attorney"
                  maxLength="50"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="border-t pt-4 space-y-3">
        <h5 className="font-medium mb-3">Additional Options</h5>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id={`perStirpes-${beneficiary.id}`}
            checked={beneficiary.perStirpes}
            onCheckedChange={(checked) => updateBeneficiary(beneficiary.id, 'perStirpes', checked)}
          />
          <div className="space-y-1">
            <Label htmlFor={`perStirpes-${beneficiary.id}`} className="font-normal">
              Per Stirpes Distribution
            </Label>
            <p className="text-xs text-gray-500">
              If beneficiary dies before you, their share goes to their descendants (children/grandchildren)
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id={`irrevocable-${beneficiary.id}`}
            checked={beneficiary.isIrrevocable}
            onCheckedChange={(checked) => updateBeneficiary(beneficiary.id, 'isIrrevocable', checked)}
          />
          <div className="space-y-1">
            <Label htmlFor={`irrevocable-${beneficiary.id}`} className="font-normal">
              Irrevocable Beneficiary
            </Label>
            <p className="text-xs text-gray-500">
              Cannot be changed without beneficiary's written consent. Use for divorce settlements or estate planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Show saved beneficiaries in read-only mode */}
      {!isEditing && beneficiaries.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Saved Beneficiaries
                </CardTitle>
                <CardDescription>
                  Your beneficiary designations have been saved. You can edit them anytime.
                </CardDescription>
              </div>
              <Button onClick={handleEdit} variant="outline">
                Edit Beneficiaries
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {beneficiaries.map((beneficiary, index) => (
              <div key={beneficiary.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{beneficiary.fullName || 'Unnamed Beneficiary'}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        beneficiary.type === 'Primary' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {beneficiary.type}
                      </span>
                      {beneficiary.isMinor && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1">
                          <Baby className="w-3 h-3" />
                          Minor
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {beneficiary.relationship} • {beneficiary.percentage}% allocation
                    </p>
                    {beneficiary.email && (
                      <p className="text-xs text-gray-500 mt-1">{beneficiary.email}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ Total allocation: <strong>{totalPercentage.toFixed(1)}%</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Show edit form when in editing mode */}
      {isEditing && (
        <>
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="font-semibold mb-2 text-red-800">Please correct the following errors:</div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {validationErrors.slice(0, 5).map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li className="text-red-600 font-medium">...and {validationErrors.length - 5} more error(s)</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Allocation Warning */}
          {!isValidAllocation && beneficiaries.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Total allocation must equal 100%. Current total: <strong>{totalPercentage.toFixed(1)}%</strong>
              </AlertDescription>
            </Alert>
          )}

      {/* Primary Beneficiaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Primary Beneficiaries
          </CardTitle>
          <CardDescription>
            Primary beneficiaries are first in line to receive benefits. Their combined allocation should total 100%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {primaryBeneficiaries.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You must designate at least one primary beneficiary.
              </AlertDescription>
            </Alert>
          ) : (
            primaryBeneficiaries.map((beneficiary, index) => renderBeneficiary(beneficiary, index))
          )}
        </CardContent>
      </Card>

      {/* Contingent Beneficiaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Contingent (Secondary) Beneficiaries
          </CardTitle>
          <CardDescription>
            Contingent beneficiaries receive benefits if all primary beneficiaries are deceased. Optional but recommended.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contingentBeneficiaries.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No contingent beneficiaries added yet.</p>
          ) : (
            contingentBeneficiaries.map((beneficiary, index) => renderBeneficiary(beneficiary, index))
          )}
        </CardContent>
      </Card>

      {/* Add Beneficiary Button */}
      <Button onClick={addBeneficiary} variant="outline" className="w-full" size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Add Another Beneficiary
      </Button>

      {/* Information Alert */}
      <Alert>
        <AlertDescription>
          <strong>Important:</strong> You can change beneficiaries at any time (unless designated as irrevocable). 
          Keep beneficiary information current to ensure benefits go to the right people.
        </AlertDescription>
      </Alert>

      {/* Save/Cancel Buttons when editing */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave}
          size="lg"
          className="flex-1"
          disabled={!isValidAllocation || primaryBeneficiaries.length === 0 || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Beneficiaries'
          )}
        </Button>
        {data.beneficiaries && data.beneficiaries.length > 0 && (
          <Button 
            onClick={() => {
              setBeneficiaries(data.beneficiaries);
              setIsEditing(false);
            }}
            variant="outline"
            size="lg"
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
      </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Product & Quote
        </Button>
        <Button 
          onClick={handleNext}  
          size="lg"
          disabled={!isValidAllocation || primaryBeneficiaries.length === 0}
        >
          Continue to Documents
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}


