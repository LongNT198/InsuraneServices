import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Download,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useToast } from "../../shared/contexts/ToastContext";
import Toast from "../../shared/components/Toast/Toast";
import adminService from "../../shared/api/services/adminService";
import { CustomSelect } from "../components/CustomSelect"; 

export function ClaimsManagement() {
  const { showSuccess, showError, showWarning } = useToast();
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsClaim, setDetailsClaim] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectClaim, setRejectClaim] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClaim, setEditClaim] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllClaims();

      // Backend returns { success: true, claims: [...] }
      // Axios wraps it in response.data
      const list = response?.data?.claims || response?.claims || [];

      console.log("Claims response:", response);
      console.log("Claims list:", list);

      if (!list || list.length === 0) {
        console.log("No claims data from backend, using mock data");
        setClaims(getMockClaims());
        return;
      }

      // Map backend data to frontend format
      const mappedClaims = list.map((claim) => {
        // Normalize status: UnderReview → reviewing, Pending → pending, etc.
        let normalizedStatus = (
          claim.status ||
          claim.Status ||
          "pending"
        ).toLowerCase();
        if (normalizedStatus === "underreview") {
          normalizedStatus = "reviewing";
        }

        return {
          id: claim.id || claim.Id,
          claimNumber: claim.claimNumber || claim.ClaimNumber || "N/A",
          userName: claim.customerName || claim.CustomerName || "N/A",
          policyType: claim.productName || claim.ProductName || "Unknown",
          amount:
            claim.claimAmount || claim.ClaimAmount
              ? (claim.claimAmount || claim.ClaimAmount).toLocaleString("vi-VN")
              : "0",
          amountRaw: claim.claimAmount || claim.ClaimAmount || 0,
          reason: claim.claimType || claim.ClaimType || "N/A",
          submitDate:
            claim.claimDate || claim.ClaimDate
              ? new Date(claim.claimDate || claim.ClaimDate).toLocaleDateString(
                  "vi-VN"
                )
              : "N/A",
          status: normalizedStatus,
          priority: (
            claim.priority ||
            claim.Priority ||
            "medium"
          ).toLowerCase(),
        };
      });

      setClaims(mappedClaims);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError(err.message || "Failed to load claims");
      setClaims(getMockClaims());
    } finally {
      setLoading(false);
    }
  };

  const getMockClaims = () => [
    {
      id: "1",
      claimNumber: "CLM-2024-001",
      userName: "Nguyễn Văn A",
      policyType: "Health",
      amount: "$25,000",
      reason: "Emergency surgery",
      submitDate: "2025-12-01",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      claimNumber: "CLM-2024-002",
      userName: "Trần Thị B",
      policyType: "Motor",
      amount: "$15,000",
      reason: "Traffic accident",
      submitDate: "2025-11-30",
      status: "approved",
      priority: "medium",
    },
    {
      id: "3",
      claimNumber: "CLM-2024-003",
      userName: "Lê Văn C",
      policyType: "Life",
      amount: "$50,000",
      reason: "Critical illness",
      submitDate: "2025-11-29",
      status: "reviewing",
      priority: "high",
    },
    {
      id: "4",
      claimNumber: "CLM-2024-004",
      userName: "Phạm Thị D",
      policyType: "Home",
      amount: "$30,000",
      reason: "Fire damage",
      submitDate: "2025-11-28",
      status: "rejected",
      priority: "medium",
    },
    {
      id: "5",
      claimNumber: "CLM-2024-005",
      userName: "Hoàng Văn E",
      policyType: "Health",
      amount: "$12,000",
      reason: "Hospitalization",
      submitDate: "2025-11-27",
      status: "approved",
      priority: "low",
    },
    {
      id: "6",
      claimNumber: "CLM-2024-006",
      userName: "Vũ Thị F",
      policyType: "Motor",
      amount: "$8,000",
      reason: "Vehicle repair",
      submitDate: "2025-11-26",
      status: "pending",
      priority: "low",
    },
  ];

  const handleViewDetails = (claim) => {
    setDetailsClaim(claim);
    setShowDetailsModal(true);
    setSelectedClaim(null);
  };

  const handleEditClaim = (claim) => {
    setEditClaim({
      id: claim.id,
      claimNumber: claim.claimNumber,
      userName: claim.userName,
      policyType: claim.policyType,
      amount: claim.amount.replace(/,/g, ""),
      reason: claim.reason,
      status: claim.status,
      priority: claim.priority,
    });
    setShowEditModal(true);
    setSelectedClaim(null);
  };

  const handleEditChange = (field, value) => {
    setEditClaim((s) => ({ ...s, [field]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editClaim.amount || !editClaim.reason) {
      showWarning("Please fill in all required information");
      return;
    }

    setEditError(null);
    try {
      setEditLoading(true);

      // Capitalize status properly (Pending, UnderReview, Approved, Rejected, Paid)
      const capitalizeStatus = (status) => {
        if (status === "reviewing") return "UnderReview";
        return status.charAt(0).toUpperCase() + status.slice(1);
      };

      // Capitalize priority (Low, Medium, High)
      const capitalizePriority = (priority) => {
        return (
          priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
        );
      };

      const payload = {
        Status: capitalizeStatus(editClaim.status),
        ClaimAmount: parseFloat(editClaim.amount),
        ApprovedAmount: parseFloat(editClaim.amount),
        Priority: capitalizePriority(editClaim.priority),
      };

      await adminService.updateClaimStatus(editClaim.id, payload);
      showSuccess("✅ Claim updated successfully");
      setShowEditModal(false);
      fetchClaims();
    } catch (err) {
      console.error("Lỗi cập nhật yêu cầu:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
      setEditError(errorMsg);
    } finally {
      setEditLoading(false);
    }
  };

  const handleApproveClaim = async (claimId) => {
    if (window.confirm("Are you sure you want to approve this claim?")) {
      setActionLoading((prev) => ({ ...prev, [claimId]: true }));
      try {
        await adminService.approveClaim(claimId);
        await fetchClaims();
        setSelectedClaim(null);
      } catch (err) {
        console.error("Error approving claim:", err);
        setClaims((prev) =>
          prev.map((c) => (c.id === claimId ? { ...c, status: "approved" } : c))
        );
      } finally {
        setActionLoading((prev) => ({ ...prev, [claimId]: false }));
      }
    }
  };

  const handleRejectClaim = (claim) => {
    console.log("handleRejectClaim called with:", claim);
    setRejectClaim(claim);
    setRejectReason("");
    setShowRejectModal(true);
    setSelectedClaim(null);
    console.log("Modal state should be true now");
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      showWarning("Please enter a rejection reason");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [rejectClaim.id]: true }));
    try {
      await adminService.rejectClaim(rejectClaim.id, {
        RejectionReason: rejectReason,
      });
      showSuccess("✅ Claim rejected successfully");
      setShowRejectModal(false);
      fetchClaims();
    } catch (err) {
      console.error("Error rejecting claim:", err);
      showError("❌ Error rejecting the claim");
    } finally {
      setActionLoading((prev) => ({ ...prev, [rejectClaim.id]: false }));
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || claim.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    approved: claims.filter((c) => c.status === "approved").length,
    rejected: claims.filter((c) => c.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">Error Loading Data</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-600 text-sm">Showing temporary data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-gray-900 mb-2">Claims Management</h1>
            <p className="text-gray-600">
              Process and track all insurance claims
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl text-gray-900 mt-1">{claims.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl text-yellow-600 mt-1">
                {claims.filter((c) => c.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl text-green-600 mt-1">
                {claims.filter((c) => c.status === "approved").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl text-red-600 mt-1">
                {claims.filter((c) => c.status === "rejected").length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by claim number or user name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-56">
                  <CustomSelect
                    value={filterStatus}
                    onChange={setFilterStatus}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "pending", label: "Pending" },
                      { value: "reviewing", label: "Under Review" },
                      { value: "approved", label: "Approved" },
                      { value: "rejected", label: "Rejected" },
                    ]}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-5 h-5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Claims Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Claim Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Policy Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Submit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClaims.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-12 text-center">
                        <p className="text-gray-500">
                          No claims found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-900">
                              {claim.claimNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {claim.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {claim.policyType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {claim.amount} VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                          {claim.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {claim.submitDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {claim.priority === "high" && (
                            <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              High
                            </span>
                          )}
                          {claim.priority === "medium" && (
                            <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Medium
                            </span>
                          )}
                          {claim.priority === "low" && (
                            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Low
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {claim.status === "pending" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {claim.status === "reviewing" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3" />
                              Under Review
                            </span>
                          )}
                          {claim.status === "approved" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          )}
                          {claim.status === "rejected" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setSelectedClaim(
                                  selectedClaim === claim.id ? null : claim.id
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            {selectedClaim === claim.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleViewDetails(claim)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEditClaim(claim)}
                                  disabled={actionLoading[claim.id]}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <FileText className="w-4 h-4" />
                                  Edit
                                </button>
                                {(claim.status === "pending" ||
                                  claim.status === "reviewing") && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleApproveClaim(claim.id)
                                      }
                                      disabled={actionLoading[claim.id]}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600 disabled:opacity-50"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        console.log(
                                          "Reject button clicked for claim:",
                                          claim.id
                                        );
                                        handleRejectClaim(claim);
                                      }}
                                      disabled={actionLoading[claim.id]}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50 cursor-pointer"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredClaims.length} of {claims.length}{" "}
                claims
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* View Details Modal */}
          {showDetailsModal && detailsClaim && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Claim Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Claim Number
                      </label>
                      <p className="text-sm font-medium">
                        {detailsClaim.claimNumber}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Status
                      </label>
                      <p className="text-sm">
                        {detailsClaim.status === "pending" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                        {detailsClaim.status === "approved" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                        {detailsClaim.status === "rejected" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                        {detailsClaim.status === "reviewing" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Under Review
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        User
                      </label>
                      <p className="text-sm font-medium">
                        {detailsClaim.userName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Policy Type
                      </label>
                      <p className="text-sm">{detailsClaim.policyType}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Claim Amount
                      </label>
                      <p className="text-sm font-medium text-blue-600">
                        {detailsClaim.amount} VNĐ
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Priority
                      </label>
                      <p className="text-sm">
                        {detailsClaim.priority === "high" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            High
                          </span>
                        )}
                        {detailsClaim.priority === "medium" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Medium
                          </span>
                        )}
                        {detailsClaim.priority === "low" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Low
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Submit Date
                      </label>
                      <p className="text-sm">{detailsClaim.submitDate}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Reason
                      </label>
                      <p className="text-sm">{detailsClaim.reason}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showRejectModal && rejectClaim && (
            <div
              className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center p-4"
              style={{ display: "flex" }}
            >
              <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "80vh",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "24px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    Reject Claim
                  </h3>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: "24px",
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Claim Number
                    </label>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        fontFamily: "monospace",
                      }}
                    >
                      {rejectClaim.claimNumber}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      User
                    </label>
                    <p style={{ fontSize: "14px", color: "#111827" }}>
                      {rejectClaim.userName}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Rejection Reason <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                      rows="3"
                      placeholder="Enter rejection reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                </div>

                {/* Footer - ALWAYS VISIBLE */}
                <div
                  style={{
                    padding: "24px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => {
                      console.log("Cancel clicked");
                      setShowRejectModal(false);
                    }}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      background: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log("Submit clicked, reason:", rejectReason);
                      handleRejectSubmit();
                    }}
                    disabled={actionLoading[rejectClaim.id]}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "white",
                      background: actionLoading[rejectClaim.id]
                        ? "#dc2626"
                        : "#dc2626",
                      border: "none",
                      borderRadius: "6px",
                      cursor: actionLoading[rejectClaim.id]
                        ? "not-allowed"
                        : "pointer",
                      opacity: actionLoading[rejectClaim.id] ? 0.6 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {actionLoading[rejectClaim.id] && (
                      <Loader className="w-4 h-4 animate-spin" />
                    )}
                    {actionLoading[rejectClaim.id]
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Claim Modal */}
          {showEditModal && editClaim && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Edit Claim</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {editError && (
                    <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {editError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Claim Number
                    </label>
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded bg-gray-50"
                      value={editClaim.claimNumber}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      User
                    </label>
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded bg-gray-50"
                      value={editClaim.userName}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Amount (VNĐ)
                    </label>
                    <input
                      type="number"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editClaim.amount}
                      onChange={(e) =>
                        handleEditChange("amount", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Status"
                      value={editClaim.status}
                      onChange={(value) => {
                        console.log("Status changed to:", value);
                        handleEditChange("status", value);
                      }}
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "reviewing", label: "Under Review" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" },
                      ]}
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Priority"
                      value={editClaim.priority}
                      onChange={(value) => {
                        console.log("Priority changed to:", value);
                        handleEditChange("priority", value);
                      }}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={editLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 flex items-center gap-2"
                  >
                    {editLoading && <Loader className="w-4 h-4 animate-spin" />}
                    {editLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
