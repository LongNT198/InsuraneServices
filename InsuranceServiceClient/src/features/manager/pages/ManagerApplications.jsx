// src/features/manager/pages/ManagerApplications.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";

import managerApplicationsService from "/src/features/shared/api/services/managerApplicationsService";
import { ApplicationTimeline } from "/src/features/shared/components/ApplicationTimeline";
import { useToast } from "/src/features/shared/contexts/ToastContext";

// =======================
// Helper functions
// =======================

// Lấy giá trị đầu tiên tồn tại trong các key, nếu không có trả fallback
const safeField = (obj, keys, fallback = "") => {
  if (!obj) return fallback;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
      return obj[k];
    }
  }
  return fallback;
};

// Parse JSON an toàn
const parseJson = (value) => {
  if (!value) return null;
  try {
    if (typeof value === "string") return JSON.parse(value);
    return value;
  } catch {
    return null;
  }
};

// Helper: format tiền VND
const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper: format date
const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("vi-VN");
};

// Badge màu theo status
const StatusBadge = ({ status }) => {
  const base =
    "px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";

  switch (status) {
    case "Submitted":
      return (
        <span
          className={`${base} bg-blue-50 text-blue-700 border border-blue-200`}
        >
          <ClockIcon className="w-3 h-3" />
          Submitted
        </span>
      );
    case "Approved":
      return (
        <span
          className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-200`}
        >
          <CheckCircle2 className="w-3 h-3" />
          Approved
        </span>
      );
    case "Rejected":
      return (
        <span
          className={`${base} bg-rose-50 text-rose-700 border border-rose-200`}
        >
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    default:
      return (
        <span
          className={`${base} bg-slate-50 text-slate-700 border border-slate-200`}
        >
          {status || "Unknown"}
        </span>
      );
  }
};

// Clock icon nhỏ để dùng trong badge
const ClockIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      fill="none"
      strokeWidth="1.5"
    />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// =======================
// Component chính
// =======================

export function ManagerApplications() {
  const { showError, showSuccess, showInfo } = useToast();

  const [applications, setApplications] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Submitted"); // sau này nếu muốn mở rộng

  // =============================
  // 1. Load list Submitted
  // =============================
  const loadApplications = async () => {
    try {
      setLoadingList(true);
      const res = await managerApplicationsService.getSubmittedApplications();
      const list = res?.data?.applications || [];
      setApplications(list);

      if (!list.length) {
        showInfo("Hiện chưa có hồ sơ nào đang Submitted cho Manager.");
      }
    } catch (err) {
      console.error("Error loading manager applications", err);
      showError("Không tải được danh sách hồ sơ cho Manager.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // =============================
  // 2. Load details khi chọn 1 hồ sơ
  // =============================
  const handleSelectApplication = async (app) => {
    if (!app?.id) return;

    // nếu click lại đúng hồ sơ đang mở thì bỏ qua
    if (selectedApplication && selectedApplication.id === app.id) return;

    try {
      setLoadingDetails(true);
      setSelectedApplication(null);

      const res = await managerApplicationsService.getApplicationDetails(
        app.id
      );
      const details = res?.data?.application;
      setSelectedApplication(details || null);
      setDecisionNotes(details?.reviewNotes || "");
    } catch (err) {
      console.error("Error loading application details for manager", err);
      showError("Không tải được chi tiết hồ sơ.");
    } finally {
      setLoadingDetails(false);
    }
  };

  // =============================
  // 3. Ra quyết định Approved / Rejected
  // =============================
  const handleDecision = async (status) => {
    if (!selectedApplication?.id) return;

    if (!["Approved", "Rejected"].includes(status)) return;

    if (status === "Rejected" && !decisionNotes.trim()) {
      const confirm = window.confirm(
        "Bạn đang từ chối hồ sơ nhưng chưa nhập ghi chú. Bạn có chắc chắn tiếp tục?"
      );
      if (!confirm) return;
    }

    try {
      setDecisionLoading(true);

      await managerApplicationsService.decideApplication(
        selectedApplication.id,
        {
          status,
          reviewNotes: decisionNotes || "",
        }
      );

      showSuccess(
        `Hồ sơ ${
          selectedApplication.applicationNumber
        } đã được ${status.toLowerCase()} thành công.`
      );

      // reload list
      await loadApplications();

      // reload lại chi tiết (phòng trường hợp frontend vẫn cho xem hồ sơ sau khi quyết định)
      try {
        const res = await managerApplicationsService.getApplicationDetails(
          selectedApplication.id
        );
        const details = res?.data?.application;
        setSelectedApplication(details || null);
      } catch {
        // nếu bị 404 (hoặc ko còn Submitted) thì ẩn panel
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error("Error making manager decision", err);
      showError("Không thể lưu quyết định của Manager.");
    } finally {
      setDecisionLoading(false);
    }
  };

  // =============================
  // 4. Filter + search
  // =============================
  const filteredApplications = useMemo(() => {
    let list = [...applications];

    if (statusFilter) {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((a) => {
        const fields = [
          a.applicationNumber,
          a.productName,
          a.productType,
          a.applicantName,
          a.status,
        ];
        return fields.some((f) => (f || "").toLowerCase().includes(term));
      });
    }

    return list;
  }, [applications, searchTerm, statusFilter]);

  // =============================
  // 5. Render UI
  // =============================
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" />
            Manager Decisions
          </h1>
          <p className="text-sm text-slate-500">
            Danh sách các hồ sơ bảo hiểm đang ở trạng thái Submitted, chờ
            Manager phê duyệt.
          </p>
        </div>

        <button
          onClick={loadApplications}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
          disabled={loadingList}
        >
          {loadingList ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Tải lại
            </>
          )}
        </button>
      </div>

      {/* Top filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số hồ sơ, tên khách hàng, sản phẩm..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main layout: list + details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* LEFT: List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Hồ sơ chờ xử lý
            </h2>
            <span className="text-xs text-slate-500">
              {filteredApplications.length} / {applications.length} hồ sơ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-xs text-slate-500">
                  <th className="px-3 py-2 text-left font-medium">Số hồ sơ</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Khách hàng
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Sản phẩm</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Thời gian gửi
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải danh sách...
                      </div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-400 text-sm"
                    >
                      Không có hồ sơ nào phù hợp điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const isSelected = selectedApplication?.id === app.id;
                    return (
                      <tr
                        key={app.id}
                        className={`border-t border-slate-50 hover:bg-slate-50/60 transition-colors ${
                          isSelected ? "bg-indigo-50/40" : ""
                        }`}
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-slate-800">
                            {app.applicationNumber || `#${app.id}`}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-slate-800 text-xs sm:text-sm">
                            {app.applicantName || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-xs text-slate-700">
                            {app.productName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {app.productType}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-slate-500 whitespace-nowrap">
                          {formatDateTime(app.submittedAt || app.createdAt)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => handleSelectApplication(app)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            <Eye className="w-3 h-3" />
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5 flex flex-col gap-4">
          {!selectedApplication && !loadingDetails && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-8">
              <AlertCircle className="w-10 h-10 mb-2" />
              <p className="text-sm">
                Hãy chọn một hồ sơ ở bảng bên trái để xem chi tiết và phê duyệt.
              </p>
            </div>
          )}

          {loadingDetails && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-8">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="text-sm">Đang tải chi tiết hồ sơ...</p>
            </div>
          )}

          {selectedApplication && !loadingDetails && (
            <>
              {/* Basic info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                      Hồ sơ
                    </div>
                    <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      {selectedApplication.applicationNumber ||
                        `#${selectedApplication.id}`}
                      <StatusBadge status={selectedApplication.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Khách hàng:{" "}
                      <span className="font-medium">
                        {selectedApplication.applicantName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-[11px] text-slate-500">Sản phẩm</div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedApplication.productName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {selectedApplication.productType}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-[11px] text-slate-500">
                      Số tiền bảo hiểm
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {formatCurrency(selectedApplication.coverageAmount)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Thời hạn: {selectedApplication.termYears} năm •{" "}
                      {selectedApplication.paymentFrequency}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline (reuse component dùng chung) */}
              <div className="border border-slate-100 rounded-lg p-3">
                <ApplicationTimeline application={selectedApplication} />
              </div>

              {/* Health Declaration */}
              {selectedApplication.healthDeclaration && (
                <div className="border border-slate-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Health Declaration
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 mb-1">
                        Lịch sử bệnh
                      </div>
                      <ul className="space-y-1 text-slate-600">
                        <li>
                          <span className="font-medium">Bệnh mãn tính:</span>{" "}
                          {safeField(
                            selectedApplication.healthDeclaration,
                            ["chronicConditions", "medicalConditions"],
                            "Không khai báo"
                          )}
                        </li>
                        <li>
                          <span className="font-medium">
                            Nhập viện gần đây:
                          </span>{" "}
                          {selectedApplication.healthDeclaration
                            .hasRecentHospitalization
                            ? "Có"
                            : "Không"}
                        </li>
                        <li>
                          <span className="font-medium">Hút thuốc:</span>{" "}
                          {selectedApplication.healthDeclaration.isSmoker
                            ? "Có"
                            : "Không"}
                        </li>
                        <li>
                          <span className="font-medium">Uống rượu:</span>{" "}
                          {selectedApplication.healthDeclaration.isDrinker
                            ? "Có"
                            : "Không"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-800 mb-1">
                        Nghề nghiệp & rủi ro
                      </div>
                      <ul className="space-y-1 text-slate-600">
                        <li>
                          <span className="font-medium">Nghề:</span>{" "}
                          {selectedApplication.healthDeclaration.occupation ||
                            "Không khai báo"}
                        </li>
                        <li>
                          <span className="font-medium">
                            Nghề có rủi ro cao:
                          </span>{" "}
                          {selectedApplication.healthDeclaration
                            .hasHighRiskOccupation
                            ? "Có"
                            : "Không"}
                        </li>
                        <li>
                          <span className="font-medium">
                            Tham gia thể thao mạo hiểm:
                          </span>{" "}
                          {selectedApplication.healthDeclaration
                            .participatesInDangerousSports
                            ? "Có"
                            : "Không"}
                        </li>
                      </ul>
                    </div>
                  </div>

                  {selectedApplication.healthDeclaration.reviewNotes && (
                    <div className="mt-2 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 text-xs text-amber-800">
                      <div className="font-semibold mb-1">
                        Ghi chú từ Officer
                      </div>
                      <div className="whitespace-pre-wrap">
                        {selectedApplication.healthDeclaration.reviewNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Beneficiaries */}
              {selectedApplication.beneficiaries &&
                selectedApplication.beneficiaries.length > 0 && (
                  <div className="border border-slate-100 rounded-lg p-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Beneficiaries
                    </div>
                    <div className="space-y-2 text-xs">
                      {selectedApplication.beneficiaries.map((b) => (
                        <div
                          key={b.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border border-slate-100 rounded-md px-2 py-1.5"
                        >
                          <div>
                            <div className="font-semibold text-slate-800">
                              {b.fullName}{" "}
                              <span className="text-[11px] font-normal text-slate-500">
                                ({b.relationship || b.type})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Tỷ lệ: {b.percentage}% • DOB:{" "}
                              {b.dateOfBirth
                                ? new Date(b.dateOfBirth).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Decision box */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <div className="text-xs font-semibold text-slate-800">
                    Quyết định của Manager
                  </div>
                </div>

                <textarea
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ghi chú / lý do phê duyệt hoặc từ chối (khuyến khích nhập khi từ chối)."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleDecision("Rejected")}
                    disabled={decisionLoading}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-rose-200 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                  >
                    {decisionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision("Approved")}
                    disabled={decisionLoading}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {decisionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerApplications;
