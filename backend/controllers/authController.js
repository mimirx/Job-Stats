const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const register = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" })
        }

        const existingUser = await userModel.findUserByEmail(email)

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await userModel.createUser(email, passwordHash)

        res.status(201).json(user)

    } catch (err) {
        console.error("Register error:", err)
        res.status(500).json({ error: "Registration failed" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findUserByEmail(email)

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const validPassword = await bcrypt.compare(password, user.password_hash)

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        res.json({ token })

    } catch (err) {
        console.error("Login error:", err)
        res.status(500).json({ error: "Login failed" })
    }
}

module.exports = {
    register,
    login
}