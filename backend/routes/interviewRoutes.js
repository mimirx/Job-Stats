const express = require("express")
const router = express.Router()
const interviewController = require("../controllers/interviewController")
const authMiddleware = require("../middleware/authMiddleware")

router.use(authMiddleware)

router.get("/", interviewController.getInterviews)
router.post("/", interviewController.addInterview)
router.put("/:id", interviewController.updateInterview)
router.delete("/:id", interviewController.deleteInterview)

module.exports = router
