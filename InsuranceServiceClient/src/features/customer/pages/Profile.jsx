import { useState, useEffect } from 'react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { profileService } from '../../shared/api/services/profileService';
import { authService } from '../../shared/api/services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../shared/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Upload, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/tabs';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';

export function Profile() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [infoMessage, setInfoMessage] = useState(location.state?.message || '');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    occupation: '',
    company: '',
    monthlyIncome: '',
    nationalId: '',
  });

  const [avatarUrl, setAvatarUrl] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    policyReminders: true,
    marketingEmails: false,
  });

  useEffect(() => {
    loadProfile();
    loadVerificationStatus();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();

      if (data) {
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
          phoneNumber: data.phoneNumber || '',
          gender: data.gender || '',
          address: data.address || '',
          city: data.city || '',
          district: data.district || '',
          ward: data.ward || '',
          occupation: data.occupation || '',
          company: data.company || '',
          monthlyIncome: data.monthlyIncome || '',
          nationalId: data.nationalId || '',
        });
        setAvatarUrl(data.avatar);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStatus = async () => {
    try {
      const status = await profileService.getVerificationStatus();
      setVerificationStatus(status);
    } catch (err) {
      console.error('Failed to load verification status:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate required fields
      if (!profileData.firstName || !profileData.firstName.trim()) {
        setError('First name is required');
        setSaving(false);
        return;
      }
      if (!profileData.lastName || !profileData.lastName.trim()) {
        setError('Last name is required');
        setSaving(false);
        return;
      }
      if (!profileData.dateOfBirth) {
        setError('Date of birth is required');
        setSaving(false);
        return;
      }
      if (!profileData.phoneNumber || !profileData.phoneNumber.trim()) {
        setError('Phone number is required');
        setSaving(false);
        return;
      }
      if (!profileData.gender) {
        setError('Gender is required');
        setSaving(false);
        return;
      }
      if (!profileData.address || !profileData.address.trim()) {
        setError('Address is required');
        setSaving(false);
        return;
      }
      if (!profileData.city || !profileData.city.trim()) {
        setError('City is required');
        setSaving(false);
        return;
      }

      const updateData = {
        ...profileData,
        dateOfBirth: new Date(profileData.dateOfBirth).toISOString(),
        monthlyIncome: profileData.monthlyIncome ? parseFloat(profileData.monthlyIncome) : null,
      };

      await profileService.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile();
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const errorList = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        setError(errorList);
      } else {
        setError(errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');

      const result = await profileService.uploadAvatar(file);
      console.log('Upload result:', result); // Debug log

      if (result && result.avatarUrl) {
        setAvatarUrl(result.avatarUrl);
        setSuccess('Avatar uploaded successfully!');

        // Update user context with new avatar (will be in JWT on next login)
        updateUser({ avatar: result.avatarUrl });
      } else {
        setError('Avatar uploaded but no URL returned');
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setPasswordError('');
      setPasswordSuccess('');

      // Validate
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('All password fields are required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters');
        return;
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        setPasswordError('Password must contain uppercase, lowercase, number, and special character');
        return;
      }

      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordSuccess('Password changed successfully! A confirmation email has been sent to your email address.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Failed to change password:', err);
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const errorList = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        setPasswordError(errorList);
      } else {
        setPasswordError(errorMsg);
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Info message from navigation state */}
        {infoMessage && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {infoMessage}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        <X className="size-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} size="sm">
                        <Save className="size-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="size-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center gap-4 pb-6 border-b">
                  <Avatar className="size-20">
                    {avatarUrl && <AvatarImage src={`${import.meta.env.VITE_API_URL || 'https://localhost:7001'}${avatarUrl}`} />}
                    <AvatarFallback className="text-xl">
                      {getInitials(`${profileData.firstName} ${profileData.lastName}`.trim() || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{`${profileData.firstName} ${profileData.lastName}`.trim() || user?.email || 'User'}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm" className="mt-2" disabled={uploading} asChild>
                        <span>
                          {uploading ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="size-4 mr-2" />
                              Change Photo
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name {isEditing && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name {isEditing && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number {isEditing && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth {isEditing && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={profileData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={profileData.monthlyIncome}
                      onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address {isEditing && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City {isEditing && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={profileData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">Ward</Label>
                    <Input
                      id="ward"
                      value={profileData.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender {isEditing && <span className="text-red-500">*</span>}</Label>
                    <select
                      id="gender"
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nationalId">National ID</Label>
                    <Input
                      id="nationalId"
                      value={profileData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {passwordError && (
                  <Alert variant="destructive" className="relative">
                    <XCircle className="size-4" />
                    <AlertDescription className="pr-8">{passwordError}</AlertDescription>
                    <button
                      onClick={() => setPasswordError('')}
                      className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert className="relative bg-green-50 border-green-200">
                    <CheckCircle className="size-4 text-green-600" />
                    <AlertDescription className="text-green-600 pr-8">{passwordSuccess}</AlertDescription>
                    <button
                      onClick={() => setPasswordSuccess('')}
                      className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Alert>
                )}

                <form onSubmit={handleChangePassword}>
                  <h3 className="mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        disabled={changingPassword}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        disabled={changingPassword}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be 8+ characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        disabled={changingPassword}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={changingPassword}>
                      {changingPassword ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </form>

                <div className="pt-6 border-t">
                  <h3 className="mb-4">Two-Factor Authentication</h3>
                  <Alert>
                    <AlertDescription>
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </AlertDescription>
                  </Alert>
                  <Button variant="outline" className="mt-4">
                    Enable 2FA
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • New York, US</p>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                      <Button variant="outline" size="sm">Logout</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Get important updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsNotifications}
                      onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Policy Reminders</p>
                      <p className="text-sm text-gray-600">Premium due date and renewal reminders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.policyReminders}
                      onChange={(e) => setNotifications({ ...notifications, policyReminders: e.target.checked })}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Marketing Emails</p>
                      <p className="text-sm text-gray-600">New products and promotional offers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Manage your KYC and identification documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Aadhaar Card</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">XXXX XXXX 1234</p>
                    <Button variant="outline" size="sm">View</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">PAN Card</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">ABCDE1234F</p>
                    <Button variant="outline" size="sm">View</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Driving License</p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Not uploaded</p>
                    <Button variant="outline" size="sm">Upload</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Bank Statement</p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Not uploaded</p>
                    <Button variant="outline" size="sm">Upload</Button>
                  </div>
                </div>

                <Alert className="mt-6">
                  <AlertDescription>
                    Keep your documents up to date to ensure smooth claim processing and policy renewals.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}



