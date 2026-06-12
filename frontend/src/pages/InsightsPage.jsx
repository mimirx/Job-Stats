import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import api from "../api/api"

const pageVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
}

function InsightsPage() {
    const [stats, setStats] = useState(null)
    const [insights, setInsights] = useState("")
    const [generating, setGenerating] = useState(false)
    const [generated, setGenerated] = useState(false)
    const [error, setError] = useState("")
    const insightsRef = useRef(null)

    useEffect(() => {
        api.get("/stats")
            .then(res => setStats(res.data))
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (generating && insightsRef.current) {
            insightsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
    }, [insights, generating])

    const generateInsights = async () => {
        setGenerating(true)
        setInsights("")
        setError("")
        setGenerated(false)

        try {
            const token = localStorage.getItem("token")
            const baseURL = import.meta.env.VITE_API_URL || "https://job-stats-905b.onrender.com"

            const response = await fetch(`${baseURL}/insights`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data.error || "Failed to generate insights")
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                setInsights(prev => prev + decoder.decode(value, { stream: true }))
            }

            setGenerated(true)
        } catch (err) {
            setError(err.message || "Failed to generate insights. Please try again.")
        } finally {
            setGenerating(false)
        }
    }

    const renderInsights = (text) => {
        return text
            .split("\n")
            .map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                    return <p key={i} className="insightsSectionTitle">{line.slice(2, -2)}</p>
                }
                if (/^\*\*(.+)\*\*/.test(line)) {
                    return <p key={i} className="insightsLine"
                        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                    />
                }
                if (line.trim() === "") return <br key={i} />
                return <p key={i} className="insightsLine">{line}</p>
            })
    }

    return (
        <motion.div className="pageContainer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="pageHeader">
                <div className="pageHeaderRow">
                    <div>
                        <h1>AI Insights</h1>
                        <p>Personalized analysis of your job search, powered by Gemini AI.</p>
                    </div>
                </div>
            </div>

            {stats && (
                <div className="insightsStatsGrid">
                    <motion.div
                        className="insightsStatCard"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.25 } }}
                    >
                        <span className="insightsStatValue">{stats.total}</span>
                        <span className="insightsStatLabel">Total Applications</span>
                    </motion.div>
                    <motion.div
                        className="insightsStatCard"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.25 } }}
                    >
                        <span className="insightsStatValue">{stats.responseRate}%</span>
                        <span className="insightsStatLabel">Response Rate</span>
                    </motion.div>
                    <motion.div
                        className="insightsStatCard"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.25 } }}
                    >
                        <span className="insightsStatValue">{stats.breakdown.Interview}</span>
                        <span className="insightsStatLabel">Interviews</span>
                    </motion.div>
                    <motion.div
                        className="insightsStatCard"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.25 } }}
                    >
                        <span className="insightsStatValue">{stats.breakdown.Offer}</span>
                        <span className="insightsStatLabel">Offers</span>
                    </motion.div>
                </div>
            )}

            <motion.div
                className="insightsCard"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.3 } }}
            >
                <div className="insightsCardHeader">
                    <div className="insightsAiBadge">
                        <span className="insightsAiDot" />
                        <span>Gemini AI Analysis</span>
                    </div>
                    <button
                        className="insightsGenerateBtn"
                        onClick={generateInsights}
                        disabled={generating}
                    >
                        {generating ? (
                            <>
                                <span className="insightsBtnSpinner" />
                                Analyzing...
                            </>
                        ) : generated ? "Regenerate Insights" : "Generate Insights"}
                    </button>
                </div>

                {error && <p className="errorText" style={{ marginTop: "1rem" }}>{error}</p>}

                {!insights && !generating && !error && (
                    <div className="insightsPlaceholder">
                        <div className="insightsPlaceholderIcon">✦</div>
                        <p>Click <strong>Generate Insights</strong> to get a personalized AI analysis of your job search.</p>
                        <p className="insightsPlaceholderSub">Claude will analyze your application history, response rate, and trends to give you actionable advice.</p>
                    </div>
                )}

                {(insights || generating) && (
                    <div ref={insightsRef} className={`insightsBody ${generating ? "insightsGenerating" : "insightsDone"}`}>
                        {renderInsights(insights)}
                        {generating && <span className="insightsCursor">▋</span>}
                    </div>
                )}
            </motion.div>

            <p className="insightsDisclaimer">
                AI-generated insights are based on your job search data. Responses are limited to 5 per 15 minutes.
            </p>
        </motion.div>
    )
}

export default InsightsPage
