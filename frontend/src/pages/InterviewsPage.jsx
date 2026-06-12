import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/api"
import { TimelineCardSkeleton } from "../components/Skeleton"

const INTERVIEW_TYPES = ["Phone", "Technical", "Onsite", "Final", "Other"]

const TYPE_COLORS = {
    Phone: "typePhone",
    Technical: "typeTechnical",
    Onsite: "typeOnsite",
    Final: "typeFinal",
    Other: "typeOther"
}

const pageVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
}

const listVariants = {
    animate: { transition: { staggerChildren: 0.07 } }
}

const cardVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
}

function formatDateTime(iso) {
    const d = new Date(iso)
    return d.toLocaleString("default", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
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
    const [scheduledDate, setScheduledDate] = useState("")
    const [scheduledTime, setScheduledTime] = useState("")
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

    useEffect(() => { fetchData() }, [fetchData])

    const resetForm = () => {
        setApplicationId(""); setInterviewType("Phone")
        setScheduledDate(""); setScheduledTime(""); setNotes(""); setEditingId(null)
    }

    const handleOpenCreate = () => { resetForm(); setShowForm(true); setError("") }

    const handleOpenEdit = interview => {
        setEditingId(interview.id)
        setApplicationId(interview.application_id)
        setInterviewType(interview.interview_type)
        const dt = new Date(interview.scheduled_at)
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        const iso = local.toISOString()
        setScheduledDate(iso.slice(0, 10))
        setScheduledTime(iso.slice(11, 16))
        setNotes(interview.notes || "")
        setShowForm(true); setError("")
    }

    const handleCloseForm = () => { setShowForm(false); resetForm(); setError("") }

    const handleSubmit = async e => {
        e.preventDefault(); setError("")
        const scheduledAt = scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : ""
        const payload = { applicationId: Number(applicationId), interviewType, scheduledAt, notes }
        try {
            if (editingId) {
                await api.put(`/interviews/${editingId}`, payload)
            } else {
                await api.post("/interviews", payload)
            }
            resetForm(); setShowForm(false); fetchData()
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
        <motion.div className="pageContainer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
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

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="formCard"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                    >
                        <h2>{editingId ? "Edit Interview" : "Schedule Interview"}</h2>
                        <form onSubmit={handleSubmit} className="applicationForm">
                            <div className="formField">
                                <label className="formLabel">Application</label>
                                <select value={applicationId} onChange={e => setApplicationId(e.target.value)} required>
                                    <option value="">Select Application</option>
                                    {applications.map(app => (
                                        <option key={app.id} value={app.id}>{app.company} — {app.position}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="formField">
                                <label className="formLabel">Interview Type</label>
                                <select value={interviewType} onChange={e => setInterviewType(e.target.value)}>
                                    {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="formFieldRow">
                                <div className="formField">
                                    <label className="formLabel">Date</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={e => setScheduledDate(e.target.value)}
                                        min="2020-01-01"
                                        max="2035-12-31"
                                        required
                                    />
                                </div>
                                <div className="formField">
                                    <label className="formLabel">Time</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={e => setScheduledTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="formField">
                                <label className="formLabel">Notes (optional)</label>
                                <textarea placeholder="Prep notes, location, contact info..." value={notes} onChange={e => setNotes(e.target.value)} rows="3" />
                            </div>
                            <div className="formActions">
                                <button type="submit" className="submitButton">{editingId ? "Update Interview" : "Save Interview"}</button>
                                <button type="button" className="cancelButton" onClick={handleCloseForm}>Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="timeline">
                    {[...Array(3)].map((_, i) => <TimelineCardSkeleton key={i} />)}
                </div>
            ) : interviews.length === 0 ? (
                <motion.div className="emptyAnalyticsCard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2>No interviews scheduled</h2>
                    <p>Schedule your first interview to start tracking your pipeline.</p>
                </motion.div>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <div className="dashboardSection">
                            <h2>Upcoming ({upcoming.length})</h2>
                            <motion.div className="timeline" variants={listVariants} initial="initial" animate="animate">
                                {upcoming.map(interview => (
                                    <motion.div key={interview.id} variants={cardVariants}>
                                        <TimelineCard interview={interview} onEdit={handleOpenEdit} onDelete={handleDelete} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {past.length > 0 && (
                        <div className="dashboardSection">
                            <h2>Past ({past.length})</h2>
                            <motion.div className="timeline timelinePast" variants={listVariants} initial="initial" animate="animate">
                                {[...past].reverse().map(interview => (
                                    <motion.div key={interview.id} variants={cardVariants}>
                                        <TimelineCard interview={interview} onEdit={handleOpenEdit} onDelete={handleDelete} isPast />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </motion.div>
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
