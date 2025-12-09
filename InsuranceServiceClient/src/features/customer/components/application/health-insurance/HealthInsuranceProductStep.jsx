import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { Users, User, DollarSign, Shield, Info, ArrowRight, ArrowLeft } from 'lucide-react';

const PLAN_TYPES = [
  {
    id: 'individual',
    name: 'Individual Plan',
    description: 'Coverage for one person',
    icon: User,
    baseRate: 0.03 // 3% of sum insured
  },
  {
    id: 'family-floater',
    name: 'Family Floater',
    description: 'Shared sum insured for entire family',
    icon: Users,
    baseRate: 0.035, // 3.5% of sum insured
    discount: 0.15 // 15% discount for families
  },
  {
    id: 'multi-individual',
    name: 'Multi-Individual',
    description: 'Separate sum insured for each member',
    icon: Shield,
    baseRate: 0.032, // 3.2% of sum insured per person
    discount: 0.1 // 10% discount
  }
];

const SUM_INSURED_OPTIONS = [
  { value: '300000', label: '₹3,00,000' },
  { value: '500000', label: '₹5,00,000' },
  { value: '1000000', label: '₹10,00,000' },
  { value: '1500000', label: '₹15,00,000' },
  { value: '2000000', label: '₹20,00,000' },
  { value: '2500000', label: '₹25,00,000' },
  { value: '5000000', label: '₹50,00,000' }
];

const RELATIONSHIPS = [
  'Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 
  'Brother', 'Sister', 'Father-in-law', 'Mother-in-law'
];

export default function HealthInsuranceProductStep({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    planType: data?.productSelection?.planType || '',
    sumInsured: data?.productSelection?.sumInsured || '',
    numberOfMembers: data?.productSelection?.numberOfMembers || 1,
    members: data?.productSelection?.members || [{ name: '', age: '', relationship: 'Self' }],
    premium: data?.productSelection?.premium || 0
  });
  const [errors, setErrors] = useState({});

  // Sync formData when data prop changes (from URL params)
  useEffect(() => {
    if (data?.productSelection) {
      setFormData({
        planType: data.productSelection.planType || '',
        sumInsured: data.productSelection.sumInsured || '',
        numberOfMembers: data.productSelection.numberOfMembers || 1,
        members: data.productSelection.members || [{ name: '', age: '', relationship: 'Self' }],
        premium: data.productSelection.premium || 0
      });
    }
  }, [data?.productSelection?.planType, data?.productSelection?.sumInsured, data?.productSelection?.premium]);

  useEffect(() => {
    calculatePremium();
  }, [formData.planType, formData.sumInsured, formData.numberOfMembers, formData.members]);

  const calculatePremium = () => {
    const { planType, sumInsured, numberOfMembers, members } = formData;
    
    if (!planType || !sumInsured) {
      setFormData(prev => ({ ...prev, premium: 0 }));
      return;
    }

    const plan = PLAN_TYPES.find(p => p.id === planType);
    const sum = parseInt(sumInsured);
    let premium = 0;

    if (planType === 'individual') {
      premium = sum * plan.baseRate;
    } else if (planType === 'family-floater') {
      // Base premium for family floater
      premium = sum * plan.baseRate;
      
      // Age-based loading
      const totalAge = members.reduce((acc, m) => acc + (parseInt(m.age) || 0), 0);
      const avgAge = totalAge / Math.max(numberOfMembers, 1);
      
      if (avgAge > 45) premium *= 1.2;
      else if (avgAge > 35) premium *= 1.1;
      
      // Apply family discount
      premium = premium * (1 - plan.discount);
    } else if (planType === 'multi-individual') {
      // Calculate for each member
      members.forEach(member => {
        let memberPremium = sum * plan.baseRate;
        
        const age = parseInt(member.age) || 0;
        if (age > 45) memberPremium *= 1.25;
        else if (age > 35) memberPremium *= 1.15;
        else if (age < 18) memberPremium *= 0.8;
        
        premium += memberPremium;
      });
      
      // Apply multi-individual discount
      if (numberOfMembers > 1) {
        premium = premium * (1 - plan.discount);
      }
    }

    setFormData(prev => ({ ...prev, premium: Math.round(premium) }));
  };

  const handlePlanTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      planType: value,
      numberOfMembers: value === 'individual' ? 1 : prev.numberOfMembers,
      members: value === 'individual' 
        ? [{ name: '', age: '', relationship: 'Self' }]
        : prev.members
    }));
    setErrors(prev => ({ ...prev, planType: '' }));
  };

  const handleNumberOfMembersChange = (value) => {
    const count = parseInt(value);
    const newMembers = [...formData.members];
    
    if (count > newMembers.length) {
      // Add new members
      for (let i = newMembers.length; i < count; i++) {
        newMembers.push({ name: '', age: '', relationship: '' });
      }
    } else {
      // Remove excess members
      newMembers.splice(count);
    }
    
    setFormData(prev => ({
      ...prev,
      numberOfMembers: count,
      members: newMembers
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
    
    // Clear member-specific errors
    setErrors(prev => ({
      ...prev,
      [`member_${index}_${field}`]: ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.planType) {
      newErrors.planType = 'Please select a plan type';
    }
    
    if (!formData.sumInsured) {
      newErrors.sumInsured = 'Please select sum insured amount';
    }
    
    // Validate members
    formData.members.forEach((member, index) => {
      if (!member.name || member.name.trim() === '') {
        newErrors[`member_${index}_name`] = 'Name is required';
      }
      
      if (!member.age || member.age === '') {
        newErrors[`member_${index}_age`] = 'Age is required';
      } else {
        const age = parseInt(member.age);
        if (age < 0 || age > 100) {
          newErrors[`member_${index}_age`] = 'Age must be between 0 and 100';
        }
      }
      
      if (!member.relationship) {
        newErrors[`member_${index}_relationship`] = 'Relationship is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ productSelection: formData });
    }
  };

  const selectedPlan = PLAN_TYPES.find(p => p.id === formData.planType);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Health Insurance Plan</CardTitle>
          <CardDescription>
            Select the plan type that best suits your family's needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Type Selection */}
          <div className="grid md:grid-cols-3 gap-4">
            {PLAN_TYPES.map((plan) => {
              const Icon = plan.icon;
              const isSelected = formData.planType === plan.id;
              
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlanTypeChange(plan.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  {plan.discount && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      Save {plan.discount * 100}%
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {errors.planType && (
            <Alert variant="destructive">
              <AlertDescription>{errors.planType}</AlertDescription>
            </Alert>
          )}

          {/* Sum Insured Selection */}
          <div>
            <Label htmlFor="sumInsured">Sum Insured Amount *</Label>
            <Select value={formData.sumInsured} onValueChange={(value) => {
              setFormData(prev => ({ ...prev, sumInsured: value }));
              setErrors(prev => ({ ...prev, sumInsured: '' }));
            }}>
              <SelectTrigger id="sumInsured">
                <SelectValue placeholder="Select coverage amount">
                  {formData.sumInsured && !SUM_INSURED_OPTIONS.find(opt => opt.value === formData.sumInsured)
                    ? `₹${parseInt(formData.sumInsured).toLocaleString('en-IN')}`
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* Show current value if it's not in standard options */}
                {formData.sumInsured && !SUM_INSURED_OPTIONS.find(opt => opt.value === formData.sumInsured) && (
                  <SelectItem value={formData.sumInsured}>
                    ₹{parseInt(formData.sumInsured).toLocaleString('en-IN')} (From Calculator)
                  </SelectItem>
                )}
                {SUM_INSURED_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sumInsured && (
              <p className="text-sm text-red-600 mt-1">{errors.sumInsured}</p>
            )}
            {formData.sumInsured && !SUM_INSURED_OPTIONS.find(opt => opt.value === formData.sumInsured) && (
              <p className="text-sm text-blue-600 mt-1">
                ℹ️ Coverage amount pre-filled from calculator
              </p>
            )}
          </div>

          {/* Number of Members (for family plans) */}
          {formData.planType && formData.planType !== 'individual' && (
            <div>
              <Label htmlFor="numberOfMembers">Number of Family Members *</Label>
              <Select 
                value={formData.numberOfMembers.toString()} 
                onValueChange={handleNumberOfMembersChange}
              >
                <SelectTrigger id="numberOfMembers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Member' : 'Members'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Member Details */}
          {formData.planType && (
            <div className="space-y-4">
              <h3 className="font-semibold">Member Details</h3>
              {formData.members.map((member, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">
                    {index === 0 ? 'Primary Member (Self)' : `Member ${index + 1}`}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`member_${index}_name`}>Full Name *</Label>
                      <Input
                        id={`member_${index}_name`}
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                      />
                      {errors[`member_${index}_name`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`member_${index}_name`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`member_${index}_age`}>Age *</Label>
                      <Input
                        id={`member_${index}_age`}
                        type="number"
                        min="0"
                        max="100"
                        value={member.age}
                        onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                        placeholder="Enter age"
                      />
                      {errors[`member_${index}_age`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`member_${index}_age`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`member_${index}_relationship`}>Relationship *</Label>
                      <Select
                        value={member.relationship}
                        onValueChange={(value) => handleMemberChange(index, 'relationship', value)}
                        disabled={index === 0}
                      >
                        <SelectTrigger id={`member_${index}_relationship`}>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIPS.map(rel => (
                            <SelectItem key={rel} value={rel}>
                              {rel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`member_${index}_relationship`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`member_${index}_relationship`]}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Premium Summary */}
          {formData.planType && formData.sumInsured && formData.premium > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Estimated Annual Premium</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedPlan?.name} - {SUM_INSURED_OPTIONS.find(o => o.value === formData.sumInsured)?.label || `₹${parseInt(formData.sumInsured).toLocaleString('en-IN')}`} coverage
                    </p>
                    {formData.planType !== 'individual' && (
                      <p className="text-sm text-gray-600">
                        For {formData.numberOfMembers} family {formData.numberOfMembers === 1 ? 'member' : 'members'}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{formData.premium.toLocaleString('en-IN')}
                    </div>
                    <p className="text-sm text-gray-600">per year</p>
                  </div>
                </div>
                
                {selectedPlan?.discount && (
                  <Alert className="mt-4 bg-green-50 border-green-200">
                    <Info className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      You're saving {selectedPlan.discount * 100}% with {selectedPlan.name}!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Continue to Medical Information
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
