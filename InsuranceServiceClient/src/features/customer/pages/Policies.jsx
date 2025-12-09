import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import {
  Heart,
  Stethoscope,
  Car,
  Home,
  Download,
  CreditCard,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shared/components/ui/tabs";

import { applicationService } from "../../shared/api/services/applicationService";
import policyService from "../../shared/api/services/policyService";

export function Policies() {
  const navigate = useNavigate();

  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Applications
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  // Policies (REAL data from backend)
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  useEffect(() => {
    fetchApplications();
    fetchPolicies();
  }, []);

  // ==========================
  // 1. Load Applications
  // ==========================
  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await applicationService.getApplications();
      if (response.success) {
        setApplications(response.applications || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // ==========================
  // 2. Load Policies from API
  // ==========================
  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);
      const res = await policyService.getMyPolicies();
      if (res.success) {
        setPolicies(res.policies || []);
      } else {
        setPolicies([]);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      setPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  };

  // ==========================
  // Helper: Badge status Application
  // ==========================
  const getStatusBadge = (status) => {
    const statusConfig = {
      Submitted: { variant: "default", icon: Clock },
      "Under Review": { variant: "default", icon: Clock },
      Approved: { variant: "success", icon: CheckCircle },
      Rejected: { variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig["Submitted"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="size-3" />
        {status}
      </Badge>
    );
  };

  // ==========================
  // Helper: icon cho Application theo productType
  // ==========================
  const getAppIconAndColor = (productType) => {
    switch (productType) {
      case "Life":
        return { Icon: Heart, text: "text-red-500", bg: "bg-red-50" };
      case "Medical":
        return { Icon: Stethoscope, text: "text-green-500", bg: "bg-green-50" };
      case "Motor":
        return { Icon: Car, text: "text-blue-500", bg: "bg-blue-50" };
      case "Home":
        return { Icon: Home, text: "text-orange-500", bg: "bg-orange-50" };
      default:
        return { Icon: FileText, text: "text-gray-500", bg: "bg-gray-50" };
    }
  };

  // ==========================
  // Helper: icon cho Policy theo product.type
  // ==========================
  const getPolicyIcon = (type) => {
    switch (type) {
      case "Life":
      case "Life Insurance":
        return Heart;
      case "Medical":
      case "Health Insurance":
        return Stethoscope;
      case "Motor":
      case "Auto Insurance":
        return Car;
      case "Home":
      case "Home Insurance":
        return Home;
      default:
        return FileText;
    }
  };

  const getPolicyStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge variant="secondary">Active</Badge>;
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Activation
          </Badge>
        );
      case "Expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  // ==========================
  // Component: ApplicationCard
  // ==========================
  const ApplicationCard = ({ app }) => {
    const { Icon, text, bg } = getAppIconAndColor(app.product?.productType);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`${bg} ${text} w-10 h-10 rounded-lg flex items-center justify-center`}
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {app.product?.productName || "Insurance Application"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {app.applicationNumber}
                  </CardDescription>
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
                <p className="font-semibold">
                  {app.coverageAmount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="font-semibold">
                  {app.premiumAmount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Term</p>
                <p>{app.termYears} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-sm">
                  {new Date(
                    app.submittedAt || app.createdAt
                  ).toLocaleDateString()}
                </p>
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
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ==========================
  // Component: PolicyCard (data thật)
  // ==========================
  const PolicyCard = ({ policy }) => {
    const Icon = getPolicyIcon(policy.product?.type);

    const handlePayNow = () => {
      if (!policy.nextPayment) return;

      navigate("/payment-gateway", {
        state: {
          paymentId: policy.nextPayment.id,
          amount: policy.nextPayment.amount,
          purpose: `Premium payment for policy ${policy.policyNumber}`,
        },
      });
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gray-50 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {policy.product?.name || "Insurance Policy"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {policy.policyNumber}
                  </CardDescription>
                </div>
              </div>
            </div>
            {getPolicyStatusBadge(policy.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Coverage Amount</p>
                <p className="font-semibold">
                  {policy.coverageAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="font-semibold">
                  {policy.premium.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Frequency</p>
                <p>{policy.paymentFrequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Term</p>
                <p>{policy.termYears} years</p>
              </div>
            </div>

            {policy.nextPayment && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 font-semibold">
                  Next Payment:{" "}
                  {policy.nextPayment.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                {policy.nextPayment.dueDate && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Due date:{" "}
                    {new Date(policy.nextPayment.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {/* View details in Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedPolicy(policy)}
                  >
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

              {policy.nextPayment && policy.nextPayment.status === "Pending" ? (
                <Button size="sm" className="flex-1" onClick={handlePayNow}>
                  <CreditCard className="size-4 mr-1" />
                  Pay Now
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  disabled
                >
                  <CheckCircle className="size-4 mr-1" />
                  Paid
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ==========================
  // Component: PolicyDetails (dùng field THẬT)
  // ==========================
  const PolicyDetails = ({ policy }) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">
            {policy.product?.name || "Insurance Policy"}
          </h3>
          <p className="text-sm text-gray-600">
            Type: {policy.product?.type || "N/A"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Policy Number</p>
            <p className="font-semibold">{policy.policyNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            {getPolicyStatusBadge(policy.status)}
          </div>
          <div>
            <p className="text-gray-600">Coverage Amount</p>
            <p className="font-semibold">
              {policy.coverageAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Premium</p>
            <p className="font-semibold">
              {policy.premium.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Payment Frequency</p>
            <p>{policy.paymentFrequency}</p>
          </div>
          <div>
            <p className="text-gray-600">Term</p>
            <p>{policy.termYears} years</p>
          </div>
          <div>
            <p className="text-gray-600">Start Date</p>
            <p>
              {policy.startDate
                ? new Date(policy.startDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">End Date</p>
            <p>
              {policy.endDate
                ? new Date(policy.endDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {policy.nextPayment && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
            <p className="font-semibold text-yellow-800 mb-1">Next Payment</p>
            <p>
              Amount:{" "}
              {policy.nextPayment.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
            {policy.nextPayment.dueDate && (
              <p>
                Due date:{" "}
                {new Date(policy.nextPayment.dueDate).toLocaleDateString()}
              </p>
            )}
            <p>Status: {policy.nextPayment.status}</p>
          </div>
        )}
      </div>
    );
  };

  // ==========================
  // Filter policies theo status
  // ==========================
  const activePolicies = policies.filter((p) => p.status === "Active");
  const duePolicies = policies.filter(
    (p) => p.nextPayment && p.nextPayment.status === "Pending"
  );

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">My Insurance</h1>
        <p className="text-gray-600">
          View and manage your policies and applications
        </p>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="policies">
            Policies ({policies.length})
          </TabsTrigger>
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
                <p className="text-gray-600 mb-4">
                  You haven't submitted any insurance applications.
                </p>
                <Button asChild>
                  <Link to="/calculator">Calculate Premium &amp; Apply</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          {loadingPolicies ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Loading policies...
              </CardContent>
            </Card>
          ) : policies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                You do not have any policies yet.
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">
                  All Policies ({policies.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activePolicies.length})
                </TabsTrigger>
                <TabsTrigger value="due">
                  Due ({duePolicies.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {policies.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePolicies.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="due" className="space-y-6">
                {duePolicies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {duePolicies.map((policy) => (
                      <PolicyCard key={policy.id} policy={policy} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-600">
                        No policies with pending payments
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Policies;
