const request = require("supertest")
const app = require("../server")
const pool = require("../config/db")

const TEST_EMAIL = `testapps_${Date.now()}@example.com`
const TEST_PASSWORD = "TestPassword123!"
let token
let createdId

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

describe("Applications — auth protection", () => {
    it("GET /applications rejects unauthenticated request with 401", async () => {
        const res = await request(app).get("/applications")
        expect(res.status).toBe(401)
    })

    it("POST /applications rejects unauthenticated request with 401", async () => {
        const res = await request(app)
            .post("/applications")
            .send({ company: "Test Co", position: "Developer" })
        expect(res.status).toBe(401)
    })
})

describe("Applications — CRUD", () => {
    it("creates a new application", async () => {
        const res = await request(app)
            .post("/applications")
            .set("Authorization", `Bearer ${token}`)
            .send({ company: "Acme Corp", position: "Software Developer", status: "Applied" })

        expect(res.status).toBe(201)
        expect(res.body.company).toBe("Acme Corp")
        expect(res.body.position).toBe("Software Developer")
        expect(res.body.id).toBeDefined()
        createdId = res.body.id
    })

    it("fetches the applications list", async () => {
        const res = await request(app)
            .get("/applications")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.total).toBeGreaterThanOrEqual(1)
        expect(res.body.totalPages).toBeDefined()
    })

    it("updates an application", async () => {
        const res = await request(app)
            .put(`/applications/${createdId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ company: "Acme Corp", position: "Senior Developer", status: "Interview" })

        expect(res.status).toBe(200)
        expect(res.body.position).toBe("Senior Developer")
        expect(res.body.status).toBe("Interview")
    })

    it("deletes an application", async () => {
        const res = await request(app)
            .delete(`/applications/${createdId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.message).toMatch(/deleted/i)
    })

    it("returns 404 when deleting a non-existent application", async () => {
        const res = await request(app)
            .delete(`/applications/999999`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(404)
    })
})
