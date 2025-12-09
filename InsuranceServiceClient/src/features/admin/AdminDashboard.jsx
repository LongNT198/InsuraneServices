import { useState } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { Overview } from './pages/Overview';
import { UsersManagement } from './pages/UsersManagement';
import { PoliciesManagement } from './pages/PoliciesManagement';
import { ClaimsManagement } from './pages/ClaimsManagement';
import { AgentsManagement } from './pages/AgentsManagement';
import { PaymentsManagement } from './pages/PaymentsManagement';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { ApplicationsManagement } from './pages/ApplicationsManagement';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UsersManagement />;
      case 'applications':
        return <ApplicationsManagement />;
      case 'policies':
        return <PoliciesManagement />;
      case 'claims':
        return <ClaimsManagement />;
      case 'agents':
        return <AgentsManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
