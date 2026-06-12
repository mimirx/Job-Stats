const pool = require("../config/db")

const VALID_TYPES = new Set(["Phone", "Technical", "Onsite", "Final", "Other"])

const getInterviewsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT i.*, a.company, a.position
         FROM interviews i
         JOIN applications a ON i.application_id = a.id
         WHERE i.user_id = $1
         ORDER BY i.scheduled_at ASC`,
        [userId]
    )
    return result.rows
}

const getInterviewsByApplication = async (applicationId, userId) => {
    const result = await pool.query(
        `SELECT * FROM interviews
         WHERE application_id = $1 AND user_id = $2
         ORDER BY scheduled_at ASC`,
        [applicationId, userId]
    )
    return result.rows
}

const createInterview = async (applicationId, userId, interviewType, scheduledAt, notes) => {
    const result = await pool.query(
        `INSERT INTO interviews (application_id, user_id, interview_type, scheduled_at, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [applicationId, userId, interviewType, scheduledAt, notes || null]
    )
    return result.rows[0]
}

const updateInterview = async (id, userId, interviewType, scheduledAt, notes) => {
    const result = await pool.query(
        `UPDATE interviews
         SET interview_type = $1, scheduled_at = $2, notes = $3
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [interviewType, scheduledAt, notes || null, id, userId]
    )
    return result.rows[0]
}

const deleteInterview = async (id, userId) => {
    const result = await pool.query(
        `DELETE FROM interviews WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId]
    )
    return result.rows[0]
}

module.exports = {
    getInterviewsByUser,
    getInterviewsByApplication,
    createInterview,
    updateInterview,
    deleteInterview,
    VALID_TYPES
}
