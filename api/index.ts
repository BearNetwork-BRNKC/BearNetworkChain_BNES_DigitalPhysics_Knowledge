import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

// API routes
app.get("/api/status", (_req, res) => {
  res.json({
    status: "online",
    engine: "BNES ? Physics Engine",
    version: "1.3.0",
    invariant: "?",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (_req, res) => {
  res.send("OK");
});

// For Vercel, we export the app
export default app;