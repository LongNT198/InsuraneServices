import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  Loader,
  Send,
  MoreVertical,
  Download,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../../shared/contexts/ToastContext";
import Toast from "../../shared/components/Toast/Toast";
import adminService from "../../shared/api/services/adminService";
import managerApplicationsService from "/src/features/shared/api/services/managerApplicationsService";
import { ManagerApplicationExtraDetails } from "../components/ManagerApplicationExtraDetails";

export function ApplicationsManagement() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const [applications, setApplications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsApp, setDetailsApp] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "approve", "reject"
  const [actionApp, setActionApp] = useState(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionError, setActionError] = useState(null);
  const [stats, setStats] = useState({
    inProgressCount: 0,
    completedCount: 0,
    rejectedCount: 0,
    totalCount: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ===== Chi tiết lấy thêm từ Manager API =====
  const [managerDetails, setManagerDetails] = useState(null);
  const [loadingManagerDetails, setLoadingManagerDetails] = useState(false);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
    fetchStats();

    // Auto-refresh every 15 seconds to get real-time updates
    const interval = setInterval(() => {
      fetchApplications();
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await adminService.getRegistrationSessions();

      console.log("API Response:", response);
      console.log("Response type:", typeof response);
      console.log("Is array?", Array.isArray(response));

      // Handle both direct array and wrapped response
      let data = Array.isArray(response) ? response : response?.data || [];

      console.log("Processed data:", data);
      console.log("Data is array?", Array.isArray(data));
      console.log("Data length:", data?.length || 0);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No applications in database, using mock data");
        setApplications(getMockApplications());
        setError(null);
        return;
      }

      // Helper function to extract applicant name from ApplicantData
      const getApplicantName = (applicantData) => {
        if (!applicantData) return "N/A";
        try {
          const data =
            typeof applicantData === "string"
              ? JSON.parse(applicantData)
              : applicantData;
          if (data.firstName && data.lastName) {
            return `${data.firstName} ${data.lastName}`;
          }
          return data.firstName || data.lastName || "N/A";
        } catch (err) {
          console.error("Error parsing applicant data:", err);
          return "N/A";
        }
      };

      // Map response from actual Application model to component expectations
      const mappedApps = data.map((app) => ({
        id: app.id,
        applicationNumber: app.applicationNumber || `APP-${app.id}`,
        userId: app.userId || "N/A",
        applicantName: getApplicantName(app.applicantData),
        // For display purposes, map Status to a step representation
        currentStep: app.status || "Unknown",
        // Map Status field to registrationStatus for compatibility
        registrationStatus: app.status || "Submitted",
        createdDate: app.createdAt,
        lastUpdateDate: app.updatedAt,
        submittedDate: app.submittedAt,
        reviewedDate: app.reviewedAt,
        selectedProductId: app.productId,
        productName: app.productName || "N/A",
        productType: app.productType || "N/A",
        selectedCoverageAmount: app.coverageAmount || 0,
        selectedTermYears: app.termYears || 0,
        paymentFrequency: app.paymentFrequency || "Annual",
        premiumAmount: app.premiumAmount || 0,
        totalPremiumAmount: app.totalPremiumAmount || 0,
        notes: app.reviewNotes || "",
        rejectionReason: app.reviewNotes || "",
        termsAccepted: app.termsAccepted,
        declarationAccepted: app.declarationAccepted,
        applicantData: app.applicantData,
      }));

      console.log("Mapped applications:", mappedApps);
      setApplications(mappedApps);
      setError(null);
    } catch (err) {
      console.error("Error fetching applications:", err);
      console.error("Error details:", err.response || err.message);
      setError(`Error: ${err.message || "Unable to connect to the server"}`);
      // Use mock data as fallback
      setApplications(getMockApplications());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsResponse = await adminService.getRegistrationStats?.();
      if (statsResponse) {
        setStats({
          inProgressCount: statsResponse.inProgressCount || 0,
          completedCount: statsResponse.completedCount || 0,
          rejectedCount: statsResponse.rejectedCount || 0,
          totalCount: statsResponse.totalCount || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications();
    await fetchStats();
    setIsRefreshing(false);
  };

  const getMockApplications = () => [
    {
      id: 1,
      userId: "nguyen.van.a",
      currentStep: "HealthDeclared",
      registrationStatus: "In Review",
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdateDate: new Date().toISOString(),
      selectedProductId: 1,
      selectedCoverageAmount: 500000,
      selectedTermYears: 10,
      notes: "Waiting for health confirmation",
      rejectionReason: "",
      sessionToken: "token-001",
      completedDate: null,
    },
    {
      id: 2,
      userId: "tran.thi.b",
      currentStep: "PolicyIssued",
      registrationStatus: "Approved",
      createdDate: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastUpdateDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      selectedProductId: 2,
      selectedCoverageAmount: 300000,
      selectedTermYears: 15,
      notes: "Approved and policy issued",
      rejectionReason: "",
      sessionToken: "token-002",
      completedDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: 3,
      userId: "le.van.c",
      currentStep: "UnderwritingApproved",
      registrationStatus: "Rejected",
      createdDate: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastUpdateDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      selectedProductId: 1,
      selectedCoverageAmount: 1000000,
      selectedTermYears: 20,
      notes: "",
      rejectionReason: "Health condition does not meet insurance requirements.",
      sessionToken: "token-003",
      completedDate: null,
    },
    {
      id: 4,
      userId: "pham.minh.d",
      currentStep: "ProductSelected",
      registrationStatus: "In Review",
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdateDate: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      selectedProductId: 3,
      selectedCoverageAmount: 200000,
      selectedTermYears: 5,
      notes: "Waiting for health declaration",
      rejectionReason: "",
      sessionToken: "token-004",
      completedDate: null,
    },
  ];

  // Filter and search applications
  const filteredApplications = applications.filter((app) => {
    const statusMatch =
      filterStatus === "all" || app.registrationStatus === filterStatus;
    const searchMatch =
      app.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toString().includes(searchTerm);
    return statusMatch && searchMatch;
  });

  const handleViewDetails = async (app) => {
    setSelectedApp(null);
    setShowDetailsModal(true);

    // Reset manager extra details mỗi lần mở
    setManagerDetails(null);
    setLoadingManagerDetails(true);

    try {
      // ===== 1. Lấy chi tiết chính bằng adminService (logic cũ) =====
      const response = await adminService.getRegistrationSessionById?.(app.id);
      if (response) {
        // Extract applicant name from ApplicantData JSON
        let applicantName = "N/A";
        if (response.applicantData) {
          try {
            const data =
              typeof response.applicantData === "string"
                ? JSON.parse(response.applicantData)
                : response.applicantData;
            if (data.firstName && data.lastName) {
              applicantName = `${data.firstName} ${data.lastName}`;
            } else {
              applicantName = data.firstName || data.lastName || "N/A";
            }
          } catch (err) {
            console.error("Error parsing applicant data:", err);
          }
        }

        // Map backend fields to frontend expected fields
        setDetailsApp({
          ...response,
          applicantName: applicantName,
          registrationStatus: response.status,
          selectedCoverageAmount: response.coverageAmount,
          selectedTermYears: response.termYears,
          productName: response.productName,
          productType: response.productType,
          paymentFrequency: response.paymentFrequency,
          premiumAmount: response.premiumAmount,
          notes: response.reviewNotes || "",
          createdDate: response.createdAt,
          lastUpdateDate: response.updatedAt,
          submittedDate: response.submittedAt,
          reviewedDate: response.reviewedAt,
        });
      } else {
        setDetailsApp(app);
      }

      // ===== 2. Gọi thêm Manager API để lấy Customer / Health / Beneficiaries =====
      try {
        const mgrRes = await managerApplicationsService.getApplicationDetails(
          app.id
        );
        const mgrApp = mgrRes?.data?.application;
        if (mgrApp) {
          setManagerDetails(mgrApp);
        } else {
          setManagerDetails(null);
        }
      } catch (mgrErr) {
        console.error("Error loading manager extra details:", mgrErr);
        setManagerDetails(null);
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      setDetailsApp(app);
    } finally {
      setLoadingManagerDetails(false);
    }
  };

  const handleApproveClick = (app) => {
    setActionApp(app);
    setActionType("approve");
    setActionNotes("");
    setActionError(null);
    setShowActionModal(true);
    setSelectedApp(null);
  };

  const handleRejectClick = (app) => {
    setActionApp(app);
    setActionType("reject");
    setActionNotes("");
    setActionError(null);
    setShowActionModal(true);
    setSelectedApp(null);
  };

  const handleConfirmAction = async () => {
    if (!actionNotes.trim()) {
      showWarning("Please enter notes or a reason.");
      return;
    }

    if (!actionApp) return;

    setActionLoading((prev) => ({ ...prev, [actionApp.id]: true }));
    try {
      if (actionType === "approve") {
        await adminService.approveApplication(actionApp.id, {
          approvalNotes: actionNotes,
        });
        showSuccess("✅ Application approved successfully!");
        // Update local state
        const updatedApps = applications.map((app) =>
          app.id === actionApp.id
            ? {
                ...app,
                registrationStatus: "Approved",
                currentStep: "PolicyIssued",
                notes: actionNotes,
                completedDate: new Date().toISOString(),
              }
            : app
        );
        setApplications(updatedApps);
      } else if (actionType === "reject") {
        await adminService.rejectApplication(actionApp.id, {
          rejectionReason: actionNotes,
        });
        showSuccess("✅ Application rejected successfully!");
        // Update local state
        const updatedApps = applications.map((app) =>
          app.id === actionApp.id
            ? {
                ...app,
                registrationStatus: "Rejected",
                rejectionReason: actionNotes,
              }
            : app
        );
        setApplications(updatedApps);
      }
      setShowActionModal(false);
      setActionApp(null);
      setActionType(null);
      setActionNotes("");
      // Refresh stats
      fetchStats();
    } catch (err) {
      console.error(`Error ${actionType}ing application:`, err);
      const msg =
        err.message ||
        `Unable to ${
          actionType === "approve" ? "approve" : "reject"
        } this application`;
      showError(msg);
      setActionError(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionApp.id]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "In Review":
      case "Submitted":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "In Review":
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Approved":
        return "Approved";
      case "Rejected":
        return "Rejected";
      case "In Review":
        return "Under Review";
      case "Submitted":
        return "Submitted";
      default:
        return status || "Unknown";
    }
  };

  if (loading && !applications.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-2">
              Review and manage customers' insurance applications
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCount || applications.length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.inProgressCount ||
                    applications.filter(
                      (a) =>
                        a.registrationStatus === "Submitted" ||
                        a.registrationStatus === "In Review"
                    ).length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completedCount ||
                    applications.filter(
                      (a) => a.registrationStatus === "Approved"
                    ).length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rejectedCount ||
                    applications.filter(
                      (a) => a.registrationStatus === "Rejected"
                    ).length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user ID or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Submitted">Submitted</option>
                <option value="In Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Coverage Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {app.applicationNumber || `#${app.id}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.applicantName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.productName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {app.selectedCoverageAmount
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(app.selectedCoverageAmount)
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.registrationStatus)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              app.registrationStatus
                            )}`}
                          >
                            {getStatusLabel(app.registrationStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.createdDate
                          ? new Date(app.createdDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSelectedApp(
                                selectedApp === app.id ? null : app.id
                              )
                            }
                            disabled={actionLoading[app.id]}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            {actionLoading[app.id] ? (
                              <Loader className="w-5 h-5 animate-spin text-gray-600" />
                            ) : (
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            )}
                          </button>

                          {selectedApp === app.id && !actionLoading[app.id] && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                              <button
                                onClick={() => handleViewDetails(app)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              {app.registrationStatus !== "Approved" &&
                                app.registrationStatus !== "Rejected" && (
                                  <>
                                    <button
                                      onClick={() => handleApproveClick(app)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Approve Application
                                    </button>
                                    <button
                                      onClick={() => handleRejectClick(app)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject Application
                                    </button>
                                  </>
                                )}

                              <button
                                onClick={() => {
                                  showInfo(
                                    `📥 Downloading application #${app.id}`
                                  );
                                  setSelectedApp(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found</p>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && detailsApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
              <div className="border-b border-gray-200 p-6 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Application Details -{" "}
                  {detailsApp.applicationNumber || `#${detailsApp.id}`}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="text-base font-semibold text-gray-900">
                        {detailsApp.applicantName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="text-base font-medium text-gray-900 truncate">
                        {detailsApp.userId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Product Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Product</p>
                      <p className="text-base font-semibold text-gray-900">
                        {detailsApp.productName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Product Type</p>
                      <p className="text-base font-semibold text-gray-900">
                        {detailsApp.productType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coverage Amount</p>
                      <p className="text-base font-semibold text-blue-600">
                        {detailsApp.selectedCoverageAmount
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(detailsApp.selectedCoverageAmount)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Term</p>
                      <p className="text-base font-semibold text-gray-900">
                        {detailsApp.selectedTermYears
                          ? `${detailsApp.selectedTermYears} years`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Frequency</p>
                      <p className="text-base font-semibold text-gray-900">
                        {detailsApp.paymentFrequency || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Premium</p>
                      <p className="text-base font-semibold text-green-600">
                        {detailsApp.premiumAmount
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(detailsApp.premiumAmount)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Status & Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(detailsApp.registrationStatus)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            detailsApp.registrationStatus
                          )}`}
                        >
                          {getStatusLabel(detailsApp.registrationStatus)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="text-base font-medium text-gray-900">
                        {detailsApp.createdDate
                          ? new Date(detailsApp.createdDate).toLocaleString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="text-base font-medium text-gray-900">
                        {detailsApp.lastUpdateDate
                          ? new Date(detailsApp.lastUpdateDate).toLocaleString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </p>
                    </div>
                    {detailsApp.submittedDate && (
                      <div>
                        <p className="text-sm text-gray-600">Submitted At</p>
                        <p className="text-base font-medium text-gray-900">
                          {new Date(detailsApp.submittedDate).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    )}
                    {detailsApp.reviewedDate && (
                      <div>
                        <p className="text-sm text-gray-600">
                          Reviewed / Decided At
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {new Date(detailsApp.reviewedDate).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ====== BỔ SUNG: Customer / Health / Beneficiaries từ Manager API ====== */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Extra Details for Manager
                  </h3>
                  {loadingManagerDetails ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader className="w-4 h-4 animate-spin" />
                      Loading additional details (Customer / Health /
                      Beneficiaries)...
                    </div>
                  ) : (
                    <ManagerApplicationExtraDetails details={managerDetails} />
                  )}
                </div>

                {/* Notes */}
                {detailsApp.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Review Notes
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-900">{detailsApp.notes}</p>
                    </div>
                  </div>
                )}

                {detailsApp.rejectionReason && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Rejection Reason
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-900">
                        {detailsApp.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Update Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Adjust Status
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Change Status
                        </label>
                        <select
                          value={detailsApp.registrationStatus}
                          onChange={(e) => {
                            setDetailsApp({
                              ...detailsApp,
                              registrationStatus: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={detailsApp.notes || ""}
                          onChange={(e) => {
                            setDetailsApp({
                              ...detailsApp,
                              notes: e.target.value,
                            });
                          }}
                          rows={3}
                          placeholder="Enter notes or reason..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await adminService.updateApplicationStatus(
                              detailsApp.id,
                              {
                                status: detailsApp.registrationStatus,
                                reviewNotes: detailsApp.notes,
                              }
                            );
                            await fetchApplications();
                            setShowDetailsModal(false);
                            setManagerDetails(null);
                            showSuccess("✅ Status updated successfully!");
                          } catch (err) {
                            console.error("Error updating status:", err);
                            showError(
                              "❌ Failed to update status: " + err.message
                            );
                          }
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 flex justify-end gap-3 sticky bottom-0 bg-white">
                {detailsApp.registrationStatus !== "Approved" &&
                  detailsApp.registrationStatus !== "Rejected" && (
                    <>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setManagerDetails(null);
                          handleApproveClick(detailsApp);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setManagerDetails(null);
                          handleRejectClick(detailsApp);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setManagerDetails(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {showActionModal && actionApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {actionType === "approve"
                    ? "Approve Application"
                    : "Reject Application"}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Application ID:</strong> #{actionApp.id}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>User ID:</strong> {actionApp.userId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {actionType === "approve"
                      ? "Approval Notes"
                      : "Rejection Reason"}{" "}
                    *
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows="4"
                    placeholder={
                      actionType === "approve"
                        ? "Enter approval notes..."
                        : "Enter rejection reason..."
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {actionError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{actionError}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionApp(null);
                    setActionNotes("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading[actionApp.id]}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
                  style={{
                    backgroundColor:
                      actionType === "approve" ? "#16a34a" : "#dc2626", // green / red
                    color: "#ffffff",
                    cursor: actionLoading[actionApp.id]
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {actionLoading[actionApp.id] ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {actionType === "approve" ? "Approve" : "Reject"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationsManagement;
