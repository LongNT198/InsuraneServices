import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import { Heart, Shield, TrendingUp, Users, CheckCircle, ArrowRight, AlertCircle, Activity, Hospital, Ambulance, Stethoscope, Calculator } from 'lucide-react';
import { Badge } from './ui/badge';
import axios from '../api/axios';
import { ComparisonTable } from './insurance/ComparisonTable';
import { PremiumCalculator } from './insurance/PremiumCalculator';
import { FAQSection } from './insurance/FAQSection';
// import { MiniCalculator } from './insurance/MiniCalculator';
import plansService from '../api/services/plansService';

export function MedicalInsurance() {
  const [products, setProducts] = useState([]);
  const [productPlans, setProductPlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        const allProducts = response.data || [];
        const medicalProducts = allProducts.filter(p => p.productType === 'Health');
        setProducts(medicalProducts);

        // Load plans for each product
        const plansData = {};
        for (const product of medicalProducts) {
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
        console.error('❌ Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const benefits = [
    {
      icon: Hospital,
      title: 'Cashless Treatment',
      description: 'Get treated at network hospitals without paying cash upfront',
    },
    {
      icon: Ambulance,
      title: 'Emergency Coverage',
      description: 'Ambulance charges and emergency medical expenses covered',
    },
    {
      icon: Heart,
      title: 'Pre & Post Care',
      description: 'Coverage for medical expenses before and after hospitalization',
    },
    {
      icon: CheckCircle,
      title: 'Tax Benefits',
      description: 'Save taxes under Section 80D of Income Tax Act',
    },
  ];

  const faqs = [
    {
      question: 'What is covered under medical insurance?',
      answer: 'Medical insurance covers hospitalization expenses, pre and post-hospitalization costs (30-60 days), ambulance charges, daycare procedures, room rent, ICU charges, surgeon fees, and prescribed medicines. Most plans also cover diagnostic tests and health check-ups.'
    },
    {
      question: 'Are pre-existing diseases covered?',
      answer: 'Pre-existing diseases are covered after a waiting period, typically 2-4 years depending on the policy. Some insurers offer plans with reduced waiting periods of 1-2 years for an additional premium. Conditions like diabetes, hypertension, and thyroid fall under this category.'
    },
    {
      question: 'How does cashless treatment work?',
      answer: 'For cashless treatment, visit a network hospital, show your health card, and get approval from the insurance company. The hospital directly settles the bill with the insurer. You only pay for excluded items or amounts above the sum insured.'
    },
    {
      question: 'What is the waiting period for claims?',
      answer: 'Initial waiting period: 30 days for illnesses (not applicable for accidents)\\nPre-existing diseases: 2-4 years\\nSpecific diseases (hernia, cataract, etc.): 1-2 years\\nMaternity coverage: 9 months to 4 years'
    },
    {
      question: 'What factors affect my medical insurance premium?',
      answer: 'Age (higher age = higher premium), sum insured amount, individual vs family floater, medical history, lifestyle habits (smoking/drinking), location (metro vs non-metro), and chosen add-ons affect the premium. Women typically get lower premiums than men.'
    },
    {
      question: 'Can I claim medical insurance for COVID-19 treatment?',
      answer: 'Yes, COVID-19 treatment is covered under medical insurance as it is classified as an illness. Both hospitalization and home treatment (if recommended by a doctor) are typically covered. Check your policy for specific terms.'
    }
  ];

  const coveredExpenses = [
    'Doctor consultation fees',
    'Hospital room charges',
    'Surgery and operation costs',
    'Medical tests and diagnostics',
    'Medicines and pharmacy bills',
    'ICU and CCU charges',
    'Pre-hospitalization expenses',
    'Post-hospitalization expenses',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Stethoscope className="size-16 mx-auto mb-6" />
            <h1 className="mb-4">Medical Insurance</h1>
            <p className="text-xl text-green-100 mb-8">
              Comprehensive healthcare coverage for all your medical expenses. Protect yourself and your family from rising healthcare costs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/apply-health">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/calculator">Calculate Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is Medical Insurance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">What is Medical Insurance?</h2>
            <p className="text-gray-700 mb-4">
              Medical insurance, also known as health insurance, is a type of insurance coverage that provides financial protection against medical expenses incurred due to illness or accidents. When an insured person needs medical treatment, the insurance company provides coverage for expenses such as doctor fees, hospital fees, medicine costs, and other related medical bills.
            </p>
            <p className="text-gray-700 mb-4">
              Under this health care cover, you can get cashless treatment at network hospitals or claim reimbursement for treatments taken at non-network facilities. The policy covers hospitalization expenses, pre and post-hospitalization costs, day care procedures, and in some cases, even domiciliary hospitalization.
            </p>
            <p className="text-gray-700">
              Medical insurance is essential in today's world where healthcare costs are rising rapidly. It ensures that you and your family receive quality medical care without worrying about the financial burden.
            </p>
          </div>
        </div>
      </section>

      {/* Covered Expenses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">What's Covered?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coveredExpenses.map((expense, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                  <span>{expense}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Medical Insurance Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from comprehensive health insurance plans tailored for individuals, families, and senior citizens.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">No medical insurance products available</p>
              </div>
            ) : (
              products.map((product) => {
                const plans = productPlans[product.id] || [];
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle>{product.productName}</CardTitle>
                        <Badge variant="secondary">Best Value</Badge>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
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
                                const annualPremium = plan.basePremiumAnnual;
                                return (
                                  <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-transparent hover:border-green-100 hover:bg-green-50/50 transition-all">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                                        <Shield className="size-4 text-green-600" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-semibold text-gray-900">{plan.planName}</span>
                                          {plan.isPopular && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Popular</Badge>}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Coverage: <span className="font-medium text-gray-700">${(plan.coverageAmount || 0).toLocaleString()}</span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-green-700">
                                        ${Number(annualPremium).toLocaleString()}
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
                            <Link to={`/medical-insurance/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button className="flex-1" asChild>
                            <Link to={`/apply-health?productId=${product.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                        </div>
                        <Button className="w-full" variant="outline" asChild>
                          <Link to={`/medical-insurance/${product.id}#plans`}>
                            <Calculator className="size-4 mr-2" />
                            Get Quote
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Comparison Table */}
          {!loading && products.length > 1 && (
            <ComparisonTable products={products} productType="Medical" />
          )}
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Eligibility Criteria
            </h2>
            <p className="text-lg text-gray-600">
              Check if you meet the requirements for medical insurance
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Age Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Individual plans: 18-65 years</li>
                  <li>• Family floater: 18-65 years for adults</li>
                  <li>• Dependent children: 91 days to 25 years</li>
                  <li>• Senior citizen plans: 60+ years</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Health Declaration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete health questionnaire</li>
                  <li>• Declare pre-existing conditions</li>
                  <li>• Medical tests for higher coverage</li>
                  <li>• Recent medical reports may be required</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Documents Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Identity proof (Aadhaar/PAN/Passport)</li>
                  <li>• Address proof (Utility bill/Aadhaar)</li>
                  <li>• Age proof (Birth certificate/Aadhaar)</li>
                  <li>• Passport-size photographs</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Exclusions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Intentional self-injury</li>
                  <li>• Cosmetic treatments (unless medically necessary)</li>
                  <li>• War/nuclear weapons injuries</li>
                  <li>• Experimental treatments</li>
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
              Find answers to common questions about medical insurance
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Protect Your Health Today</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Don't let medical expenses burden you. Get comprehensive health insurance coverage now.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/apply-health">Apply Now</Link>
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




