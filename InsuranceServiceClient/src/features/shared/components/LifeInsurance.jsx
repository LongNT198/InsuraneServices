import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import { Heart, Shield, TrendingUp, Users, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import axios from '../api/axios';
import { ComparisonTable } from './insurance/ComparisonTable';
import { PremiumCalculator } from './insurance/PremiumCalculator';
import { FAQSection } from './insurance/FAQSection';
import { MiniCalculator } from './insurance/MiniCalculator';
import plansService from '../api/services/plansService';

export function LifeInsurance() {
  const [products, setProducts] = useState([]);
  const [productPlans, setProductPlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 Loading Life Insurance products...');
        const response = await axios.get('/api/products');
        console.log('📦 API Response:', response);
        const allProducts = response.data || [];
        console.log('📊 All products:', allProducts.length);
        const lifeProducts = allProducts.filter(p => p.productType === 'Life');
        console.log('💼 Life products:', lifeProducts.length, lifeProducts);
        setProducts(lifeProducts);

        // Load plans for each product
        const plansData = {};
        for (const product of lifeProducts) {
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
      icon: Shield,
      title: 'Financial Security',
      description: 'Ensures financial protection for your family in case of unfortunate events',
    },
    {
      icon: Users,
      title: 'Family Protection',
      description: 'Provides financial support to your dependents when they need it most',
    },
    {
      icon: TrendingUp,
      title: 'Wealth Creation',
      description: 'Build wealth over time with savings and investment components',
    },
    {
      icon: CheckCircle,
      title: 'Tax Benefits',
      description: 'Save on taxes under Section 80C and 10(10D) of Income Tax Act',
    },
  ];

  const faqs = [
    {
      question: 'What are the different types of life insurance available?',
      answer: 'Term Life: Pure protection, no savings (most affordable)\nWhole Life: Lifetime coverage with cash value\nUniversal Life: Flexible premiums with investment\nEndowment: Savings + protection, pays at maturity or death\nPension/Retirement: Long-term savings for retirement income\nVariable Universal: Investment in multiple funds\nULIP: Unit-linked with stock market investment'
    },
    {
      question: 'What is the minimum and maximum age to buy life insurance?',
      answer: 'The minimum age is typically 18 years, and the maximum age varies by plan but usually ranges from 60-65 years for term plans and up to 75 years for whole life plans.'
    },
    {
      question: 'How much life insurance coverage do I need?',
      answer: 'A general rule is 10-15 times your annual income. Consider your debts, future expenses (children\'s education, marriage), and your family\'s lifestyle needs.'
    },
    {
      question: 'What is the difference between term and endowment insurance?',
      answer: 'Term insurance provides pure protection - pays only on death during the term, no maturity benefit, lowest premium. Endowment insurance combines protection and savings - pays on death OR at maturity, builds cash value, higher premium. Choose term for maximum coverage at low cost, endowment for savings goal.'
    },
    {
      question: 'What happens if I stop paying premiums?',
      answer: 'For term plans, the policy will lapse and coverage will stop. For investment-linked plans, you may get a surrender value after completing a minimum number of years (usually 3 years). Some policies offer a grace period of 30 days.'
    },
    {
      question: 'Are life insurance payouts taxable?',
      answer: 'Death benefits received by nominees are generally tax-free under Section 10(10D) of the Income Tax Act. However, if the annual premium exceeds 10% of the sum assured, tax benefits may not apply.'
    },
    {
      question: 'Can I have multiple life insurance policies?',
      answer: 'Yes, you can have multiple life insurance policies from different insurers. There is no legal limit on the number of policies you can own. However, insurers may assess your total coverage during underwriting.'
    },
    {
      question: 'What is the claim settlement process?',
      answer: 'Nominees need to inform the insurer, submit a claim form along with death certificate, policy documents, and KYC documents. The insurer verifies the claim and typically settles within 30 days if all documents are in order.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-pink-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="size-16 mx-auto mb-6" />
            <h1 className="mb-4">Life Insurance</h1>
            <p className="text-xl text-red-100 mb-8">
              Protect your loved ones with comprehensive life insurance coverage. Ensure their financial security even when you're not around.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/apply-life">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-red-600">
                <Link to="/calculator">Calculate Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is Life Insurance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">What is Life Insurance?</h2>
            <p className="text-gray-700 mb-4">
              Life insurance is a financial plan that provides protection to the insured and their family with financial coverage in case of any mishaps. It's a contract between the policyholder and the insurance company, where the insurer promises to pay a designated beneficiary a sum of money upon the death of the insured person.
            </p>
            <p className="text-gray-700 mb-4">
              To avail the benefits of a life insurance policy, the policyholder has to pay a monthly or annual premium to the insurer for a certain period of time. The premium amount depends on various factors including age, health condition, lifestyle, and the coverage amount chosen.
            </p>
            <p className="text-gray-700">
              Life insurance not only provides financial security to your loved ones but also helps in wealth creation, retirement planning, and offers tax benefits under various sections of the Income Tax Act.
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
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="size-8" />
                </div>
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Life Insurance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center">Types of Life Insurance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Term Life</CardTitle>
                <CardDescription>Pure Protection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Provides coverage for a specific term. Pays death benefit only if insured dies during the term. 
                  No maturity benefit. Most affordable option.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Best for:</strong> Maximum coverage at lowest cost
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Whole Life</CardTitle>
                <CardDescription>Lifetime Coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Covers you for entire lifetime. Builds cash value over time. Higher premiums but guaranteed 
                  payout and savings component.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Best for:</strong> Lifetime protection + wealth building
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Endowment</CardTitle>
                <CardDescription>Savings + Protection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Pays on death OR at maturity. Combines life cover with savings. Good for achieving 
                  financial goals like children's education.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Best for:</strong> Goal-based savings + insurance
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Universal Life</CardTitle>
                <CardDescription>Flexible Investment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Flexible premiums and death benefit. Investment component with market returns. 
                  Can adjust coverage as needs change.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Best for:</strong> Flexible coverage with investment
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Pension Plan</CardTitle>
                <CardDescription>Retirement Income</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Long-term savings for retirement. Provides regular pension after retirement age. 
                  Tax-efficient way to build retirement corpus.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Best for:</strong> Retirement planning
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">ULIP</CardTitle>
                <CardDescription>Market-Linked</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Unit-linked insurance with stock market investment. Higher returns potential but 
                  market risk. Lock-in period of 5 years.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Best for:</strong> Long-term wealth creation
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Life Insurance Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from a variety of life insurance plans designed to meet your specific needs and budget.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">No life insurance products available</p>
              </div>
            ) : (
              products.map((product) => {
                const plans = productPlans[product.id] || [];
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle>{product.productName}</CardTitle>
                        <Badge variant="secondary">Popular</Badge>
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
                                const monthlyPremium = plan.basePremiumMonthly || (plan.basePremiumAnnual / 12);
                                const annualPremium = plan.basePremiumAnnual;
                                console.log(`Plan ${plan.planCode}: Monthly=${monthlyPremium}, Annual=${annualPremium}`);
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
                            <Link to={`/life-insurance/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button className="flex-1" asChild>
                            <Link to={`/apply-life?productId=${product.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                        </div>
                        <MiniCalculator product={product} productType="Life" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
          
          {/* Comparison Table */}
          {!loading && products.length > 1 && (
            <ComparisonTable products={products} productType="Life" />
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Eligibility Criteria
            </h2>
            <p className="text-lg text-gray-600">
              Check if you meet the requirements for life insurance
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
                  <li>• Minimum age: 18 years</li>
                  <li>• Maximum age for term plans: 60-65 years</li>
                  <li>• Maximum age for whole life: 75 years</li>
                  <li>• Age proof required (Aadhaar, PAN, etc.)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Health & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Medical underwriting required</li>
                  <li>• Health questionnaire submission</li>
                  <li>• Medical tests for higher coverage</li>
                  <li>• Indian citizen or NRI status</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Income Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Salary slips (last 3 months)</li>
                  <li>• IT returns (last 2 years)</li>
                  <li>• Bank statements (last 6 months)</li>
                  <li>• For self-employed: Business proof</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Other Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Valid email address and phone number</li>
                  <li>• PAN card mandatory</li>
                  <li>• Address proof (Aadhaar/Passport/Utility bill)</li>
                  <li>• Nominee details required</li>
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
              Find answers to common questions about life insurance
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Secure Your Family's Future?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Get started with a life insurance plan today and ensure your loved ones are financially protected.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/apply-life">Apply Now</Link>
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




