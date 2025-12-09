import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, Briefcase, Loader2, Edit, Eye, Info } from 'lucide-react';
import { profileService } from '../../../../shared/api/services/profileService';
import { applicationService } from '../../../../shared/api/services/applicationService';
import { OCCUPATION_CATEGORIES, getOccupationRisk, getOccupationLabel } from '../../../utils/insuranceHelpers';
import { validatePersonalInfo, hasErrors } from '../../../utils/validationHelpers';
import { toast } from 'sonner';

export function PersonalInfoStep({ data, onChange, onNext, onPrevious, isFirstStep, profileExists, applicationId }) {
  const [formData, setFormData] = useState({
    firstName: data.applicant.firstName || '',
    lastName: data.applicant.lastName || '',
    email: data.applicant.email || '',
    phone: data.applicant.phone || '',
    dateOfBirth: data.applicant.dateOfBirth || '',
    gender: data.applicant.gender || '',
    nationalId: data.applicant.nationalId || '',
    occupation: data.applicant.occupation || '',
    occupationOther: data.applicant.occupationOther || '',
    occupationRisk: data.applicant.occupationRisk || '',
    annualIncome: data.applicant.annualIncome || '',
    address: data.applicant.address || '',
    city: data.applicant.city || '',
    postalCode: data.applicant.postalCode || '',
    // Emergency Contact
    emergencyContactName: data.applicant.emergencyContactName || '',
    emergencyContactRelationship: data.applicant.emergencyContactRelationship || '',
    emergencyContactRelationshipOther: data.applicant.emergencyContactRelationshipOther || '',
    emergencyContactPhone: data.applicant.emergencyContactPhone || '',
    emergencyContactGender: data.applicant.emergencyContactGender || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(() => {
    console.log('🔍 PersonalInfoStep - Initial isEditing calculation:', { profileExists, result: !profileExists });
    return !profileExists;
  }); // Auto-edit if no profile
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // Field-level validation errors
  const [touched, setTouched] = useState({}); // Track which fields have been touched

  // Sync isEditing with profileExists when profile is loaded from server
  useEffect(() => {
    console.log('🔍 PersonalInfoStep - profileExists changed:', { 
      profileExists, 
      currentIsEditing: isEditing,
      hasData: Boolean(data.applicant.firstName && data.applicant.lastName)
    });
    
    // When profile is loaded from server (profileExists changes to true),
    // switch to view mode automatically for existing users
    if (profileExists && isEditing) {
      console.log('✅ Profile exists, switching to view mode');
      setIsEditing(false);
    }
  }, [profileExists]);

  // Update formData when data.applicant changes (from parent)
  useEffect(() => {
    if (data.applicant) {
      setFormData({
        firstName: data.applicant.firstName || '',
        lastName: data.applicant.lastName || '',
        email: data.applicant.email || '',
        phone: data.applicant.phone || '',
        dateOfBirth: data.applicant.dateOfBirth || '',
        gender: data.applicant.gender || '',
        nationalId: data.applicant.nationalId || '',
        occupation: data.applicant.occupation || '',
        occupationOther: data.applicant.occupationOther || '',
        annualIncome: data.applicant.annualIncome || '',
        address: data.applicant.address || '',
        city: data.applicant.city || '',
        postalCode: data.applicant.postalCode || '',
        emergencyContactName: data.applicant.emergencyContactName || '',
        emergencyContactRelationship: data.applicant.emergencyContactRelationship || '',
        emergencyContactRelationshipOther: data.applicant.emergencyContactRelationshipOther || '',
        emergencyContactPhone: data.applicant.emergencyContactPhone || '',
        emergencyContactGender: data.applicant.emergencyContactGender || '',
      });
    }
  }, [data.applicant.firstName, data.applicant.lastName, data.applicant.emergencyContactName, data.applicant.emergencyContactPhone, data.applicant.emergencyContactGender, data.applicant.emergencyContactRelationship, data.applicant.emergencyContactRelationshipOther]); // Include emergency contact fields

  const handleChange = (field, value) => {
    const updates = { [field]: value };
    
    // Auto-calculate occupation risk when occupation changes
    if (field === 'occupation') {
      const risk = getOccupationRisk(value);
      updates.occupationRisk = risk;
      // Clear "Other" specification field when changing from "Other" to a predefined option
      if (value !== 'other') {
        updates.occupationOther = '';
      }
    }
    
    // Clear "Other" specification field when changing from "Other" to a predefined option
    if (field === 'emergencyContactRelationship' && value !== 'Other') {
      updates.emergencyContactRelationshipOther = '';
    }
    
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({ ...prev, [field]: null }));
    setError('');
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSaveProfile = async () => {
    // Validate all fields
    const errors = validatePersonalInfo(formData);
    
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      setError(firstError);
      toast.error('Validation Error', {
        description: firstError,
        duration: 4000,
      });
      
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address || '',
        city: formData.city || '',
        postalCode: formData.postalCode || null,
        occupation: formData.occupation || null,
        occupationOther: formData.occupationOther || null,
        monthlyIncome: formData.annualIncome ? Math.round(formData.annualIncome / 12) : null,
        nationalId: formData.nationalId || null,
        // Emergency Contact
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactPhone: formData.emergencyContactPhone || null,
        emergencyContactGender: formData.emergencyContactGender || null,
        emergencyContactRelationship: formData.emergencyContactRelationship || null,
        emergencyContactRelationshipOther: formData.emergencyContactRelationshipOther || null,
      };

      await profileService.updateProfile(profileData);
      
      // Update parent state
      onChange({ applicant: formData });
      
      // Exit edit mode after successful save
      setIsEditing(false);
      setError('');
      setFieldErrors({});
      
      toast.success('Profile Saved', {
        description: 'Your personal information has been saved successfully.',
        duration: 3000,
      });
      
      console.log('✅ Profile saved successfully');
    } catch (err) {
      console.error('Failed to save profile:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save profile. Please try again.';
      setError(errorMsg);
      toast.error('Save Failed', {
        description: errorMsg,
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const validateAndNext = async () => {
    // If in edit mode, must save first
    if (isEditing) {
      const errorMsg = 'Please save your profile information before continuing';
      setError(errorMsg);
      toast.warning('Save Required', {
        description: errorMsg,
        duration: 3000,
      });
      return;
    }

    // Validate all fields again
    const errors = validatePersonalInfo(formData);
    
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      setError(firstError);
      toast.error('Validation Error', {
        description: firstError,
        duration: 4000,
      });
      
      // Mark all fields as touched
      const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      return;
    }

    // Progressive saving: Save to application if applicationId exists
    if (applicationId) {
      try {
        setLoading(true);
        await applicationService.updatePersonalInfo(applicationId, formData);
        console.log('✅ Personal info saved to application');
      } catch (err) {
        console.error('❌ Failed to save personal info to application:', err);
        setError('Failed to save personal information. Please try again.');
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    // Update parent state and proceed
    onChange({ applicant: formData });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {profileExists && !isEditing 
                  ? 'Your profile has been loaded. Review the information below and click Edit to make changes, or continue to the next step.'
                  : profileExists && isEditing
                  ? 'Update your profile information and click Save to continue.'
                  : 'Please provide your personal details. This information will be saved to your profile for future applications.'}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  // Reset to original data
                  setFormData({
                    firstName: data.applicant.firstName || '',
                    lastName: data.applicant.lastName || '',
                    email: data.applicant.email || '',
                    phone: data.applicant.phone || '',
                    dateOfBirth: data.applicant.dateOfBirth || '',
                    gender: data.applicant.gender || '',
                    nationalId: data.applicant.nationalId || '',
                    occupation: data.applicant.occupation || '',
                    occupationOther: data.applicant.occupationOther || '',
                    annualIncome: data.applicant.annualIncome || '',
                    address: data.applicant.address || '',
                    city: data.applicant.city || '',
                    postalCode: data.applicant.postalCode || '',
                    emergencyContactName: data.applicant.emergencyContactName || '',
                    emergencyContactRelationship: data.applicant.emergencyContactRelationship || '',
                    emergencyContactRelationshipOther: data.applicant.emergencyContactRelationshipOther || '',
                    emergencyContactPhone: data.applicant.emergencyContactPhone || '',
                    emergencyContactGender: data.applicant.emergencyContactGender || '',
                  });
                }}
                type="button"
              >
                <Eye className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Save Profile Section - Show when editing */}
          {isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">
                    {profileExists ? 'Update Your Profile' : 'Create Your Profile'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {profileExists 
                      ? 'Save changes to your profile information. These details will be used for this and future applications.'
                      : 'Your information will be saved to your profile for faster applications in the future.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Saved Indicator - Show when not editing and profile exists */}
          {!isEditing && profileExists && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium">Profile information loaded successfully</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  className={`pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.firstName && fieldErrors.firstName ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="First name"
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              {touched.firstName && fieldErrors.firstName && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={`pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.lastName && fieldErrors.lastName ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Last name"
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              {touched.lastName && fieldErrors.lastName && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  className="pl-10 bg-gray-50 cursor-not-allowed"
                  placeholder="your.email@example.com"
                  disabled
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">✓ Email is verified and cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.phone && fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="+1 (555) 000-0000"
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              {touched.phone && fieldErrors.phone && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">
                Date of Birth {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                onBlur={() => handleBlur('dateOfBirth')}
                className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                  touched.dateOfBirth && fieldErrors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={!isEditing}
                readOnly={!isEditing}
                required={isEditing}
              />
              {touched.dateOfBirth && fieldErrors.dateOfBirth && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Select 
                value={formData.gender || ''} 
                onValueChange={(value) => handleChange('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger 
                  id="gender" 
                  className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.gender && fieldErrors.gender ? 'border-red-500' : ''
                  }`}
                  onBlur={() => handleBlur('gender')}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {touched.gender && fieldErrors.gender && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.gender}</p>
              )}
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <Label htmlFor="nationalId">
                National ID / Passport {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={(e) => handleChange('nationalId', e.target.value)}
                onBlur={() => handleBlur('nationalId')}
                placeholder="ID Number"
                className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                  touched.nationalId && fieldErrors.nationalId ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={!isEditing}
                readOnly={!isEditing}
                required={isEditing}
              />
              {touched.nationalId && fieldErrors.nationalId && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.nationalId}</p>
              )}
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label htmlFor="occupation">
                Occupation {isEditing && <span className="text-red-500">*</span>}
                {formData.occupationRisk && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    formData.occupationRisk === 'Low' ? 'bg-green-100 text-green-800' :
                    formData.occupationRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {formData.occupationRisk} Risk
                  </span>
                )}
              </Label>
              <Select
                value={formData.occupation || ''}
                onValueChange={(value) => handleChange('occupation', value)}
                disabled={!isEditing}
              >
                <SelectTrigger 
                  className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.occupation && fieldErrors.occupation ? 'border-red-500' : ''
                  }`}
                  onBlur={() => handleBlur('occupation')}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Select your occupation" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {OCCUPATION_CATEGORIES.map((occupation) => (
                    <SelectItem key={occupation.value} value={occupation.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{occupation.label}</span>
                        <span className={`ml-4 text-xs px-2 py-0.5 rounded-full ${
                          occupation.risk === 'Low' ? 'bg-green-100 text-green-700' :
                          occupation.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {occupation.risk}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.occupationRisk && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Occupation risk level affects premium calculation
                </p>
              )}
              
              {/* Show text input when "Other" is selected */}
              {formData.occupation === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="occupationOther">
                    Occupation Details {isEditing && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="occupationOther"
                    value={formData.occupationOther}
                    onChange={(e) => handleChange('occupationOther', e.target.value)}
                    onBlur={() => handleBlur('occupationOther')}
                    placeholder="Please specify your occupation"
                    className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                      touched.occupationOther && fieldErrors.occupationOther ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                  {touched.occupationOther && fieldErrors.occupationOther && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.occupationOther}</p>
                  )}
                </div>
              )}
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income ($)</Label>
              <Input
                id="income"
                type="number"
                value={formData.annualIncome}
                onChange={(e) => handleChange('annualIncome', e.target.value)}
                placeholder="e.g., 50000"
                className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Residential Address {isEditing && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                className={`pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                  touched.address && fieldErrors.address ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Street address"
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
            {touched.address && fieldErrors.address && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.address}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">
                City {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="City"
                className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                  touched.city && fieldErrors.city ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
              {touched.city && fieldErrors.city && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.city}</p>
              )}
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postalCode">
                Postal Code {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                onBlur={() => handleBlur('postalCode')}
                placeholder="Postal/ZIP code"
                className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                  touched.postalCode && fieldErrors.postalCode ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
              {touched.postalCode && fieldErrors.postalCode && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.postalCode}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚨 Emergency Contact
          </CardTitle>
          <CardDescription>
            Required for application completion. This contact will only be used in emergency situations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Emergency Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                onBlur={() => handleBlur('emergencyContactName')}
                placeholder="Emergency contact name"
                className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                  touched.emergencyContactName && fieldErrors.emergencyContactName ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={!isEditing}
                readOnly={!isEditing}
                required={isEditing}
              />
              {touched.emergencyContactName && fieldErrors.emergencyContactName && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.emergencyContactName}</p>
              )}
            </div>

            {/* Emergency Contact Relationship */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">
                Relationship <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.emergencyContactRelationship || ''} 
                onValueChange={(value) => handleChange('emergencyContactRelationship', value)}
                disabled={!isEditing}
              >
                <SelectTrigger 
                  id="emergencyContactRelationship" 
                  className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.emergencyContactRelationship && fieldErrors.emergencyContactRelationship ? 'border-red-500' : ''
                  }`}
                  onBlur={() => handleBlur('emergencyContactRelationship')}
                >
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: If Emergency Contact Relationship is Other, show text input */}
            {formData.emergencyContactRelationship === 'Other' && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyContactRelationshipOther">
                  Please specify relationship <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emergencyContactRelationshipOther"
                  value={formData.emergencyContactRelationshipOther || ''}
                  onChange={(e) => handleChange('emergencyContactRelationshipOther', e.target.value)}
                  onBlur={() => handleBlur('emergencyContactRelationshipOther')}
                  placeholder="e.g., Cousin, Neighbor, Colleague"
                  maxLength="50"
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  required={isEditing}
                  className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.emergencyContactRelationshipOther && fieldErrors.emergencyContactRelationshipOther ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {touched.emergencyContactRelationshipOther && fieldErrors.emergencyContactRelationshipOther && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.emergencyContactRelationshipOther}</p>
                )}
              </div>
            )}

            {/* Emergency Contact Phone */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergencyContactPhone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  onBlur={() => handleBlur('emergencyContactPhone')}
                  placeholder="+1 (555) 000-0000"
                  className={`pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                    touched.emergencyContactPhone && fieldErrors.emergencyContactPhone ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              {touched.emergencyContactPhone && fieldErrors.emergencyContactPhone && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.emergencyContactPhone}</p>
              )}
            </div>

            {/* Emergency Contact Gender */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergencyContactGender">
                Gender
              </Label>
              <Select
                value={formData.emergencyContactGender || ''}
                onValueChange={(value) => handleChange('emergencyContactGender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}>
                  <SelectValue placeholder="Select gender (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save/Cancel Buttons when editing */}
      {isEditing && (
        <div className="flex gap-3">
          <Button
            onClick={handleSaveProfile}
            size="lg"
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
          {profileExists && (
            <Button
              onClick={() => {
                setIsEditing(false);
                setError('');
                // Reset to original data
                setFormData({
                  firstName: data.applicant.firstName || '',
                  lastName: data.applicant.lastName || '',
                  email: data.applicant.email || '',
                  phone: data.applicant.phone || '',
                  dateOfBirth: data.applicant.dateOfBirth || '',
                  gender: data.applicant.gender || '',
                  nationalId: data.applicant.nationalId || '',
                  occupation: data.applicant.occupation || '',
                  occupationOther: data.applicant.occupationOther || '',
                  annualIncome: data.applicant.annualIncome || '',
                  address: data.applicant.address || '',
                  city: data.applicant.city || '',
                  postalCode: data.applicant.postalCode || '',
                  emergencyContactName: data.applicant.emergencyContactName || '',
                  emergencyContactRelationship: data.applicant.emergencyContactRelationship || '',
                  emergencyContactRelationshipOther: data.applicant.emergencyContactRelationshipOther || '',
                  emergencyContactPhone: data.applicant.emergencyContactPhone || '',
                  emergencyContactGender: data.applicant.emergencyContactGender || '',
                });
              }}
              variant="outline"
              size="lg"
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        {!isFirstStep && onPrevious && (
          <Button onClick={onPrevious} variant="outline" size="lg" disabled={loading || isSaving}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        {isFirstStep && <div></div>}
        <Button 
          onClick={validateAndNext} 
          size="lg" 
          className="ml-auto" 
          disabled={loading || isSaving || isEditing}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <span>{loading ? 'Processing...' : 'Continue to Health Declaration'}</span>
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
