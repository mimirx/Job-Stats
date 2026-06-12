const pool = require("../config/db")

const getStats = async (userId) => {
    const [breakdownResult, weeklyResult, salaryResult] = await Promise.all([
        pool.query(
            `SELECT status, COUNT(*)::int AS count
             FROM applications
             WHERE user_id = $1
             GROUP BY status`,
            [userId]
        ),
        pool.query(
            `SELECT DATE_TRUNC('week', COALESCE(date_applied, created_at))::date AS week,
                    COUNT(*)::int AS count
             FROM applications
             WHERE user_id = $1
               AND COALESCE(date_applied, created_at) >= NOW() - INTERVAL '10 weeks'
             GROUP BY week
             ORDER BY week ASC`,
            [userId]
        ),
        pool.query(
            `SELECT ROUND(AVG(salary))::int AS avg_salary
             FROM applications
             WHERE user_id = $1 AND salary IS NOT NULL`,
            [userId]
        )
    ])

    const breakdown = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
    for (const row of breakdownResult.rows) {
        breakdown[row.status] = row.count
    }

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0)
    const responseRate = total > 0
        ? Math.round(((breakdown.Interview + breakdown.Offer) / total) * 100)
        : 0

    return {
        total,
        breakdown,
        responseRate,
        weeklyTrend: weeklyResult.rows,
        avgSalary: salaryResult.rows[0].avg_salary
    }
}

module.exports = { getStats }
