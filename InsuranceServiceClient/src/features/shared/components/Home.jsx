import { Link } from 'react-router-dom';
import { Heart, Stethoscope, Car, Home as HomeIcon, Calculator, Wallet, Shield, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Testimonials } from '../components/Testimonials';

export function Home() {
  const insuranceTypes = [
    {
      icon: Heart,
      title: 'Life Insurance',
      description: 'Financial protection for your loved ones with comprehensive life coverage plans.',
      link: '/life-insurance',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Stethoscope,
      title: 'Medical Insurance',
      description: 'Complete healthcare coverage for medical expenses, hospitalization, and treatments.',
      link: '/medical-insurance',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Car,
      title: 'Motor Insurance',
      description: 'Protect your vehicle with comprehensive auto insurance coverage.',
      link: '/motor-insurance',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: HomeIcon,
      title: 'Home Insurance',
      description: 'Safeguard your home and belongings against unforeseen circumstances.',
      link: '/home-insurance',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const features = [
    {
      icon: Calculator,
      title: 'Premium Calculator',
      description: 'Calculate your insurance premium instantly with our easy-to-use calculator.',
    },
    {
      icon: Wallet,
      title: 'Loan Facility',
      description: 'Access loan facilities against your insurance policies with competitive rates.',
    },
    {
      icon: Shield,
      title: 'Secure Online Payments',
      description: 'Make premium payments securely through our encrypted payment gateway.',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Our dedicated team is available round the clock to assist you.',
    },
  ];

  const stats = [
    { label: 'Active Policies', value: '50,000+' },
    { label: 'Claims Settled', value: '95%' },
    { label: 'Years of Service', value: '25+' },
    { label: 'Customer Satisfaction', value: '4.8/5' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Secure Your Future with Comprehensive Insurance Solutions</h1>
            <p className="text-xl mb-8 text-blue-100">
              Protecting what matters most to you with reliable, affordable, and comprehensive insurance coverage.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/calculator">Calculate Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Insurance Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of insurance products designed to meet your specific needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`${type.bgColor} ${type.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <type.icon className="size-7" />
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={type.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose SecureLife?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive insurance services with features designed for your convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="size-8" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <TrendingUp className="size-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="mb-4">Latest Strategies & Subsidiary Schemes</h2>
                <p className="text-gray-700 mb-6">
                  Stay informed about our new investment strategies and subsidiary schemes designed to maximize your insurance benefits. We continuously update our offerings to provide you with the best returns and coverage options.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Benefit Plans</CardTitle>
                  <CardDescription>Save up to ₹1.5 lakhs under Section 80C</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pension Plus Scheme</CardTitle>
                  <CardDescription>Secure your retirement with guaranteed returns</CardDescription>
                </CardHeader>
              </Card>
            </div>
            <div className="text-center mt-6">
              <Button asChild>
                <Link to="/schemes">View All Schemes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Award className="size-16 mx-auto mb-6" />
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SecureLife Insurance for their protection needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Create Your Account Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}



