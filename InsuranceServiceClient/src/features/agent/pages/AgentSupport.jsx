import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Textarea } from '../../shared/components/ui/textarea';
import { Avatar, AvatarFallback } from '../../shared/components/ui/avatar';
import { Badge } from '../../shared/components/ui/badge';
import { Star, MapPin, Phone, Mail, Calendar, MessageCircle, Video, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/tabs';

export function AgentSupport() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [meetingType, setMeetingType] = useState('call');

  const agents = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      title: 'Senior Insurance Advisor',
      rating: 4.9,
      reviews: 156,
      experience: '12 years',
      location: 'Mumbai, Maharashtra',
      specializations: ['Life Insurance', 'Health Insurance', 'Investment Plans'],
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@securelife.com',
      languages: ['English', 'Hindi', 'Marathi'],
      availability: 'Mon-Sat, 9 AM - 6 PM',
      totalClients: 450,
      claimSuccess: '98%',
      badge: 'Platinum',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      title: 'Insurance Consultant',
      rating: 4.8,
      reviews: 124,
      experience: '8 years',
      location: 'Delhi NCR',
      specializations: ['Motor Insurance', 'Home Insurance', 'Travel Insurance'],
      phone: '+91 98765 43211',
      email: 'priya.sharma@securelife.com',
      languages: ['English', 'Hindi', 'Punjabi'],
      availability: 'Mon-Fri, 10 AM - 7 PM',
      totalClients: 320,
      claimSuccess: '96%',
      badge: 'Gold',
    },
    {
      id: '3',
      name: 'Arun Patel',
      title: 'Financial Advisor',
      rating: 4.7,
      reviews: 98,
      experience: '10 years',
      location: 'Bangalore, Karnataka',
      specializations: ['Life Insurance', 'Retirement Planning', 'Tax Saving'],
      phone: '+91 98765 43212',
      email: 'arun.patel@securelife.com',
      languages: ['English', 'Hindi', 'Kannada'],
      availability: 'Mon-Sat, 9 AM - 8 PM',
      totalClients: 380,
      claimSuccess: '97%',
      badge: 'Platinum',
    },
    {
      id: '4',
      name: 'Meera Reddy',
      title: 'Insurance Advisor',
      rating: 4.9,
      reviews: 145,
      experience: '15 years',
      location: 'Hyderabad, Telangana',
      specializations: ['Health Insurance', 'Critical Illness', 'Senior Citizen Plans'],
      phone: '+91 98765 43213',
      email: 'meera.reddy@securelife.com',
      languages: ['English', 'Telugu', 'Hindi'],
      availability: 'Mon-Sat, 9 AM - 6 PM',
      totalClients: 520,
      claimSuccess: '99%',
      badge: 'Platinum',
    },
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'Gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const handleBookAppointment = () => {
    alert('Appointment request sent! Our agent will contact you shortly.');
    setSelectedAgent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mb-2">Talk to Our Insurance Experts</h1>
          <p className="text-gray-600">Get personalized guidance from certified insurance advisors</p>
        </div>

        {!selectedAgent ? (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Agents</TabsTrigger>
              <TabsTrigger value="platinum">Platinum</TabsTrigger>
              <TabsTrigger value="gold">Gold</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="size-16">
                          <AvatarFallback className="text-lg bg-blue-600 text-white">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="mb-1">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.title}</p>
                            </div>
                            <Badge className={getBadgeColor(agent.badge)}>
                              <Award className="size-3 mr-1" />
                              {agent.badge}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{agent.rating}</span>
                            <span className="text-sm text-gray-500">({agent.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Experience</p>
                          <p className="font-semibold">{agent.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Clients Served</p>
                          <p className="font-semibold">{agent.totalClients}+</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Claim Success</p>
                          <p className="font-semibold text-green-600">{agent.claimSuccess}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Languages</p>
                          <p className="font-semibold">{agent.languages.length}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Specializations</p>
                        <div className="flex flex-wrap gap-2">
                          {agent.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="size-4" />
                        {agent.location}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => setSelectedAgent(agent.id)} 
                          className="flex-1"
                        >
                          Book Appointment
                        </Button>
                        <Button variant="outline" size="icon">
                          <MessageCircle className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="platinum">
              <div className="grid md:grid-cols-2 gap-6">
                {agents.filter(a => a.badge === 'Platinum').map((agent) => (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow border-2 border-gray-300">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="size-16">
                          <AvatarFallback className="text-lg bg-blue-600 text-white">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="mb-1">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.title}</p>
                            </div>
                            <Badge className={getBadgeColor(agent.badge)}>
                              <Award className="size-3 mr-1" />
                              {agent.badge}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{agent.rating}</span>
                            <span className="text-sm text-gray-500">({agent.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Experience</p>
                          <p className="font-semibold">{agent.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Clients Served</p>
                          <p className="font-semibold">{agent.totalClients}+</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Claim Success</p>
                          <p className="font-semibold text-green-600">{agent.claimSuccess}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Languages</p>
                          <p className="font-semibold">{agent.languages.length}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Specializations</p>
                        <div className="flex flex-wrap gap-2">
                          {agent.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={() => setSelectedAgent(agent.id)} 
                        className="w-full"
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gold">
              <div className="grid md:grid-cols-2 gap-6">
                {agents.filter(a => a.badge === 'Gold').map((agent) => (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="size-16">
                          <AvatarFallback className="text-lg bg-blue-600 text-white">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="mb-1">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.title}</p>
                            </div>
                            <Badge className={getBadgeColor(agent.badge)}>
                              <Award className="size-3 mr-1" />
                              {agent.badge}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{agent.rating}</span>
                            <span className="text-sm text-gray-500">({agent.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setSelectedAgent(agent.id)} 
                        className="w-full"
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <Button variant="outline" onClick={() => setSelectedAgent(null)}>
                ← Back to Agents
              </Button>
              <div className="flex items-start gap-4 mt-4">
                <Avatar className="size-20">
                  <AvatarFallback className="text-xl bg-blue-600 text-white">
                    {agents.find(a => a.id === selectedAgent)?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2>{agents.find(a => a.id === selectedAgent)?.name}</h2>
                  <p className="text-gray-600">{agents.find(a => a.id === selectedAgent)?.title}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <Label>Meeting Type</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setMeetingType('call')}
                      className={`border rounded-lg p-4 text-center transition ${
                        meetingType === 'call' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
                      }`}
                    >
                      <Phone className="size-6 mx-auto mb-2" />
                      <p className="font-semibold">Phone Call</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeetingType('video')}
                      className={`border rounded-lg p-4 text-center transition ${
                        meetingType === 'video' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
                      }`}
                    >
                      <Video className="size-6 mx-auto mb-2" />
                      <p className="font-semibold">Video Call</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeetingType('inperson')}
                      className={`border rounded-lg p-4 text-center transition ${
                        meetingType === 'inperson' ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
                      }`}
                    >
                      <MapPin className="size-6 mx-auto mb-2" />
                      <p className="font-semibold">In Person</p>
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Your Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what you need help with..."
                    rows={4}
                  />
                </div>

                <Button type="button" onClick={handleBookAppointment} className="w-full" size="lg">
                  <Calendar className="size-4 mr-2" />
                  Confirm Appointment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



