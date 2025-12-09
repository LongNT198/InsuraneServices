import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Textarea } from '../../shared/components/ui/textarea';
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, Video, Send } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shared/components/ui/accordion';
import { Badge } from '../../shared/components/ui/badge';

export function Support() {
  const [message, setMessage] = useState('');
  const [ticket, setTicket] = useState({
    subject: '',
    category: '',
    description: '',
  });

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'How do I file an insurance claim?',
          a: 'To file a claim, navigate to the Claims section in your dashboard, click "File New Claim", select your policy, provide incident details, and upload supporting documents. Our team will review your claim within 2-3 business days.',
        },
        {
          q: 'How long does claim processing take?',
          a: 'Claim processing typically takes 7-14 business days from the date of submission, depending on the complexity and completeness of documentation. Simple claims may be processed faster.',
        },
        {
          q: 'Can I update my policy details online?',
          a: 'Yes, you can update most policy details through your dashboard. Go to Profile > Personal Information and click Edit. Some changes may require verification.',
        },
      ],
    },
    {
      category: 'Premium & Payments',
      questions: [
        {
          q: 'What payment methods are accepted?',
          a: 'We accept credit/debit cards, net banking, UPI, and digital wallets. You can also set up auto-debit for hassle-free premium payments.',
        },
        {
          q: 'What happens if I miss a premium payment?',
          a: 'You have a grace period of 30 days for monthly premiums and 90 days for annual premiums. If payment is not received within the grace period, your policy may lapse.',
        },
        {
          q: 'Can I change my premium payment frequency?',
          a: 'Yes, you can change from monthly to annual or vice versa. Contact our support team or submit a request through your dashboard.',
        },
      ],
    },
    {
      category: 'Policies',
      questions: [
        {
          q: 'How do I renew my policy?',
          a: 'Policies can be renewed online through your dashboard 45 days before expiry. You will also receive email and SMS reminders. Click on the policy and select "Renew Now".',
        },
        {
          q: 'Can I surrender my policy before maturity?',
          a: 'Yes, most policies can be surrendered after completing 3 years. However, surrender charges will apply and you will receive the surrender value, which is typically less than premiums paid.',
        },
        {
          q: 'How do I add a nominee to my policy?',
          a: 'Go to your policy details, click "Manage Nominees", and add nominee information. You can add or update nominees at any time during the policy term.',
        },
      ],
    },
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: '1-800-INSURANCE',
      availability: '24/7 Available',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@securelife.com',
      availability: 'Response in 24 hours',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with an agent',
      availability: 'Mon-Sat, 9 AM - 8 PM',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Video,
      title: 'Video Call',
      description: 'Schedule a video call',
      availability: 'Mon-Fri, 10 AM - 6 PM',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentTickets = [
    {
      id: 'TKT-2024-001',
      subject: 'Premium payment issue',
      status: 'Resolved',
      date: '2024-11-18',
    },
    {
      id: 'TKT-2024-002',
      subject: 'Policy document request',
      status: 'In Progress',
      date: '2024-11-20',
    },
  ];

  const handleSendMessage = () => {
    // In real app, this would send to backend
    alert('Message sent! Our team will respond shortly.');
    setMessage('');
  };

  const handleSubmitTicket = () => {
    // In real app, this would submit to backend
    alert('Support ticket created successfully! Ticket ID: TKT-2024-003');
    setTicket({ subject: '', category: '', description: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="size-12 text-blue-600 mx-auto mb-4" />
          <h1 className="mb-2">Help & Support</h1>
          <p className="text-gray-600">We're here to help you with any questions or concerns</p>
        </div>

        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className={`${channel.bgColor} ${channel.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <channel.icon className="size-6" />
                </div>
                <h3 className="mb-1">{channel.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="size-3" />
                  {channel.availability}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="size-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Create Support Ticket */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
                <CardDescription>For detailed issues that require follow-up</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticket.subject}
                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full border rounded-md p-2"
                    value={ticket.category}
                    onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    <option value="claims">Claims</option>
                    <option value="payment">Payment Issues</option>
                    <option value="policy">Policy Questions</option>
                    <option value="technical">Technical Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your issue..."
                    rows={4}
                    value={ticket.description}
                    onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleSubmitTicket} className="w-full">
                  <FileText className="size-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold">{ticket.id}</p>
                      <Badge variant={ticket.status === 'Resolved' ? 'default' : 'secondary'}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">{new Date(ticket.date).toLocaleDateString()}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                      View Details →
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="size-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="size-4 mr-2" />
                  Call Us Now
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="size-4 mr-2" />
                  Schedule Video Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="mb-6 last:mb-0">
                <h3 className="mb-4">{category.category}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${catIndex}-${faqIndex}`}>
                      <AccordionTrigger>{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



