import { Link, useNavigate } from "react-router-dom"
import { BriefcaseBusiness, Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const { theme, toggleTheme } = useTheme()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <div className="navbarInner">
                <Link to={token ? "/dashboard" : "/"} className="navbarBrand">
                    <BriefcaseBusiness size={22} strokeWidth={2.1} />
                    <span>Job Stats</span>
                </Link>

                <div className="navbarLinks">
                    {token ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/applications">Applications</Link>
                            <Link to="/interviews">Interviews</Link>
                            <Link to="/analytics">Analytics</Link>
                            <Link to="/insights" className="navInsightsLink">✦ AI Insights</Link>
                            <button className="themeToggle" onClick={toggleTheme} title="Toggle dark mode">
                                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                            </button>
                            <button className="logoutButton" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="themeToggle" onClick={toggleTheme} title="Toggle dark mode">
                                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                            </button>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
