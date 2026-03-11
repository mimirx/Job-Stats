import { Link, useNavigate } from "react-router-dom"

function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <Link to={token ? "/dashboard" : "/"} className="navbarBrand">
                Job Stats
            </Link>

            <div className="navbarLinks">
                {token ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/applications">Applications</Link>
                        <Link to="/analytics">Analytics</Link>
                        <button className="logoutButton" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar