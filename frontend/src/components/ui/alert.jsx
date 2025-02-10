import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const AlertModal = ({ isOpen, type = 'success', message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-lg font-bold text-gray-900">
              {type === 'success' ? 'Success!' : 'Error'}
            </h3>
          </div>
          {type === 'error' && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        <p className="text-gray-600 mb-5">{message}</p>
        {type === 'error' && (
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
