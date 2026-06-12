import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/api"

function formatDate(iso) {
    return new Date(iso).toLocaleString("default", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit"
    })
}

function ActivityLog({ applicationId }) {
    const [open, setOpen] = useState(false)
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const handleToggle = async () => {
        if (!open && !loaded) {
            setLoading(true)
            try {
                const res = await api.get(`/applications/${applicationId}/activity`)
                setEntries(res.data)
                setLoaded(true)
            } finally {
                setLoading(false)
            }
        }
        setOpen(o => !o)
    }

    return (
        <div className="activityLog">
            <button className="activityToggle" onClick={handleToggle}>
                {open ? "▲ Hide activity" : "▼ Show activity"}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="activityEntries"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", transition: { duration: 0.22 } }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
                    >
                        {loading ? (
                            <p className="activityLoading">Loading...</p>
                        ) : entries.length === 0 ? (
                            <p className="activityEmpty">No activity recorded yet.</p>
                        ) : (
                            entries.map(entry => (
                                <div key={entry.id} className="activityEntry">
                                    <div className="activityDot" />
                                    <div className="activityContent">
                                        <span className="activityAction">
                                            {entry.action}
                                            {entry.metadata?.from && (
                                                <span className="activityMeta">
                                                    {" "}· {entry.metadata.from} → {entry.metadata.to}
                                                </span>
                                            )}
                                        </span>
                                        <span className="activityDate">{formatDate(entry.created_at)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ActivityLog
