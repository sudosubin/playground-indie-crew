import { describe, it, expect } from "vitest";

// Simple test to verify the testing setup works
describe("hello-world-api", () => {
  it("should pass a basic test", () => {
    expect(true).toBe(true);
  });

  it("should return correct JSON structure", () => {
    const response = {
      message: "Hello World from Hono on Cloudflare Workers!",
      timestamp: new Date().toISOString(),
    };

    expect(response).toHaveProperty("message");
    expect(response).toHaveProperty("timestamp");
    expect(typeof response.message).toBe("string");
    expect(typeof response.timestamp).toBe("string");
  });

  describe("health endpoint", () => {
    it("should return ok status", () => {
      const health = {
        status: "ok",
        uptime: "running",
      };

      expect(health.status).toBe("ok");
      expect(health.uptime).toBe("running");
    });
  });
});
