from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.postgres import engine, Base

app = FastAPI(title="Estate App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def ensure_indexes():
    from app.db.mongo import db 
    await db["item_scan_drafts"].create_index("item_id", unique=True)

@app.get("/health")
async def health():
    return {"status": "ok"}