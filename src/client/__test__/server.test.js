const request = require("supertest");
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.static("dist"));

app.get("/", (req, res) => res.sendFile(path.resolve("dist/index.html")));

const testServer = app.listen(0);

jest.setTimeout(10000);

describe("Server Root Endpoint", () => {
    afterAll(() => testServer.close());

    it("should serve index.html with a 200 status code", async () => {
        const res = await request(testServer).get("/");
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/text\/html; charset=UTF-8/);
    });
});
