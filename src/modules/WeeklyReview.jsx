import React, { useEffect, useState } from "react"
import { Pencil, Trash2, Check, ChevronDown, ChevronUp, FileDown, ArrowLeft } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable" // ✅ You missed this line
import { useParams, useNavigate } from "react-router-dom"

const weekNumber = () => {
  const now = new Date()
  const onejan = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7)
  return `week_${now.getFullYear()}_${week}`
}

const prompts = [
  { key: "success", label: "✅ What did I do well this week?" },
  { key: "struggle", label: "⚠️ Where did I struggle?" },
  { key: "pattern", label: "🔁 What patterns do I notice?" },
  { key: "improve", label: "🔄 What will I improve next week?" }
]

const moodColors = ["green", "yellow", "red", "blue"]

const getWeekDateRange = (weekKey) => {
  const [_, yearStr, weekStr] = weekKey.split("_")
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)

  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = (week - 1) * 7
  const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset))

  // Adjust to Monday
  const day = firstDayOfWeek.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(firstDayOfWeek)
  monday.setDate(monday.getDate() + diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const format = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return `${format(monday)} – ${format(sunday)}, ${year}`
}

const WeeklyReview = () => {
  const { weekId } = useParams()
  const navigate = useNavigate()
  const currentWeek = weekId || weekNumber()
  const [selectedWeek, setSelectedWeek] = useState(weekId || currentWeek)
  const [allReviews, setAllReviews] = useState(() => {
    const saved = localStorage.getItem("weekly_review")
    return saved ? JSON.parse(saved) : {}
  })
  const [review, setReview] = useState(allReviews[selectedWeek] || {})
  const [inputValues, setInputValues] = useState({})
  const [expandedFields, setExpandedFields] = useState({})
  const [editing, setEditing] = useState({})
  const [editValue, setEditValue] = useState("")
  const [editMood, setEditMood] = useState("green")
  const [logToDelete, setLogToDelete] = useState({ key: null, idx: null })

  useEffect(() => {
    const saved = localStorage.getItem("weekly_review")
    const parsed = saved ? JSON.parse(saved) : {}
    setAllReviews(parsed)
    setReview(parsed[selectedWeek] || {})
  }, [selectedWeek])

  const handleAddNote = (key) => {
    const note = inputValues[key]?.trim()
    if (!note) return
    const newItem = { text: note, mood: "green" }
    const updated = {
      ...review,
      [key]: [...(review[key] || []), newItem]
    }
    const all = { ...allReviews, [selectedWeek]: updated }
    setReview(updated)
    setAllReviews(all)
    localStorage.setItem("weekly_review", JSON.stringify(all))
    setInputValues({ ...inputValues, [key]: "" })
    setExpandedFields((prev) => ({ ...prev, [key]: true }))
  }

  const handleUpdateNote = (key, idx) => {
    const updatedField = [...review[key]]
    updatedField[idx] = { ...updatedField[idx], text: editValue, mood: editMood }
    const updated = { ...review, [key]: updatedField }
    const all = { ...allReviews, [selectedWeek]: updated }
    setReview(updated)
    setAllReviews(all)
    localStorage.setItem("weekly_review", JSON.stringify(all))
    setEditing({ ...editing, [key]: null })
    setEditValue("")
  }

  const handleDeleteNote = () => {
    const { key, idx } = logToDelete
    const updatedField = review[key].filter((_, i) => i !== idx)
    const updated = { ...review, [key]: updatedField }
    const all = { ...allReviews, [selectedWeek]: updated }
    setReview(updated)
    setAllReviews(all)
    localStorage.setItem("weekly_review", JSON.stringify(all))
    setLogToDelete({ key: null, idx: null })
  }

  const handleKeyDown = (e, key) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddNote(key)
    }
  }

  const toggleField = (key) => {
    setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const getProgress = () => {
    const total = prompts.length
    const filled = prompts.filter(p => (review[p.key]?.length || 0) > 0).length
    return Math.round((filled / total) * 100)
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Weekly Review", 14, 16)
    doc.setFontSize(12)

    let y = 20
    prompts.forEach(({ key, label }) => {
      const items = (review[key] || []).map((i, idx) => [idx + 1, i.text])
      if (items.length > 0) {
        y += 10
        doc.text(label, 14, y)
        autoTable(doc, {
          startY: y + 2,
          head: [["#", "Entry"]],
          body: items,
          theme: "striped"
        })
        y = doc.lastAutoTable.finalY
      }
    })

    doc.save(`${selectedWeek.replace("_", "-")}-review.pdf`)
  }
  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      {/* Back to Weekly Overview */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("/weekly-overview")}
          className="icon-btn text-gray-600 dark:text-gray-300 hover:text-primary transition"
          title="Back to Overview"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      {/* Progress + Export */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden mr-4">
          <div
            className="h-3 bg-primary transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <button
          onClick={exportPDF}
          className="icon-btn-sm text-gray-600 dark:text-gray-300 hover:text-secondary transition"
          title="Export PDF"
        >
          <FileDown size={20} />
        </button>
      </div>

      {/* Week Selector */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary">📅 Weekly Review</h1>
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-md px-3 py-1 appearance-none pr-8"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          {Object.keys(allReviews)
            .sort()
            .reverse()
            .map((weekKey) => (
              <option key={weekKey} value={weekKey}>
                {getWeekDateRange(weekKey)}
              </option>
            ))}
        </select>
      </div>

      {/* Prompts */}
      <div className="space-y-6">
        {prompts.map(({ key, label }) => {
          const count = review[key]?.length || 0

          return (
            <div
              key={key}
              className="bg-[var(--bg)] dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-all"
            >
              {/* Prompt Title */}
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                  {label}
                  {count > 0 && !expandedFields[key] && (
                    <span className="text-xs text-white bg-primary px-2 py-0.5 rounded-full">{count}</span>
                  )}
                </label>
                <button
                  onClick={() => toggleField(key)}
                  className="text-gray-400 hover:text-primary transition"
                >
                  {expandedFields[key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Input Field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write and press Enter or click ✔"
                  value={inputValues[key] || ""}
                  onChange={(e) => setInputValues({ ...inputValues, [key]: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, key)}
                  className="input text-sm"
                />
                <button
                  onClick={() => handleAddNote(key)}
                  className="icon-btn-sm text-gray-400 hover:text-primary"
                >
                  <Check size={18} />
                </button>
              </div>
              {/* Notes Section – Collapsible */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFields[key] && review[key]?.length > 0 ? "mt-3 max-h-[500px]" : "max-h-0"
                  }`}
              >
                <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-2 custom-scroll">
                  {(review[key] || []).map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start justify-between pl-2 border-l-4 rounded-md py-1 px-2 group transition-all ${item.mood === "green"
                        ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                        : item.mood === "yellow"
                          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                          : item.mood === "red"
                            ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                            : "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        }`}
                    >
                      {editing[key] === idx ? (
                        <div className="flex flex-col w-full">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdateNote(key, idx)}
                            className="input text-sm mb-1"
                          />
                          <select
                            className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-gray-600 dark:text-gray-300"
                            value={editMood}
                            onChange={(e) => setEditMood(e.target.value)}
                          >
                            <option value="green">😊 Positive</option>
                            <option value="yellow">😐 Neutral</option>
                            <option value="red">😞 Negative</option>
                            <option value="blue">💡 Insight</option>
                          </select>
                        </div>
                      ) : (
                        <span className="ml-2 text-[var(--text)] text-sm">• {item.text}</span>
                      )}

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        {editing[key] === idx ? (
                          <button
                            onClick={() => handleUpdateNote(key, idx)}
                            className="text-green-500 hover:text-green-600 transition"
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditing({ ...editing, [key]: idx })
                              setEditValue(item.text)
                              setEditMood(item.mood || "green")
                            }}
                            className="text-gray-400 hover:text-primary transition"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setLogToDelete({ key, idx })}
                          className="text-red-500 hover:text-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div> // end of single prompt block
          )
        })}
      </div>
      {/* Delete Confirmation Modal */}
      {logToDelete.key !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-sm animate-modalEnter">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Delete this note?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setLogToDelete({ key: null, idx: null })}
                className="px-4 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNote}
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

export default WeeklyReview