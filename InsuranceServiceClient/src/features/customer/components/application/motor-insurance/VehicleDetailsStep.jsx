import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Car, Bike, Truck } from 'lucide-react';

export function VehicleDetailsStep({ data, onChange, onNext, onPrevious }) {
  const [formData, setFormData] = useState({
    vehicleType: data.vehicleDetails?.vehicleType || '',
    registrationNumber: data.vehicleDetails?.registrationNumber || '',
    make: data.vehicleDetails?.make || '',
    model: data.vehicleDetails?.model || '',
    variant: data.vehicleDetails?.variant || '',
    yearOfManufacture: data.vehicleDetails?.yearOfManufacture || '',
    engineNumber: data.vehicleDetails?.engineNumber || '',
    chassisNumber: data.vehicleDetails?.chassisNumber || '',
    fuelType: data.vehicleDetails?.fuelType || '',
    seatingCapacity: data.vehicleDetails?.seatingCapacity || '',
    cubicCapacity: data.vehicleDetails?.cubicCapacity || '',
    currentIDV: data.vehicleDetails?.currentIDV || '',
    registrationDate: data.vehicleDetails?.registrationDate || '',
    previousPolicyNumber: data.vehicleDetails?.previousPolicyNumber || '',
    claimInLastYear: data.vehicleDetails?.claimInLastYear || false,
    ncbPercentage: data.vehicleDetails?.ncbPercentage || '0',
  });

  const [errors, setErrors] = useState({});

  const vehicleTypes = [
    { value: 'car', label: 'Car / SUV', icon: Car },
    { value: 'two-wheeler', label: 'Two Wheeler', icon: Bike },
    { value: 'commercial', label: 'Commercial Vehicle', icon: Truck },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleType) newErrors.vehicleType = 'Please select vehicle type';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.make) newErrors.make = 'Vehicle make is required';
    if (!formData.model) newErrors.model = 'Vehicle model is required';
    if (!formData.yearOfManufacture) newErrors.yearOfManufacture = 'Year is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onChange({ vehicleDetails: formData });
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
        <CardDescription>Provide information about your vehicle</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Vehicle Type</label>
            <div className="grid grid-cols-3 gap-4">
              {vehicleTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange('vehicleType', value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.vehicleType === value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">{label}</div>
                </button>
              ))}
            </div>
            {errors.vehicleType && <p className="text-red-600 text-sm mt-1">{errors.vehicleType}</p>}
          </div>

          {/* Vehicle Registration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Registration Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="MH01AB1234"
              />
              {errors.registrationNumber && <p className="text-red-600 text-sm mt-1">{errors.registrationNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Registration Date</label>
              <input
                type="date"
                value={formData.registrationDate}
                onChange={(e) => handleChange('registrationDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Make / Brand</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => handleChange('make', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Honda, Toyota, Maruti..."
              />
              {errors.make && <p className="text-red-600 text-sm mt-1">{errors.make}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="City, Fortuner, Swift..."
              />
              {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Variant</label>
              <input
                type="text"
                value={formData.variant}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="VX, ZX, LX..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year of Manufacture</label>
              <select
                value={formData.yearOfManufacture}
                onChange={(e) => handleChange('yearOfManufacture', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.yearOfManufacture && <p className="text-red-600 text-sm mt-1">{errors.yearOfManufacture}</p>}
            </div>
          </div>

          {/* Engine Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Engine Number</label>
              <input
                type="text"
                value={formData.engineNumber}
                onChange={(e) => handleChange('engineNumber', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chassis Number</label>
              <input
                type="text"
                value={formData.chassisNumber}
                onChange={(e) => handleChange('chassisNumber', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={(e) => handleChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.fuelType && <p className="text-red-600 text-sm mt-1">{errors.fuelType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Seating Capacity</label>
              <input
                type="number"
                value={formData.seatingCapacity}
                onChange={(e) => handleChange('seatingCapacity', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cubic Capacity (CC)</label>
              <input
                type="number"
                value={formData.cubicCapacity}
                onChange={(e) => handleChange('cubicCapacity', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="1200"
              />
            </div>
          </div>

          {/* IDV & NCB */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current IDV (Insured Declared Value)</label>
              <input
                type="number"
                value={formData.currentIDV}
                onChange={(e) => handleChange('currentIDV', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">NCB % (No Claim Bonus)</label>
              <select
                value={formData.ncbPercentage}
                onChange={(e) => handleChange('ncbPercentage', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="0">0%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="35">35%</option>
                <option value="45">45%</option>
                <option value="50">50%</option>
              </select>
            </div>
          </div>

          {/* Previous Policy */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Previous Policy Number (if any)</label>
              <input
                type="text"
                value={formData.previousPolicyNumber}
                onChange={(e) => handleChange('previousPolicyNumber', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.claimInLastYear}
                onChange={(e) => handleChange('claimInLastYear', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm">I made a claim in the last policy year</label>
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
