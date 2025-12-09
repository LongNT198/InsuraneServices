// src/features/admin/components/ManagerApplicationExtraDetails.jsx
import { AlertCircle } from "lucide-react";

// format tiền
const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("vi-VN");
};

export function ManagerApplicationExtraDetails({ details }) {
  if (!details) {
    return (
      <div className="mt-4 border border-slate-100 rounded-lg p-4 text-xs text-slate-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Không có thêm thông tin chi tiết từ Manager API.
      </div>
    );
  }

  const profile = details.customerProfile;
  const hd = details.healthDeclaration;
  const beneficiaries = details.beneficiaries || [];

  return (
    <div className="mt-6 space-y-4">
      {/* ===== THÔNG TIN KHÁCH HÀNG ===== */}
      {profile && (
        <section className="border border-slate-200 bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Thông Tin Khách Hàng (Manager View)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <p>
                <span className="font-semibold">Họ & Tên: </span>
                {profile.fullName ||
                  `${profile.firstName || ""} ${
                    profile.lastName || ""
                  }`.trim() ||
                  "N/A"}
              </p>
              <p>
                <span className="font-semibold">Giới tính: </span>
                {profile.gender || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Ngày sinh: </span>
                {formatDate(profile.dateOfBirth)}
              </p>
              <p>
                <span className="font-semibold">CMND/CCCD: </span>
                {profile.nationalId || "N/A"}
              </p>
            </div>

            <div>
              <p>
                <span className="font-semibold">Email: </span>
                {profile.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Số điện thoại: </span>
                {profile.phoneNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Nghề nghiệp: </span>
                {profile.occupationOther
                  ? `${profile.occupationOther} (${
                      profile.occupation || "Khác"
                    })`
                  : profile.occupation || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Thu nhập (tháng): </span>
                {profile.monthlyIncome
                  ? formatCurrency(profile.monthlyIncome)
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-700">
            <p>
              <span className="font-semibold">Địa chỉ: </span>
              {profile.address || "N/A"}
              {profile.city ? `, ${profile.city}` : ""}
              {profile.postalCode ? ` (${profile.postalCode})` : ""}
            </p>
          </div>

          <div className="mt-3 text-xs text-slate-700">
            <p className="font-semibold mb-1">Liên hệ khẩn cấp:</p>
            <p>
              <span className="font-semibold">Họ tên: </span>
              {profile.emergencyContactName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">SĐT: </span>
              {profile.emergencyContactPhone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Quan hệ: </span>
              {profile.emergencyContactRelationshipOther ||
                profile.emergencyContactRelationship ||
                "N/A"}
            </p>
          </div>
        </section>
      )}

      {/* ===== HEALTH DECLARATION (TÓM TẮT) ===== */}
      {hd && (
        <section className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Tóm Tắt Khai Báo Sức Khỏe
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <p>
                <span className="font-semibold">Hút thuốc: </span>
                {hd.isSmoker ? "Có" : "Không"}
              </p>
              <p>
                <span className="font-semibold">Uống rượu/bia: </span>
                {hd.isDrinker ? "Có" : "Không"}{" "}
                {hd.alcoholConsumption && `(${hd.alcoholConsumption})`}
              </p>
              <p>
                <span className="font-semibold">Chiều cao / Cân nặng: </span>
                {hd.height && hd.weight
                  ? `${hd.height} cm • ${hd.weight} kg`
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Huyết áp: </span>
                {hd.bloodPressureSystolic && hd.bloodPressureDiastolic
                  ? `${hd.bloodPressureSystolic}/${hd.bloodPressureDiastolic}`
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Nhập viện gần đây: </span>
                {hd.hasRecentHospitalization ? "Có" : "Không"}
              </p>
            </div>

            <div>
              <p>
                <span className="font-semibold">Nghề nghiệp: </span>
                {hd.occupation || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Nghề có rủi ro cao: </span>
                {hd.hasHighRiskOccupation ? "Có" : "Không"}
              </p>
              <p>
                <span className="font-semibold">Thể thao mạo hiểm: </span>
                {hd.participatesInDangerousSports ? "Có" : "Không"}
              </p>
              <p>
                <span className="font-semibold">Bệnh lý nghiêm trọng: </span>
                {hd.hasLifeThreateningCondition ? "Có" : "Không"}
              </p>
            </div>
          </div>

          {hd.reviewNotes && (
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 text-xs text-amber-800">
              <p className="font-semibold mb-1">Ghi chú từ Officer / Bác sĩ:</p>
              <p className="whitespace-pre-wrap">{hd.reviewNotes}</p>
            </div>
          )}
        </section>
      )}

      {/* ===== BENEFICIARIES ===== */}
      {beneficiaries.length > 0 && (
        <section className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Người Thụ Hưởng
          </h3>

          <div className="space-y-2 text-xs">
            {beneficiaries.map((b) => (
              <div
                key={b.id}
                className="border border-slate-100 rounded-md px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {b.fullName}{" "}
                    <span className="text-[11px] font-normal text-slate-500">
                      ({b.relationshipOther || b.relationship || b.type})
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ngày sinh:{" "}
                    {b.dateOfBirth ? formatDate(b.dateOfBirth) : "N/A"} • Tỷ lệ:{" "}
                    {b.percentage ?? 0}%
                  </p>
                </div>
                <div className="text-[11px] text-slate-500">
                  {b.isMinor && (
                    <span className="mr-2">• Là người chưa thành niên</span>
                  )}
                  {b.isIrrevocable && <span>• Không hủy ngang</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
