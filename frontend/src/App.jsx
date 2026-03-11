import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ApplicationsPage from "./pages/ApplicationsPage"
import AnalyticsPage from "./pages/AnalyticsPage"

function App() {
    const token = localStorage.getItem("token")

    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />}
                />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute>
                            <ApplicationsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    }
                />
                
            </Routes>
        </BrowserRouter>
    )
}

export default App