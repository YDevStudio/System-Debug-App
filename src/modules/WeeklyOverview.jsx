import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Pencil, Check } from "lucide-react"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
dayjs.extend(isoWeek)

const WeeklyOverview = () => {
  const navigate = useNavigate()
  const [weeks, setWeeks] = useState([])
  const [weekData, setWeekData] = useState({})
  const [weekToDelete, setWeekToDelete] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDate, setEditDate] = useState("")
  const [infoMessage, setInfoMessage] = useState("")

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    const stored = JSON.parse(localStorage.getItem("weekly_review") || "{}")
    const sorted = Object.entries(stored).sort((a, b) => b[1].created - a[1].created)
    const keys = sorted.map(([k]) => k)
    setWeeks(keys)
    setWeekData(stored)
  }

  const getCurrentWeekKey = () => {
    const today = dayjs()
    const monday = today.isoWeekday(1).startOf("day")
    const week = monday.isoWeek()
    return {
      key: `week_${monday.year()}_${week}`,
      created: today.valueOf(), // ✅ save today's date, not Monday
    }
  }

  const handleAddWeek = () => {
    const { key, created } = getCurrentWeekKey()

    if (weekData[key]) {
      setInfoMessage("✅ This week already exists. You can continue filling it.")
      setTimeout(() => setInfoMessage(""), 4000)
      return
    }

    const newData = {
      ...weekData,
      [key]: {
        name: "",
        created,
        success: [],
        struggle: [],
        pattern: [],
        improve: [],
      },
    }

    localStorage.setItem("weekly_review", JSON.stringify(newData))
    refreshData()
    setInfoMessage("✅ Week added successfully!")
    setTimeout(() => setInfoMessage(""), 3000)
  }

  const handleDelete = () => {
    const updated = { ...weekData }
    delete updated[weekToDelete]
    localStorage.setItem("weekly_review", JSON.stringify(updated))
    refreshData()
    setShowConfirm(false)
    setWeekToDelete(null)
  }

  const calcProgress = (week) => {
    if (!week) return 0
    const sections = ["success", "struggle", "pattern", "improve"]
    const filled = sections.filter((s) => week[s]?.length).length
    return (filled / 4) * 100
  }

  const formatDate = (ts) => dayjs(ts).format("DD MMM YYYY")

  const handleEdit = (key) => {
    const w = weekData[key]
    setEditingKey(key)
    setEditName(w.name || "")
    setEditDate(dayjs(w.created).format("YYYY-MM-DD"))
  }

  const saveEdit = (oldKey) => {
    const updatedCreated = dayjs(editDate).valueOf()
    const newKey = `week_${dayjs(editDate).year()}_${dayjs(editDate).isoWeek()}`

    const updatedWeek = {
      ...weekData[oldKey],
      name: editName,
      created: updatedCreated,
    }

    const newData = { ...weekData }

    // Remove old key if it's changing
    if (oldKey !== newKey) {
      delete newData[oldKey]
    }

    newData[newKey] = updatedWeek
    localStorage.setItem("weekly_review", JSON.stringify(newData))
    setEditingKey(null)
    refreshData()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">📆 Weekly Overview</h1>
        <button
          onClick={handleAddWeek}
          className="icon-btn bg-primary text-white hover:bg-primary/90 transition"
          title="Add Current Week"
        >
          <Plus size={20} />
        </button>
      </div>
      {infoMessage && (
        <div className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-4 py-2 rounded-lg border border-green-200 dark:border-green-700">
          {infoMessage}
        </div>
      )}
      <div className="overflow-x-auto w-full border rounded-xl shadow">
        <table className="w-full text-sm md:text-base text-left text-[var(--text)] dark:text-white">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-2 md:px-4 py-2 px-4 py-3">#</th>
              <th className="px-2 md:px-4 py-2 px-4 py-3">Created</th>
              <th className="px-2 md:px-4 py-2 px-4 py-3">Progress</th>
              <th className="px-2 md:px-4 py-2 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((key, index) => {
              const week = weekData[key]
              const progress = calcProgress(week)
              const isEditing = editingKey === key

              return (
                <tr key={key} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3 font-semibold text-secondary">
                    {isEditing ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-sm px-2 py-1 rounded bg-white dark:bg-gray-800 border"
                      />
                    ) : (
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => navigate(`/weekly-review/${key}`)}
                      >
                        {week.name || `Week ${weeks.length - index}`}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="text-sm px-2 py-1 rounded bg-white dark:bg-gray-800 border"
                      />
                    ) : (
                      formatDate(week?.created)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(key)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(key)}
                        className="text-gray-500 hover:text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setWeekToDelete(key)
                        setShowConfirm(true)
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {weeks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No weeks yet. Click ➕ to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-sm animate-modalEnter">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Delete this week?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeeklyOverview