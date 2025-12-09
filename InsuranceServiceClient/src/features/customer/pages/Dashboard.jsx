import { useAuth } from '../../../core/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Stethoscope, Car, Home, Calculator, Wallet, FileText, TrendingUp, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '../../shared/components/ui/badge';
import { useEffect, useState } from 'react';
import { applicationService } from '../../shared/api/services/applicationService';

export function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications();
      if (response.success) {
        setApplications(response.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
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

  // Mock policy data - in real app, this would come from backend
  const mockPolicies = [
    {
      id: '1',
      type: 'Life Insurance',
      policyNumber: 'LI-2024-0001',
      premium: 5000,
      coverage: 1000000,
      status: 'Active',
      nextDueDate: '2025-12-22',
    },
    {
      id: '2',
      type: 'Medical Insurance',
      policyNumber: 'MI-2024-0042',
      premium: 15000,
      coverage: 500000,
      status: 'Active',
      nextDueDate: '2025-11-30',
    },
  ];

  const quickActions = [
    {
      icon: Calculator,
      title: 'Calculate Premium',
      description: 'Get instant quotes',
      link: '/calculator',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FileText,
      title: 'My Policies',
      description: 'View all policies',
      link: '/policies',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Wallet,
      title: 'Loan Facility',
      description: 'Apply for loans',
      link: '/loan-facility',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: TrendingUp,
      title: 'Schemes',
      description: 'Explore new schemes',
      link: '/schemes',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Manage your insurance policies and explore new options.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className={`${action.bgColor} ${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="size-6" />
                </div>
                <h3 className="mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Policies */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Applications</h2>
          <Button variant="outline" asChild>
            <Link to="/policies">View All Applications</Link>
          </Button>
        </div>
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Loading applications...
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <FileText className="size-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-2">No applications yet</p>
              <p className="text-sm">Start by calculating your premium or exploring our insurance schemes.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.slice(0, 3).map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {app.product?.productName || 'Insurance Application'}
                        {getStatusBadge(app.status)}
                      </CardTitle>
                      <CardDescription>
                        Application No: {app.applicationNumber} •
                        {app.product?.productType && ` ${app.product.productType}`}
                      </CardDescription>
                    </div>
                    {app.product?.productType === 'Life' && <Heart className="size-6 text-red-500" />}
                    {app.product?.productType === 'Medical' && <Stethoscope className="size-6 text-green-500" />}
                    {app.product?.productType === 'Motor' && <Car className="size-6 text-blue-500" />}
                    {app.product?.productType === 'Home' && <Home className="size-6 text-orange-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Coverage Amount</p>
                      <p className="font-medium">₹{app.coverageAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Premium</p>
                      <p className="font-medium">₹{app.premiumAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Term</p>
                      <p className="font-medium">{app.termYears} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-medium">{new Date(app.submittedAt || app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {app.reviewNotes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Review Notes:</strong> {app.reviewNotes}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/application/${app.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Policies Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2>Active Policies</h2>
          <Button variant="outline" asChild>
            <Link to="/policies">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {mockPolicies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {policy.type}
                      <Badge variant="secondary">{policy.status}</Badge>
                    </CardTitle>
                    <CardDescription>Policy No: {policy.policyNumber}</CardDescription>
                  </div>
                  {policy.type === 'Life Insurance' && <Heart className="size-6 text-red-500" />}
                  {policy.type === 'Medical Insurance' && <Stethoscope className="size-6 text-green-500" />}
                  {policy.type === 'Motor Insurance' && <Car className="size-6 text-blue-500" />}
                  {policy.type === 'Home Insurance' && <Home className="size-6 text-orange-500" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Premium (Annual)</p>
                    <p>₹{policy.premium.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coverage</p>
                    <p>₹{policy.coverage.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Due Date</p>
                    <p>{new Date(policy.nextDueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm">Pay Premium</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p>{user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p>{user?.registeredDate ? new Date(user.registeredDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



