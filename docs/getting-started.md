# Getting Started with SambungChat

**Version:** 0.1.0
**Last Updated:** January 11, 2026

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Next Steps](#next-steps)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software       | Minimum Version | Recommended | Installation                                           |
| -------------- | --------------- | ----------- | ------------------------------------------------------ |
| **Bun**        | 1.2.23          | Latest      | [bun.sh](https://bun.sh/)                              |
| **PostgreSQL** | 15              | 16+         | [postgresql.org](https://www.postgresql.org/download/) |
| **Docker**     | 24.0            | Latest      | [docker.com](https://www.docker.com/get-started)       |
| **Git**        | 2.30            | Latest      | [git-scm.com](https://git-scm.com/downloads)           |

### Verify Installation

```bash
bun --version    # Should be >= 1.2.23
psql --version   # Should be >= 15
docker --version # Should be >= 24.0
git --version    # Should be >= 2.30
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sambunghub/sambung-chat.git
cd sambung-chat
```

### 2. Install Dependencies

```bash
bun install
```

This will install all dependencies for the monorepo, including:

- Frontend (SvelteKit)
- Backend (Hono)
- Shared packages (API, Auth, DB, UI)

### 3. Setup Environment Variables

Create environment files for each application:

```bash
# Copy example environment files
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp packages/db/.env.example packages/db/.env
```

#### Environment Variables Reference

**apps/server/.env:**

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/sambung-chat

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:5173

# CORS
CORS_ORIGIN=http://localhost:5173

# AI Providers - Optional (can also be set via UI Settings)
# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# Anthropic/Claude
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_VERSION=2023-06-01

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key-here

# Groq
GROQ_API_KEY=gsk_your-groq-key-here

# Ollama (for local models)
OLLAMA_BASE_URL=http://localhost:11434
```

**apps/web/.env:**

```bash
# Public Variables
PUBLIC_SERVER_URL=http://localhost:3000
```

**packages/db/.env:**

```bash
# Database Configuration
POSTGRES_DB=sambung-chat
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
```

### 4. Generate Better Auth Secret

```bash
# Generate a secure secret
openssl rand -base64 32
```

Copy the output and set it as `BETTER_AUTH_SECRET` in `apps/server/.env`.

---

## Configuration

### Database Setup

#### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL container
bun run db:start

# Verify database is running
bun run db:studio
```

#### Option 2: Using Native PostgreSQL

```bash
# Create database
createdb sambung-chat

# Update DATABASE_URL in apps/server/.env
# DATABASE_URL=postgresql://user:password@localhost:5432/sambung-chat
```

### Push Database Schema

```bash
bun run db:push
```

This will create all required tables including:

- User tables (via Better Auth)
- Session tables
- Any application-specific tables

---

## Running the Application

### Development Mode

#### Start All Services

```bash
bun run dev
```

This starts:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Database**: localhost:5432

#### Start Individual Services

```bash
# Frontend only
bun run dev:web

# Backend only
bun run dev:server
```

### Access the Application

1. Open your browser
2. Go to http://localhost:5173
3. You should see the SambungChat interface
4. Sign up for a new account

---

## Next Steps

### 1. Configure AI Provider

After signing up, you'll need to add your AI provider credentials. You can either set them via environment variables or through the UI Settings.

#### Option A: Via Environment Variables (Recommended for Self-Hosting)

Add your API keys to `apps/server/.env`:

```bash
# OpenAI (GPT-4, GPT-3.5)
OPENAI_API_KEY=sk-your-openai-key-here

# Anthropic (Claude 3.5 Sonnet, Claude 3 Opus, etc.)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022  # Optional: default model
```

#### Option B: Via UI Settings

1. Go to **Settings** → **API Keys**
2. Click **Add Key**
3. Select your provider (OpenAI, Anthropic, Google, Groq, Ollama)
4. Enter your API key
5. Click **Save**

#### Supported AI Providers

| Provider      | Models                                                                              | Best For                           |
| ------------- | ----------------------------------------------------------------------------------- | ---------------------------------- |
| **OpenAI**    | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo                                                  | General purpose, coding            |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku | Complex reasoning, coding, writing |
| **Google**    | Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro, Gemini Flash                          | Multimodal tasks, long context     |
| **Groq**      | Llama 3 70B, Llama 3 8B, Mixtral 8x7B, Gemma 7B                                     | Fast inference, local deployment   |
| **Ollama**    | Llama 3, Mistral, Gemma, and other open-source models                               | Privacy, local execution           |

#### Available Claude Models

- **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`) - Most balanced model, excellent for coding and general tasks
- **Claude 3.5 Haiku** (`claude-3-5-haiku-20241022`) - Fastest model, great for simple tasks and quick responses
- **Claude 3 Opus** (`claude-3-opus-20240229`) - Most capable, best for complex reasoning and analysis
- **Claude 3 Sonnet** (`claude-3-sonnet-20240229`) - Balanced performance and speed
- **Claude 3 Haiku** (`claude-3-haiku-20240307`) - Fastest and most cost-effective

### 2. Create Your First Chat

1. Click **New Chat**
2. Select a model from the dropdown
3. Type your message
4. Press Enter or click Send

### 3. Explore Features

- **Chat History**: Access all your previous conversations
- **Prompt Templates**: Save and reuse prompts
- **Settings**: Customize your experience

---

## Troubleshooting

### Database Connection Failed

**Problem:** `connection refused` or `database does not exist`

**Solution:**

```bash
# Check if database is running
bun run db:start

# Verify connection string
cat apps/server/.env | grep DATABASE_URL

# Test connection
bun run db:studio
```

### Port Already in Use

**Problem:** `Port 3000 is already in use`

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change PORT in apps/server/.env
```

### TypeScript Errors

**Problem:** Type errors after installing dependencies

**Solution:**

```bash
# Rebuild packages
bun run build

# Restart dev server
bun run dev
```

### Better Auth Not Working

**Problem:** Cannot sign in or session not persisting

**Solution:**

```bash
# Check BETTER_AUTH_SECRET is set
cat apps/server/.env | grep BETTER_AUTH_SECRET

# Verify CORS_ORIGIN matches frontend URL
cat apps/server/.env | grep CORS_ORIGIN

# Check cookies are being sent
# Open browser DevTools → Application → Cookies
```

### ORPC Client Errors

**Problem:** `Cannot find module '@sambung-chat/api'`

**Solution:**

```bash
# Rebuild all packages
bun run build

# Restart dev server
bun run dev
```

---

## Development Tips

### Hot Module Replacement (HMR)

Both frontend and backend support HMR. Changes will reflect immediately without restarting the server.

### Type Safety

The project uses ORPC for end-to-end type safety. Changes to API routes will automatically update types in the frontend.

### Database Migrations

```bash
# Generate migration
bun run db:generate

# Run migration
bun run db:migrate

# View database
bun run db:studio
```

---

## Additional Resources

- [Architecture Documentation](./architecture.md)
- [API Reference](./api-reference.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guide](../.github/CONTRIBUTING.md)

---

**"Sambung: Connect any AI model. Self-hosted. Privacy-first. Open-source forever."**
