import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Contact() {
  const offices = [
    {
      name: 'Head Office',
      address: '123 Insurance Plaza, Financial District, New York, NY 10004',
      phone: '1-800-INSURANCE',
      email: 'info@securelife.com',
      hours: 'Mon-Fri: 9 AM - 8 PM, Sat: 10 AM - 6 PM',
    },
    {
      name: 'Regional Office - West',
      address: '456 Market Street, San Francisco, CA 94102',
      phone: '1-800-INS-WEST',
      email: 'west@securelife.com',
      hours: 'Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM',
    },
    {
      name: 'Regional Office - South',
      address: '789 Peachtree Road, Atlanta, GA 30308',
      phone: '1-800-INS-SOUTH',
      email: 'south@securelife.com',
      hours: 'Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM',
    },
  ];

  const departments = [
    { name: 'Sales & New Policies', email: 'sales@securelife.com', phone: '1-800-INS-SALE' },
    { name: 'Claims Department', email: 'claims@securelife.com', phone: '1-800-INS-CLAM' },
    { name: 'Customer Service', email: 'support@securelife.com', phone: '1-800-INS-HELP' },
    { name: 'Policy Renewals', email: 'renewals@securelife.com', phone: '1-800-INS-RENW' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you within 24 hours.');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message here..." rows={5} required />
                  </div>

                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">1-800-INSURANCE</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">support@securelife.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Head Office</p>
                      <p className="text-gray-600">123 Insurance Plaza</p>
                      <p className="text-gray-600">Financial District, NY 10004</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Business Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9 AM - 8 PM</p>
                      <p className="text-gray-600">Saturday: 10 AM - 6 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>Stay connected on social media</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon">
                      <Facebook className="size-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="size-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Linkedin className="size-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Instagram className="size-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Contact by Department</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {departments.map((dept, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-gray-500" />
                      <span>{dept.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-gray-500" />
                      <span>{dept.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-8 text-center">Our Offices</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5 text-blue-600" />
                      {office.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="text-sm">{office.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="text-sm">{office.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-sm">{office.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Hours</p>
                      <p className="text-sm">{office.hours}</p>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-8 text-center">Find Us on Map</h2>
            <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Interactive Map Would Be Here</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




