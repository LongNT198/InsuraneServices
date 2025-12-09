import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function MotorProductSelectionStep({ data, onChange, onNext, onPrevious }) {
  const [formData, setFormData] = useState({
    productId: data.productId || '',
    planId: data.planId || '',
    coverageType: data.motorProduct?.coverageType || 'comprehensive',
    addOns: data.motorProduct?.addOns || [],
    paymentFrequency: data.paymentFrequency || 'annual',
    premiumAmount: data.premiumAmount || '',
  });

  const coverageTypes = [
    {
      value: 'third-party',
      title: 'Third Party Only',
      description: 'Mandatory legal coverage for damages to third party',
      price: '2,500',
    },
    {
      value: 'comprehensive',
      title: 'Comprehensive',
      description: 'Own damage + Third party liability',
      price: '8,500',
      popular: true,
    },
    {
      value: 'zero-dep',
      title: 'Zero Depreciation',
      description: 'No depreciation deduction on claims',
      price: '12,000',
    },
  ];

  const availableAddOns = [
    { id: 'roadside', name: 'Roadside Assistance', price: 500 },
    { id: 'engine-protect', name: 'Engine Protection', price: 1200 },
    { id: 'consumables', name: 'Consumables Cover', price: 800 },
    { id: 'return-invoice', name: 'Return to Invoice', price: 1500 },
    { id: 'ncb-protect', name: 'NCB Protection', price: 600 },
    { id: 'passenger', name: 'Passenger Cover', price: 400 },
  ];

  const handleCoverageChange = (value) => {
    setFormData(prev => ({ ...prev, coverageType: value }));
  };

  const handleAddOnToggle = (addOnId) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ motorProduct: formData, paymentFrequency: formData.paymentFrequency, premiumAmount: formData.premiumAmount });
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Coverage</CardTitle>
        <CardDescription>Choose the type of motor insurance coverage</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coverage Type */}
          <div>
            <label className="block text-sm font-medium mb-4">Coverage Type</label>
            <div className="grid md:grid-cols-3 gap-4">
              {coverageTypes.map((coverage) => (
                <button
                  key={coverage.value}
                  type="button"
                  onClick={() => handleCoverageChange(coverage.value)}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    formData.coverageType === coverage.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {coverage.popular && (
                    <div className="absolute -top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Popular
                    </div>
                  )}
                  <div className="font-semibold text-gray-900 mb-1">{coverage.title}</div>
                  <div className="text-sm text-gray-600 mb-3">{coverage.description}</div>
                  <div className="text-lg font-bold text-blue-600">${coverage.price}/year</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-sm font-medium mb-4">Add-ons (Optional)</label>
            <div className="grid md:grid-cols-2 gap-3">
              {availableAddOns.map((addOn) => (
                <button
                  key={addOn.id}
                  type="button"
                  onClick={() => handleAddOnToggle(addOn.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.addOns.includes(addOn.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{addOn.name}</div>
                      <div className="text-sm text-blue-600 mt-1">+${addOn.price}/year</div>
                    </div>
                    {formData.addOns.includes(addOn.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="block text-sm font-medium mb-3">Payment Frequency</label>
            <div className="grid grid-cols-4 gap-3">
              {['annual', 'semi-annual', 'quarterly', 'monthly'].map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentFrequency: freq }))}
                  className={`p-3 rounded-lg border-2 capitalize ${
                    formData.paymentFrequency === freq
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {freq.replace('-', ' ')}
                </button>
              ))}
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
