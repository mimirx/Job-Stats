const applicationModel = require("../models/applicationModel")
const activityModel = require("../models/activityModel")

const getApplications = async (req, res) => {
    try {
        const {
            status,
            search,
            sortBy = "created_at",
            sortOrder = "desc",
            page = "1",
            limit = "10"
        } = req.query

        const parsedPage = Math.max(1, parseInt(page, 10) || 1)
        const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10))

        const result = await applicationModel.getAllApplications(req.user.id, {
            status,
            search,
            sortBy,
            sortOrder,
            page: parsedPage,
            limit: parsedLimit
        })

        res.json({
            data: result.data,
            total: result.total,
            page: parsedPage,
            totalPages: Math.ceil(result.total / parsedLimit)
        })
    } catch (err) {
        console.error("Error fetching applications:", err)
        res.status(500).json({ error: "Failed to fetch applications" })
    }
}

const addApplication = async (req, res) => {
    try {
        const { company, position, location, salary, status, dateApplied, notes } = req.body

        const newApplication = await applicationModel.createApplication(
            company,
            position,
            location || null,
            salary ? Number(salary) : null,
            status || "Applied",
            dateApplied || null,
            notes || null,
            req.user.id
        )

        await activityModel.log(newApplication.id, req.user.id, "Application submitted")
        res.status(201).json(newApplication)
    } catch (err) {
        console.error("Error creating application:", err)
        res.status(500).json({ error: "Failed to create application" })
    }
}

const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await applicationModel.deleteApplicationById(id, req.user.id)

        if (!deleted) {
            return res.status(404).json({ error: "Application not found" })
        }

        res.json({ message: "Application deleted successfully", application: deleted })
    } catch (err) {
        console.error("Error deleting application:", err)
        res.status(500).json({ error: "Failed to delete application" })
    }
}

const updateApplication = async (req, res) => {
    try {
        const { id } = req.params
        const { company, position, location, salary, status, dateApplied, notes } = req.body

        const existing = await applicationModel.getApplicationById(id, req.user.id)

        const updated = await applicationModel.updateApplicationById(
            id,
            company,
            position,
            location || null,
            salary ? Number(salary) : null,
            status || "Applied",
            dateApplied || null,
            notes || null,
            req.user.id
        )

        if (!updated) {
            return res.status(404).json({ error: "Application not found" })
        }

        if (existing && existing.status !== (status || "Applied")) {
            await activityModel.log(id, req.user.id, "Status changed", {
                from: existing.status,
                to: status || "Applied"
            })
        }

        res.json(updated)
    } catch (err) {
        console.error("Error updating application:", err)
        res.status(500).json({ error: "Failed to update application" })
    }
}

module.exports = { getApplications, addApplication, deleteApplication, updateApplication }
