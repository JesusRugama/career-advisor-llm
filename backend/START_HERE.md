# Career Advisor Backend - Quick Start Guide

## 🚀 Local Development with FastAPI CLI

### Prerequisites
1. **Python 3.11+** (required - uses modern type hints)
2. PostgreSQL with pgvector extension
3. OpenAI API key

> **Note**: Python 3.11+ is required. The code uses modern type hints that aren't compatible with Python 3.9.

### Setup Steps

1. **Install PostgreSQL with pgvector**
   ```bash
   # macOS
   brew install postgresql@15
   brew install pgvector
   
   # Start PostgreSQL
   brew services start postgresql@15
   
   # Create database
   createdb career_advisor
   psql career_advisor -c "CREATE EXTENSION vector;"
   ```

2. **Set up Python environment**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   # Run the install script (installs all service dependencies)
   ./install-deps.sh
   ```

4. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

5. **Run database migrations**
   ```bash
   # Users service
   cd services/users-service
   alembic upgrade head
   cd ../..
   
   # Conversations service
   cd services/conversations-service
   alembic upgrade head
   cd ../..
   
   # Prompts service
   cd services/prompts-service
   alembic upgrade head
   cd ../..
   
   # LLM service
   cd services/llm-service
   alembic upgrade head
   cd ../..
   ```

6. **Start the unified API**
   ```bash
   # From the backend directory
   fastapi dev main.py
   ```

   The API will be available at:
   - **API**: http://localhost:8000
   - **Docs**: http://localhost:8000/docs
   - **Health**: http://localhost:8000/health

### Available Endpoints

All services are mounted under `/api`:

- **Users**: `GET /api/users/{user_id}/profile`
- **Conversations**: 
  - `GET /api/users/{user_id}/conversations`
  - `POST /api/users/{user_id}/conversations`
- **Messages**: 
  - `GET /api/users/{user_id}/conversations/{conversation_id}/messages`
  - `POST /api/users/{user_id}/conversations/{conversation_id}/message`
  - `POST /api/users/{user_id}/messages` (creates conversation + message)
- **Prompts**: `GET /api/prompts`
- **LLM**: `POST /api/ai/career-advice`

### How It Works

**Local Development:**
- Single FastAPI process runs all services
- All routers mounted in `main.py`
- Feign clients make HTTP calls to `localhost:8000` (same process)
- Easy debugging, single port, fast iteration

**Lambda Deployment:**
- Each service gets its own Lambda handler in `lambda_handlers/`
- Completely independent deployments
- Feign clients call different API Gateway URLs
- Same code, different entry points

### Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prompts service
curl http://localhost:8000/api/prompts

# Test with user ID (replace with actual UUID)
curl http://localhost:8000/api/users/123e4567-e89b-12d3-a456-426614174000/profile
```

### Troubleshooting

**Database connection issues:**
- Ensure PostgreSQL is running: `brew services list`
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -l`

**Import errors:**
- Make sure you're in the backend directory
- Activate virtual environment: `source .venv/bin/activate`
- Check all dependencies are installed

**Port already in use:**
- FastAPI dev uses port 8000 by default
- Change with: `fastapi dev main.py --port 8001`

## 📦 Lambda Deployment

Each service has a dedicated handler in `lambda_handlers/`:
- `users_handler.py` - Users service
- `conversations_handler.py` - Conversations + Messages service
- `prompts_handler.py` - Prompts service
- `llm_handler.py` - LLM service

These handlers use [Mangum](https://mangum.io/) to wrap the FastAPI apps for AWS Lambda.

### Deployment Configuration

You'll need to:
1. Package each service with its dependencies
2. Set environment variables per Lambda (DATABASE_URL, service URLs, etc.)
3. Configure API Gateway to route to appropriate Lambdas
4. Set up VPC for database access

(Terraform/SAM configuration coming soon)
