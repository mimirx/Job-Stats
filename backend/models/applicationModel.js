const pool = require("../config/db")

const getAllApplications = async () => {
    const result = await pool.query(`
        SELECT *
        FROM applications
        ORDER BY created_at DESC
    `)
    return result.rows
}

const createApplication = async (company, position, location, salary, status, dateApplied, notes, userId) => {
    const result = await pool.query(
        `
        INSERT INTO applications (company, position, location, salary, status, date_applied, notes, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [company, position, location, salary, status, dateApplied, notes, userId]
    )

    return result.rows[0]
}

module.exports = {
    getAllApplications,
    createApplication
}