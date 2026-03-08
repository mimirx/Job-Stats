const pool = require("../config/db")

const getAllApplications = async (userId) => {
    const result = await pool.query(
        `
        SELECT *
        FROM applications
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    )
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

const deleteApplicationById = async (id, userId) => {
    const result = await pool.query(
        `
        DELETE FROM applications
        WHERE id = $1 AND user_id = $2
        RETURNING *
        `,
        [id, userId]
    )

    return result.rows[0]
}

const updateApplicationById = async (id, company, position, location, salary, status, dateApplied, notes, userId) => {
    const result = await pool.query(
        `
        UPDATE applications
        SET
            company = $1,
            position = $2,
            location = $3,
            salary = $4,
            status = $5,
            date_applied = $6,
            notes = $7
        WHERE id = $8 AND user_id = $9
        RETURNING *
        `,
        [company, position, location, salary, status, dateApplied, notes, id, userId]
    )

    return result.rows[0]
}

module.exports = {
    getAllApplications,
    createApplication,
    deleteApplicationById,
    updateApplicationById
}