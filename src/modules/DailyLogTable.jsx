import React, { useState } from "react"
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react"

const DailyLogTable = ({ logs, onEdit, onDelete }) => {
  const [sortKey, setSortKey] = useState("time")
  const [sortOrder, setSortOrder] = useState("asc")

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const sortedLogs = [...logs].sort((a, b) => {
    const aVal = a[sortKey]?.toLowerCase?.() || ""
    const bVal = b[sortKey]?.toLowerCase?.() || ""
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const thClass = "px-4 py-3 text-sm text-left text-[var(--text)] dark:text-gray-300 cursor-pointer hover:text-primary transition"

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md bg-[var(--bg)] transition-colors duration-300">
      <table className="w-full text-sm">
      <thead className="bg-[var(--bg)] text-[var(--text)] transition-all duration-300">
                  <tr>
            {["time", "place", "feeling", "trigger", "response", "mood"].map((key) => (
              <th key={key} className={thClass} onClick={() => toggleSort(key)}>
                <div className="flex items-center gap-1 capitalize">
                  {key}
                  {sortKey === key &&
                    (sortOrder === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-[var(--text)] transition-colors ">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedLogs.map((log) => (
            <tr
              key={log.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ease-in-out duration-300">
              <td className="px-4 py-3 text-[var(--text)] transition-colors">{log.time}</td>
              <td className="px-4 py-3 text-[var(--text)] transition-colors">{log.place}</td>
              <td className="px-4 py-3 text-[var(--text)] transition-colors">{log.feeling}</td>
              <td className="px-4 py-3 text-[var(--text)] transition-colors">{log.trigger}</td>
              <td className="px-4 py-3 text-[var(--text)] transition-colors">{log.response}</td>
              <td className="px-4 py-3 text-[var(--text)] transition-colors capitalize">{log.mood}</td>
              <td className="px-4 py-3 text-[var(--text)] transition-colors flex gap-2">
                <button onClick={() => onEdit(log.id)} className="text-gray-500 hover:text-primary transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(log.id)} className="text-gray-500 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DailyLogTable