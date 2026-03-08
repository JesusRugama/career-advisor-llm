import sys
import os
import importlib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

base_dir = os.path.dirname(__file__)
sys.path.insert(0, os.path.join(base_dir, "shared"))

from database import close_engine

# Module names that conflict between services
CONFLICTING_MODULES = {
    "router", "schemas", "models", "repository", "service",
    "dependencies", "repositories", "routers",
}


def load_service_module(service_name: str, module_name: str):
    """
    Load a module from a service directory, cleaning up conflicting
    module names between services so each import is isolated.
    """
    service_path = os.path.join(base_dir, f"services/{service_name}/src")

    # Remove any previously cached conflicting modules
    for mod_name in list(sys.modules.keys()):
        if mod_name.split(".")[0] in CONFLICTING_MODULES:
            del sys.modules[mod_name]

    # Add service path to front of sys.path
    sys.path.insert(0, service_path)

    # Import the module
    module = importlib.import_module(module_name)

    # Remove service path
    sys.path.remove(service_path)

    return module


# Load routers from each service (order matters - cleanup happens between each)
users_mod = load_service_module("users-service", "router")
users_router = users_mod.router

convos_mod = load_service_module("conversations-service", "routers")
conversations_router = convos_mod.conversations_router
messages_router = convos_mod.messages_router

prompts_mod = load_service_module("prompts-service", "router")
prompts_router = prompts_mod.router


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
        },
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mode": "local-development",
        "services": ["users", "conversations", "messages", "prompts"],
    }
