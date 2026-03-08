import { useEffect, useState } from "react"
import api from "../api/api"

function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications")
                setApplications(response.data)
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load applications")
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    if (loading) {
        return (
            <div className="pageContainer">
                <h1>Applications</h1>
                <p>Loading applications...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pageContainer">
                <h1>Applications</h1>
                <p className="errorText">{error}</p>
            </div>
        )
    }

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <div className="pageHeaderRow">
                    <div>
                        <h1>Applications</h1>
                        <p>Track and manage your job applications.</p>
                    </div>

                    <button className="addButton">
                        + Add Application
                    </button>
                </div>
            </div>

            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <div className="applicationsList">
                    {applications.map(application => (
                        <div key={application.id} className="applicationCard">
                            <h3>{application.company}</h3>
                            <p><strong>Position:</strong> {application.position}</p>
                            <p><strong>Location:</strong> {application.location || "N/A"}</p>
                            <p><strong>Salary:</strong> {application.salary || "N/A"}</p>
                            <p><strong>Status:</strong> {application.status}</p>
                            <p><strong>Date Applied:</strong> {application.date_applied ? application.date_applied.slice(0, 10) : "N/A"}</p>
                            <p><strong>Notes:</strong> {application.notes || "N/A"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ApplicationsPage