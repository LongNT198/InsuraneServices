import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { useState } from 'react';
import { Home, Building2, Package } from 'lucide-react';

export function PropertyDetailsStep({ data, onChange, onNext, onPrevious }) {
  const [formData, setFormData] = useState({
    propertyType: data.propertyDetails?.propertyType || '',
    propertyUsage: data.propertyDetails?.propertyUsage || 'residential',
    address: data.propertyDetails?.address || data.applicant?.address || '',
    city: data.propertyDetails?.city || data.applicant?.city || '',
    postalCode: data.propertyDetails?.postalCode || data.applicant?.postalCode || '',
    yearBuilt: data.propertyDetails?.yearBuilt || '',
    constructionType: data.propertyDetails?.constructionType || '',
    numberOfFloors: data.propertyDetails?.numberOfFloors || '',
    carpetArea: data.propertyDetails?.carpetArea || '',
    buildingValue: data.propertyDetails?.buildingValue || '',
    contentsValue: data.propertyDetails?.contentsValue || '',
    hasSecuritySystem: data.propertyDetails?.hasSecuritySystem || false,
    hasFireAlarm: data.propertyDetails?.hasFireAlarm || false,
    isInFloodZone: data.propertyDetails?.isInFloodZone || false,
  });

  const [errors, setErrors] = useState({});

  const propertyTypes = [
    { value: 'independent-house', label: 'Independent House', icon: Home },
    { value: 'apartment', label: 'Apartment / Flat', icon: Building2 },
    { value: 'villa', label: 'Villa / Bungalow', icon: Home },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.propertyType) newErrors.propertyType = 'Please select property type';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.yearBuilt) newErrors.yearBuilt = 'Year built is required';
    if (!formData.carpetArea) newErrors.carpetArea = 'Carpet area is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onChange({ propertyDetails: formData });
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>Provide information about your property</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Property Type</label>
            <div className="grid grid-cols-3 gap-4">
              {propertyTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange('propertyType', value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.propertyType === value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm font-medium">{label}</div>
                </button>
              ))}
            </div>
            {errors.propertyType && <p className="text-red-600 text-sm mt-1">{errors.propertyType}</p>}
          </div>

          {/* Property Usage */}
          <div>
            <label className="block text-sm font-medium mb-2">Property Usage</label>
            <div className="grid grid-cols-2 gap-3">
              {['residential', 'commercial'].map((usage) => (
                <button
                  key={usage}
                  type="button"
                  onClick={() => handleChange('propertyUsage', usage)}
                  className={`p-3 rounded-lg border-2 capitalize ${
                    formData.propertyUsage === usage
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  {usage}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2">Property Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              placeholder="Full property address"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.postalCode && <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          {/* Building Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Year Built</label>
              <select
                value={formData.yearBuilt}
                onChange={(e) => handleChange('yearBuilt', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.yearBuilt && <p className="text-red-600 text-sm mt-1">{errors.yearBuilt}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Construction Type</label>
              <select
                value={formData.constructionType}
                onChange={(e) => handleChange('constructionType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="rcc">RCC (Concrete)</option>
                <option value="brick">Brick & Cement</option>
                <option value="wood">Wood</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Floors</label>
              <input
                type="number"
                value={formData.numberOfFloors}
                onChange={(e) => handleChange('numberOfFloors', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Carpet Area (sq ft)</label>
              <input
                type="number"
                value={formData.carpetArea}
                onChange={(e) => handleChange('carpetArea', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="1200"
              />
              {errors.carpetArea && <p className="text-red-600 text-sm mt-1">{errors.carpetArea}</p>}
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Building Value ($)</label>
              <input
                type="number"
                value={formData.buildingValue}
                onChange={(e) => handleChange('buildingValue', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contents Value ($)</label>
              <input
                type="number"
                value={formData.contentsValue}
                onChange={(e) => handleChange('contentsValue', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="100000"
              />
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Security Features</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasSecuritySystem}
                onChange={(e) => handleChange('hasSecuritySystem', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm">Property has security system / CCTV</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasFireAlarm}
                onChange={(e) => handleChange('hasFireAlarm', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm">Property has fire alarm system</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isInFloodZone}
                onChange={(e) => handleChange('isInFloodZone', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm">Property is in flood-prone zone</label>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
