import { useEffect, useState } from "react"
import api from "../api/api"

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
            <div className="pageContainer">
                <div className="pageHeader"><h1>Dashboard</h1><p>Loading dashboard...</p></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pageContainer">
                <div className="pageHeader"><h1>Dashboard</h1><p className="errorText">{error}</p></div>
            </div>
        )
    }

    const { total, breakdown, responseRate } = stats

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1>Dashboard</h1>
                <p>Overview of your job search activity.</p>
            </div>

            <div className="statsGrid">
                <div className="statCard"><h3>Total Applications</h3><p>{total}</p></div>
                <div className="statCard"><h3>Applied</h3><p>{breakdown.Applied}</p></div>
                <div className="statCard"><h3>Interviews</h3><p>{breakdown.Interview}</p></div>
                <div className="statCard"><h3>Offers</h3><p>{breakdown.Offer}</p></div>
                <div className="statCard"><h3>Response Rate</h3><p>{responseRate}%</p></div>
            </div>

            <div className="dashboardSection">
                <h2>Recent Applications</h2>

                {recentApplications.length === 0 ? (
                    <p>No applications yet.</p>
                ) : (
                    <div className="applicationsList">
                        {recentApplications.map(application => (
                            <div key={application.id} className="applicationCard">
                                <h3>{application.company}</h3>
                                <p><strong>Position:</strong> {application.position}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`statusBadge status${application.status}`}>{application.status}</span>
                                </p>
                                <p><strong>Date Applied:</strong> {application.date_applied ? application.date_applied.slice(0, 10) : "N/A"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashboardPage
