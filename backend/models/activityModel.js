const pool = require("../config/db")

const log = async (applicationId, userId, action, metadata = null) => {
    await pool.query(
        `INSERT INTO activity_log (application_id, user_id, action, metadata)
         VALUES ($1, $2, $3, $4)`,
        [applicationId, userId, action, metadata ? JSON.stringify(metadata) : null]
    )
}

const getByApplication = async (applicationId, userId) => {
    const result = await pool.query(
        `SELECT * FROM activity_log
         WHERE application_id = $1 AND user_id = $2
         ORDER BY created_at ASC`,
        [applicationId, userId]
    )
    return result.rows
}

module.exports = { log, getByApplication }
