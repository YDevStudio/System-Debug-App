import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import BaseLayout from "./layout/BaseLayout"
import DailyLog from "./modules/DailyLog"
import WeeklyReview from "./modules/WeeklyReview"
import WeeklyOverview from "./modules/WeeklyOverview"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <BaseLayout>
          <Routes>
            <Route path="/" element={<DailyLog />} />
            <Route path="/weekly-review" element={<WeeklyReview />} />
            <Route path="/weekly-review/:weekId" element={<WeeklyReview />} />
            <Route path="/weekly-overview" element={<WeeklyOverview />} />
          </Routes>
        </BaseLayout>
      </div>
    </Router>
  )
}

export default App