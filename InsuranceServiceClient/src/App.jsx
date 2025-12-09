import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './core/contexts/AuthContext';
import { AdminAuthProvider } from './features/admin/AdminAuthContext';
import { ToastProvider } from './features/shared/contexts/ToastContext';
import { Toaster } from 'sonner';
import { Header } from './features/shared/components/Header';
import { Footer } from './features/shared/components/Footer';
import { ChatBubbleAdvanced } from './features/shared/components/ChatBubbleAdvanced';
import { Home } from './features/shared/components/Home';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { ForgotPassword } from './features/auth/pages/ForgotPassword';
import { ResetPassword } from './features/auth/pages/ResetPassword';
import { CheckEmail } from './features/auth/pages/CheckEmail';
import { VerifyEmail } from './features/auth/pages/VerifyEmail';
import { CompleteProfile } from './features/auth/pages/CompleteProfile';
import { VerifyPhone } from './features/auth/pages/VerifyPhone';
import { Dashboard } from './features/customer/pages/Dashboard';
import { LifeInsurance } from './features/shared/components/LifeInsurance';
import { MedicalInsurance } from './features/shared/components/MedicalInsurance';
import { MotorInsurance } from './features/shared/components/MotorInsurance';
import { HomeInsurance } from './features/shared/components/HomeInsurance';

import { LifeInsuranceProductDetail } from './features/shared/components/insurance/LifeInsuranceProductDetail';
import { MedicalInsuranceProductDetail } from './features/shared/components/insurance/MedicalInsuranceProductDetail';
import { MotorInsuranceProductDetail } from './features/shared/components/insurance/MotorInsuranceProductDetail';
import { HomeInsuranceProductDetail } from './features/shared/components/insurance/HomeInsuranceProductDetail';
import { PremiumCalculator } from './features/shared/components/PremiumCalculator';
import { LoanFacility } from './features/customer/pages/LoanFacility';
import { Policies } from './features/customer/pages/Policies';
import { Schemes } from './features/shared/components/Schemes';
import { Claims } from './features/customer/pages/Claims';
import { Profile } from './features/customer/pages/Profile';
import { Support } from './features/customer/pages/Support';
import { Contact } from './features/shared/components/Contact';
import { PaymentGateway } from './features/customer/pages/PaymentGateway';
import { ComparisonTool } from './features/shared/components/ComparisonTool';
import { AgentSupport } from './features/agent/pages/AgentSupport';
import HealthInsuranceApplication from './features/customer/components/application/health-insurance/HealthInsuranceApplication';
import { LifeInsuranceApplication } from './features/customer/pages/LifeInsuranceApplication';
import { MotorInsuranceApplication } from './features/customer/pages/MotorInsuranceApplication';
import { HomeInsuranceApplication } from './features/customer/pages/HomeInsuranceApplication';
import ApplicationSuccess from './features/customer/pages/ApplicationSuccess';
import { PaymentFrequencyDemo } from './features/customer';
import { ProtectedRoute } from './features/shared/components/ProtectedRoute';
import { AdminLogin } from './features/admin/AdminLogin';
import { AdminDashboard } from './features/admin';
import { AdminProtectedRoute } from './features/admin/AdminProtectedRoute';
import ManagerApplications from './features/manager/pages/ManagerApplications';


// Tạo QueryClient instance với cấu hình mặc định
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Không tự động refetch khi focus window
      retry: 1, // Số lần retry khi request thất bại
      staleTime: 5 * 60 * 1000, // Dữ liệu được coi là fresh trong 5 phút
      cacheTime: 10 * 60 * 1000, // Cache được giữ trong 10 phút
    },
    mutations: {
      retry: 0, // Không retry mutations
    },
  },
});

// Layout wrapper component
function AppLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Admin routes: No Header, Footer, or Chat
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Customer & Public routes: Full layout
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatBubbleAdvanced />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AdminAuthProvider>
            <ToastProvider>
              <Toaster
                position="top-right"
                expand={false}
                richColors
                closeButton
                duration={4000}
              />
              <div className="min-h-screen flex flex-col bg-gray-50">
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/check-email" element={<CheckEmail />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                      path="/complete-profile"
                      element={
                        <ProtectedRoute>
                          <CompleteProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/verify-phone"
                      element={
                        <ProtectedRoute>
                          <VerifyPhone />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/life-insurance" element={<LifeInsurance />} />
                    <Route path="/life-insurance/:id" element={<LifeInsuranceProductDetail />} />
                    <Route path="/medical-insurance" element={<MedicalInsurance />} />
                    <Route path="/medical-insurance/:id" element={<MedicalInsuranceProductDetail />} />
                    <Route path="/motor-insurance" element={<MotorInsurance />} />
                    <Route path="/motor-insurance/:id" element={<MotorInsuranceProductDetail />} />
                    <Route path="/home-insurance" element={<HomeInsurance />} />
                    <Route path="/home-insurance/:id" element={<HomeInsuranceProductDetail />} />

                    <Route path="/schemes" element={<Schemes />} />

                    {/* Insurance Application Flow */}
                    <Route
                      path="/apply-life"
                      element={
                        <ProtectedRoute>
                          <LifeInsuranceApplication />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/apply-health"
                      element={
                        <ProtectedRoute>
                          <HealthInsuranceApplication />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/apply-medical"
                      element={
                        <ProtectedRoute>
                          <HealthInsuranceApplication />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/apply-motor"
                      element={
                        <ProtectedRoute>
                          <MotorInsuranceApplication />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/apply-home"
                      element={
                        <ProtectedRoute>
                          <HomeInsuranceApplication />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/application-success"
                      element={
                        <ProtectedRoute>
                          <ApplicationSuccess />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/application/success"
                      element={
                        <ProtectedRoute>
                          <ApplicationSuccess />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/calculator"
                      element={<PremiumCalculator />}
                    />
                    <Route
                      path="/payment-frequency"
                      element={<PaymentFrequencyDemo />}
                    />
                    <Route
                      path="/policies"
                      element={
                        <ProtectedRoute>
                          <Policies />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/loan-facility"
                      element={
                        <ProtectedRoute>
                          <LoanFacility />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/claims"
                      element={
                        <ProtectedRoute>
                          <Claims />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/support"
                      element={
                        <ProtectedRoute>
                          <Support />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/payment-gateway" element={<PaymentGateway />} />
                    <Route path="/comparison-tool" element={<ComparisonTool />} />
                    <Route path="/agent-support" element={<AgentSupport />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/*"
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      }
                    />

                    {/* Manager Routes */}
                    <Route
                      path="/manager/applications"
                      element={
                        <AdminProtectedRoute>
                          <ManagerApplications />
                        </AdminProtectedRoute>
                      }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              </div>
            </ToastProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
