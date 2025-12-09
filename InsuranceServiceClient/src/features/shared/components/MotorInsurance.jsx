import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import { Car, Shield, TrendingUp, Users, CheckCircle, ArrowRight, AlertCircle, Wrench } from 'lucide-react';
import { Badge } from './ui/badge';
import axios from '../api/axios';
import { ComparisonTable } from './insurance/ComparisonTable';
import { PremiumCalculator } from './insurance/PremiumCalculator';
import { FAQSection } from './insurance/FAQSection';
import { MiniCalculator } from './insurance/MiniCalculator';
import plansService from '../api/services/plansService';

export function MotorInsurance() {
  const [products, setProducts] = useState([]);
  const [productPlans, setProductPlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading Motor Insurance products...');
        const response = await axios.get('/api/products');
        console.log('📦 API Response:', response);
        const allProducts = response.data || [];
        const motorProducts = allProducts.filter(p => p.productType === 'Motor');
        console.log('🚗 Motor products:', motorProducts.length, motorProducts);
        setProducts(motorProducts);

        // Load plans for each product
        const plansData = {};
        for (const product of motorProducts) {
          try {
            const plans = await plansService.getPlansByProduct(product.id);
            plansData[product.id] = plans || [];
          } catch (error) {
            console.error(`Error loading plans for product ${product.id}:`, error);
            plansData[product.id] = [];
          }
        }
        setProductPlans(plansData);
      } catch (error) {
        console.error('❌ Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: 'Accident Protection',
      description: 'Coverage for damages due to accidents and collisions',
    },
    {
      icon: Wrench,
      title: 'Repair Coverage',
      description: 'Financial support for vehicle repairs and maintenance',
    },
    {
      icon: Users,
      title: 'Third Party Liability',
      description: 'Protection against legal liabilities to third parties',
    },
    {
      icon: CheckCircle,
      title: 'Cashless Claims',
      description: 'Get repairs done at network garages without paying upfront',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between third-party and comprehensive insurance?',
      answer: 'Third-party insurance covers only damages to others (people, vehicles, property). It is mandatory by law. Comprehensive insurance covers both third-party liabilities and own damage to your vehicle, theft, natural disasters, and personal accident cover.'
    },
    {
      question: 'How is IDV (Insured Declared Value) calculated?',
      answer: 'IDV is the current market value of your vehicle. It is calculated as: Manufacturer\'s listed selling price - Depreciation based on vehicle age. IDV decreases each year as the vehicle ages. You can choose an IDV within ±10% of the calculated value.'
    },
    {
      question: 'What is No Claim Bonus (NCB)?',
      answer: 'NCB is a discount on premium for claim-free years. It starts at 20% for 1 year and can go up to 50% for 5+ claim-free years. NCB belongs to the policyholder, not the vehicle, so you can transfer it when buying a new vehicle.'
    },
    {
      question: 'What are the important add-ons I should consider?',
      answer: 'Zero Depreciation: Full claim without depreciation deduction\nEngine Protection: Covers engine damage from water/oil leakage\nRoadside Assistance: Towing, fuel delivery, flat tire help\nReturn to Invoice: Gap between IDV and invoice price in total loss\nConsumables Cover: Cost of nuts, bolts, oils, lubricants'
    },
    {
      question: 'What is not covered in motor insurance?',
      answer: 'Driving without valid license, drunk driving, wear and tear, mechanical/electrical breakdown, consequential damage, driving outside geographical area, using vehicle for commercial purposes (if insured as private), and damages from war/nuclear risks are typically excluded.'
    },
    {
      question: 'How do I make a claim after an accident?',
      answer: 'Inform the insurer within 24-48 hours, file an FIR for theft/third-party cases, take photos of damage, get the vehicle surveyed by insurer, submit claim form with documents (RC copy, driving license, FIR), and get repairs done at network garage for cashless claims.'
    }
  ];

  const addOns = [
    { name: 'Zero Depreciation', description: 'No depreciation on claim amount' },
    { name: 'Engine Protection', description: 'Coverage for engine damage' },
    { name: 'Return to Invoice', description: 'Get full invoice value on total loss' },
    { name: 'Roadside Assistance', description: '24/7 emergency assistance' },
    { name: 'NCB Protection', description: 'Protect your No Claim Bonus' },
    { name: 'Consumables Cover', description: 'Coverage for nuts, bolts, oil, etc.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Car className="size-16 mx-auto mb-6" />
            <h1 className="mb-4">Motor Insurance</h1>
            <p className="text-xl text-blue-100 mb-8">
              Comprehensive auto insurance protection for your vehicle. Drive worry-free with complete coverage against accidents and damages.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/apply-motor">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/calculator">Calculate Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is Motor Insurance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">What is Motor Insurance?</h2>
            <p className="text-gray-700 mb-4">
              Motor insurance, also known as auto or vehicle insurance, is a type of insurance plan that provides financial protection against damages to your automobile. It covers losses resulting from accidents, theft, natural calamities, and third-party liabilities.
            </p>
            <p className="text-gray-700 mb-4">
              In India, having at least third-party motor insurance is mandatory as per the Motor Vehicles Act. This ensures that you're covered for any legal liabilities arising from accidents that cause injury or damage to third parties. However, a comprehensive motor insurance policy provides additional coverage for damages to your own vehicle.
            </p>
            <p className="text-gray-700">
              Motor insurance gives you peace of mind while driving, knowing that you're financially protected against unexpected events. Whether it's a minor scratch or a major accident, your insurance policy helps cover the repair costs and legal expenses.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="size-8" />
                </div>
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Motor Insurance Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the right motor insurance plan that suits your vehicle and budget.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {loading ? (
              <div className="col-span-2 text-center py-8">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="col-span-2 text-center py-8">No motor insurance products available</div>
            ) : (
              products.map((product) => {
                const plans = productPlans[product.id] || [];
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle>{product.productName}</CardTitle>
                      </div>
                      <CardDescription>{product.description || 'Motor Insurance Coverage'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Available Plans */}
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Available Plans</p>
                          {plans.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No plans available</p>
                          ) : (
                            <div className="space-y-2">
                              {plans.map((plan) => {
                                const monthlyPremium = plan.basePremiumMonthly || (plan.basePremiumAnnual / 12);
                                const annualPremium = plan.basePremiumAnnual;
                                return (
                                  <div key={plan.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{plan.planName}</span>
                                      {plan.isFeatured && <Badge variant="default" className="text-xs">Featured</Badge>}
                                      {plan.isPopular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-green-600">
                                        ${Number(monthlyPremium).toFixed(0)}/mo
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        ${Number(annualPremium).toFixed(0)}/yr • ${plan.coverageAmount.toLocaleString()} coverage
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" variant="outline" asChild>
                            <Link to={`/motor-insurance/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button className="flex-1" asChild>
                            <Link to={`/apply-motor?productId=${product.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                        </div>
                        <MiniCalculator product={product} productType="Motor" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
          
          {/* Comparison Table */}
          {!loading && products.length > 1 && (
            <ComparisonTable products={products} productType="Motor" />
          )}
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Available Add-on Covers</h2>
            <p className="text-center text-gray-600 mb-8">
              Enhance your motor insurance with these additional covers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addOns.map((addon, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{addon.name}</CardTitle>
                    <CardDescription>{addon.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Eligibility & Requirements
            </h2>
            <p className="text-lg text-gray-600">
              What you need to get motor insurance
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Vehicle Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Valid Registration Certificate (RC)</li>
                  <li>• Vehicle invoice or previous policy</li>
                  <li>• Chassis and engine number</li>
                  <li>• No Claim Bonus (NCB) certificate (if applicable)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Owner Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Valid driving license</li>
                  <li>• PAN card (mandatory)</li>
                  <li>• Aadhaar card or address proof</li>
                  <li>• Valid email and phone number</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Vehicle Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Vehicle must be roadworthy</li>
                  <li>• Valid pollution certificate (PUC)</li>
                  <li>• No major modifications without RTO approval</li>
                  <li>• Age: New to 20 years old</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Inspection Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Vehicles older than 5 years</li>
                  <li>• Break in policy continuity</li>
                  <li>• Total loss claim in previous policy</li>
                  <li>• High-value vehicles ({'>'}₹20 lakhs)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about motor insurance
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Insure Your Vehicle Today</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Get comprehensive motor insurance coverage and drive with complete peace of mind.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/apply-motor">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/calculator">Calculate Premium</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}




