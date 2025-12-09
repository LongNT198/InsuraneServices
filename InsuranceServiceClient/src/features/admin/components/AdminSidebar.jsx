// src/features/admin/components/AdminSidebar.jsx
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";

// Menu cho Admin / Manager
const menuItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview", badge: null },
  { id: "users", icon: Users, label: "Users", badge: null },
  // Applications: dùng FileText cho chắc (tránh lỗi FormInput không tồn tại)
  { id: "applications", icon: FileText, label: "Applications", badge: "3" },
  { id: "policies", icon: FileText, label: "Policies", badge: "234" },
  { id: "claims", icon: ClipboardList, label: "Claims", badge: "12" },
  { id: "payments", icon: CreditCard, label: "Payments", badge: "5" },
  { id: "reports", icon: BarChart3, label: "Reports", badge: null },
  { id: "settings", icon: Settings, label: "Settings", badge: null },
];

export function AdminSidebar({ currentPage, onPageChange, isOpen }) {
  // Dùng admin auth để logout đúng context
  const { logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 z-30 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-blue-700">
        {isOpen ? (
          <h1 className="text-xl font-semibold tracking-wide">Admin Panel</h1>
        ) : (
          <LayoutDashboard className="w-8 h-8" />
        )}
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-blue-100 hover:bg-blue-700/50"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-blue-100 hover:bg-blue-700/50 transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm">Logout</span>}
        </button>
        {isOpen && (
          <div className="text-xs text-blue-300 text-center mt-3">
            © 2025 Insurance Admin
          </div>
        )}
      </div>
    </aside>
  );
}
