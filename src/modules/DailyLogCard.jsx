import React from "react"
import { Pencil, Trash2 } from "lucide-react"

const moodStyle = {
    calm: "bg-green-100 dark:bg-green-900 border-green-400",
    tempted: "bg-red-100 dark:bg-red-900 border-red-400",
    neutral: "bg-gray-100 dark:bg-gray-800 border-gray-300"
  }

const DailyLogCard = ({ data, onEdit, onDelete }) => {
  const {
    id,
    time,
    place,
    feeling,
    trigger,
    response,
    mood = "neutral"
  } = data

  return (
    <div
      className={`bg-gradient-to-br ${moodStyle[mood]} border-l-4 p-4 rounded-md shadow-md transition-all ease-in-out duration-300 animate-fadeIn ${moodStyle[mood]}`}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm text-[var(--text)] dark:text-gray-400 mb-1">
          🕒 {time} — 📍 {place}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(id)} className="text-gray-500 hover:text-primary">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(id)} className="text-gray-500 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="text-lg font-semibold text-[var(--text)] dark:text-[var(--text)] mt-1">{feeling}</div>
      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
        <strong>Trigger:</strong> {trigger}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Response:</strong> {response}
      </div>
    </div>
  )
}

export default DailyLogCard