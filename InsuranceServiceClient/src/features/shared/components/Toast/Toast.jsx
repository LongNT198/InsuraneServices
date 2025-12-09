import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast Notification Component
 * Hiển thị thông báo tự động biến mất
 */
export const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-pulse`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${config.text}`}>{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className={`flex-shrink-0 ${config.text} hover:opacity-75`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
