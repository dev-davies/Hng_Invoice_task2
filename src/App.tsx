import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <Router>
      <div className="min-h-screen bg-text-light dark:bg-dark-bg text-text-dark dark:text-text-light transition-colors duration-300">
        <header className="p-8 flex justify-between items-center bg-component-bg text-white">
          <h1 className="text-3xl font-bold tracking-tight">Invoice App</h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 bg-primary-purple hover:bg-light-purple rounded-lg transition-colors flex items-center gap-2"
          >
            {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={
              <div className="text-center mt-20">
                <h2 className="text-5xl font-bold mb-4">Welcome to the Invoice App</h2>
                <p className="text-xl opacity-80">Your modern invoice management system.</p>
                <div className="mt-10 p-6 bg-component-bg rounded-xl shadow-lg border border-primary-purple/20">
                  <p>Theme: <span className="font-bold text-primary-purple">{isDarkMode ? 'Dark' : 'Light'}</span></p>
                  <p>Font: <span className="font-bold">League Spartan</span></p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
