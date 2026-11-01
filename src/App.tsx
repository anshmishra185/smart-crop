import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './auth/AuthProvider'
import { AuthModal } from './components/auth/AuthModal'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { About } from './pages/About'
import { Dashboard } from './pages/Dashboard'
import { ExploreCrops } from './pages/ExploreCrops'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<ExploreCrops />} />
              <Route path="/about" element={<About />} />
              {/* If user visits /auth directly, redirect home and modal is triggered from navbar */}
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal />
        </div>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
