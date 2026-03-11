import { useEffect, useState } from "react"
import api from "../api/api"

function DashboardPage() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications")
                setApplications(response.data)
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const totalApplications = applications.length
    const applied = applications.filter(app => app.status === "Applied").length
    const interviews = applications.filter(app => app.status === "Interview").length
    const offers = applications.filter(app => app.status === "Offer").length
    const rejected = applications.filter(app => app.status === "Rejected").length

    if (loading) {
        return (
            <div className="pageContainer">
                <div className="pageHeader">
                    <h1>Dashboard</h1>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pageContainer">
                <div className="pageHeader">
                    <h1>Dashboard</h1>
                    <p className="errorText">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1>Dashboard</h1>
                <p>Overview of your job search activity.</p>
            </div>

            <div className="statsGrid">
                <div className="statCard">
                    <h3>Total Applications</h3>
                    <p>{totalApplications}</p>
                </div>

                <div className="statCard">
                    <h3>Applied</h3>
                    <p>{applied}</p>
                </div>

                <div className="statCard">
                    <h3>Interviews</h3>
                    <p>{interviews}</p>
                </div>

                <div className="statCard">
                    <h3>Offers</h3>
                    <p>{offers}</p>
                </div>

                <div className="statCard">
                    <h3>Rejected</h3>
                    <p>{rejected}</p>
                </div>
            </div>

            <div className="dashboardSection">
                <h2>Recent Applications</h2>

                {applications.length === 0 ? (
                    <p>No applications yet.</p>
                ) : (
                    <div className="applicationsList">
                        {applications.slice(0, 3).map(application => (
                            <div key={application.id} className="applicationCard">
                                <h3>{application.company}</h3>
                                <p><strong>Position:</strong> {application.position}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`statusBadge status${application.status}`}>
                                        {application.status}
                                    </span>
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