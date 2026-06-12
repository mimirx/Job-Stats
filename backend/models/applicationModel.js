const pool = require("../config/db")

const VALID_SORT_FIELDS = new Set(["date_applied", "created_at", "company", "position", "salary"])
const VALID_STATUSES = new Set(["Applied", "Interview", "Offer", "Rejected"])

const getAllApplications = async (userId, { status, search, sortBy, sortOrder, page, limit }) => {
    const offset = (page - 1) * limit
    const safeSortBy = VALID_SORT_FIELDS.has(sortBy) ? sortBy : "created_at"
    const safeSortOrder = sortOrder === "asc" ? "ASC" : "DESC"

    const conditions = ["user_id = $1"]
    const params = [userId]
    let i = 2

    if (status && VALID_STATUSES.has(status)) {
        conditions.push(`status = $${i++}`)
        params.push(status)
    }

    if (search) {
        conditions.push(`(company ILIKE $${i} OR position ILIKE $${i})`)
        params.push(`%${search}%`)
        i++
    }

    const where = conditions.join(" AND ")

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM applications WHERE ${where}`,
        params
    )
    const total = parseInt(countResult.rows[0].count, 10)

    const dataResult = await pool.query(
        `SELECT * FROM applications
         WHERE ${where}
         ORDER BY ${safeSortBy} ${safeSortOrder} NULLS LAST
         LIMIT $${i} OFFSET $${i + 1}`,
        [...params, limit, offset]
    )

    return { data: dataResult.rows, total }
}

const createApplication = async (company, position, location, salary, status, dateApplied, notes, userId) => {
    const result = await pool.query(
        `INSERT INTO applications (company, position, location, salary, status, date_applied, notes, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [company, position, location, salary, status, dateApplied, notes, userId]
    )
    return result.rows[0]
}

const deleteApplicationById = async (id, userId) => {
    const result = await pool.query(
        `DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId]
    )
    return result.rows[0]
}

const updateApplicationById = async (id, company, position, location, salary, status, dateApplied, notes, userId) => {
    const result = await pool.query(
        `UPDATE applications
         SET company = $1, position = $2, location = $3, salary = $4,
             status = $5, date_applied = $6, notes = $7
         WHERE id = $8 AND user_id = $9
         RETURNING *`,
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
