import { useEffect, useState, useCallback } from "react"
import api from "../api/api"

const SORT_OPTIONS = [
    { value: "created_at", label: "Date Added" },
    { value: "date_applied", label: "Date Applied" },
    { value: "company", label: "Company" },
    { value: "position", label: "Position" },
    { value: "salary", label: "Salary" }
]

const PAGE_SIZE = 10

function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [sortBy, setSortBy] = useState("created_at")
    const [sortOrder, setSortOrder] = useState("desc")
    const [page, setPage] = useState(1)

    const [company, setCompany] = useState("")
    const [position, setPosition] = useState("")
    const [location, setLocation] = useState("")
    const [salary, setSalary] = useState("")
    const [status, setStatus] = useState("Applied")
    const [dateApplied, setDateApplied] = useState("")
    const [notes, setNotes] = useState("")

    const fetchApplications = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                page,
                limit: PAGE_SIZE,
                sortBy,
                sortOrder,
                ...(statusFilter && { status: statusFilter }),
                ...(search && { search })
            }
            const response = await api.get("/applications", { params })
            setApplications(response.data.data)
            setTotal(response.data.total)
            setTotalPages(response.data.totalPages)
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load applications")
        } finally {
            setLoading(false)
        }
    }, [page, sortBy, sortOrder, statusFilter, search])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    useEffect(() => {
        setPage(1)
    }, [search, statusFilter, sortBy, sortOrder])

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

        const payload = { company, position, location, salary: salary ? Number(salary) : null, status, dateApplied, notes }

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
        if (!window.confirm("Are you sure you want to delete this application?")) return
        try {
            await api.delete(`/applications/${id}`)
            fetchApplications()
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete application")
        }
    }

    const toggleSortOrder = () => setSortOrder(o => o === "desc" ? "asc" : "desc")

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <div className="pageHeaderRow">
                    <div>
                        <h1>Applications</h1>
                        <p>Track and manage your job applications.</p>
                    </div>
                    <button className="addButton" onClick={handleOpenCreate}>+ Add Application</button>
                </div>
            </div>

            <div className="filterBar">
                <input
                    type="text"
                    placeholder="Search by company or position"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="filterInput"
                />

                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filterSelect">
                    <option value="">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filterSelect">
                    {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <button className="sortOrderButton" onClick={toggleSortOrder} title="Toggle sort order">
                    {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
                </button>
            </div>

            {error && <p className="errorText">{error}</p>}

            {showForm && (
                <div className="formCard">
                    <h2>{editingId ? "Edit Application" : "Add New Application"}</h2>
                    <form onSubmit={handleSubmit} className="applicationForm">
                        <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} required />
                        <input type="text" placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} required />
                        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                        <input type="number" placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} />
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <input type="date" value={dateApplied} onChange={e => setDateApplied(e.target.value)} />
                        <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} rows="4" />
                        <div className="formActions">
                            <button type="submit" className="submitButton">{editingId ? "Update Application" : "Save Application"}</button>
                            <button type="button" className="cancelButton" onClick={handleCloseForm}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading applications...</p>
            ) : applications.length === 0 ? (
                <p>No matching applications found.</p>
            ) : (
                <>
                    <p className="resultsCount">{total} application{total !== 1 ? "s" : ""} found</p>

                    <div className="applicationsList">
                        {applications.map(application => (
                            <div key={application.id} className="applicationCard">
                                <div className="applicationCardHeader">
                                    <h3>{application.company}</h3>
                                    <div className="cardActions">
                                        <button className="editButton" onClick={() => handleOpenEdit(application)}>Edit</button>
                                        <button className="deleteButton" onClick={() => handleDelete(application.id)}>Delete</button>
                                    </div>
                                </div>
                                <p><strong>Position:</strong> {application.position}</p>
                                <p><strong>Location:</strong> {application.location || "N/A"}</p>
                                <p><strong>Salary:</strong> {application.salary ? `$${Number(application.salary).toLocaleString()}` : "N/A"}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`statusBadge status${application.status}`}>{application.status}</span>
                                </p>
                                <p><strong>Date Applied:</strong> {application.date_applied ? application.date_applied.slice(0, 10) : "N/A"}</p>
                                <p><strong>Notes:</strong> {application.notes || "N/A"}</p>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pageButton"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← Prev
                            </button>

                            <span className="pageInfo">Page {page} of {totalPages}</span>

                            <button
                                className="pageButton"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ApplicationsPage
