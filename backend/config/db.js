const { Pool } = require("pg")

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "jobstats",
    password: "jobstats123",
    database: "jobstats"
})

module.exports = pool