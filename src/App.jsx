import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ChoDemoucronPage from './pages/ChoDemoucronPage.jsx'
import SpanningTreePage from './pages/SpanningTreePage.jsx'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 py-4 px-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ADOMC - Algorithmes de graphes</h1>
              <p className="text-sm text-gray-600">Navigation entre les pages de recherche, Cho-Demoucron et arbres couvrants.</p>
            </div>
            <nav className="flex flex-wrap gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >Accueil</NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) => `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >Recherche</NavLink>
              <NavLink
                to="/chodemoucron"
                className={({ isActive }) => `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >Cho-Demoucron</NavLink>
              <NavLink
                to="/spanning-tree"
                className={({ isActive }) => `rounded px-4 py-2 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >Arbres couvrants</NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/chodemoucron" element={<ChoDemoucronPage />} />
            <Route path="/spanning-tree" element={<SpanningTreePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
