const express = require("express")
const rateLimit = require("express-rate-limit")
const router = express.Router()
const authController = require("../controllers/authController")
const { validateRegister, validateLogin } = require("../middleware/validate")

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: { error: "Too many attempts, please try again later." }
})

router.post("/register", authLimiter, validateRegister, authController.register)
router.post("/login", authLimiter, validateLogin, authController.login)

module.exports = router
