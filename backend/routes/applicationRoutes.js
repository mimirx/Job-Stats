const express = require("express")
const router = express.Router()
const applicationController = require("../controllers/applicationController")
const authMiddleware = require("../middleware/authMiddleware")
const { validateApplication } = require("../middleware/validate")
const activityModel = require("../models/activityModel")

router.use(authMiddleware)

router.get("/", applicationController.getApplications)
router.post("/", validateApplication, applicationController.addApplication)
router.put("/:id", validateApplication, applicationController.updateApplication)
router.delete("/:id", applicationController.deleteApplication)

router.get("/:id/activity", async (req, res) => {
    try {
        const entries = await activityModel.getByApplication(req.params.id, req.user.id)
        res.json(entries)
    } catch (err) {
        console.error("Error fetching activity:", err)
        res.status(500).json({ error: "Failed to fetch activity" })
    }
})

module.exports = router
