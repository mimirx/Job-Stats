const statsModel = require("../models/statsModel")

const getStats = async (req, res) => {
    try {
        const stats = await statsModel.getStats(req.user.id)
        res.json(stats)
    } catch (err) {
        console.error("Error fetching stats:", err)
        res.status(500).json({ error: "Failed to fetch stats" })
    }
}

module.exports = { getStats }
