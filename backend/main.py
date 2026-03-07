import sys
import os

# Add shared directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), "shared"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import close_engine

# Import users service router
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "services/users-service/src"))
from router import router as users_router
sys.path.pop(0)

# Import conversations service routers
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "services/conversations-service/src"))
from routers import conversations_router, messages_router
sys.path.pop(0)

# Import prompts service router
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "services/prompts-service/src"))
from router import router as prompts_router
sys.path.pop(0)

# Import llm service router
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "services/llm-service/src"))
from router import router as llm_router
sys.path.pop(0)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    yield
    await close_engine()


app = FastAPI(
    title="Career Advisor API - Local Development",
    version="1.0.0",
    description="Unified API for local development. Deploys as separate Lambdas in production.",
    lifespan=lifespan,
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(conversations_router, prefix="/api", tags=["conversations"])
app.include_router(messages_router, prefix="/api", tags=["messages"])
app.include_router(prompts_router, prefix="/api", tags=["prompts"])
app.include_router(llm_router, prefix="/api", tags=["llm"])


@app.get("/")
async def root():
    return {
        "message": "Career Advisor API - Local Development Mode",
        "version": "1.0.0",
        "services": {
            "users": "/api/users",
            "conversations": "/api/users/{user_id}/conversations",
            "messages": "/api/messages",
            "prompts": "/api/prompts",
            "llm": "/api/ai",
        },
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mode": "local-development",
        "services": ["users", "conversations", "messages", "prompts", "llm"],
    }
