const express = require("express")
const router = express.Router()
const { GoogleGenerativeAI } = require("@google/generative-ai")
const rateLimit = require("express-rate-limit")
const authMiddleware = require("../middleware/authMiddleware")
const statsModel = require("../models/statsModel")

const insightsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many insight requests. Please wait 15 minutes before generating again." }
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function buildPrompt(stats) {
    const { total, breakdown, responseRate, weeklyTrend, avgSalary } = stats

    const weeklyInfo = weeklyTrend.length > 0
        ? weeklyTrend.map(w => `  • Week of ${w.week}: ${w.count} application(s)`).join("\n")
        : "  • No weekly data available yet."

    return `You are an expert career coach helping a recent Computer Science graduate (Bachelor of Science, Software Development) find their first software developer role. Analyze their job search data and provide personalized, actionable insights.

Job Search Data:
- Total applications submitted: ${total}
- Status breakdown:
  • Applied (awaiting response): ${breakdown.Applied}
  • Interview stage: ${breakdown.Interview}
  • Offer received: ${breakdown.Offer}
  • Rejected: ${breakdown.Rejected}
- Response rate (interviews + offers ÷ total): ${responseRate}%
- Average salary target: ${avgSalary ? `$${Number(avgSalary).toLocaleString()}` : "Not specified"}

Weekly application activity (last 10 weeks):
${weeklyInfo}

Please provide a structured analysis with these exact sections:

**Overall Assessment**
A candid 2-3 sentence evaluation of the job search health based on the numbers.

**What's Working**
2-3 specific strengths or positive patterns visible in the data.

**Areas to Improve**
2-3 specific, actionable suggestions based on the numbers. Be direct and concrete.

**Action Plan for This Week**
3 concrete, prioritized steps to take immediately.

Keep the response focused, encouraging but honest, and under 400 words. Base every observation on the actual data — no generic advice.`
}

router.post("/", authMiddleware, insightsLimiter, async (req, res) => {
    try {
        const stats = await statsModel.getStats(req.user.id)

        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("X-Accel-Buffering", "no")

        if (stats.total === 0) {
            res.write("You haven't added any job applications yet! Start by adding your first application on the Applications page, then come back here for personalized AI insights based on your real data.")
            return res.end()
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const result = await model.generateContentStream(buildPrompt(stats))

        for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) res.write(text)
        }

        res.end()
    } catch (err) {
        console.error("Insights error:", err)
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate insights. Please try again." })
        } else {
            res.end()
        }
    }
})

module.exports = router
