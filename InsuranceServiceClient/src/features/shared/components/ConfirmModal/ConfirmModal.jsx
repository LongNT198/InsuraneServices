import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Confirmation Modal Component
 * Replaces window.confirm() with a styled modal
 */
export const ConfirmModal = ({ 
  isOpen, 
  title = 'Xác nhận', 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Có',
  cancelText = 'Hủy',
  isDangerous = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <AlertCircle className={`w-6 h-6 ${isDangerous ? 'text-red-600' : 'text-yellow-600'}`} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onCancel}
            className="ml-auto p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
