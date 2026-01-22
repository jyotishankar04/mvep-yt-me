import { beforeAll, describe, expect, it } from "vitest";
import { api } from "../../../helpers/testapp";
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.DATABASE_URL!;
describe("Register", async () => {
  describe("Happy Path", () => {
    it("should register a new user", async () => {
      const response = await api.post("/api/auth/register").send({
        email: "test@example.com",
        password: "password",
        name: "Test User",
      });

      expect(response.status).toBe(201);
      console.log(response.body);
      expect(response.body.success).toBe(true);
    });
    it("should register a new user with a valid email and name and password", async () => {
      const response = await api.post("/api/auth/register").send({
        email: "test@example.com",
        password: "password",
        name: "Test User",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
    it("it should return a otp token", async () => {
      const response = await api.post("/api/auth/register").send({
        email: "test@example.com",
        password: "password",
        name: "Test User",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      // Verify that is is a jsonwebtoken
      expect(response.body.data.token.split(".").length).toBe(3);
    });
  });
});
