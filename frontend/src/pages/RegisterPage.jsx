import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/api"

function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        try {
            await api.post("/auth/register", {
                email,
                password
            })

            navigate("/login")
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed")
        }
    }

    return (
        <div className="pageCenter">
            <div className="authCard">
                <h1>Register</h1>

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

                    <button type="submit">Create Account</button>
                </form>

                <p className="authSwitch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage