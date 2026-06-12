const { body, validationResult } = require("express-validator")

const handleValidation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

const validateRegister = [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    handleValidation
]

const validateLogin = [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidation
]

const validateApplication = [
    body("company")
        .trim()
        .notEmpty().withMessage("Company is required")
        .isLength({ max: 255 }).withMessage("Company must be 255 characters or fewer"),
    body("position")
        .trim()
        .notEmpty().withMessage("Position is required")
        .isLength({ max: 255 }).withMessage("Position must be 255 characters or fewer"),
    body("location")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 255 }).withMessage("Location must be 255 characters or fewer"),
    body("salary")
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Salary must be a positive number"),
    body("status")
        .optional()
        .isIn(["Applied", "Interview", "Offer", "Rejected"]).withMessage("Invalid status"),
    body("dateApplied")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().withMessage("Date applied must be a valid date"),
    handleValidation
]

module.exports = { validateRegister, validateLogin, validateApplication }
