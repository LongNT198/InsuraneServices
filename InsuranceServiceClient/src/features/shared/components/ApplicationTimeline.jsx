// src/features/shared/components/ApplicationTimeline.jsx
import { CheckCircle2, Clock, FileText, UserCheck } from "lucide-react";

// Helper format datetime
const formatDateTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("vi-VN");
};

/**
 * application: object chứa các field thời gian, ví dụ:
 * - createdAt
 * - submittedAt
 * - reviewedAt
 * - status
 * - reviewedBy
 */
export function ApplicationTimeline({ application }) {
  if (!application) return null;

  const { createdAt, submittedAt, reviewedAt, status, reviewedBy } =
    application;

  // Chuẩn hoá status cho dễ hiển thị
  const normalizedStatus = (status || "").toLowerCase();

  const steps = [
    {
      id: "created",
      label: "Khởi tạo hồ sơ",
      description: "Khách hàng bắt đầu tạo hồ sơ bảo hiểm.",
      date: formatDateTime(createdAt),
      alwaysDone: true,
    },
    {
      id: "submitted",
      label: "Gửi hồ sơ",
      description: "Khách hàng đã gửi hồ sơ lên hệ thống.",
      date: formatDateTime(submittedAt),
    },
    {
      id: "officer",
      label: "Officer review",
      description: "Officer kiểm tra và đánh giá hồ sơ.",
      // Ta không có thời gian riêng cho Officer, tạm dùng submittedAt / reviewedAt
      date: formatDateTime(submittedAt),
    },
    {
      id: "manager",
      label: "Quyết định Manager",
      description:
        status === "Approved"
          ? "Hồ sơ đã được Manager phê duyệt."
          : status === "Rejected"
          ? "Hồ sơ đã bị Manager từ chối."
          : "Đang chờ quyết định cuối cùng từ Manager.",
      date: formatDateTime(reviewedAt),
      extra: reviewedBy && reviewedAt ? `By: ${reviewedBy}` : null,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          Application Timeline
        </h3>
        <span className="text-xs text-slate-500">
          Trạng thái hiện tại:{" "}
          <span className="font-medium">{status || "Unknown"}</span>
        </span>
      </div>

      <ol className="relative border-l border-slate-200 ml-2 pl-4 space-y-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isDone =
            step.alwaysDone ||
            (step.id === "submitted" && submittedAt) ||
            (step.id === "officer" && submittedAt) ||
            (step.id === "manager" && reviewedAt) ||
            false;

          const Icon =
            step.id === "created"
              ? FileText
              : step.id === "manager"
              ? UserCheck
              : Clock;

          return (
            <li key={step.id} className={isLast ? "pb-1" : "pb-4"}>
              <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-white border border-slate-300">
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Icon className="w-3 h-3 text-slate-400" />
                )}
              </span>

              <div className="ml-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {step.label}
                  </p>
                  {step.date && (
                    <span className="text-[11px] text-slate-400">
                      {step.date}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {step.description}
                </p>
                {step.extra && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {step.extra}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ApplicationTimeline;
