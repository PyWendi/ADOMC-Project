import React from 'react'

const ConfirmModal = ({ open, onCancel, onConfirm, message = 'Êtes-vous sûr de vouloir supprimer cet élément ?', title = 'Suppression', icon, confirmText = 'Confirmer', cancelText = 'Annuler' }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-fade-in">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onCancel} aria-label="Close">
          ×
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-3 mb-3">
            {icon || (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6" width="18" height="17" rx="2" fill="#fff" stroke="#ef4444"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#ef4444"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="#ef4444"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="#ef4444"/>
                <line x1="4" y1="6" x2="20" y2="6" stroke="#ef4444"/>
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-1 text-gray-800">{title}</h3>
          <div className="mb-4 text-gray-600 text-center text-sm">{message}</div>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition">
              {cancelText}
            </button>
            <button onClick={onConfirm} className="flex-1 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition">
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
