import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Gift, Percent, Award, Star, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Schemes() {
  const newSchemes = [
    {
      icon: Gift,
      title: 'New Year Special 2025',
      category: 'Limited Offer',
      description: 'Get 20% discount on first year premium for all new life insurance policies purchased in January 2025.',
      benefits: [
        '20% premium discount',
        'No medical check-up required up to ₹50 lakhs',
        'Free rider benefits worth ₹25,000',
        'Instant policy issuance',
      ],
      validity: 'Valid till 31st January 2025',
      featured: true,
    },
    {
      icon: Award,
      title: 'Family Health Plus',
      category: 'Health Insurance',
      description: 'Comprehensive family health coverage with additional wellness benefits and preventive care.',
      benefits: [
        'Cover for up to 6 family members',
        'Annual health check-ups included',
        '10% discount on wellness programs',
        'Maternity and new born coverage',
      ],
      validity: 'Ongoing',
      featured: true,
    },
    {
      icon: Zap,
      title: 'Instant Motor Cover',
      category: 'Motor Insurance',
      description: 'Get instant motor insurance with zero paperwork and same-day policy issuance.',
      benefits: [
        'Instant policy in 5 minutes',
        'Zero documentation',
        '15% online discount',
        'Free roadside assistance',
      ],
      validity: 'Ongoing',
      featured: false,
    },
  ];

  const subsidiarySchemes = [
    {
      icon: Percent,
      title: 'Tax Saver Plan',
      description: 'Save up to ₹1.5 lakhs under Section 80C and get tax-free maturity benefits under Section 10(10D).',
      features: [
        'Tax deduction up to ₹1.5 lakhs',
        'Tax-free maturity benefits',
        'Guaranteed returns',
        'Life coverage included',
      ],
      eligibility: 'Age 18-65 years',
    },
    {
      icon: TrendingUp,
      title: 'Pension Plus Scheme',
      description: 'Secure your retirement with guaranteed pension income and life insurance coverage.',
      features: [
        'Guaranteed monthly pension',
        'Life coverage up to 75 years',
        'Immediate or deferred options',
        'Tax benefits available',
      ],
      eligibility: 'Age 40-65 years',
    },
    {
      icon: Star,
      title: 'Child Education Plan',
      description: 'Ensure your child\'s education with guaranteed payouts at key milestones.',
      features: [
        'Guaranteed payouts at 18, 20, 22 years',
        'Waiver of premium on parent\'s death',
        'Maturity benefit at 25 years',
        'Tax benefits under 80C',
      ],
      eligibility: 'Child age 0-15 years',
    },
    {
      icon: Gift,
      title: 'Women Special Plan',
      description: 'Exclusive insurance plan for women with added benefits and lower premiums.',
      features: [
        '15% lower premiums',
        'Critical illness coverage',
        'Maternity benefits',
        'Wellness program access',
      ],
      eligibility: 'Age 18-55 years',
    },
  ];

  const strategies = [
    {
      title: 'Diversified Investment Strategy',
      description: 'Combining traditional insurance with market-linked investments for optimal returns',
      points: [
        'Balance between security and growth',
        'Portfolio diversification across asset classes',
        'Risk management through professional fund management',
        'Flexibility to switch between funds',
      ],
    },
    {
      title: 'Goal-Based Planning',
      description: 'Align insurance products with life goals for comprehensive financial planning',
      points: [
        'Child education planning',
        'Retirement corpus building',
        'Wealth creation and preservation',
        'Emergency fund creation',
      ],
    },
    {
      title: 'Protection First Approach',
      description: 'Prioritizing adequate life coverage before investment-oriented products',
      points: [
        'Ensure adequate term coverage',
        'Critical illness protection',
        'Income replacement planning',
        'Debt protection coverage',
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <TrendingUp className="size-16 mx-auto mb-6" />
            <h1 className="mb-4">Latest Schemes & Strategies</h1>
            <p className="text-xl text-purple-100 mb-8">
              Explore our new insurance schemes, subsidiary plans, and investment strategies designed to maximize your benefits.
            </p>
          </div>
        </div>
      </section>

      {/* New Schemes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">New Launches</Badge>
            <h2 className="mb-4">Latest Insurance Schemes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our newest insurance products with exclusive benefits and competitive pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newSchemes.map((scheme, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow ${scheme.featured ? 'border-2 border-purple-500' : ''}`}>
                <CardHeader>
                  {scheme.featured && (
                    <Badge className="w-fit mb-2">Featured</Badge>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <scheme.icon className="size-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scheme.title}</CardTitle>
                      <p className="text-xs text-gray-600">{scheme.category}</p>
                    </div>
                  </div>
                  <CardDescription>{scheme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Key Benefits</p>
                      <ul className="space-y-2">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-600 mb-3">{scheme.validity}</p>
                      <Button className="w-full" asChild>
                        <Link to="/register">
                          Apply Now <ArrowRight className="size-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subsidiary Schemes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Subsidiary Schemes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore additional insurance schemes designed for specific needs and life stages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {subsidiarySchemes.map((scheme, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <scheme.icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scheme.title}</CardTitle>
                      <CardDescription>{scheme.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Features</p>
                      <ul className="space-y-1">
                        {scheme.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-600 mb-3">
                        <strong>Eligibility:</strong> {scheme.eligibility}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/calculator">Get Quote</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Strategies */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Our Investment Strategies</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Learn about our strategic approach to insurance and investment planning.
              </p>
            </div>

            <Tabs defaultValue="strategy-0" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="strategy-0">Diversified Investment</TabsTrigger>
                <TabsTrigger value="strategy-1">Goal-Based Planning</TabsTrigger>
                <TabsTrigger value="strategy-2">Protection First</TabsTrigger>
              </TabsList>

              {strategies.map((strategy, index) => (
                <TabsContent key={index} value={`strategy-${index}`} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{strategy.title}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {strategy.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="size-4" />
                            </div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Choose the right insurance scheme for your needs and start your journey to financial security.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
              <Link to="/calculator">Calculate Premium</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}




