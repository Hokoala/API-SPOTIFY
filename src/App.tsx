import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./components/Login"
import DashboardPage from "./pages/DashboardPage"
import SearchPage from "./pages/SearchPage"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Mock user data
    const user = {
        name: "Jean Dupont",
        email: "jean.dupont@email.com",
        image: "https://i.pravatar.cc/150?img=68",
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    if (!isLoggedIn) {
        return <Login onLogin={setIsLoggedIn} />
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard"
                element={<DashboardPage onLogout={handleLogout} />}
            />
            <Route
                path="/search"
                element={<SearchPage onLogout={handleLogout} user={user} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App
