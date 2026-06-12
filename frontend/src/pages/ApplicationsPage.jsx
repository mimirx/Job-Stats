import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/api"
import { ApplicationCardSkeleton } from "../components/Skeleton"

const SORT_OPTIONS = [
    { value: "created_at", label: "Date Added" },
    { value: "date_applied", label: "Date Applied" },
    { value: "company", label: "Company" },
    { value: "position", label: "Position" },
    { value: "salary", label: "Salary" }
]

const PAGE_SIZE = 10

const pageVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
}

const listVariants = {
    animate: { transition: { staggerChildren: 0.06 } }
}

const cardVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.12 } }
}

function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const isFirstLoad = useRef(true)

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
        if (isFirstLoad.current) {
            setLoading(true)
        } else {
            setFetching(true)
        }
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
            isFirstLoad.current = false
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load applications")
        } finally {
            setLoading(false)
            setFetching(false)
        }
    }, [page, sortBy, sortOrder, statusFilter, search])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    useEffect(() => {
        setPage(1)
    }, [search, statusFilter, sortBy, sortOrder])

    const resetForm = () => {
        setCompany(""); setPosition(""); setLocation(""); setSalary("")
        setStatus("Applied"); setDateApplied(""); setNotes(""); setEditingId(null)
    }

    const handleOpenCreate = () => { resetForm(); setShowForm(true); setError("") }

    const handleOpenEdit = app => {
        setEditingId(app.id)
        setCompany(app.company || ""); setPosition(app.position || "")
        setLocation(app.location || ""); setSalary(app.salary || "")
        setStatus(app.status || "Applied")
        setDateApplied(app.date_applied ? app.date_applied.slice(0, 10) : "")
        setNotes(app.notes || "")
        setShowForm(true); setError("")
    }

    const handleCloseForm = () => { setShowForm(false); resetForm(); setError("") }

    const handleSubmit = async e => {
        e.preventDefault(); setError("")
        const payload = { company, position, location, salary: salary ? Number(salary) : null, status, dateApplied, notes }
        try {
            if (editingId) {
                await api.put(`/applications/${editingId}`, payload)
            } else {
                await api.post("/applications", payload)
            }
            resetForm(); setShowForm(false); fetchApplications()
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
        <motion.div className="pageContainer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
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
                <button className="sortOrderButton" onClick={toggleSortOrder}>
                    {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
                </button>
            </div>

            {error && <p className="errorText">{error}</p>}

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="formCard"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="applicationsList">
                    {[...Array(5)].map((_, i) => <ApplicationCardSkeleton key={i} />)}
                </div>
            ) : applications.length === 0 ? (
                <p>No matching applications found.</p>
            ) : (
                <>
                    <p className="resultsCount">{total} application{total !== 1 ? "s" : ""} found</p>

                    <motion.div
                        className="applicationsList"
                        style={{ opacity: fetching ? 0.5 : 1, transition: "opacity 0.2s ease" }}
                        variants={listVariants}
                        initial="initial"
                        animate="animate"
                        key={`${page}-${statusFilter}-${search}-${sortBy}-${sortOrder}`}
                    >
                        {applications.map(app => (
                            <motion.div key={app.id} className="applicationCard" variants={cardVariants}>
                                <div className="applicationCardHeader">
                                    <h3>{app.company}</h3>
                                    <div className="cardActions">
                                        <button className="editButton" onClick={() => handleOpenEdit(app)}>Edit</button>
                                        <button className="deleteButton" onClick={() => handleDelete(app.id)}>Delete</button>
                                    </div>
                                </div>
                                <p><strong>Position:</strong> {app.position}</p>
                                <p><strong>Location:</strong> {app.location || "N/A"}</p>
                                <p><strong>Salary:</strong> {app.salary ? `$${Number(app.salary).toLocaleString()}` : "N/A"}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`statusBadge status${app.status}`}>{app.status}</span>
                                </p>
                                <p><strong>Date Applied:</strong> {app.date_applied ? app.date_applied.slice(0, 10) : "N/A"}</p>
                                <p><strong>Notes:</strong> {app.notes || "N/A"}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="pageButton" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                            <span className="pageInfo">Page {page} of {totalPages}</span>
                            <button className="pageButton" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </motion.div>
    )
}

export default ApplicationsPage
