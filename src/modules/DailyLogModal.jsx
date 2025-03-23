import React, { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

const initialForm = {
  time: "",
  place: "",
  feeling: "",
  trigger: "",
  response: "",
  mood: "neutral"
}

const DailyLogModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState("")
  const modalRef = useRef()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.feeling.trim() || !form.time.trim() || !form.response.trim()) {
      setErrorMessage("Please fill at least time, feeling, and response.")
      return
    }

    onSave(form)
    setForm(initialForm)
    setErrorMessage("")
    onClose()
  }

  const handleEscape = (e) => {
    if (e.key === "Escape") onClose()
  }

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm(initialData)
      } else {
        setForm(initialForm)
      }
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, initialData])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center transition-all">
      <div
        ref={modalRef}
        className="bg-background dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-lg relative animate-modalEnter transition-all"
      >
        {errorMessage && (
          <p className="text-sm text-red-500 font-medium mt-2 animate-fadeIn">
            {errorMessage}
          </p>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-primary">
          {initialData ? "✏️ Edit Log Entry" : "📝 New Log Entry"}
        </h2>

        <input
          name="time"
          type="time"
          className="input"
          onChange={handleChange}
          value={form.time}
        />
        <input
          name="place"
          placeholder="Place (e.g. Home, Work)"
          className="input"
          onChange={handleChange}
          value={form.place}
        />
        <textarea
          name="feeling"
          placeholder="What are you feeling?"
          className={`input ${errorMessage && !form.feeling.trim() ? "border-red-400" : ""
            }`}
          rows={2}
          onChange={handleChange}
          value={form.feeling}
        />
        <textarea
          name="trigger"
          placeholder="What triggered it?"
          className={`input ${errorMessage && !form.feeling.trim() ? "border-red-400" : ""
            }`}
          rows={2}
          onChange={handleChange}
          value={form.trigger}
        />
        <textarea
          name="response"
          placeholder="What did you do / How did you react?"
          className={`input ${errorMessage && !form.feeling.trim() ? "border-red-400" : ""
            }`}
          rows={2}
          onChange={handleChange}
          value={form.response}
        />

        <select
          name="mood"
          className="input"
          onChange={handleChange}
          value={form.mood}
        >
          <option value="neutral">🧊 Neutral</option>
          <option value="calm">🟢 Calm / Resisted</option>
          <option value="tempted">🔴 Gave in / Tempted</option>
        </select>

        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-primary text-[var(--text)] hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            {initialData ? "Update Log" : "Save Log"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DailyLogModal