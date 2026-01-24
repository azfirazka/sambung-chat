.PHONY: help docker-down docker-up-build docker-up docker-restart docker-logs docker-ps web web-build web-install

# Default target
help:
	@echo "Available commands:"
	@echo "  make docker-down       - Stop and remove Docker containers"
	@echo "  make docker-up-build   - Build and start Docker containers (server + postgres)"
	@echo "  make docker-up         - Start Docker containers (server + postgres)"
	@echo "  make docker-restart    - Restart Docker containers"
	@echo "  make docker-logs       - Show Docker logs"
	@echo "  make docker-ps         - Show running Docker containers"
	@echo "  make web               - Start web dev server (port 5174)"
	@echo "  make web-build         - Build web app for production"
	@echo "  make web-install       - Install web dependencies"

# Stop and remove Docker containers
docker-down:
	docker compose -f docker-compose.dev.yml down

# Build and start Docker containers
docker-up-build:
	docker compose -f docker-compose.dev.yml up -d --build server postgres

# Start Docker containers (without rebuild)
docker-up:
	docker compose -f docker-compose.dev.yml up -d server postgres

# Restart Docker containers
docker-restart: docker-down docker-up

# Show Docker logs
docker-logs:
	docker compose -f docker-compose.dev.yml logs -f

# Show running Docker containers
docker-ps:
	docker compose -f docker-compose.dev.yml ps

# Install web dependencies
web-install:
	cd apps/web && bun install

# Start web dev server
web:
	cd apps/web && bun run dev

# Build web app for production
web-build:
	cd apps/web && bun run build
