import { useState, useEffect } from "react";
import {
  Search,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  AlertCircle,
  Loader,
  Eye,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "../../shared/contexts/ToastContext";
import Toast from "../../shared/components/Toast/Toast";
import adminService from "../../shared/api/services/adminService";

export function PaymentsManagement() {
  const { showSuccess, showError, showWarning } = useToast();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsPayment, setDetailsPayment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(null);
  const [confirmData, setConfirmData] = useState({ transactionId: "", notes: "" });
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundPayment, setRefundPayment] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllPayments();
      
      const list = response?.data?.payments || [];
      console.log('Payments response:', response);
      console.log('Payments list:', list);

      if (!list || list.length === 0) {
        console.log('No payments data from backend, using mock data');
        setPayments(getMockPayments());
        return;
      }

      // Map backend data to frontend format
      const mappedPayments = list.map((payment) => ({
        id: payment.id || payment.Id,
        transactionId: payment.transactionId || payment.TransactionId || "N/A",
        userName: payment.customerName || payment.CustomerName || "N/A",
        policyNumber: payment.policyNumber || payment.PolicyNumber || "N/A",
        amount: (payment.amount || payment.Amount)
          ? (payment.amount || payment.Amount).toLocaleString('vi-VN')
          : "0",
        amountRaw: payment.amount || payment.Amount || 0,
        method: payment.paymentMethod || payment.PaymentMethod || "N/A",
        date: (payment.paymentDate || payment.PaymentDate || payment.dueDate || payment.DueDate)
          ? new Date(payment.paymentDate || payment.PaymentDate || payment.dueDate || payment.DueDate).toLocaleString('vi-VN')
          : "N/A",
        status: (payment.status || payment.Status || "pending").toLowerCase(),
      }));

      setPayments(mappedPayments);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to load payments");
      setPayments(getMockPayments());
    } finally {
      setLoading(false);
    }
  };

  const getMockPayments = () => [
    {
      id: "1",
      transactionId: "TXN-001",
      userName: "Nguyễn Văn A",
      policyNumber: "POL-2024-001",
      amount: "$10,000",
      amountRaw: 10000,
      method: "Credit Card",
      date: "2025-12-01 10:30",
      status: "completed",
    },
    {
      id: "2",
      transactionId: "TXN-002",
      userName: "Trần Thị B",
      policyNumber: "POL-2024-002",
      amount: "$8,000",
      amountRaw: 8000,
      method: "Bank Transfer",
      date: "2025-12-01 09:15",
      status: "completed",
    },
    {
      id: "3",
      transactionId: "TXN-003",
      userName: "Lê Văn C",
      policyNumber: "POL-2024-003",
      amount: "$5,000",
      amountRaw: 5000,
      method: "E-Wallet",
      date: "2025-12-01 08:45",
      status: "pending",
    },
    {
      id: "4",
      transactionId: "TXN-004",
      userName: "Phạm Thị D",
      policyNumber: "POL-2024-004",
      amount: "$12,000",
      amountRaw: 12000,
      method: "Credit Card",
      date: "2025-11-30 16:20",
      status: "failed",
    },
  ];

  const monthlyData = [
    { month: "T7", amount: 180 },
    { month: "T8", amount: 220 },
    { month: "T9", amount: 195 },
    { month: "T10", amount: 245 },
    { month: "T11", amount: 280 },
    { month: "T12", amount: 310 },
  ];

  const handleViewDetails = (payment) => {
    setDetailsPayment(payment);
    setShowDetailsModal(true);
    setSelectedPayment(null);
  };

  const handleConfirmPayment = (payment) => {
    setConfirmPayment(payment);
    setConfirmData({ transactionId: payment.transactionId, notes: "" });
    setShowConfirmModal(true);
    setSelectedPayment(null);
  };

  const handleConfirmSubmit = async () => {
    setActionLoading((prev) => ({ ...prev, [confirmPayment.id]: true }));
    try {
      await adminService.confirmPayment(confirmPayment.id, {
        TransactionId: confirmData.transactionId,
        Notes: confirmData.notes,
      });
      showSuccess("✅ Xác nhận thanh toán thành công");
      setShowConfirmModal(false);
      fetchPayments();
    } catch (err) {
      console.error("Error confirming payment:", err);
      showError("❌ Có lỗi xảy ra khi xác nhận thanh toán");
    } finally {
      setActionLoading((prev) => ({ ...prev, [confirmPayment.id]: false }));
    }
  };

  const handleRefundPayment = (payment) => {
    setRefundPayment(payment);
    setRefundReason("");
    setShowRefundModal(true);
    setSelectedPayment(null);
  };

  const handleRefundSubmit = async () => {
    if (!refundReason.trim()) {
      showWarning("Vui lòng nhập lý do hoàn tiền");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [refundPayment.id]: true }));
    try {
      await adminService.refundPayment(refundPayment.id, { Reason: refundReason });
      showSuccess("✅ Hoàn tiền thành công");
      setShowRefundModal(false);
      fetchPayments();
    } catch (err) {
      console.error("Error refunding payment:", err);
      showError("❌ Có lỗi xảy ra khi hoàn tiền");
    } finally {
      setActionLoading((prev) => ({ ...prev, [refundPayment.id]: false }));
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.reduce(
      (sum, p) => sum + (p.amountRaw || parseInt(p.amount.replace(/,/g, "")) || 0),
      0
    ),
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
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
            <p className="text-red-800 font-medium">Lỗi tải dữ liệu</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-600 text-sm">Hiển thị dữ liệu tạm thời...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-gray-900 mb-2">Payments Management</h1>
            <p className="text-gray-600">
              Track and manage all payment transactions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl text-gray-900 mt-1">
                ${(stats.total / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl text-red-600 mt-1">{stats.failed}</p>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-gray-900 mb-6">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#3b82f6"
                  name="Revenue (Thousand $)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by transaction ID or user name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-5 h-5" />
                  Export Excel
                </button>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Policy Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Date & Time
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
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-900">
                              {payment.transactionId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.policyNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.amount} VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.status === "completed" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                          {payment.status === "pending" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {payment.status === "failed" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3" />
                              Failed
                            </span>
                          )}
                          {payment.status === "refunded" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                              <RefreshCw className="w-3 h-3" />
                              Refunded
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setSelectedPayment(
                                  selectedPayment === payment.id
                                    ? null
                                    : payment.id
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            {selectedPayment === payment.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleViewDetails(payment)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                {payment.status === "pending" && (
                                  <button
                                    onClick={() => handleConfirmPayment(payment)}
                                    disabled={actionLoading[payment.id]}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600 disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm Payment
                                  </button>
                                )}
                                {payment.status === "completed" && (
                                  <button
                                    onClick={() => handleRefundPayment(payment)}
                                    disabled={actionLoading[payment.id]}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-purple-600 disabled:opacity-50"
                                  >
                                    <DollarSign className="w-4 h-4" />
                                    Refund
                                  </button>
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
                Showing {filteredPayments.length} of{" "}
                {payments.length} transactions
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
          {showDetailsModal && detailsPayment && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Transaction Details</h3>
                  <button onClick={() => setShowDetailsModal(false)} className="text-gray-500">✕</button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Transaction ID</label>
                      <p className="text-sm font-medium">{detailsPayment.transactionId}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Status</label>
                      <p className="text-sm">
                        {detailsPayment.status === "completed" && <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>}
                        {detailsPayment.status === "pending" && <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>}
                        {detailsPayment.status === "failed" && <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">Failed</span>}
                        {detailsPayment.status === "refunded" && <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Refunded</span>}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">User</label>
                      <p className="text-sm font-medium">{detailsPayment.userName}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Policy Number</label>
                      <p className="text-sm">{detailsPayment.policyNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Amount</label>
                      <p className="text-sm font-medium text-blue-600">{detailsPayment.amount} VNĐ</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                      <p className="text-sm">{detailsPayment.method}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Date & Time</label>
                      <p className="text-sm">{detailsPayment.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Payment Modal */}
          {showConfirmModal && confirmPayment && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Confirm Payment</h3>
                  <button onClick={() => setShowConfirmModal(false)} className="text-gray-500">✕</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Transaction ID</label>
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={confirmData.transactionId}
                      onChange={(e) => setConfirmData({...confirmData, transactionId: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notes</label>
                    <textarea
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                      value={confirmData.notes}
                      onChange={(e) => setConfirmData({...confirmData, notes: e.target.value})}
                      placeholder="Transaction notes..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={handleConfirmSubmit}
                    disabled={actionLoading[confirmPayment.id]}
                    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60 flex items-center gap-2"
                  >
                    {actionLoading[confirmPayment.id] && <Loader className="w-4 h-4 animate-spin" />}
                    {actionLoading[confirmPayment.id] ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Refund Payment Modal */}
          {showRefundModal && refundPayment && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Refund Payment</h3>
                  <button onClick={() => setShowRefundModal(false)} className="text-gray-500">✕</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Transaction ID</label>
                    <p className="text-sm font-medium">{refundPayment.transactionId}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Amount</label>
                    <p className="text-sm font-medium text-blue-600">{refundPayment.amount} VN Đ</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Refund Reason *</label>
                    <textarea
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                      placeholder="Enter refund reason..."
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setShowRefundModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={handleRefundSubmit}
                    disabled={actionLoading[refundPayment.id]}
                    className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-60 flex items-center gap-2"
                  >
                    {actionLoading[refundPayment.id] && <Loader className="w-4 h-4 animate-spin" />}
                    {actionLoading[refundPayment.id] ? "Processing..." : "Refund"}
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
