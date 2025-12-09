import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Calculator, IndianRupee, Heart, Shield, Car, Home, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import PaymentFrequencyCompact from '../../customer/components/PaymentFrequencyCompact';

export function PremiumCalculator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeFromUrl = searchParams.get('type');
  
  const [insuranceType, setInsuranceType] = useState(typeFromUrl || '');
  const [formData, setFormData] = useState({});
  const [premium, setPremium] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  // Update insurance type when URL changes
  useEffect(() => {
    if (typeFromUrl && typeFromUrl !== insuranceType) {
      setInsuranceType(typeFromUrl);
      setFormData({});
      setPremium(null);
      setSelectedFrequency(null);
    }
  }, [typeFromUrl]);

  const calculatePremium = () => {
    let calculatedPremium = 0;

    switch (insuranceType) {
      case 'life':
        const age = parseInt(formData.age) || 30;
        const coverage = parseInt(formData.coverage) || 1000000;
        const term = parseInt(formData.term) || 20;
        
        // Simple calculation: Base rate increases with age, decreases with term
        const ageFactor = age < 30 ? 0.5 : age < 40 ? 0.7 : age < 50 ? 1.0 : 1.5;
        const termFactor = term <= 10 ? 1.2 : term <= 20 ? 1.0 : 0.9;
        calculatedPremium = (coverage / 1000) * ageFactor * termFactor * 0.5;
        break;

      case 'medical':
        const medAge = parseInt(formData.age) || 30;
        const medCoverage = parseInt(formData.coverage) || 500000;
        const familySize = parseInt(formData.familySize) || 1;
        
        // Medical insurance calculation
        const medAgeFactor = medAge < 35 ? 1.0 : medAge < 45 ? 1.3 : medAge < 60 ? 1.8 : 2.5;
        const familyFactor = familySize === 1 ? 1.0 : familySize <= 4 ? 1.8 : 2.2;
        calculatedPremium = (medCoverage / 5000) * medAgeFactor * familyFactor;
        break;

      case 'motor':
        const vehicleValue = parseInt(formData.vehicleValue) || 500000;
        const vehicleAge = parseInt(formData.vehicleAge) || 0;
        const planType = formData.planType || 'comprehensive';
        
        // Motor insurance calculation
        const vehicleAgeFactor = vehicleAge === 0 ? 1.2 : vehicleAge <= 3 ? 1.0 : vehicleAge <= 7 ? 0.8 : 0.6;
        const planFactor = planType === 'comprehensive' ? 1.5 : planType === 'zero-dep' ? 2.0 : 0.5;
        calculatedPremium = (vehicleValue * 0.03) * vehicleAgeFactor * planFactor;
        break;

      case 'home':
        const propertyValue = parseInt(formData.propertyValue) || 5000000;
        const propertyType = formData.propertyType || 'independent';
        const coverageType = formData.coverageType || 'comprehensive';
        
        // Home insurance calculation
        const propertyTypeFactor = propertyType === 'independent' ? 1.2 : 1.0;
        const coverageTypeFactor = coverageType === 'comprehensive' ? 1.5 : coverageType === 'building' ? 1.0 : 0.7;
        calculatedPremium = (propertyValue * 0.002) * propertyTypeFactor * coverageTypeFactor;
        break;
    }

    setPremium(Math.round(calculatedPremium));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setPremium(null); // Reset premium when inputs change
    setSelectedFrequency(null); // Reset frequency selection
  };

  const renderForm = () => {
    switch (insuranceType) {
      case 'life':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="coverage">Coverage Amount (₹)</Label>
              <Input
                id="coverage"
                type="number"
                placeholder="1000000"
                value={formData.coverage || ''}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="term">Policy Term (years)</Label>
              <Input
                id="term"
                type="number"
                placeholder="20"
                value={formData.term || ''}
                onChange={(e) => handleInputChange('term', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="planType">Plan Type</Label>
              <Select onValueChange={(value) => handleInputChange('planType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">Term Insurance</SelectItem>
                  <SelectItem value="whole">Whole Life</SelectItem>
                  <SelectItem value="endowment">Endowment</SelectItem>
                  <SelectItem value="ulip">ULIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'medical':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="coverage">Coverage Amount (₹)</Label>
              <Input
                id="coverage"
                type="number"
                placeholder="500000"
                value={formData.coverage || ''}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="familySize">Number of Members</Label>
              <Input
                id="familySize"
                type="number"
                placeholder="1"
                value={formData.familySize || ''}
                onChange={(e) => handleInputChange('familySize', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="planType">Plan Type</Label>
              <Select onValueChange={(value) => handleInputChange('planType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="family">Family Floater</SelectItem>
                  <SelectItem value="senior">Senior Citizen</SelectItem>
                  <SelectItem value="critical">Critical Illness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'motor':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicleValue">Vehicle Value (₹)</Label>
              <Input
                id="vehicleValue"
                type="number"
                placeholder="500000"
                value={formData.vehicleValue || ''}
                onChange={(e) => handleInputChange('vehicleValue', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vehicleAge">Vehicle Age (years)</Label>
              <Input
                id="vehicleAge"
                type="number"
                placeholder="0"
                value={formData.vehicleAge || ''}
                onChange={(e) => handleInputChange('vehicleAge', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="planType">Plan Type</Label>
              <Select onValueChange={(value) => handleInputChange('planType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="third-party">Third Party</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="zero-dep">Zero Depreciation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="propertyValue">Property Value (₹)</Label>
              <Input
                id="propertyValue"
                type="number"
                placeholder="5000000"
                value={formData.propertyValue || ''}
                onChange={(e) => handleInputChange('propertyValue', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent">Independent House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coverageType">Coverage Type</Label>
              <Select onValueChange={(value) => handleInputChange('coverageType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building">Building Only</SelectItem>
                  <SelectItem value="contents">Contents Only</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location Type</Label>
              <Select onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metro">Metro City</SelectItem>
                  <SelectItem value="tier1">Tier 1 City</SelectItem>
                  <SelectItem value="tier2">Tier 2/3 City</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const insuranceTypes = [
    {
      value: 'life',
      label: 'Life Insurance',
      icon: Heart,
      color: 'blue',
      description: 'Protect your family\'s future'
    },
    {
      value: 'medical',
      label: 'Medical Insurance',
      icon: Shield,
      color: 'green',
      description: 'Comprehensive health coverage'
    },
    {
      value: 'motor',
      label: 'Motor Insurance',
      icon: Car,
      color: 'orange',
      description: 'Vehicle protection plans'
    },
    {
      value: 'home',
      label: 'Home Insurance',
      icon: Home,
      color: 'purple',
      description: 'Safeguard your property'
    }
  ];

  const getInsuranceIcon = (type) => {
    const config = insuranceTypes.find(t => t.value === type);
    return config ? config.icon : Calculator;
  };

  const getInsuranceColor = (type) => {
    const config = insuranceTypes.find(t => t.value === type);
    return config ? config.color : 'blue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4">
              <Calculator className="size-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Premium Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant premium quotes for all insurance types. Simple, fast, and accurate calculations.
            </p>
          </div>

          {/* Insurance Type Cards */}
          {!insuranceType && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Choose Insurance Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {insuranceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.value}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2 ${
                        insuranceType === type.value ? `border-${type.color}-500` : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setInsuranceType(type.value);
                        navigate(`/calculator?type=${type.value}`);
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-xl bg-${type.color}-100 text-${type.color}-600 flex items-center justify-center mx-auto mb-3`}>
                          <Icon className="size-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calculator Form */}
          {insuranceType && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = getInsuranceIcon(insuranceType);
                        const color = getInsuranceColor(insuranceType);
                        return (
                          <div className={`w-10 h-10 rounded-lg bg-${color}-100 text-${color}-600 flex items-center justify-center`}>
                            <Icon className="size-5" />
                          </div>
                        );
                      })()}
                      <div className="flex-1">
                        <CardTitle className="text-xl">Calculate Your Premium</CardTitle>
                        <CardDescription>
                          {insuranceTypes.find(t => t.value === insuranceType)?.label} - Fill in your details below
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setInsuranceType('');
                          navigate('/calculator');
                        }}
                      >
                        Change Type
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">

                    {/* Dynamic Form */}
                    {renderForm()}

                    {/* Calculate Button */}
                    <Button onClick={calculatePremium} className="w-full" size="lg">
                      <Calculator className="size-5 mr-2" />
                      Calculate Premium
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Result & Info */}
              <div className="space-y-6">{premium !== null ? (
                <>
                  {/* Premium Result Card */}
                  <Card className="shadow-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Your Premium Quote</CardTitle>
                          <CardDescription className="text-xs">Base annual premium</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          ${premium.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">per year</p>
                      </div>
                      <Alert className="bg-white border-green-200">
                        <Info className="size-4 text-green-600" />
                        <AlertDescription className="text-xs text-gray-700">
                          Choose your payment frequency below for final pricing. Save up to 8% with lump sum payment!
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  {/* Payment Frequency */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">Payment Frequency</CardTitle>
                      <CardDescription className="text-xs">Select how you'd like to pay</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PaymentFrequencyCompact
                        productId={1}
                        termYears={parseInt(formData.term) || parseInt(formData.termYears) || 10}
                        coverageAmount={premium}
                        onSelect={setSelectedFrequency}
                      />
                      
                      {selectedFrequency && (
                        <div className="mt-4 space-y-3">
                          <Button className="w-full" size="lg">
                            Buy Policy
                            <ArrowRight className="size-4 ml-2" />
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setPremium(null);
                              setSelectedFrequency(null);
                            }}
                          >
                            Recalculate
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Info Card when no result */
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">How It Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">1</div>
                      <p className="text-gray-700">Fill in your details in the form</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">2</div>
                      <p className="text-gray-700">Click calculate to get instant quote</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">3</div>
                      <p className="text-gray-700">Choose payment frequency</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">4</div>
                      <p className="text-gray-700">Proceed to buy your policy</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              </div>
            </div>
          )}

          {/* Bottom Info Card */}
          {insuranceType && (
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="size-5 text-blue-600" />
                  How Premium is Calculated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Age:</strong> Younger individuals typically pay lower premiums</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Coverage Amount:</strong> Higher coverage means higher premiums</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Policy Term:</strong> Longer terms may have different structures</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Health/Condition:</strong> Better condition results in lower premiums</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Coverage Type:</strong> Comprehensive plans cost more than basic</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Payment Frequency:</strong> Save up to 8% with annual payment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}



