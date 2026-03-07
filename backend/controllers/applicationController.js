const applicationModel = require("../models/applicationModel")

const getApplications = async (req, res) => {
    try {
        const applications = await applicationModel.getAllApplications()
        res.json(applications)
    } catch (err) {
        console.error("Error fetching applications:", err)
        res.status(500).json({ error: "Failed to fetch applications" })
    }
}

const addApplication = async (req, res) => {
    try {
        const {
            company,
            position,
            location,
            salary,
            status,
            dateApplied,
            notes,
            userId
        } = req.body

        if (!company || !position || !userId) {
            return res.status(400).json({ error: "company, position, and userId are required" })
        }

        const newApplication = await applicationModel.createApplication(
            company,
            position,
            location || null,
            salary || null,
            status || "Applied",
            dateApplied || null,
            notes || null,
            userId
        )

        res.status(201).json(newApplication)
    } catch (err) {
        console.error("Error creating application:", err)
        res.status(500).json({ error: "Failed to create application" })
    }
}

module.exports = {
    getApplications,
    addApplication
}