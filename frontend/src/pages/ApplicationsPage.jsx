import { useEffect, useState } from "react"
import api from "../api/api"

function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)

    const [company, setCompany] = useState("")
    const [position, setPosition] = useState("")
    const [location, setLocation] = useState("")
    const [salary, setSalary] = useState("")
    const [status, setStatus] = useState("Applied")
    const [dateApplied, setDateApplied] = useState("")
    const [notes, setNotes] = useState("")

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

    useEffect(() => {
        fetchApplications()
    }, [])

    const resetForm = () => {
        setCompany("")
        setPosition("")
        setLocation("")
        setSalary("")
        setStatus("Applied")
        setDateApplied("")
        setNotes("")
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        try {
            await api.post("/applications", {
                company,
                position,
                location,
                salary: salary ? Number(salary) : null,
                status,
                dateApplied,
                notes
            })

            resetForm()
            setShowForm(false)
            fetchApplications()
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create application")
        }
    }

    if (loading) {
        return (
            <div className="pageContainer">
                <h1>Applications</h1>
                <p>Loading applications...</p>
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

                    <button
                        className="addButton"
                        onClick={() => setShowForm(prev => !prev)}
                    >
                        {showForm ? "Close Form" : "+ Add Application"}
                    </button>
                </div>
            </div>

            {error && <p className="errorText">{error}</p>}

            {showForm && (
                <div className="formCard">
                    <h2>Add New Application</h2>

                    <form onSubmit={handleSubmit} className="applicationForm">
                        <input
                            type="text"
                            placeholder="Company"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Position"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Salary"
                            value={salary}
                            onChange={e => setSalary(e.target.value)}
                        />

                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <input
                            type="date"
                            value={dateApplied}
                            onChange={e => setDateApplied(e.target.value)}
                        />

                        <textarea
                            placeholder="Notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows="4"
                        />

                        <button type="submit" className="submitButton">
                            Save Application
                        </button>
                    </form>
                </div>
            )}

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