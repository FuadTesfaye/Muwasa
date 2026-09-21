import uuid
import json
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from src.db.postgres import db_pool
from src.db.redis import redis_client
from src.pipeline.orchestrator import process_message

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await db_pool.connect()
    except Exception as e:
        print(f"⚠️ [Muwāsā] PostgreSQL connection notice: {e}. Connect when database is ready.")

    try:
        await redis_client.connect()
    except Exception as e:
        print(f"⚠️ [Muwāsā] Redis connection notice: {e}. Redis sessions will be unavailable until started.")
        
    yield
    
    # Shutdown
    try:
        await db_pool.close()
    except Exception:
        pass
    try:
        await redis_client.close()
    except Exception:
        pass

app = FastAPI(title="Muwasa AI Orchestrator", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/v1/sessions")
async def create_session():
    session_id = str(uuid.uuid4())
    r = redis_client.get_client()
    await r.set(f"session:{session_id}:history", "[]", ex=86400)
    return {"session_id": session_id}

@app.get("/api/v1/sessions/{session_id}")
async def get_session(session_id: str):
    r = redis_client.get_client()
    exists = await r.exists(f"session:{session_id}:history")
    if not exists:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "active": True}

@app.delete("/api/v1/sessions/{session_id}")
async def delete_session(session_id: str):
    r = redis_client.get_client()
    await r.delete(f"session:{session_id}:history")
    await r.delete(f"session:{session_id}:profile")
    return {"status": "deleted"}

@app.websocket("/api/v1/chat/{session_id}/ws")
async def chat_websocket(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    r = redis_client.get_client()
    if not await r.exists(f"session:{session_id}:history"):
        await websocket.close(code=1008, reason="Session not found")
        return
        
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            user_message = payload.get("message", "")
            
            if not user_message:
                continue
                
            async for chunk in process_message(session_id, user_message):
                await websocket.send_text(chunk.model_dump_json())
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_text(json.dumps({"type": "error", "content": str(e)}))

@app.post("/api/v1/chat/{session_id}/message")
async def chat_message(session_id: str, request: ChatRequest):
    # Non-streaming fallback
    r = redis_client.get_client()
    if not await r.exists(f"session:{session_id}:history"):
        raise HTTPException(status_code=404, detail="Session not found")
        
    chunks = []
    async for chunk in process_message(session_id, request.message):
        chunks.append(chunk)
        
    return {"chunks": [c.model_dump() for c in chunks]}

@app.get("/api/v1/sources/quran/{verse_key}")
async def get_quran_source(verse_key: str):
    return {"source": "Quran", "verse_key": verse_key, "status": "Mocked for now"}

@app.get("/api/v1/sources/hadith/{id}")
async def get_hadith_source(id: str):
    return {"source": "Hadith", "id": id, "status": "Mocked for now"}

@app.post("/api/v1/feedback")
async def submit_feedback():
    return {"status": "Feedback received"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
