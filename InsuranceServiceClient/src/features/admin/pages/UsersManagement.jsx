import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Download,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useToast } from "../../shared/contexts/ToastContext";
import Toast from "../../shared/components/Toast/Toast";
import ConfirmModal from "../../shared/components/ConfirmModal/ConfirmModal";
import adminService from "../../shared/api/services/adminService";

export function UsersManagement() {
  const { showSuccess, showError, showWarning } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createFieldErrors, setCreateFieldErrors] = useState({});
  const [createUserForm, setCreateUserForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Officer", // Default role
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editFieldErrors, setEditFieldErrors] = useState({});
  
  // Confirm modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ action: null, userId: null });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      // Map response to expected format
      const mappedUsers = (response || []).map((user) => {
        const roles = Array.isArray(user.roles) ? user.roles : (user.roles ? Object.values(user.roles) : []);
        return {
          id: user.id,
          name: user.userName || "N/A",
          email: user.email,
          phone: user.phoneNumber || "N/A",
          policies: 0, // Will fetch from policies endpoint
          totalPremium: "0",
          joinDate: user.createdDate
            ? new Date(user.createdDate).toLocaleDateString()
            : "N/A",
          status:
            user.lockoutEnd && new Date(user.lockoutEnd) > new Date()
              ? "suspended"
              : "active",
          roles: roles || [],
        };
      });
      setUsers(mappedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
      // Use mock data as fallback
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = () => [
    {
      id: "USR-001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      policies: 3,
      totalPremium: "25,000,000",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: "USR-002",
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0902345678",
      policies: 2,
      totalPremium: "18,000,000",
      joinDate: "2024-02-20",
      status: "active",
    },
    {
      id: "USR-003",
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0903456789",
      policies: 1,
      totalPremium: "12,000,000",
      joinDate: "2024-03-10",
      status: "inactive",
    },
    {
      id: "USR-004",
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0904567890",
      policies: 4,
      totalPremium: "35,000,000",
      joinDate: "2024-04-05",
      status: "active",
    },
    {
      id: "USR-005",
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      phone: "0905678901",
      policies: 2,
      totalPremium: "20,000,000",
      joinDate: "2024-05-12",
      status: "suspended",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.status === filterStatus;
    const matchesRole =
      filterRole === "all" || (user.roles && user.roles.some(r => r.toLowerCase() === filterRole.toLowerCase()));
    return matchesSearch && matchesFilter && matchesRole;
  });

  const handleDeleteUser = async (userId) => {
    setConfirmData({ action: 'delete', userId });
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    const userId = confirmData.userId;
    setShowConfirmModal(false);
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      await adminService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      showSuccess("✅ User deleted successfully");
    } catch (err) {
      showError("❌ Error: " + (err.message || "Failed to delete user"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleLockUser = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      await adminService.lockUser(userId);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u))
      );
      showSuccess("✅ Khóa tài khoản thành công");
    } catch (err) {
      showError("❌ Lỗi: " + (err.message || "Failed to lock user"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnlockUser = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      await adminService.unlockUser(userId);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
      );
      showSuccess("✅ Mở khóa tài khoản thành công");
    } catch (err) {
      showError("❌ Lỗi: " + (err.message || "Failed to unlock user"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleViewDetails = (user) => {
    setDetailsUser(user);
    setShowDetailsModal(true);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    // Get current roles - user.roles is an array from backend
    const currentRoles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['Customer'];
    const primaryRole = currentRoles[0]; // Use first role as primary
    
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      currentRoles: currentRoles, // Store all current roles
      currentRole: primaryRole,
      newRole: primaryRole,
    });
    setShowEditModal(true);
    setSelectedUser(null);
  };

  const handleEditUserChange = (field, value) => {
    setEditUser((s) => ({ ...s, [field]: value }));
  };

  const handleEditUserSubmit = async () => {
    if (!editUser.email) {
      showWarning("Email là bắt buộc");
      return;
    }

    setEditError(null);
    setEditFieldErrors({});

    try {
      setEditLoading(true);
      const payload = {
        UserName: editUser.name || editUser.email,
        Email: editUser.email,
        PhoneNumber: editUser.phone,
      };

      await adminService.updateUser(editUser.id, payload);

      // Handle role change if user selected a different role
      if (editUser.newRole && editUser.newRole !== editUser.currentRole) {
        try {
          // Remove ALL old roles first
          const rolesToRemove = editUser.currentRoles || [editUser.currentRole];
          for (const oldRole of rolesToRemove) {
            if (oldRole && oldRole !== editUser.newRole) {
              try {
                await adminService.removeRole(editUser.id, oldRole);
                console.log(`Removed role: ${oldRole}`);
              } catch (removeErr) {
                // Ignore error if role doesn't exist or already removed
                console.log(`Could not remove role ${oldRole}:`, removeErr);
              }
            }
          }
          
          // Assign new role
          await adminService.assignRole(editUser.id, editUser.newRole);
          console.log(`Assigned new role: ${editUser.newRole}`);
          showSuccess("✅ Cập nhật người dùng và vai trò thành công");
        } catch (roleErr) {
          console.error("Lỗi cập nhật vai trò:", roleErr);
          const errorMsg = roleErr?.response?.data?.message || roleErr?.message || String(roleErr);
          showError("❌ Cập nhật thông tin thành công nhưng lỗi khi thay đổi vai trò: " + errorMsg);
        }
      } else {
        showSuccess("✅ Cập nhật người dùng thành công");
      }
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi cập nhật người dùng:", err);
      if (err && typeof err === "object") {
        const msg = err.message || err.data?.message || err.data?.title || "An error occurred";
        setEditError(msg);
        const validatorErrors = err.errors || err.validationErrors || err.data?.errors || err.data?.validationErrors || {};
        const mapped = mapValidationErrors(validatorErrors || {});
        if (mapped.model) {
          setEditError((prev) => [prev].concat(mapped.model).filter(Boolean).join(' - '));
          delete mapped.model;
        }
        setEditFieldErrors(mapped);
      } else {
        setEditError(String(err));
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateUserChange = (field, value) => {
    setCreateUserForm((s) => ({ ...s, [field]: value }));
  };

  // Map server validation errors (Identity codes or field keys) to frontend field keys
  const mapValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') return {};
    const mapped = {};

    const push = (targetKey, val) => {
      const arr = Array.isArray(val) ? val : [val];
      if (mapped[targetKey]) mapped[targetKey] = mapped[targetKey].concat(arr);
      else mapped[targetKey] = arr;
    };

    Object.entries(errors).forEach(([k, v]) => {
      const key = String(k || '').toLowerCase();

      // Common Identity error codes -> map to fields
      if (key.includes('duplicate') && key.includes('email')) {
        push('Email', v);
      } else if (key.includes('duplicate') && key.includes('user')) {
        // DuplicateUserName typically means the email/username is taken
        push('Email', v);
      } else if (key.includes('email') || key === 'email') {
        push('Email', v);
      } else if (key.includes('password')) {
        push('Password', v);
      } else if (key.includes('phone') || key.includes('phonenumber')) {
        push('PhoneNumber', v);
      } else if (key.includes('username') || key === 'username' || key === 'userName') {
        push('UserName', v);
      } else if (key.includes('role')) {
        push('Role', v);
      } else if (key === 'model' || key === 'errors' || key === 'validation') {
        // put general model errors under createError
        push('model', v);
      } else {
        // unknown keys: preserve original key so developer can see it
        push(k, v);
      }
    });

    return mapped;
  };

  const handleCreateUserSubmit = async () => {
    if (!createUserForm.email || !createUserForm.password) {
      showWarning("Email và mật khẩu là bắt buộc");
      return;
    }

    // clear previous errors
    setCreateError(null);
    setCreateFieldErrors({});

    try {
      setCreateLoading(true);
      const payload = {
        UserName: createUserForm.userName || createUserForm.email,
        Email: createUserForm.email,
        PhoneNumber: createUserForm.phoneNumber,
        Password: createUserForm.password,
        Role: createUserForm.role,
      };

      await adminService.createUser(payload);
      showSuccess("✅ Tạo người dùng thành công");
      setShowCreateModal(false);
      setCreateUserForm({ userName: "", email: "", phoneNumber: "", password: "", role: "Officer" });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi tạo người dùng:", err);
      if (err && typeof err === "object") {
        const msg = err.message || err.data?.message || err.data?.title || "An error occurred";
        setCreateError(msg);
        const validatorErrors = err.errors || err.validationErrors || err.data?.errors || err.data?.validationErrors || {};
        const mapped = mapValidationErrors(validatorErrors || {});
        // If there are model-level messages, merge them into createError for visibility
        if (mapped.model) {
          setCreateError((prev) => [prev].concat(mapped.model).filter(Boolean).join(' - '));
          delete mapped.model;
        }
        setCreateFieldErrors(mapped);
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
          <h1 className="text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">
            Manage all customers and their information
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">Error Loading Data</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl text-green-600 mt-1">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl text-gray-500 mt-1">
            {users.filter((u) => u.status === "inactive").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Suspended</p>
          <p className="text-2xl text-red-600 mt-1">
            {users.filter((u) => u.status === "suspended").length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="Officer">Officer</option>
              <option value="Manager">Manager</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex justify-center items-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Join Date
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role, idx) => {
                              const roleText = role === "Officer" ? "Nhân Viên" : role === "Manager" ? "Quản Lý" : role === "Admin" ? "Admin" : role === "User" ? "Khách Hàng" : role;
                              return (
                                <span key={idx} className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {roleText}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Chưa gán vai trò</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.status === "active" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                            Hoạt Động
                          </span>
                        )}
                        {user.status === "inactive" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">
                            Không Hoạt Động
                          </span>
                        )}
                        {user.status === "suspended" && (
                          <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                            Đình Chỉ
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSelectedUser(
                                selectedUser === user.id ? null : user.id
                              )
                            }
                            disabled={actionLoading[user.id]}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            {actionLoading[user.id] ? (
                              <Loader className="w-5 h-5 animate-spin text-gray-600" />
                            ) : (
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                          {selectedUser === user.id &&
                            !actionLoading[user.id] && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleViewDetails(user)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  Xem Chi Tiết
                                </button>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Chỉnh Sửa
                                </button>
                                {user.status === "active" && (
                                  <button
                                    onClick={() => handleLockUser(user.id)}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-yellow-600"
                                  >
                                    🔒 Khóa Tài Khoản
                                  </button>
                                )}
                                {user.status === "suspended" && (
                                  <button
                                    onClick={() => handleUnlockUser(user.id)}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                                  >
                                    🔓 Mở Khóa Tài Khoản
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa
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
              Showing {filteredUsers.length} of {users.length} users
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
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Thêm Người Dùng Mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-4">
              {createError && (
                <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <div className="font-medium">Lỗi: {createError}</div>
                  {createFieldErrors && Object.keys(createFieldErrors).length > 0 && (
                    <ul className="mt-2 list-disc ml-5 text-xs">
                      {Object.entries(createFieldErrors).map(([k, v]) => (
                        <li key={k}>
                          <strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={createUserForm.email}
                  onChange={(e) => handleCreateUserChange("email", e.target.value)}
                />
                {createFieldErrors && createFieldErrors.Email && (
                  <p className="text-xs text-red-600 mt-1">{Array.isArray(createFieldErrors.Email) ? createFieldErrors.Email.join(', ') : createFieldErrors.Email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên Người Dùng (tùy chọn)</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={createUserForm.userName}
                  onChange={(e) => handleCreateUserChange("userName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Vai Trò *</label>
                <select 
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={createUserForm.role}
                  onChange={(e) => handleCreateUserChange("role", e.target.value)}
                >
                  <option value="Officer">Officer (Cán bộ)</option>
                  <option value="Manager">Manager (Quản lý)</option>
                </select>
                {createFieldErrors && createFieldErrors.Role && (
                  <p className="text-xs text-red-600 mt-1">{Array.isArray(createFieldErrors.Role) ? createFieldErrors.Role.join(', ') : createFieldErrors.Role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Số Điện Thoại (tùy chọn)</label>
                <input
                  type="tel"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={createUserForm.phoneNumber}
                  onChange={(e) => handleCreateUserChange("phoneNumber", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Mật Khẩu</label>
                <input
                  type="password"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={createUserForm.password}
                  onChange={(e) => handleCreateUserChange("password", e.target.value)}
                />
                {createFieldErrors && createFieldErrors.Password && (
                  <p className="text-xs text-red-600 mt-1">{Array.isArray(createFieldErrors.Password) ? createFieldErrors.Password.join(', ') : createFieldErrors.Password}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateUserSubmit}
                disabled={createLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 flex items-center gap-2"
              >
                {createLoading && <Loader className="w-4 h-4 animate-spin" />}
                {createLoading ? "Đang tạo..." : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && detailsUser && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Chi Tiết Người Dùng</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Tên</label>
                <p className="text-gray-900">{detailsUser.name || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Email</label>
                <p className="text-gray-900">{detailsUser.email}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Số Điện Thoại</label>
                <p className="text-gray-900">{detailsUser.phone || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Vai Trò</label>
                <div className="flex flex-wrap gap-1">
                  {detailsUser.roles && Array.isArray(detailsUser.roles) && detailsUser.roles.length > 0 ? (
                    detailsUser.roles.map((role, idx) => {
                      const roleText = role === "Officer" ? "Nhân Viên" : role === "Manager" ? "Quản Lý" : role === "Admin" ? "Admin" : role === "User" ? "Khách Hàng" : role;
                      return (
                        <span key={idx} className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {roleText}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-500">Chưa gán vai trò</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Trạng Thái</label>
                {detailsUser.status === "active" && (
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                    Hoạt Động
                  </span>
                )}
                {detailsUser.status === "inactive" && (
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">
                    Không Hoạt Động
                  </span>
                )}
                {detailsUser.status === "suspended" && (
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                    Đình Chỉ
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Ngày Tham Gia</label>
                <p className="text-gray-900">{detailsUser.joinDate}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editUser && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Chỉnh Sửa Người Dùng</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-4">
              {editError && (
                <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <div className="font-medium">Lỗi: {editError}</div>
                  {editFieldErrors && Object.keys(editFieldErrors).length > 0 && (
                    <ul className="mt-2 list-disc ml-5 text-xs">
                      {Object.entries(editFieldErrors).map(([k, v]) => (
                        <li key={k}>
                          <strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editUser.email}
                  onChange={(e) => handleEditUserChange("email", e.target.value)}
                />
                {editFieldErrors && editFieldErrors.Email && (
                  <p className="text-xs text-red-600 mt-1">{Array.isArray(editFieldErrors.Email) ? editFieldErrors.Email.join(', ') : editFieldErrors.Email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên Người Dùng</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editUser.name}
                  onChange={(e) => handleEditUserChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Số Điện Thoại</label>
                <input
                  type="tel"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editUser.phone}
                  onChange={(e) => handleEditUserChange("phone", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Vai Trò</label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={editUser.newRole}
                  onChange={(e) => handleEditUserChange("newRole", e.target.value)}
                >
                  <option value="Customer">Customer (Khách hàng)</option>
                  <option value="Officer">Officer (Cán bộ)</option>
                  <option value="Manager">Manager (Quản lý)</option>
                </select>
                {editUser.newRole !== editUser.currentRole && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Vai trò sẽ được thay đổi từ <strong>{editUser.currentRoles?.join(', ') || editUser.currentRole}</strong> sang <strong>{editUser.newRole}</strong>
                    <br />
                    <span className="text-xs">(Tất cả vai trò cũ sẽ bị xóa)</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEditUserSubmit}
                disabled={editLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 flex items-center gap-2"
              >
                {editLoading && <Loader className="w-4 h-4 animate-spin" />}
                {editLoading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous={true}
      />
    </div>
  );
}
