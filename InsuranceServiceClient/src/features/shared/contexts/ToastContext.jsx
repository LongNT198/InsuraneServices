import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext();

/**
 * Toast Provider - Quản lý tất cả toast notifications
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message) => addToast(message, 'success', 3000), [addToast]);
  const showError = useCallback((message) => addToast(message, 'error', 4000), [addToast]);
  const showWarning = useCallback((message) => addToast(message, 'warning', 3500), [addToast]);
  const showInfo = useCallback((message) => addToast(message, 'info', 3000), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none max-w-md">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Hook để sử dụng Toast notifications
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastContext;
