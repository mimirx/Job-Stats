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

const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params
        const deletedApplication = await applicationModel.deleteApplicationById(id)

        if (!deletedApplication) {
            return res.status(404).json({ error: "Application not found" })
        }

        res.json({
            message: "Application deleted successfully",
            application: deletedApplication
        })
    } catch (err) {
        console.error("Error deleting application:", err)
        res.status(500).json({ error: "Failed to delete application" })
    }
}

const updateApplication = async (req, res) => {
    try {
        const { id } = req.params
        const {
            company,
            position,
            location,
            salary,
            status,
            dateApplied,
            notes
        } = req.body

        if (!company || !position) {
            return res.status(400).json({ error: "company and position are required" })
        }

        const updatedApplication = await applicationModel.updateApplicationById(
            id,
            company,
            position,
            location || null,
            salary || null,
            status || "Applied",
            dateApplied || null,
            notes || null
        )

        if (!updatedApplication) {
            return res.status(404).json({ error: "Application not found" })
        }

        res.json(updatedApplication)
    } catch (err) {
        console.error("Error updating application:", err)
        res.status(500).json({ error: "Failed to update application" })
    }
}

module.exports = {
    getApplications,
    addApplication,
    deleteApplication,
    updateApplication
}