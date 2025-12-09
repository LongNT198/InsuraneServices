import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Amit Sharma',
      role: 'Business Owner',
      location: 'Mumbai',
      rating: 5,
      text: 'SecureLife made the entire insurance process so simple. Their team helped me understand everything clearly, and the claim settlement was incredibly fast. Highly recommended!',
      policyType: 'Life Insurance',
    },
    {
      id: 2,
      name: 'Priya Malhotra',
      role: 'Software Engineer',
      location: 'Bangalore',
      rating: 5,
      text: 'I was worried about medical emergencies, but their health insurance gave me complete peace of mind. The cashless hospitalization feature worked flawlessly when I needed it.',
      policyType: 'Medical Insurance',
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      role: 'Marketing Manager',
      location: 'Delhi',
      rating: 5,
      text: 'After my car accident, I was stressed about the repair costs. SecureLife processed my claim within 48 hours. Their customer support is outstanding!',
      policyType: 'Motor Insurance',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'Teacher',
      location: 'Hyderabad',
      rating: 5,
      text: 'Best decision to insure my home with SecureLife. When floods damaged my property, they covered everything without any hassle. Truly trustworthy!',
      policyType: 'Home Insurance',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Entrepreneur',
      location: 'Pune',
      rating: 5,
      text: 'The premium calculator helped me choose the perfect plan for my family. The loan facility against my policy was a lifesaver during a financial crunch.',
      policyType: 'Life Insurance',
    },
    {
      id: 6,
      name: 'Kavita Patel',
      role: 'Doctor',
      location: 'Ahmedabad',
      rating: 5,
      text: 'As a doctor, I understand the importance of good insurance. SecureLife offers comprehensive coverage at reasonable prices. Their claim settlement ratio is impressive!',
      policyType: 'Medical Insurance',
    },
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their insurance needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials(testimonial.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <Quote className="size-8 text-blue-200" />
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Policy: <span className="font-semibold text-blue-600">{testimonial.policyType}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">50,000+</p>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">98%</p>
            <p className="text-gray-600">Claim Settlement</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">4.8/5</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">24/7</p>
            <p className="text-gray-600">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}


