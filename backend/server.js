const express = require("express")
const cors = require("cors")
require("dotenv").config()

const pool = require("./config/db")
const applicationRoutes = require("./routes/applicationRoutes")

const app = express()

app.use(cors())
app.use(express.json())

pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL")
    })
    .catch(err => {
        console.error("Database connection error:", err)
    })

app.get("/", (req, res) => {
    res.send("Job Stats API running")
})

app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()")
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send("Database query failed")
    }
})

app.get("/create-test-user", async (req, res) => {
    try {
        const result = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
            ["test@test.com", "123"]
        )
        res.json(result.rows[0])
    } catch (err) {
        console.error("Error creating test user:", err)
        res.status(500).json({ error: "Failed to create test user" })
    }
})

app.use("/applications", applicationRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})