import { useState } from "react"
import { motion } from "framer-motion"

const COLUMNS = ["Applied", "Interview", "Offer", "Rejected"]

const COLUMN_LABELS = {
    Applied: "Applied",
    Interview: "Interview",
    Offer: "Offer",
    Rejected: "Rejected"
}

function KanbanView({ applications, onStatusChange, onEdit, onDelete }) {
    const [dragOverColumn, setDragOverColumn] = useState(null)
    const [draggingId, setDraggingId] = useState(null)

    const byStatus = COLUMNS.reduce((acc, col) => {
        acc[col] = applications.filter(a => a.status === col)
        return acc
    }, {})

    const handleDragStart = (e, app) => {
        e.dataTransfer.setData("appId", app.id)
        e.dataTransfer.setData("fromStatus", app.status)
        e.dataTransfer.effectAllowed = "move"
        setDraggingId(app.id)
    }

    const handleDragEnd = () => {
        setDraggingId(null)
        setDragOverColumn(null)
    }

    const handleDragOver = (e, column) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        setDragOverColumn(column)
    }

    const handleDragLeave = () => {
        setDragOverColumn(null)
    }

    const handleDrop = (e, toStatus) => {
        e.preventDefault()
        const appId = Number(e.dataTransfer.getData("appId"))
        const fromStatus = e.dataTransfer.getData("fromStatus")
        setDragOverColumn(null)
        setDraggingId(null)
        if (fromStatus !== toStatus) {
            onStatusChange(appId, toStatus)
        }
    }

    return (
        <div className="kanbanBoard">
            {COLUMNS.map(col => (
                <div
                    key={col}
                    className={`kanbanColumn ${dragOverColumn === col ? "kanbanColumnOver" : ""}`}
                    onDragOver={e => handleDragOver(e, col)}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, col)}
                >
                    <div className="kanbanColumnHeader">
                        <span className={`statusBadge status${col}`}>{COLUMN_LABELS[col]}</span>
                        <span className="kanbanCount">{byStatus[col].length}</span>
                    </div>

                    <div className="kanbanCards">
                        {byStatus[col].length === 0 && (
                            <div className="kanbanEmpty">Drop here</div>
                        )}
                        {byStatus[col].map(app => (
                            <motion.div
                                key={app.id}
                                className={`kanbanCard ${draggingId === app.id ? "kanbanCardDragging" : ""}`}
                                draggable
                                onDragStart={e => handleDragStart(e, app)}
                                onDragEnd={handleDragEnd}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: draggingId === app.id ? 0.4 : 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="kanbanCardHeader">
                                    <h4>{app.company}</h4>
                                    <div className="cardActions">
                                        <button className="editButton" onClick={() => onEdit(app)}>Edit</button>
                                        <button className="deleteButton" onClick={() => onDelete(app.id)}>Delete</button>
                                    </div>
                                </div>
                                <p className="kanbanPosition">{app.position}</p>
                                {app.location && <p className="kanbanMeta">{app.location}</p>}
                                {app.salary && <p className="kanbanMeta">${Number(app.salary).toLocaleString()}</p>}
                                {app.date_applied && (
                                    <p className="kanbanDate">{app.date_applied.slice(0, 10)}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default KanbanView
