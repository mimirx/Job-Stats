const request = require("supertest")
const app = require("../server")
const pool = require("../config/db")

const TEST_EMAIL = `teststats_${Date.now()}@example.com`
const TEST_PASSWORD = "TestPassword123!"
let token

beforeAll(async () => {
    await request(app)
        .post("/auth/register")
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

    const res = await request(app)
        .post("/auth/login")
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

    token = res.body.token
})

afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [TEST_EMAIL])
})

describe("GET /stats", () => {
    it("rejects unauthenticated request with 401", async () => {
        const res = await request(app).get("/stats")
        expect(res.status).toBe(401)
    })

    it("returns a valid stats object for an authenticated user", async () => {
        const res = await request(app)
            .get("/stats")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(typeof res.body.total).toBe("number")
        expect(typeof res.body.responseRate).toBe("number")
        expect(res.body.breakdown).toMatchObject({
            Applied: expect.any(Number),
            Interview: expect.any(Number),
            Offer: expect.any(Number),
            Rejected: expect.any(Number)
        })
        expect(Array.isArray(res.body.weeklyTrend)).toBe(true)
    })

    it("returns zero totals for a brand-new user with no applications", async () => {
        const res = await request(app)
            .get("/stats")
            .set("Authorization", `Bearer ${token}`)

        expect(res.body.total).toBe(0)
        expect(res.body.responseRate).toBe(0)
    })
})
