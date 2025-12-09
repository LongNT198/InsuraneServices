import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Badge } from '../../shared/components/ui/badge';
import { Heart, Stethoscope, Car, Home, Download, CreditCard, FileText, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/tabs';
import { applicationService } from '../../shared/api/services/applicationService';
import { Link } from 'react-router-dom';

export function Policies() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await applicationService.getApplications();
      if (response.success) {
        setApplications(response.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Submitted': { variant: 'default', icon: Clock, color: 'text-blue-500' },
      'Under Review': { variant: 'default', icon: Clock, color: 'text-yellow-500' },
      'Approved': { variant: 'success', icon: CheckCircle, color: 'text-green-500' },
      'Rejected': { variant: 'destructive', icon: XCircle, color: 'text-red-500' },
    };

    const config = statusConfig[status] || statusConfig['Submitted'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="size-3" />
        {status}
      </Badge>
    );
  };

  // Mock policy data
  const policies = [
    {
      id: '1',
      type: 'Life Insurance',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      policyNumber: 'LI-2024-0001',
      planName: 'Term Life Plus',
      premium: 5000,
      coverage: 1000000,
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2044-01-15',
      nextDueDate: '2025-12-22',
      nominee: 'Jane Doe',
      premiumsPaid: 12,
      totalPremiums: 240,
    },
    {
      id: '2',
      type: 'Medical Insurance',
      icon: Stethoscope,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      policyNumber: 'MI-2024-0042',
      planName: 'Family Health Shield',
      premium: 15000,
      coverage: 500000,
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      nextDueDate: '2025-11-30',
      coveredMembers: 4,
      premiumsPaid: 9,
      totalPremiums: 12,
    },
    {
      id: '3',
      type: 'Motor Insurance',
      icon: Car,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      policyNumber: 'MI-2024-0156',
      planName: 'Comprehensive Auto Cover',
      premium: 12000,
      coverage: 800000,
      status: 'Due',
      startDate: '2024-06-15',
      endDate: '2025-06-15',
      nextDueDate: '2024-12-15',
      vehicleNumber: 'MH-01-AB-1234',
      premiumsPaid: 6,
      totalPremiums: 12,
    },
  ];

  const activePolicies = policies.filter(p => p.status === 'Active');
  const duePolicies = policies.filter(p => p.status === 'Due');

  const ApplicationCard = ({ app }) => {
    const getIcon = (productType) => {
      switch (productType) {
        case 'Life': return Heart;
        case 'Medical': return Stethoscope;
        case 'Motor': return Car;
        case 'Home': return Home;
        default: return FileText;
      }
    };

    const getColor = (productType) => {
      switch (productType) {
        case 'Life': return { text: 'text-red-500', bg: 'bg-red-50' };
        case 'Medical': return { text: 'text-green-500', bg: 'bg-green-50' };
        case 'Motor': return { text: 'text-blue-500', bg: 'bg-blue-50' };
        case 'Home': return { text: 'text-orange-500', bg: 'bg-orange-50' };
        default: return { text: 'text-gray-500', bg: 'bg-gray-50' };
      }
    };

    const Icon = getIcon(app.product?.productType);
    const colors = getColor(app.product?.productType);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`${colors.bg} ${colors.text} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{app.product?.productName || 'Insurance Application'}</CardTitle>
                  <CardDescription className="text-xs">{app.applicationNumber}</CardDescription>
                </div>
              </div>
            </div>
            {getStatusBadge(app.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Coverage Amount</p>
                <p className="font-semibold">₹{app.coverageAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="font-semibold">₹{app.premiumAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Term</p>
                <p>{app.termYears} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-sm">{new Date(app.submittedAt || app.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {app.reviewNotes && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Review Notes:</strong> {app.reviewNotes}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={`/application/${app.id}`}>
                  <Eye className="size-4 mr-1" />
                  View Details
                </Link>
              </Button>

              {app.status === 'Approved' && (
                <Button size="sm" className="flex-1">
                  <CreditCard className="size-4 mr-1" />
                  Pay Premium
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PolicyCard = ({ policy }) => {
    const Icon = policy.icon;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`${policy.bgColor} ${policy.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{policy.type}</CardTitle>
                  <CardDescription className="text-xs">{policy.policyNumber}</CardDescription>
                </div>
              </div>
            </div>
            <Badge variant={policy.status === 'Active' ? 'secondary' : 'destructive'}>
              {policy.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Plan Name</p>
              <p className="font-semibold">{policy.planName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Premium (Annual)</p>
                <p>₹{policy.premium.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coverage</p>
                <p>₹{policy.coverage.toLocaleString()}</p>
              </div>
            </div>

            {policy.status === 'Due' && (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800 font-semibold">Payment Due</p>
                <p className="text-xs text-red-600">Next Due: {new Date(policy.nextDueDate).toLocaleDateString()}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedPolicy(policy)}>
                    <Eye className="size-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Policy Details</DialogTitle>
                    <DialogDescription>{policy.policyNumber}</DialogDescription>
                  </DialogHeader>
                  {selectedPolicy && <PolicyDetails policy={selectedPolicy} />}
                </DialogContent>
              </Dialog>

              <Button size="sm" variant="outline" className="flex-1">
                <Download className="size-4 mr-1" />
                Download
              </Button>

              {policy.status === 'Due' ? (
                <Button size="sm" className="flex-1">
                  <CreditCard className="size-4 mr-1" />
                  Pay Now
                </Button>
              ) : (
                <Button size="sm" variant="secondary" className="flex-1">
                  <FileText className="size-4 mr-1" />
                  Claim
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PolicyDetails = ({ policy }) => {
    const Icon = policy.icon;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`${policy.bgColor} ${policy.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
            <Icon className="size-6" />
          </div>
          <div>
            <h3>{policy.planName}</h3>
            <p className="text-sm text-gray-600">{policy.type}</p>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Policy Number</p>
                <p className="font-semibold">{policy.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={policy.status === 'Active' ? 'secondary' : 'destructive'}>
                  {policy.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p>{new Date(policy.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p>{new Date(policy.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Due Date</p>
                <p>{new Date(policy.nextDueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Premiums Paid</p>
                <p>{policy.premiumsPaid} / {policy.totalPremiums}</p>
              </div>
            </div>

            {policy.nominee && (
              <div>
                <p className="text-sm text-gray-600">Nominee</p>
                <p className="font-semibold">{policy.nominee}</p>
              </div>
            )}

            {policy.vehicleNumber && (
              <div>
                <p className="text-sm text-gray-600">Vehicle Number</p>
                <p className="font-semibold">{policy.vehicleNumber}</p>
              </div>
            )}

            {policy.coveredMembers && (
              <div>
                <p className="text-sm text-gray-600">Covered Members</p>
                <p className="font-semibold">{policy.coveredMembers} family members</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="coverage" className="space-y-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Coverage Amount</p>
              <p className="text-2xl text-blue-600">₹{policy.coverage.toLocaleString()}</p>
            </div>

            <div>
              <p className="font-semibold mb-2">What's Covered</p>
              <ul className="space-y-2">
                {policy.type === 'Life Insurance' && (
                  <>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Death benefit to nominee</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Accidental death coverage</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Terminal illness benefit</span>
                    </li>
                  </>
                )}
                {policy.type === 'Medical Insurance' && (
                  <>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Hospitalization expenses</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Pre & post hospitalization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Day care procedures</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Ambulance charges</span>
                    </li>
                  </>
                )}
                {policy.type === 'Motor Insurance' && (
                  <>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Own damage coverage</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Third party liability</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Theft protection</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Natural calamities</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Annual Premium</p>
                <p className="text-xl">₹{policy.premium.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-xl">₹{(policy.premium * policy.premiumsPaid / 12).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-3">Payment History</p>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold">Premium Payment</p>
                      <p className="text-xs text-gray-600">
                        {new Date(2024, 10 - i, 15).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{Math.round(policy.premium / 12).toLocaleString()}</p>
                      <Badge variant="secondary" className="text-xs">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full">
              <CreditCard className="size-4 mr-2" />
              Pay Next Premium
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">My Insurance</h1>
        <p className="text-gray-600">View and manage your policies and applications</p>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="policies">Policies ({policies.length})</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          {loadingApplications ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Loading applications...
              </CardContent>
            </Card>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any insurance applications.</p>
                <Button asChild>
                  <Link to="/calculator">Calculate Premium & Apply</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Policies ({policies.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activePolicies.length})</TabsTrigger>
              <TabsTrigger value="due">Due ({duePolicies.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="due" className="space-y-6">
              {duePolicies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {duePolicies.map(policy => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">No policies with pending payments</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}



