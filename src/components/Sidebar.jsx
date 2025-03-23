import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  CalendarDays, BookOpen, Code2, Briefcase, FileText,
  PiggyBank, ScrollText, Sun, Moon, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon
} from "lucide-react"

const modules = [
  { name: "Daily Log", id: "daily-log", path: "/", icon: <CalendarDays size={18} />, desc: "Log emotions & triggers" },
  { name: "Weekly Overview", id: "weekly-overview", path: "/weekly-overview", icon: <CalendarIcon size={18} />, desc: "Browse past weeks" },
  { name: "Learning Tracker", id: "learning-tracker", path: "/learning-tracker", icon: <BookOpen size={18} />, desc: "Track your courses" },
  { name: "Coding Discipline", id: "coding-discipline", path: "/coding-discipline", icon: <Code2 size={18} />, desc: "Avoid lazy coding" },
  { name: "Freelance Map", id: "freelance-map", path: "/freelance-map", icon: <Briefcase size={18} />, desc: "Start earning online" },
  { name: "CV / Interview", id: "cv-prep", path: "/cv-prep", icon: <FileText size={18} />, desc: "Job prep & mock Qs" },
  { name: "Money Map", id: "money-map", path: "/money-map", icon: <PiggyBank size={18} />, desc: "Side income strategy" },
  { name: "Islamic Reminders", id: "islamic-reminders", path: "/islamic-reminders", icon: <ScrollText size={18} />, desc: "Spiritual anchors" }
]

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 bg-[var(--bg)] text-[var(--text)] 
          border-r border-gray-200 dark:border-gray-700 shadow-lg 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <h2 className="text-xl font-bold text-primary tracking-tight">System Debug</h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-primary"
            >
              {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>
          </div>

          <nav className="space-y-2">
            {modules.map((mod) => (
              <NavLink
                to={mod.path}
                key={mod.id}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${isActive ? "bg-primary text-white shadow-md" : "hover:bg-primary/10 hover:text-primary"}
                `}
              >
                {mod.icon}
                {!collapsed && <span className="text-sm font-medium">{mod.name}</span>}
                {collapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                    {mod.desc}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg w-full justify-center bg-secondary text-white hover:bg-secondary/90 transition"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile (click to close) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
    </>
  )
}

export default Sidebar