"use client"

import { useState } from "react"
import RealContextToolsPanel from "@/components/real-context-tools-panel"

export default function ProductionPage() {
  const [activeSection, setActiveSection] = useState("details")

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Context Tools Panel) */}
      <aside className="w-64 bg-gray-200 p-4">
        <RealContextToolsPanel activeSection={activeSection} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Content based on activeSection */}
        {activeSection === "details" && (
          <div>
            <h2>Production Details</h2>
            <p>This is the details section.</p>
          </div>
        )}
        {activeSection === "schedule" && (
          <div>
            <h2>Production Schedule</h2>
            <p>This is the schedule section.</p>
          </div>
        )}
        {activeSection === "resources" && (
          <div>
            <h2>Production Resources</h2>
            <p>This is the resources section.</p>
          </div>
        )}
      </main>
    </div>
  )
}
