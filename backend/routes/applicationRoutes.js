const express = require("express")
const router = express.Router()
const applicationController = require("../controllers/applicationController")
const authMiddleware = require("../middleware/authMiddleware")
const { validateApplication } = require("../middleware/validate")

router.use(authMiddleware)

router.get("/", applicationController.getApplications)
router.post("/", validateApplication, applicationController.addApplication)
router.put("/:id", validateApplication, applicationController.updateApplication)
router.delete("/:id", applicationController.deleteApplication)

module.exports = router
