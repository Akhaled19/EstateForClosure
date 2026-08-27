from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.postgres import engine, Base
from app.routers import items
from app.routers import item_interest_router
from app.routers import FamilyFriendUsers_router
from app.routers import ebay_router

import app.models 

app = FastAPI(title="Estate App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(items.router)
app.include_router(item_interest_router.router)
app.include_router(FamilyFriendUsers_router.router)
app.include_router(ebay_router.router)

@app.on_event("startup")
async def ensure_indexes():
    from app.db.mongo import db 
    await db["item_scan_drafts"].create_index("item_id", unique=True)

@app.get("/health")
async def health():
    return {"status": "ok"}