import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import api from "../api/api"
import { StatCardSkeleton, ApplicationCardSkeleton } from "../components/Skeleton"

const pageVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
}

const listVariants = {
    animate: { transition: { staggerChildren: 0.07 } }
}

const itemVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
}

function DashboardPage() {
    const [stats, setStats] = useState(null)
    const [recentApplications, setRecentApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    api.get("/stats"),
                    api.get("/applications", { params: { page: 1, limit: 3, sortBy: "created_at", sortOrder: "desc" } })
                ])
                setStats(statsRes.data)
                setRecentApplications(appsRes.data.data)
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <motion.div className="pageContainer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <div className="pageHeader">
                    <h1>Dashboard</h1>
                    <p>Overview of your job search activity.</p>
                </div>
                <div className="statsGrid">
                    {[...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)}
                </div>
                <div className="dashboardSection">
                    <h2>Recent Applications</h2>
                    <div className="applicationsList">
                        {[...Array(3)].map((_, i) => <ApplicationCardSkeleton key={i} />)}
                    </div>
                </div>
            </motion.div>
        )
    }

    if (error) {
        return (
            <motion.div className="pageContainer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <div className="pageHeader"><h1>Dashboard</h1><p className="errorText">{error}</p></div>
            </motion.div>
        )
    }

    const { total, breakdown, responseRate } = stats

    const statCards = [
        { label: "Total Applications", value: total },
        { label: "Applied", value: breakdown.Applied },
        { label: "Interviews", value: breakdown.Interview },
        { label: "Offers", value: breakdown.Offer },
        { label: "Response Rate", value: `${responseRate}%` }
    ]

    return (
        <motion.div className="pageContainer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="pageHeader">
                <h1>Dashboard</h1>
                <p>Overview of your job search activity.</p>
            </div>

            <motion.div className="statsGrid" variants={listVariants} initial="initial" animate="animate">
                {statCards.map(card => (
                    <motion.div key={card.label} className="statCard" variants={itemVariants}>
                        <h3>{card.label}</h3>
                        <p>{card.value}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="dashboardSection">
                <h2>Recent Applications</h2>
                {recentApplications.length === 0 ? (
                    <p>No applications yet.</p>
                ) : (
                    <motion.div className="applicationsList" variants={listVariants} initial="initial" animate="animate">
                        {recentApplications.map(app => (
                            <motion.div key={app.id} className="applicationCard" variants={itemVariants}>
                                <h3>{app.company}</h3>
                                <p><strong>Position:</strong> {app.position}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`statusBadge status${app.status}`}>{app.status}</span>
                                </p>
                                <p><strong>Date Applied:</strong> {app.date_applied ? app.date_applied.slice(0, 10) : "N/A"}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default DashboardPage
