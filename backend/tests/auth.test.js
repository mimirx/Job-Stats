const request = require("supertest")
const app = require("../server")
const pool = require("../config/db")

const TEST_EMAIL = `testauth_${Date.now()}@example.com`
const TEST_PASSWORD = "TestPassword123!"

afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [TEST_EMAIL])
})

describe("POST /auth/register", () => {
    it("registers a new user and returns id + email", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

        expect(res.status).toBe(201)
        expect(res.body.email).toBe(TEST_EMAIL)
        expect(res.body.id).toBeDefined()
    })

    it("rejects duplicate email with 400", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })

    it("rejects missing password with 400", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "another@example.com" })

        expect(res.status).toBe(400)
    })
})

describe("POST /auth/login", () => {
    it("returns a JWT token with valid credentials", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
        expect(typeof res.body.token).toBe("string")
    })

    it("rejects wrong password with 401", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: TEST_EMAIL, password: "wrongpassword" })

        expect(res.status).toBe(401)
    })

    it("rejects unknown email with 401", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "nobody_xyz@example.com", password: TEST_PASSWORD })

        expect(res.status).toBe(401)
    })
})
