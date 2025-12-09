import { useState, useEffect } from "react";
import {
  Save,
  Bell,
  Lock,
  Globe,
  Palette,
  Database,
  Mail,
  Shield,
  Loader,
  AlertCircle,
} from "lucide-react";
import adminService from "../../shared/api/services/adminService";

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    companyName: "Công Ty Bảo Hiểm ABC",
    contactEmail: "contact@insurance.vn",
    phone: "1900-xxxx",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getSettings();
      const data = response.data || response;
      if (data) {
        setSettings({
          companyName: data.companyName || settings.companyName,
          contactEmail: data.contactEmail || settings.contactEmail,
          phone: data.phone || settings.phone,
          address: data.address || settings.address,
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err.message);
      // Keep default settings
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await adminService.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
          <div>
            <h3 className="text-green-800 font-semibold">Success</h3>
            <p className="text-green-700 text-sm mt-1">
              Settings saved successfully
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Manage system settings and configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-white rounded-xl border border-gray-200 p-4">
          <nav className="space-y-2">
            {[
              { id: "general", icon: Globe, label: "Chung" },
              { id: "notifications", icon: Bell, label: "Thông Báo" },
              { id: "security", icon: Lock, label: "Bảo Mật" },
              { id: "appearance", icon: Palette, label: "Giao Diện" },
              { id: "data", icon: Database, label: "Dữ Liệu" },
              { id: "email", icon: Mail, label: "Email" },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-4">Cài Đặt Chung</h2>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tên Công Ty
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email Liên Hệ
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Địa Chỉ
                </label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <Save className="w-5 h-5" />
                {isSaving ? "Đang Lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-4">Cài Đặt Thông Báo</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Thông báo yêu cầu bồi thường mới",
                    desc: "Nhận thông báo khi có yêu cầu mới",
                  },
                  {
                    title: "Thông báo thanh toán",
                    desc: "Nhận thông báo khi có giao dịch mới",
                  },
                  {
                    title: "Thông báo chính sách mới",
                    desc: "Nhận thông báo khi có chính sách được tạo",
                  },
                  {
                    title: "Thông báo đại lý",
                    desc: "Nhận thông báo về hoạt động đại lý",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <Save className="w-5 h-5" />
                {isSaving ? "Đang Lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 mb-4">Bảo Mật</h2>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">
                    Bảo mật được kích hoạt
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Hệ thống của bạn đang được bảo vệ
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mật Khẩu Hiện Tại
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mật Khẩu Mới
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Xác Nhận Mật Khẩu Mới
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <Lock className="w-5 h-5" />
                {isSaving ? "Đang Cập Nhật..." : "Cập Nhật Mật Khẩu"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
