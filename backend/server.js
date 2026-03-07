const express = require("express")
const cors = require("cors")
require("dotenv").config()

const pool = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const applicationRoutes = require("./routes/applicationRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/applications", applicationRoutes)

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

app.use("/applications", applicationRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})