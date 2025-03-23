import React from "react"
import Sidebar from "../components/Sidebar"

const BaseLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--bg)] shadow px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">System Debug</h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-600 hover:text-primary"
        >
          ☰
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto pt-[60px] md:pt-6 px-4 md:px-6 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  )
}

export default BaseLayout