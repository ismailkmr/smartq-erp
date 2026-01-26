import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import EmployeeManagement from './components/EmployeeManagement'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/employees"
            element={
              isAuthenticated ?
                <EmployeeManagement /> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ?
                <Dashboard onLogout={handleLogout} /> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" /> :
                <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
