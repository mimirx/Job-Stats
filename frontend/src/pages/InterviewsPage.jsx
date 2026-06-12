import { useEffect, useState, useCallback } from "react"
import api from "../api/api"

const INTERVIEW_TYPES = ["Phone", "Technical", "Onsite", "Final", "Other"]

const TYPE_COLORS = {
    Phone: "typePhone",
    Technical: "typeTechnical",
    Onsite: "typeOnsite",
    Final: "typeFinal",
    Other: "typeOther"
}

function formatDateTime(iso) {
    const d = new Date(iso)
    return d.toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    })
}

function isUpcoming(iso) {
    return new Date(iso) >= new Date()
}

function InterviewsPage() {
    const [interviews, setInterviews] = useState([])
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const [applicationId, setApplicationId] = useState("")
    const [interviewType, setInterviewType] = useState("Phone")
    const [scheduledAt, setScheduledAt] = useState("")
    const [notes, setNotes] = useState("")

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [interviewsRes, appsRes] = await Promise.all([
                api.get("/interviews"),
                api.get("/applications", { params: { limit: 100, sortBy: "company", sortOrder: "asc" } })
            ])
            setInterviews(interviewsRes.data)
            setApplications(appsRes.data.data)
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load interviews")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const resetForm = () => {
        setApplicationId("")
        setInterviewType("Phone")
        setScheduledAt("")
        setNotes("")
        setEditingId(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setShowForm(true)
        setError("")
    }

    const handleOpenEdit = interview => {
        setEditingId(interview.id)
        setApplicationId(interview.application_id)
        setInterviewType(interview.interview_type)
        const dt = new Date(interview.scheduled_at)
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        setScheduledAt(local.toISOString().slice(0, 16))
        setNotes(interview.notes || "")
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

        const payload = { applicationId: Number(applicationId), interviewType, scheduledAt, notes }

        try {
            if (editingId) {
                await api.put(`/interviews/${editingId}`, payload)
            } else {
                await api.post("/interviews", payload)
            }
            resetForm()
            setShowForm(false)
            fetchData()
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save interview")
        }
    }

    const handleDelete = async id => {
        if (!window.confirm("Delete this interview?")) return
        try {
            await api.delete(`/interviews/${id}`)
            fetchData()
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete interview")
        }
    }

    const upcoming = interviews.filter(i => isUpcoming(i.scheduled_at))
    const past = interviews.filter(i => !isUpcoming(i.scheduled_at))

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <div className="pageHeaderRow">
                    <div>
                        <h1>Interviews</h1>
                        <p>Schedule and track your interviews across all applications.</p>
                    </div>
                    <button className="addButton" onClick={handleOpenCreate}>+ Schedule Interview</button>
                </div>
            </div>

            {error && <p className="errorText">{error}</p>}

            {showForm && (
                <div className="formCard">
                    <h2>{editingId ? "Edit Interview" : "Schedule Interview"}</h2>
                    <form onSubmit={handleSubmit} className="applicationForm">
                        <select value={applicationId} onChange={e => setApplicationId(e.target.value)} required>
                            <option value="">Select Application</option>
                            {applications.map(app => (
                                <option key={app.id} value={app.id}>
                                    {app.company} — {app.position}
                                </option>
                            ))}
                        </select>

                        <select value={interviewType} onChange={e => setInterviewType(e.target.value)}>
                            {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={e => setScheduledAt(e.target.value)}
                            required
                        />

                        <textarea
                            placeholder="Notes (optional)"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows="3"
                        />

                        <div className="formActions">
                            <button type="submit" className="submitButton">
                                {editingId ? "Update Interview" : "Save Interview"}
                            </button>
                            <button type="button" className="cancelButton" onClick={handleCloseForm}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading interviews...</p>
            ) : interviews.length === 0 ? (
                <div className="emptyAnalyticsCard">
                    <h2>No interviews scheduled</h2>
                    <p>Schedule your first interview to start tracking your pipeline.</p>
                </div>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <div className="dashboardSection">
                            <h2>Upcoming ({upcoming.length})</h2>
                            <div className="timeline">
                                {upcoming.map(interview => (
                                    <TimelineCard
                                        key={interview.id}
                                        interview={interview}
                                        onEdit={handleOpenEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {past.length > 0 && (
                        <div className="dashboardSection">
                            <h2>Past ({past.length})</h2>
                            <div className="timeline timelinePast">
                                {[...past].reverse().map(interview => (
                                    <TimelineCard
                                        key={interview.id}
                                        interview={interview}
                                        onEdit={handleOpenEdit}
                                        onDelete={handleDelete}
                                        isPast
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function TimelineCard({ interview, onEdit, onDelete, isPast }) {
    return (
        <div className={`timelineCard ${isPast ? "timelineCardPast" : ""}`}>
            <div className="timelineMarker">
                <span className={`interviewTypeBadge ${TYPE_COLORS[interview.interview_type]}`}>
                    {interview.interview_type}
                </span>
            </div>

            <div className="timelineContent">
                <div className="timelineHeader">
                    <div>
                        <h3>{interview.company}</h3>
                        <p className="timelinePosition">{interview.position}</p>
                    </div>
                    <div className="cardActions">
                        <button className="editButton" onClick={() => onEdit(interview)}>Edit</button>
                        <button className="deleteButton" onClick={() => onDelete(interview.id)}>Delete</button>
                    </div>
                </div>

                <p className="timelineDate">{formatDateTime(interview.scheduled_at)}</p>

                {interview.notes && <p className="timelineNotes">{interview.notes}</p>}
            </div>
        </div>
    )
}

export default InterviewsPage
