import React from "react"
import { Trash2, X } from "lucide-react"

const DeleteConfirmModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-all">
      <div className="bg-background  dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm space-y-4 shadow-lg relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-red-600">
          <Trash2 size={24} />
          <h2 className="text-xl font-bold">Confirm Deletion</h2>
        </div>

        <p className="text-[var(--text)] dark:text-gray-300">
          Are you sure you want to delete this log entry? This action can't be undone.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-full bg-primary text-[var(--text)] hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal