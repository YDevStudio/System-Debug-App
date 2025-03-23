import React from "react"
import Sidebar from "../components/Sidebar"

const BaseLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  )
}

export default BaseLayout