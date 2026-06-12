const interviewModel = require("../models/interviewModel")

const getInterviews = async (req, res) => {
    try {
        const interviews = await interviewModel.getInterviewsByUser(req.user.id)
        res.json(interviews)
    } catch (err) {
        console.error("Error fetching interviews:", err)
        res.status(500).json({ error: "Failed to fetch interviews" })
    }
}

const addInterview = async (req, res) => {
    try {
        const { applicationId, interviewType, scheduledAt, notes } = req.body

        if (!applicationId || !interviewType || !scheduledAt) {
            return res.status(400).json({ error: "applicationId, interviewType, and scheduledAt are required" })
        }

        if (!interviewModel.VALID_TYPES.has(interviewType)) {
            return res.status(400).json({ error: "Invalid interview type" })
        }

        const interview = await interviewModel.createInterview(
            applicationId,
            req.user.id,
            interviewType,
            scheduledAt,
            notes
        )

        res.status(201).json(interview)
    } catch (err) {
        console.error("Error creating interview:", err)
        res.status(500).json({ error: "Failed to create interview" })
    }
}

const updateInterview = async (req, res) => {
    try {
        const { id } = req.params
        const { interviewType, scheduledAt, notes } = req.body

        if (!interviewType || !scheduledAt) {
            return res.status(400).json({ error: "interviewType and scheduledAt are required" })
        }

        if (!interviewModel.VALID_TYPES.has(interviewType)) {
            return res.status(400).json({ error: "Invalid interview type" })
        }

        const updated = await interviewModel.updateInterview(id, req.user.id, interviewType, scheduledAt, notes)

        if (!updated) {
            return res.status(404).json({ error: "Interview not found" })
        }

        res.json(updated)
    } catch (err) {
        console.error("Error updating interview:", err)
        res.status(500).json({ error: "Failed to update interview" })
    }
}

const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await interviewModel.deleteInterview(id, req.user.id)

        if (!deleted) {
            return res.status(404).json({ error: "Interview not found" })
        }

        res.json({ message: "Interview deleted successfully", interview: deleted })
    } catch (err) {
        console.error("Error deleting interview:", err)
        res.status(500).json({ error: "Failed to delete interview" })
    }
}

module.exports = { getInterviews, addInterview, updateInterview, deleteInterview }
