import React from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import UploadPage from './pages/UploadPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'

function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/70 backdrop-blur sticky top-0 z-50">
      <div className="container-page h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-accent shadow-glow" />
          <span className="text-lg font-semibold">Hockey Analyzer</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `px-2 py-1 rounded ${isActive ? 'text-accent' : 'text-gray-400 hover:text-gray-200'}`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/review"
            className={({ isActive }) =>
              `px-2 py-1 rounded ${isActive ? 'text-accent' : 'text-gray-400 hover:text-gray-200'}`
            }
          >
            Review
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </main>
    </div>
  )
}
