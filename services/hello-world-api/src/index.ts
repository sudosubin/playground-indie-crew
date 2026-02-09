import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Hello World from Hono on Cloudflare Workers!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: "running",
  });
});

export default app;
