# Career Advisor LLM

> **Status: Archived** - This project has been discontinued. See [Decision](#decision) below.

## What Was This?

A career advisory chatbot for tech workers, powered by AI (Grok API). The app featured personalized career advice based on user profiles, progressive profile enrichment from conversations, conversation history with RAG (Retrieval-Augmented Generation), and curated prompt templates.

### Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, pgvector
- **Frontend**: React/Next.js
- **Infrastructure**: Kubernetes (EKS), Docker, Tilt, Alembic
- **AI**: Grok API, sentence-transformers, SSE streaming

### Architecture
3 microservices (Users, Conversations, Prompts) with shared PostgreSQL, designed for AWS EKS deployment. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full design.

---

## Decision

**This repo is being killed.** Here's why.

### Wrong tools for the job

I'm a **Node.js developer**. I chose FastAPI because it's popular in the AI/ML space, but the learning curve was steep. What should have been straightforward tasks - setting up test fixtures, configuring Pydantic settings, wiring up dependency injection, managing async database drivers - turned into hours of debugging unfamiliar framework conventions. FastAPI is a great framework, but fighting your primary toolchain while also trying to build a product is a losing strategy.

### Over-engineered infrastructure

I chose **Kubernetes** because it's an impressive line on a resume, not because the project needed it. A career advice chatbot does not need:

- 3 separate microservices with independent Alembic migrations
- Kubernetes with Tilt, Colima, Skaffold, and Helm
- Service mesh considerations and HPA auto-scaling
- Nginx API gateway routing to individual pods
- Feign clients for inter-service communication

An API Gateway with a few Lambda functions would have been more than enough. The infrastructure complexity consumed more time than actual feature development.

### Too many new things at once

The real mistake was trying to learn **everything simultaneously**:

- New framework (FastAPI)
- New ORM patterns (SQLAlchemy async)
- New infrastructure (Kubernetes, Tilt, Skaffold)
- New AI patterns (RAG, pgvector, embeddings, SSE streaming)
- New cloud architecture (EKS, Fargate, service mesh)

Each of these is a meaningful learning investment on its own. Stacking all of them on a single side project guaranteed that none would be learned well and the project would never ship.

I'm now working on smaller toy projects to learn just one or two new services/technologies at a time, rather than trying to absorb everything in one go.

---

## Lessons Learned

### 1. Optimize for shipping, not for learning everything at once

There's a difference between a **learning project** and a **shipping project**. If the goal is to ship, use tools you already know and introduce **one** new thing at a time. If the goal is to learn, scope the project small enough that the new tech is the only variable.

### 2. Choose infrastructure that matches the problem, not the ambition

Kubernetes is the right answer for large-scale distributed systems with multiple teams. It's the wrong answer for a solo developer building an MVP. The best infrastructure is the one that disappears - you shouldn't be thinking about it more than your product.

### 3. Résumé-driven development is a trap

Picking technologies because they look good on a resume leads to over-engineering. Senior-to-Staff growth isn't about knowing every tool - it's about knowing **which tool to pick and why**. The ability to say "we don't need Kubernetes for this" is more valuable than knowing how to set it up.

### 4. Complexity is a cost, not a feature

Every layer of abstraction, every additional service, every infrastructure component is a maintenance burden. Microservices have real coordination costs. Multiple databases need multiple migration strategies. Service-to-service communication needs error handling, retries, and circuit breakers. None of this adds user value for an MVP.

### 5. Know when to kill it

Sunk cost fallacy is real. The time spent setting up infrastructure, debugging test configurations, and wrestling with unfamiliar frameworks was a signal, not a challenge to push through. Recognizing when the approach is wrong and starting fresh with the right tools is a better use of time than forcing a broken setup to work.

---

## What I Should Have Done

**Ship something on day one, then iterate.**

The biggest mistake wasn't the tech stack - it was spending weeks on architecture before a single user could interact with the product. The goal should have been:

1. **Day 1**: A single Lambda behind API Gateway that takes a message and returns AI career advice. No database, no auth, no RAG. Just input → LLM → output. Deploy it. Share it with a few friends.
2. **Week 1**: Add Cognito auth and a simple user profile. Store conversations in DynamoDB or PostgreSQL. Still one or two Lambdas. Get early feedback from people you trust.
3. **Week 2**: Add RAG with pgvector. Now conversations have context. Iterate based on what you're hearing.
4. **Week 3+**: Reassess. Maybe the product needs progressive profile enrichment. Maybe the feedback points you in a completely different direction. The point is you have a working product and real signals to guide what to build next - not a backlog of assumptions.

Infrastructure scales with the product, not ahead of it. Ideas evolve too - you don't just iterate the code, you iterate the vision. A working prototype in front of real people teaches you more in a week than a month of architecture documents. Lambda functions are simple enough to start with and scale far enough that you shouldn't be thinking about infrastructure at all in the early days.

**The right stack from the start:**

- **Runtime**: Node.js / TypeScript (what I know)
- **Auth**: AWS Cognito
- **AI**: LangChain.js
- **Deployment**: API Gateway + Lambda
- **Database**: TBD - I'll let the data model guide this decision, not pick one upfront

Same product idea. Right tools. Ship first, optimize later.
