import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, X, Heart, Shield, Home, Car } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ComparisonTool() {
  const [selectedType, setSelectedType] = useState('life');
  const [selectedPlans, setSelectedPlans] = useState([]);

  const lifePlans = [
    {
      id: 'life-basic',
      name: 'Term Life Basic',
      premium: '₹5,000/year',
      coverage: '₹50 Lakhs',
      features: {
        'Death Benefit': '₹50 Lakhs',
        'Critical Illness': 'Not Included',
        'Accidental Death': 'Not Included',
        'Premium Waiver': 'No',
        'Maturity Benefit': 'No',
        'Tax Benefits': 'Yes',
        'Claim Settlement': '97%',
      },
      recommended: false,
    },
    {
      id: 'life-premium',
      name: 'Term Life Premium',
      premium: '₹12,000/year',
      coverage: '₹1 Crore',
      features: {
        'Death Benefit': '₹1 Crore',
        'Critical Illness': '₹25 Lakhs',
        'Accidental Death': '₹1 Crore (Additional)',
        'Premium Waiver': 'Yes',
        'Maturity Benefit': 'No',
        'Tax Benefits': 'Yes',
        'Claim Settlement': '98%',
      },
      recommended: true,
    },
    {
      id: 'life-elite',
      name: 'Whole Life Elite',
      premium: '₹25,000/year',
      coverage: '₹2 Crores',
      features: {
        'Death Benefit': '₹2 Crores',
        'Critical Illness': '₹50 Lakhs',
        'Accidental Death': '₹2 Crores (Additional)',
        'Premium Waiver': 'Yes',
        'Maturity Benefit': 'Yes',
        'Tax Benefits': 'Yes',
        'Claim Settlement': '99%',
      },
      recommended: false,
    },
  ];

  const medicalPlans = [
    {
      id: 'health-basic',
      name: 'Health Shield Basic',
      premium: '₹8,000/year',
      coverage: '₹5 Lakhs',
      features: {
        'Sum Insured': '₹5 Lakhs',
        'Room Rent Limit': '1% of SI',
        'Pre-existing Diseases': '3 years waiting',
        'No Claim Bonus': '10% per year',
        'Cashless Hospitals': '5,000+',
        'Ambulance Cover': '₹2,000',
        'Maternity Cover': 'Not Included',
      },
      recommended: false,
    },
    {
      id: 'health-family',
      name: 'Family Health Shield',
      premium: '₹18,000/year',
      coverage: '₹10 Lakhs',
      features: {
        'Sum Insured': '₹10 Lakhs (Family Floater)',
        'Room Rent Limit': '2% of SI',
        'Pre-existing Diseases': '2 years waiting',
        'No Claim Bonus': '20% per year',
        'Cashless Hospitals': '8,000+',
        'Ambulance Cover': '₹5,000',
        'Maternity Cover': '₹50,000',
      },
      recommended: true,
    },
    {
      id: 'health-premium',
      name: 'Premium Health Plus',
      premium: '₹35,000/year',
      coverage: '₹25 Lakhs',
      features: {
        'Sum Insured': '₹25 Lakhs',
        'Room Rent Limit': 'No Limit',
        'Pre-existing Diseases': '1 year waiting',
        'No Claim Bonus': '50% per year',
        'Cashless Hospitals': '10,000+',
        'Ambulance Cover': 'Unlimited',
        'Maternity Cover': '₹1 Lakh',
      },
      recommended: false,
    },
  ];

  const motorPlans = [
    {
      id: 'motor-basic',
      name: 'Third Party Only',
      premium: '₹2,500/year',
      coverage: 'Unlimited',
      features: {
        'Third Party Liability': 'Unlimited',
        'Own Damage': 'Not Covered',
        'Personal Accident': '₹15 Lakhs',
        'Zero Depreciation': 'No',
        'Engine Protection': 'No',
        'Roadside Assistance': 'No',
        'NCB Protection': 'No',
      },
      recommended: false,
    },
    {
      id: 'motor-comprehensive',
      name: 'Comprehensive Cover',
      premium: '₹8,500/year',
      coverage: '₹10 Lakhs',
      features: {
        'Third Party Liability': 'Unlimited',
        'Own Damage': '₹10 Lakhs',
        'Personal Accident': '₹15 Lakhs',
        'Zero Depreciation': 'Yes',
        'Engine Protection': 'Yes',
        'Roadside Assistance': 'Yes',
        'NCB Protection': 'Yes',
      },
      recommended: true,
    },
    {
      id: 'motor-premium',
      name: 'Premium Shield',
      premium: '₹15,000/year',
      coverage: '₹20 Lakhs',
      features: {
        'Third Party Liability': 'Unlimited',
        'Own Damage': '₹20 Lakhs',
        'Personal Accident': '₹25 Lakhs',
        'Zero Depreciation': 'Yes',
        'Engine Protection': 'Yes',
        'Roadside Assistance': '24/7 Priority',
        'NCB Protection': 'Yes',
      },
      recommended: false,
    },
  ];

  const homePlans = [
    {
      id: 'home-basic',
      name: 'Home Basic',
      premium: '₹4,000/year',
      coverage: '₹10 Lakhs',
      features: {
        'Structure Cover': '₹10 Lakhs',
        'Contents Cover': '₹2 Lakhs',
        'Natural Disasters': 'Yes',
        'Theft/Burglary': 'Yes',
        'Fire & Explosion': 'Yes',
        'Temporary Accommodation': 'No',
        'Public Liability': 'No',
      },
      recommended: false,
    },
    {
      id: 'home-standard',
      name: 'Home Standard',
      premium: '₹8,000/year',
      coverage: '₹25 Lakhs',
      features: {
        'Structure Cover': '₹25 Lakhs',
        'Contents Cover': '₹5 Lakhs',
        'Natural Disasters': 'Yes',
        'Theft/Burglary': 'Yes',
        'Fire & Explosion': 'Yes',
        'Temporary Accommodation': '₹50,000',
        'Public Liability': '₹10 Lakhs',
      },
      recommended: true,
    },
    {
      id: 'home-premium',
      name: 'Home Premium',
      premium: '₹15,000/year',
      coverage: '₹50 Lakhs',
      features: {
        'Structure Cover': '₹50 Lakhs',
        'Contents Cover': '₹10 Lakhs',
        'Natural Disasters': 'Yes',
        'Theft/Burglary': 'Yes',
        'Fire & Explosion': 'Yes',
        'Temporary Accommodation': '₹1 Lakh',
        'Public Liability': '₹25 Lakhs',
      },
      recommended: false,
    },
  ];

  const getPlans = () => {
    switch (selectedType) {
      case 'life': return lifePlans;
      case 'medical': return medicalPlans;
      case 'motor': return motorPlans;
      case 'home': return homePlans;
      default: return lifePlans;
    }
  };

  const getIcon = () => {
    switch (selectedType) {
      case 'life': return Heart;
      case 'medical': return Shield;
      case 'motor': return Car;
      case 'home': return Home;
      default: return Shield;
    }
  };

  const Icon = getIcon();
  const plans = getPlans();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Icon className="size-12 text-blue-600 mx-auto mb-4" />
          <h1 className="mb-2">Compare Insurance Plans</h1>
          <p className="text-gray-600">Find the perfect plan that suits your needs</p>
        </div>

        {/* Insurance Type Selector */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="life">Life Insurance</TabsTrigger>
            <TabsTrigger value="medical">Medical Insurance</TabsTrigger>
            <TabsTrigger value="motor">Motor Insurance</TabsTrigger>
            <TabsTrigger value="home">Home Insurance</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-4 gap-4 min-w-[900px]">
            {/* Feature Column */}
            <div>
              <Card className="h-full bg-gray-50">
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription className="opacity-0">Compare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.keys(plans[0].features).map((feature) => (
                    <div key={feature} className="py-3 border-b last:border-0">
                      <p className="font-semibold text-sm">{feature}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Plan Columns */}
            {plans.map((plan) => (
              <div key={plan.id}>
                <Card className={`h-full ${plan.recommended ? 'border-2 border-blue-600 shadow-lg' : ''}`}>
                  <CardHeader className="relative">
                    {plan.recommended && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Recommended
                      </Badge>
                    )}
                    <CardTitle className="text-lg mt-2">{plan.name}</CardTitle>
                    <div className="pt-2">
                      <p className="text-2xl font-bold text-blue-600">{plan.premium}</p>
                      <p className="text-sm text-gray-600">Coverage: {plan.coverage}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(plan.features).map(([feature, value]) => (
                      <div key={feature} className="py-3 border-b last:border-0">
                        <div className="flex items-center justify-center">
                          {value === 'Yes' || value === 'Included' ? (
                            <Check className="size-5 text-green-600" />
                          ) : value === 'No' || value === 'Not Included' || value === 'Not Covered' ? (
                            <X className="size-5 text-red-400" />
                          ) : (
                            <p className="text-sm text-center">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant={plan.recommended ? 'default' : 'outline'}>
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Not sure which plan is right for you? Our experts can help.
              </p>
              <Button variant="outline" className="w-full">Talk to Expert</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Get a personalized quote based on your specific requirements.
              </p>
              <Button variant="outline" className="w-full">Get Custom Quote</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Download Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Save this comparison for later or share it with family.
              </p>
              <Button variant="outline" className="w-full">Download PDF</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}




