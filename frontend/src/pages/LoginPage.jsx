import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/api"

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            })

            localStorage.setItem("token", response.data.token)
            navigate("/dashboard")
        } catch (err) {
            setError(err.response?.data?.error || "Login failed")
        }
    }

    return (
        <div className="pageCenter">
            <div className="authCard">
                <h1>Login</h1>

                <form onSubmit={handleSubmit} className="authForm">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {error && <p className="errorText">{error}</p>}

                    <button type="submit">Login</button>
                </form>

                <p className="authSwitch">
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage