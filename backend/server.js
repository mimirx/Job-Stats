const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const pool = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const applicationRoutes = require("./routes/applicationRoutes")
const statsRoutes = require("./routes/statsRoutes")
const interviewRoutes = require("./routes/interviewRoutes")
const insightsRoutes = require("./routes/insightsRoutes")

const app = express()

app.use(cors())
app.use(express.json())

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: { error: "Too many requests, please try again later." }
})

app.use(apiLimiter)

app.use("/auth", authRoutes)
app.use("/applications", applicationRoutes)
app.use("/stats", statsRoutes)
app.use("/interviews", interviewRoutes)
app.use("/insights", insightsRoutes)

app.get("/", (req, res) => {
    res.send("Job Stats API running")
})

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

module.exports = app
