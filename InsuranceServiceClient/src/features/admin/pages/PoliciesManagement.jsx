import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  AlertCircle,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "../../shared/contexts/ToastContext";
import Toast from "../../shared/components/Toast/Toast";
import ConfirmModal from "../../shared/components/ConfirmModal/ConfirmModal";
import adminService from "../../shared/api/services/adminService";

export function PoliciesManagement() {
  const { showSuccess, showError, showWarning } = useToast();
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsPolicy, setDetailsPolicy] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  
  // Confirm modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ action: null, policy: null });

  // Fetch policies on component mount
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllPolicies();
      const list = (response && response.data) || response || [];
      // Map response to expected format
      const mappedPolicies = (list || []).map((policy) => ({
        id: policy.id || policy.policyId,
        policyNumber: policy.policyNumber,
        userName: policy.CustomerName || policy.customerName || "N/A",
        type: policy.ProductType || policy.productType || "Unknown",
        plan: policy.PlanName || policy.planName || "N/A",
        premium:
          policy.Premium || policy.premium
            ? "$" + (policy.Premium || policy.premium).toLocaleString("en-US")
            : "$0",
        premiumRaw: policy.Premium || policy.premium || 0, // Keep raw number for edit
        startDate: policy.startDate
          ? new Date(policy.startDate).toLocaleDateString()
          : "N/A",
        startDateRaw: policy.startDate, // Keep ISO date for edit
        endDate: policy.endDate
          ? new Date(policy.endDate).toLocaleDateString()
          : "N/A",
        endDateRaw: policy.endDate, // Keep ISO date for edit
        status: policy.status?.toLowerCase() || "pending",
      }));
      setPolicies(mappedPolicies);
      setError(null);
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError(err.message || "Failed to load policies");
      // Use mock data as fallback
      setPolicies(getMockPolicies());
    } finally {
      setLoading(false);
    }
  };

  const getMockPolicies = () => [
    {
      id: "1",
      policyNumber: "POL-2024-001",
      userName: "John Doe",
      type: "Life Insurance",
      plan: "Premium",
      premium: "$10,000",
      premiumRaw: 10000,
      startDate: "1/15/2024",
      startDateRaw: "2024-01-15",
      endDate: "1/15/2025",
      endDateRaw: "2025-01-15",
      status: "active",
    },
    {
      id: "2",
      policyNumber: "POL-2024-002",
      userName: "Jane Smith",
      type: "Health Insurance",
      plan: "Standard",
      premium: "$8,000",
      premiumRaw: 8000,
      startDate: "2/20/2024",
      startDateRaw: "2024-02-20",
      endDate: "2/20/2025",
      endDateRaw: "2025-02-20",
      status: "active",
    },
    {
      id: "3",
      policyNumber: "POL-2024-003",
      userName: "Mark Johnson",
      type: "Auto Insurance",
      plan: "Basic",
      premium: "$5,000",
      premiumRaw: 5000,
      startDate: "3/10/2024",
      startDateRaw: "2024-03-10",
      endDate: "3/10/2025",
      endDateRaw: "2025-03-10",
      status: "pending",
    },
    {
      id: "4",
      policyNumber: "POL-2024-004",
      userName: "Sarah Wilson",
      type: "Home Insurance",
      plan: "Premium",
      premium: "$12,000",
      premiumRaw: 12000,
      startDate: "12/1/2023",
      startDateRaw: "2023-12-01",
      endDate: "12/1/2024",
      endDateRaw: "2024-12-01",
      status: "expired",
    },
  ];

  const handleApprovePolicy = async (policyId) => {
    setConfirmData({ action: 'approve', policy: policyId });
    setShowConfirmModal(true);
  };

  const handleConfirmApprove = async () => {
    const policyId = confirmData.policy;
    setShowConfirmModal(false);
    setActionLoading((prev) => ({ ...prev, [policyId]: true }));
    try {
      await adminService.approvePolicy(policyId);
      showSuccess("✅ Policy approved successfully");
      await fetchPolicies();
      setSelectedPolicy(null);
    } catch (err) {
      console.error("Error approving policy:", err);
      showError("❌ Unable to approve policy");
      // Update local state as fallback
      setPolicies((prev) =>
        prev.map((p) => (p.id === policyId ? { ...p, status: "active" } : p))
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [policyId]: false }));
    }
  };

  const handleRejectPolicy = async (policyId) => {
    setConfirmData({ action: 'reject', policy: policyId });
    setShowConfirmModal(true);
  };

  const handleConfirmReject = async () => {
    const policyId = confirmData.policy;
    setShowConfirmModal(false);
    setActionLoading((prev) => ({ ...prev, [policyId]: true }));
    try {
      await adminService.rejectPolicy(policyId);
      showSuccess("✅ Policy rejected successfully");
      await fetchPolicies();
      setSelectedPolicy(null);
    } catch (err) {
      console.error("Error rejecting policy:", err);
      showError("❌ Unable to reject policy");
      // Update local state as fallback
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === policyId ? { ...p, status: "cancelled" } : p
        )
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [policyId]: false }));
    }
  };

  const handleDeletePolicy = async (policyId) => {
    setConfirmData({ action: 'delete', policy: policyId });
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    const policyId = confirmData.policy;
    setShowConfirmModal(false);
    setActionLoading((prev) => ({ ...prev, [policyId]: true }));
    try {
      await adminService.deletePolicy(policyId);
      showSuccess("✅ Policy deleted successfully");
      await fetchPolicies();
      setSelectedPolicy(null);
    } catch (err) {
      console.error("Error deleting policy:", err);
      showError("❌ Unable to delete policy");
      // Update local state as fallback
      setPolicies((prev) => prev.filter((p) => p.id !== policyId));
    } finally {
      setActionLoading((prev) => ({ ...prev, [policyId]: false }));
    }
  };

  const handleViewDetails = (policy) => {
    setDetailsPolicy(policy);
    setShowDetailsModal(true);
    setSelectedPolicy(null);
  };

  const handleEditPolicy = (policy) => {
    // Convert date strings to YYYY-MM-DD format for input[type="date"]
    const formatDateForInput = (dateStr) => {
      if (!dateStr || dateStr === "N/A") return "";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
      } catch {
        return "";
      }
    };

    setEditPolicy({
      id: policy.id,
      policyNumber: policy.policyNumber,
      userName: policy.userName,
      type: policy.type,
      plan: policy.plan,
      premium: String(policy.premiumRaw || policy.premium.replace(/,/g, "")),
      startDate: formatDateForInput(policy.startDateRaw || policy.startDate),
      endDate: formatDateForInput(policy.endDateRaw || policy.endDate),
      status: policy.status, // Keep lowercase for display
    });
    setShowEditModal(true);
    setSelectedPolicy(null);
  };

  const handleEditChange = (field, value) => {
    setEditPolicy((s) => ({ ...s, [field]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editPolicy.policyNumber || !editPolicy.premium) {
      showWarning("Please fill in all required information");
      return;
    }

    setEditError(null);
    try {
      setEditLoading(true);

      // Capitalize first letter of status to match backend enum (Active, Pending, Expired, Cancelled)
      const capitalizeStatus = (status) => {
        if (!status) return status;
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      };

      const payload = {
        Premium: parseFloat(editPolicy.premium),
        StartDate: editPolicy.startDate, // Already in YYYY-MM-DD format from input
        EndDate: editPolicy.endDate,
        Status: capitalizeStatus(editPolicy.status), // Convert to capitalized format
      };

      await adminService.updatePolicy(editPolicy.id, payload);
      showSuccess("✅ Policy updated successfully");
      setShowEditModal(false);
      fetchPolicies();
    } catch (err) {
      console.error("Error updating policy:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while updating the policy";
      setEditError(errorMsg);
    } finally {
      setEditLoading(false);
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || policy.type === filterType;
    const matchesStatus =
      filterStatus === "all" || policy.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: policies.length,
    active: policies.filter((p) => p.status === "active").length,
    pending: policies.filter((p) => p.status === "pending").length,
    expired: policies.filter((p) => p.status === "expired").length,
  };

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [users, setUsers] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createFieldErrors, setCreateFieldErrors] = useState({});
  const [createForm, setCreateForm] = useState({
    userId: "",
    productId: "",
    coverageAmount: "",
    termYears: 1,
    paymentFrequency: "Monthly",
    startDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (!showCreateModal) return;

    let cancelled = false;

    const loadData = async () => {
      // products
      try {
        setProductsError(null);
        const res = await adminService.getProducts();
        // res expected: { success: true, products: [...] }
        const list =
          (res && res.products) ||
          (res && res.data && res.data.products) ||
          res ||
          [];
        if (!cancelled)
          setProducts(Array.isArray(list) ? list : list.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        if (!cancelled) {
          setProducts([]);
          setProductsError(err?.message || "Failed to load products");
        }
      }

      // users
      try {
        const ures = await adminService.getAllUsers();
        const list = ures || [];
        if (!cancelled) setUsers(Array.isArray(list) ? list : list.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        if (!cancelled) setUsers([]);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [showCreateModal]);

  const handleCreateChange = (field, value) => {
    setCreateForm((s) => ({ ...s, [field]: value }));
  };

  const handleCreateSubmit = async () => {
    if (
      !createForm.userId ||
      !createForm.productId ||
      !createForm.coverageAmount
    ) {
      showWarning("Please fill in all required information");
      return;
    }

    // clear previous errors
    setCreateError(null);
    setCreateFieldErrors({});

    try {
      setCreateLoading(true);
      const payload = {
        UserId: createForm.userId,
        ProductId: parseInt(createForm.productId, 10),
        CoverageAmount: parseFloat(createForm.coverageAmount),
        TermYears: parseInt(createForm.termYears, 10),
        PaymentFrequency: createForm.paymentFrequency,
        StartDate: createForm.startDate,
      };

      await adminService.adminCreatePolicy(payload);
      showSuccess("✅ Policy created successfully");
      setShowCreateModal(false);
      fetchPolicies();
    } catch (err) {
      console.error("Error creating policy:", err);
      // err may be an axios rejection object or Error
      if (err && typeof err === "object") {
        const msg =
          err.message ||
          err.data?.message ||
          err.data?.title ||
          "An error occurred";
        setCreateError(msg);
        // extract validation errors if present
        const validatorErrors =
          err.errors || err.data?.errors || err.data?.validationErrors || {};
        setCreateFieldErrors(validatorErrors || {});
      } else {
        setCreateError(String(err));
      }
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Policies Management</h1>
          <p className="text-gray-600">
            Manage all insurance policies
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Policy
        </button>
      </div>

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Create New Policy</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>

            {/* Show server error summary (if any) */}
            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <div className="font-medium">Error: {createError}</div>
                {createFieldErrors &&
                  Object.keys(createFieldErrors).length > 0 && (
                    <ul className="mt-2 list-disc ml-5 text-xs">
                      {Object.entries(createFieldErrors).map(([k, v]) => (
                        <li key={k}>
                          <strong>{k}:</strong>{" "}
                          {Array.isArray(v) ? v.join(", ") : String(v)}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">
                  User
                </label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={createForm.userId}
                  onChange={(e) => handleCreateChange("userId", e.target.value)}
                >
                  <option value="">-- Select User --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.userName || u.email || u.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Product</label>
                {productsError ? (
                  <div className="text-sm text-red-600">
                    <div>Unable to load product list.</div>
                    <button
                      className="mt-2 px-3 py-1 bg-gray-100 rounded text-sm"
                      onClick={() => {
                        // quick retry by toggling modal to trigger useEffect
                        setShowCreateModal(false);
                        setTimeout(() => setShowCreateModal(true), 50);
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={createForm.productId}
                    onChange={(e) =>
                      handleCreateChange("productId", e.target.value)
                    }
                  >
                    <option value="">-- Select Product --</option>
                    {products.map((p) => (
                      <option key={p.id || p.Id} value={p.id || p.Id}>
                        {p.productName || p.ProductName || p.productName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Coverage Amount
                </label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={createForm.coverageAmount}
                  onChange={(e) =>
                    handleCreateChange("coverageAmount", e.target.value)
                  }
                />
                {createFieldErrors &&
                  (createFieldErrors.CoverageAmount ||
                    createFieldErrors.coverageAmount) && (
                    <p className="text-xs text-red-600 mt-1">
                      {Array.isArray(
                        createFieldErrors.CoverageAmount
                          ? createFieldErrors.CoverageAmount
                          : createFieldErrors.coverageAmount
                      )
                        ? createFieldErrors.CoverageAmount
                          ? createFieldErrors.CoverageAmount.join(", ")
                          : createFieldErrors.coverageAmount.join(", ")
                        : createFieldErrors.CoverageAmount
                        ? String(createFieldErrors.CoverageAmount)
                        : String(createFieldErrors.coverageAmount)}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">Number of Years</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={createForm.termYears}
                  onChange={(e) =>
                    handleCreateChange("termYears", e.target.value)
                  }
                />
                {createFieldErrors &&
                  (createFieldErrors.TermYears ||
                    createFieldErrors.termYears) && (
                    <p className="text-xs text-red-600 mt-1">
                      {Array.isArray(
                        createFieldErrors.TermYears
                          ? createFieldErrors.TermYears
                          : createFieldErrors.termYears
                      )
                        ? createFieldErrors.TermYears
                          ? createFieldErrors.TermYears.join(", ")
                          : createFieldErrors.termYears.join(", ")
                        : createFieldErrors.TermYears
                        ? String(createFieldErrors.TermYears)
                        : String(createFieldErrors.termYears)}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Payment Frequency
                </label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={createForm.paymentFrequency}
                  onChange={(e) =>
                    handleCreateChange("paymentFrequency", e.target.value)
                  }
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>HalfYearly</option>
                  <option>Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={createForm.startDate}
                  onChange={(e) =>
                    handleCreateChange("startDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={createLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              >
                {createLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" /> Creating...
                  </span>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Policies</p>
          <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl text-red-600 mt-1">{stats.expired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by policy number or user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Nhân Thọ">Life Insurance</option>
              <option value="Y Tế">Health Insurance</option>
              <option value="Xe Cộ">Auto Insurance</option>
              <option value="Nhà Ở">Home Insurance</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  End Date
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
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-600">
                        Loading policies...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600">
                        No policies found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900">
                          {policy.policyNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {policy.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {policy.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {policy.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {policy.premium} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {policy.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {policy.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {policy.status === "active" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                      {policy.status === "pending" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                      {policy.status === "expired" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          Expired
                        </span>
                      )}
                      {policy.status === "cancelled" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setSelectedPolicy(
                              selectedPolicy === policy.id ? null : policy.id
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {selectedPolicy === policy.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleViewDetails(policy)}
                              disabled={actionLoading[policy.id]}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {policy.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprovePolicy(policy.id)}
                                  disabled={actionLoading[policy.id]}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600 disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPolicy(policy.id)}
                                  disabled={actionLoading[policy.id]}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditPolicy(policy)}
                              disabled={actionLoading[policy.id]}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePolicy(policy.id)}
                              disabled={actionLoading[policy.id]}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Policy
                            </button>
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
            Showing {filteredPolicies.length} of {policies.length}{" "}
            policies
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
      {showDetailsModal && detailsPolicy && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Policy Details</h3>
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
                    Policy Number
                  </label>
                  <p className="text-sm font-medium">
                    {detailsPolicy.policyNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Status
                  </label>
                  <p className="text-sm">
                    {detailsPolicy.status === "active" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                    {detailsPolicy.status === "pending" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                    {detailsPolicy.status === "expired" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                    {detailsPolicy.status === "cancelled" && (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        Cancelled
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    User Name
                  </label>
                  <p className="text-sm font-medium">
                    {detailsPolicy.userName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Insurance Type
                  </label>
                  <p className="text-sm">{detailsPolicy.type}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Insurance Plan
                  </label>
                  <p className="text-sm">{detailsPolicy.plan}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Insurance Premium
                  </label>
                  <p className="text-sm font-medium text-blue-600">
                    {detailsPolicy.premium} VND
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Start Date
                  </label>
                  <p className="text-sm">{detailsPolicy.startDate}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End Date
                  </label>
                  <p className="text-sm">{detailsPolicy.endDate}</p>
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

      {/* Edit Policy Modal */}
      {showEditModal && editPolicy && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Policy</h3>
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
                  Policy Number
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editPolicy.policyNumber}
                  onChange={(e) =>
                    handleEditChange("policyNumber", e.target.value)
                  }
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
                  value={editPolicy.userName}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Insurance Premium (VND)
                </label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editPolicy.premium}
                  onChange={(e) => handleEditChange("premium", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editPolicy.startDate}
                  onChange={(e) =>
                    handleEditChange("startDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editPolicy.endDate}
                  onChange={(e) => handleEditChange("endDate", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={editPolicy.status}
                  onChange={(e) => handleEditChange("status", e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title={
          confirmData.action === 'approve' ? 'Approve Policy' :
          confirmData.action === 'reject' ? 'Reject Policy' :
          'Delete Policy'
        }
        message={
          confirmData.action === 'approve' ? 'Are you sure you want to approve this policy?' :
          confirmData.action === 'reject' ? 'Are you sure you want to reject this policy?' :
          'Are you sure you want to delete this policy? This action cannot be undone.'
        }
        onConfirm={
          confirmData.action === 'approve' ? handleConfirmApprove :
          confirmData.action === 'reject' ? handleConfirmReject :
          handleConfirmDelete
        }
        onCancel={() => setShowConfirmModal(false)}
        confirmText={confirmData.action === 'delete' ? 'Delete' : 'Yes'}
        cancelText="Cancel"
        isDangerous={confirmData.action === 'delete'}
      />
    </div>
  );
}
