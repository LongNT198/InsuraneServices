import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import { Home, Shield, TrendingUp, Users, CheckCircle, ArrowRight, AlertCircle, Flame, Droplet } from 'lucide-react';
import { Badge } from './ui/badge';
import axios from '../api/axios';
import { ComparisonTable } from './insurance/ComparisonTable';
import { PremiumCalculator } from './insurance/PremiumCalculator';
import { FAQSection } from './insurance/FAQSection';
import { MiniCalculator } from './insurance/MiniCalculator';
import plansService from '../api/services/plansService';

export function HomeInsurance() {
  const [products, setProducts] = useState([]);
  const [productPlans, setProductPlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading Home Insurance products...');
        const response = await axios.get('/api/products');
        console.log('📦 API Response:', response);
        const allProducts = response.data || [];
        const homeProducts = allProducts.filter(p => p.productType === 'Home');
        console.log('🏡 Home products:', homeProducts.length, homeProducts);
        setProducts(homeProducts);

        // Load plans for each product
        const plansData = {};
        for (const product of homeProducts) {
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
      title: 'Complete Protection',
      description: 'Comprehensive coverage for your home and belongings',
    },
    {
      icon: Flame,
      title: 'Fire Coverage',
      description: 'Protection against fire damage and related losses',
    },
    {
      icon: Droplet,
      title: 'Natural Calamities',
      description: 'Coverage for floods, earthquakes, and storms',
    },
    {
      icon: CheckCircle,
      title: 'Theft Protection',
      description: 'Financial security against burglary and theft',
    },
  ];

  const faqs = [
    {
      question: 'What does home insurance cover?',
      answer: 'Home insurance covers the building structure against fire, lightning, earthquake, floods, storms, burglary, theft, and other natural/man-made disasters. Contents insurance covers household items like furniture, electronics, jewelry, and valuables. Liability coverage protects against legal liability for injuries to third parties on your property.'
    },
    {
      question: 'What is the difference between building and contents insurance?',
      answer: 'Building insurance covers the physical structure - walls, roof, floors, fixtures, and fittings. Contents insurance covers movable items inside the home - furniture, appliances, electronics, clothing, jewelry. You can buy them separately or together as a comprehensive home insurance policy.'
    },
    {
      question: 'Are natural disasters like earthquakes and floods covered?',
      answer: 'Standard home insurance covers fire, lightning, explosion, and some natural perils. Earthquake and flood coverage are typically add-ons that need to be purchased separately. Check your policy wording for specific inclusions and exclusions. Cyclone and storm damage are usually covered in the base policy.'
    },
    {
      question: 'How is the sum insured calculated for home insurance?',
      answer: 'For building insurance: Current reconstruction cost (not market value) of the structure.\\nFor contents: Total replacement value of all household items.\\nYou should update the sum insured periodically to account for inflation and new purchases. Under-insurance can lead to proportionate claim settlement.'
    },
    {
      question: 'What is not covered in home insurance?',
      answer: 'War and nuclear risks, willful damage, wear and tear, consequential losses, damage when house is unoccupied for more than 30 days, damage from defective construction/design, and damage from illegal activities are typically excluded. Read the policy exclusions carefully.'
    },
    {
      question: 'How do I make a claim for home insurance?',
      answer: 'Inform the insurer immediately (within 24-48 hours), file an FIR for theft/burglary, take photos of damage, do not dispose of damaged items until surveyor inspection, submit claim form with supporting documents (FIR, bills, photos, repair estimates), and cooperate with the insurer\'s surveyor.'
    }
  ];

  const coveredEvents = [
    { event: 'Fire and Lightning', description: 'Damage caused by fire, lightning strikes' },
    { event: 'Explosion/Implosion', description: 'Damage from gas explosions or implosions' },
    { event: 'Earthquakes', description: 'Coverage for earthquake damages' },
    { event: 'Floods & Storms', description: 'Protection against flood and storm damage' },
    { event: 'Burglary & Theft', description: 'Coverage for stolen items and break-ins' },
    { event: 'Riots & Strikes', description: 'Damage during civil disturbances' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Home className="size-16 mx-auto mb-6" />
            <h1 className="mb-4">Home Insurance</h1>
            <p className="text-xl text-orange-100 mb-8">
              The most popular insurance that provides compensation for any mishaps that occur to your home. Protect your biggest investment with comprehensive coverage.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/apply-home">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                <Link to="/calculator">Calculate Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is Home Insurance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">What is Home Insurance?</h2>
            <p className="text-gray-700 mb-4">
              Home insurance is one of the most popular types of insurance that provides financial compensation for any mishaps that occur to your home. It protects your biggest investment - your house - against various risks including natural disasters, theft, fire, and other unforeseen events.
            </p>
            <p className="text-gray-700 mb-4">
              Coverage is provided according to the policy and premium paid by the homeowner. Home insurance typically covers the physical structure of your home, your personal belongings, liability protection, and additional living expenses if you need to temporarily relocate due to covered damages.
            </p>
            <p className="text-gray-700">
              There are various types of home insurance plans that you can choose from to suit your specific needs. Whether you own or rent your home, there's a policy designed to protect your property and possessions. Home insurance gives you peace of mind knowing that your home and belongings are financially protected.
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
                <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="size-8" />
                </div>
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Covered Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">What's Covered?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coveredEvents.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="size-5 text-green-500" />
                      {item.event}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Home Insurance Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from various home insurance plans designed to protect your property and belongings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {loading ? (
              <div className="col-span-2 text-center py-8">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="col-span-2 text-center py-8">No home insurance products available</div>
            ) : (
              products.map((product) => {
                const plans = productPlans[product.id] || [];
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle>{product.productName}</CardTitle>
                      </div>
                      <CardDescription>{product.description || 'Home Insurance Coverage'}</CardDescription>
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
                            <Link to={`/home-insurance/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button className="flex-1" asChild>
                            <Link to={`/apply-home?productId=${product.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                        </div>
                        <MiniCalculator product={product} productType="Home" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
          
          {/* Comparison Table */}
          {!loading && products.length > 1 && (
            <ComparisonTable products={products} productType="Home" />
          )}
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
              What you need to get home insurance
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Property Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ownership proof (Sale deed/Title deed)</li>
                  <li>• Property tax receipts</li>
                  <li>• Construction completion certificate</li>
                  <li>• Building plan approved by local authority</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Property Valuation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Professional valuation certificate</li>
                  <li>• Current reconstruction cost estimate</li>
                  <li>• Details of structure and materials used</li>
                  <li>• Contents inventory and value</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Property Condition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Property should be in good condition</li>
                  <li>• No structural defects or damage</li>
                  <li>• Must be occupied or regularly maintained</li>
                  <li>• Adequate security measures in place</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Owner Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• PAN card (mandatory)</li>
                  <li>• Aadhaar card or address proof</li>
                  <li>• Valid email and phone number</li>
                  <li>• Passport-size photographs</li>
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
              Find answers to common questions about home insurance
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Protect Your Home Today</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Don't wait for disaster to strike. Secure your home and belongings with comprehensive home insurance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/apply-home">Apply Now</Link>
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




