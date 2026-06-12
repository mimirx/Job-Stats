import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ApplicationsPage from "./pages/ApplicationsPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import InterviewsPage from "./pages/InterviewsPage"
import InsightsPage from "./pages/InsightsPage"

function AppRoutes() {
    const location = useLocation()
    const token = localStorage.getItem("token")

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                />
                <Route
                    path="/applications"
                    element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>}
                />
                <Route
                    path="/analytics"
                    element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>}
                />
                <Route
                    path="/interviews"
                    element={<ProtectedRoute><InterviewsPage /></ProtectedRoute>}
                />
                <Route
                    path="/insights"
                    element={<ProtectedRoute><InsightsPage /></ProtectedRoute>}
                />
            </Routes>
        </AnimatePresence>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <AppRoutes />
        </BrowserRouter>
    )
}

export default App
