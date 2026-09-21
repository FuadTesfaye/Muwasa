import { Hono } from "hono";
import { cors } from "hono/cors";
import { serverConfig } from "./config";
import { processMessage, getOrCreateSession, deleteSession } from "./pipeline/orchestrator";
import { checkDbConnection } from "./db";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/health", async (c) => {
  const dbConnected = await checkDbConnection();
  return c.json({
    status: "ok",
    runtime: "Bun (TypeScript)",
    database: dbConnected ? "connected" : "offline_fallback",
    version: serverConfig.kbVersion,
  });
});

// Create anonymous session
app.post("/api/v1/sessions", (c) => {
  const sessionId = crypto.randomUUID();
  getOrCreateSession(sessionId);
  return c.json({ sessionId });
});

// Get session status
app.get("/api/v1/sessions/:id", (c) => {
  const sessionId = c.req.param("id");
  const session = getOrCreateSession(sessionId);
  return c.json({
    sessionId,
    messageCount: session.history.length,
    active: true,
  });
});

// Delete session (Privacy-first deletion)
app.delete("/api/v1/sessions/:id", (c) => {
  const sessionId = c.req.param("id");
  deleteSession(sessionId);
  return c.json({ status: "deleted" });
});

// Non-streaming fallback endpoint
app.post("/api/v1/chat/:id/message", async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req.json();
  const message = body.message || "";

  const chunks: any[] = [];
  for await (const chunk of processMessage(sessionId, message)) {
    chunks.push(chunk);
  }

  return c.json({ chunks });
});

// User feedback endpoint
app.post("/api/v1/feedback", async (c) => {
  const body = await c.req.json();
  console.log("Feedback received:", body);
  return c.json({ status: "received" });
});

// Native Bun server with HTTP and WebSocket streaming
const server = Bun.serve({
  port: serverConfig.port,
  hostname: serverConfig.host,
  fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket upgrade for streaming chat: /api/v1/chat/:sessionId/ws
    const wsMatch = url.pathname.match(/^\/api\/v1\/chat\/([a-zA-Z0-9_-]+)\/ws$/);
    if (wsMatch) {
      const sessionId = wsMatch[1];
      const upgraded = server.upgrade(req, {
        data: { sessionId },
      });
      if (upgraded) return undefined;
    }

    // Default to Hono HTTP routing
    return app.fetch(req);
  },
  websocket: {
    open(ws) {
      console.log(`💬 WebSocket connection opened for session: ${(ws.data as any)?.sessionId}`);
    },
    async message(ws, message) {
      try {
        const { sessionId } = ws.data as { sessionId: string };
        const parsed = JSON.parse(message.toString());
        const userMessage = parsed.message || "";

        if (!userMessage) return;

        // Process message through full pipeline and stream chunks
        for await (const chunk of processMessage(sessionId, userMessage)) {
          ws.send(JSON.stringify(chunk));
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", content: String(err) }));
      }
    },
    close(ws) {
      console.log(`🔌 WebSocket connection closed for session: ${(ws.data as any)?.sessionId}`);
    },
  },
});

console.log(`🕌 Muwāsā TypeScript Server running on http://${server.hostname}:${server.port}`);
console.log(`⚡ Powered by Bun & Hono`);
