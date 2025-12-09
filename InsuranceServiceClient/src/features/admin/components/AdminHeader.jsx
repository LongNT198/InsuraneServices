// src/features/admin/components/AdminHeader.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Search, User, LogOut, Settings } from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";

export function AdminHeader({ sidebarOpen, onToggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Dùng admin auth thay vì auth của customer
  const { admin, logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const notifications = [
    {
      id: 1,
      text: "Yêu cầu bồi thường mới từ Nguyễn Văn A",
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      text: "Thanh toán đã được xác nhận",
      time: "1 giờ trước",
      unread: true,
    },
    {
      id: 3,
      text: "Chính sách mới đã được thêm",
      time: "2 giờ trước",
      unread: false,
    },
  ];

  const displayName =
    admin?.fullName || admin?.userName || admin?.name || "Admin User";
  const displayEmail = admin?.email || "admin@insurance.vn";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-sm">Thông Báo</h3>
              </div>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    notif.unread ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="text-sm text-gray-800">{notif.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              ))}
              <div className="px-4 py-2 border-t border-gray-200 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-500">{displayEmail}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-500">{displayEmail}</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Cài đặt tài khoản
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
