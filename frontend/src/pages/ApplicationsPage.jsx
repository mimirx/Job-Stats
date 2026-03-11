import { useEffect, useMemo, useState } from "react"
import api from "../api/api"

function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")

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

    const filteredApplications = useMemo(() => {
        return applications.filter(application => {
            const matchesSearch =
                application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                application.position.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus =
                statusFilter === "All" || application.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [applications, searchTerm, statusFilter])

    const resetForm = () => {
        setCompany("")
        setPosition("")
        setLocation("")
        setSalary("")
        setStatus("Applied")
        setDateApplied("")
        setNotes("")
        setEditingId(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setShowForm(true)
        setError("")
    }

    const handleOpenEdit = application => {
        setEditingId(application.id)
        setCompany(application.company || "")
        setPosition(application.position || "")
        setLocation(application.location || "")
        setSalary(application.salary || "")
        setStatus(application.status || "Applied")
        setDateApplied(application.date_applied ? application.date_applied.slice(0, 10) : "")
        setNotes(application.notes || "")
        setShowForm(true)
        setError("")
    }

    const handleCloseForm = () => {
        setShowForm(false)
        resetForm()
        setError("")
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        const payload = {
            company,
            position,
            location,
            salary: salary ? Number(salary) : null,
            status,
            dateApplied,
            notes
        }

        try {
            if (editingId) {
                await api.put(`/applications/${editingId}`, payload)
            } else {
                await api.post("/applications", payload)
            }

            resetForm()
            setShowForm(false)
            fetchApplications()
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save application")
        }
    }

    const handleDelete = async id => {
        const confirmed = window.confirm("Are you sure you want to delete this application?")

        if (!confirmed) {
            return
        }

        try {
            await api.delete(`/applications/${id}`)
            fetchApplications()
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete application")
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

                    <button className="addButton" onClick={handleOpenCreate}>
                        + Add Application
                    </button>
                </div>
            </div>

            <div className="filterBar">
                <input
                    type="text"
                    placeholder="Search by company or position"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="filterInput"
                />

                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="filterSelect"
                >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {error && <p className="errorText">{error}</p>}

            {showForm && (
                <div className="formCard">
                    <h2>{editingId ? "Edit Application" : "Add New Application"}</h2>

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

                        <div className="formActions">
                            <button type="submit" className="submitButton">
                                {editingId ? "Update Application" : "Save Application"}
                            </button>

                            <button
                                type="button"
                                className="cancelButton"
                                onClick={handleCloseForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {filteredApplications.length === 0 ? (
                <p>No matching applications found.</p>
            ) : (
                <div className="applicationsList">
                    {filteredApplications.map(application => (
                        <div key={application.id} className="applicationCard">
                            <div className="applicationCardHeader">
                                <h3>{application.company}</h3>

                                <div className="cardActions">
                                    <button
                                        className="editButton"
                                        onClick={() => handleOpenEdit(application)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="deleteButton"
                                        onClick={() => handleDelete(application.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p><strong>Position:</strong> {application.position}</p>
                            <p><strong>Location:</strong> {application.location || "N/A"}</p>
                            <p><strong>Salary:</strong> {application.salary || "N/A"}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`statusBadge status${application.status}`}>
                                    {application.status}
                                </span>
                            </p>
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