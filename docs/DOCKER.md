# Docker Development Guide

This guide explains how to run SambaChat using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Development

```bash
# Start all services (database, server, web)
docker-compose up

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Services will be available at:
- **Web (SvelteKit)**: http://localhost:5173
- **Server (Hono API)**: http://localhost:3000
- **Database (PostgreSQL)**: localhost:5432

### Production

```bash
# Copy and configure environment variables
cp .env.docker.example .env
# Edit .env with your values

# Start production containers
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop all services
docker-compose -f docker-compose.prod.yml down
```

## Docker Compose Files

| File | Purpose | Environment |
|------|---------|-------------|
| `docker-compose.yml` | Development | Development mode with hot reload |
| `docker-compose.prod.yml` | Production | Production-optimized builds |

## Environment Variables

### Required for Production

Create a `.env` file from `.env.docker.example`:

```bash
# Database
POSTGRES_USER=sambungchat
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=sambungchat

# Authentication
BETTER_AUTH_SECRET=your_secret_key  # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=https://your-domain.com

# Public URLs
PUBLIC_API_URL=https://api.your-domain.com
```

### Optional LLM Provider Credentials

Add your API keys for LLM providers:

```bash
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_GENERATIVE_AI_API_KEY=xxx
GROQ_API_KEY=gsk_xxx
```

## Docker Tips

### Rebuild after dependency changes

```bash
# Rebuild specific service
docker-compose build web
docker-compose up -d --no-deps web

# Rebuild all services
docker-compose build
docker-compose up -d
```

### Access container shell

```bash
# Access web container
docker-compose exec web sh

# Access server container
docker-compose exec server sh

# Access database
docker-compose exec postgres psql -U sambungchat -d sambungchat_dev
```

### View container logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f server
docker-compose logs -f postgres
```

### Clean up volumes (deletes data!)

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v
```

## Vite HMR in Docker

The Vite configuration is optimized for Docker development:

- **Host**: `0.0.0.0` - Listens on all interfaces
- **Watch mode**: Uses polling for file change detection
- **HMR**: Configured for Docker networking

If HMR doesn't work:
1. Check if port 5173 is exposed
2. Ensure `--host 0.0.0.0` is passed to Vite
3. Try increasing `usePolling` interval

## Production Deployment

### Using docker-compose.prod.yml

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check health status
docker-compose -f docker-compose.prod.yml ps
```

### Resource Limits

Production containers have resource limits configured:
- **CPU**: 1 core (limit), 0.5 core (reserved)
- **Memory**: 512MB (limit), 256MB (reserved)

Adjust in `docker-compose.prod.yml` if needed.

### Health Checks

Health checks run every 30 seconds:
- Web: `GET /`
- Server: `GET /health`
- Database: `pg_isready`

### Logs

Production logs are rotated:
- Max size: 10MB per file
- Max files: 3 per container

## Troubleshooting

### Port already in use

```bash
# Check what's using the port
lsof -i :5173  # Web
lsof -i :3000  # Server/Database

# Change ports in docker-compose.yml
ports:
  - '5174:5173'  # Use different host port
```

### Database connection errors

```bash
# Check database is healthy
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# View database logs
docker-compose logs postgres
```

### Build fails with "module not found"

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache
```

### File changes not detected in development

1. Check volume mounts: `docker-compose config`
2. Ensure `.dockerignore` doesn't exclude needed files
3. Try restarting with: `docker-compose restart web`

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Docker Network                │
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │   Web App    │─────▶│   Server     │        │
│  │  (SvelteKit) │      │   (Hono)     │        │
│  │  Port: 5173  │      │  Port: 3000  │        │
│  └──────────────┘      └──────┬───────┘        │
│                                │                 │
│                                ▼                 │
│                        ┌──────────────┐         │
│                        │ PostgreSQL   │         │
│                        │ Port: 5432   │         │
│                        └──────────────┘         │
└─────────────────────────────────────────────────┘
```

## References

- [Vite Docker Guide](https://vite.dev/guide/build.html)
- [Vite Server Options](https://vite.dev/config/server-options)
- [Docker Compose Docs](https://docs.docker.com/compose/)
