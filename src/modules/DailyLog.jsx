import React, { useState } from "react"
import DailyLogCard from "./DailyLogCard"
import DailyLogModal from "./DailyLogModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import DailyLogTable from "./DailyLogTable"
import { Plus, LayoutGrid, List } from "lucide-react"
const DailyLog = () => {
    const [logs, setLogs] = useState(() => {
        const stored = localStorage.getItem("system_debug_logs")
        return stored ? JSON.parse(stored) : []
      })
    const [modalOpen, setModalOpen] = useState(false)
    const [editingLog, setEditingLog] = useState(null)
    const [logToDelete, setLogToDelete] = useState(null)
    const [viewMode, setViewMode] = useState("card")
    const addLog = (newLog) => {
        if (editingLog) {
          const updated = logs.map((log) =>
            log.id === editingLog.id ? { ...editingLog, ...newLog } : log
          )
          saveLogs(updated)
          setEditingLog(null)
        } else {
          const updated = [{ ...newLog, id: Date.now() }, ...logs]
          saveLogs(updated)
        }
        setModalOpen(false)
      }

    const saveLogs = (newLogs) => {
        setLogs(newLogs)
        localStorage.setItem("system_debug_logs", JSON.stringify(newLogs))
      }

      const deleteLog = () => {
        const updated = logs.filter((log) => log.id !== logToDelete)
        saveLogs(updated)
        setLogToDelete(null)
      }

    const openEdit = (id) => {
        const logToEdit = logs.find((log) => log.id === id)
        if (logToEdit) {
            setEditingLog(logToEdit)
            setModalOpen(true)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 pb-10 bg-[var(--bg)] transition-colors duration-300 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">🧠 Daily Log</h1>
                <div className="flex items-center gap-2">
                    {/* Add Log */}
                    <button
                        onClick={() => {
                            setEditingLog(null)
                            setModalOpen(true)
                        }}
                        className="icon-btn bg-primary text-white"
                        title="Add New Log"
                    >
                        <Plus size={18} />
                    </button>

                    {/* Toggle View */}
                    <button
                        onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                        className="icon-btn p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title={viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
                    >
                        {viewMode === "card" ? <List size={18} /> : <LayoutGrid size={18} />}
                    </button>
                </div>
            </div>


            {logs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    No logs yet. Start by adding one above.
                </p>
            ) : viewMode === "card" ? (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <DailyLogCard
                            key={log.id}
                            data={log}
                            onEdit={openEdit}
                            onDelete={(id) => setLogToDelete(id)}
                        />
                    ))}
                </div>
            ) : (
                <DailyLogTable logs={logs} onEdit={openEdit} onDelete={(id) => setLogToDelete(id)} />
            )}

            <DailyLogModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setEditingLog(null)
                }}
                onSave={addLog}
                initialData={editingLog}
            />
            <DeleteConfirmModal
                open={!!logToDelete}
                onClose={() => setLogToDelete(null)}
                onConfirm={deleteLog}
            />
        </div>
    )
}

export default DailyLog