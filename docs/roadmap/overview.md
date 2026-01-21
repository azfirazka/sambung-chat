# SambungChat Roadmap Overview

**Version:** 1.0
**Last Updated:** January 21, 2026
**License:** AGPL-3.0

---

## Quick Summary

SambungChat is a self-hosted, privacy-first, open-source multi-model LLM platform designed for team collaboration from day one.

**Current Status:** Phase 1 - MVP Foundation (42% complete)
**Target Release:** v0.1.0 MVP - March 2026
**Latest Version:** v0.0.18

---

## Development Phases

| Phase       | Timeline    | Target Release | Status               | Focus                    |
| ----------- | ----------- | -------------- | -------------------- | ------------------------ |
| **Phase 1** | Weeks 1-12  | v0.1.0         | 🔄 In Progress (42%) | MVP Foundation           |
| **Phase 2** | Weeks 13-24 | v0.2.0         | ⏳ Planned           | Ecosystem Expansion      |
| **Phase 3** | Weeks 25-36 | v0.3.0         | ⏳ Planned           | Advanced Features        |
| **Phase 4** | Weeks 37-48 | v0.4.0         | ⏳ Planned           | Enterprise & Scalability |
| **Phase 5** | 2027+       | v1.0.0         | ⏳ Planned           | Platform Expansion       |

---

## Phase 1: MVP Foundation (Weeks 1-12)

**Target:** v0.1.0 - March 2026

### Completed ✅

- Infrastructure: Monorepo (Turborepo + Bun), SvelteKit 5, Hono, Drizzle ORM
- Authentication: Better Auth with Keycloak OAuth
- Database: PostgreSQL with 10 tables
- Chat Backend: Multi-provider streaming (OpenAI, Anthropic, Google, Groq, Ollama)
- Chat UI: Interface, export, search backend
- Navigation: Dual sidebar system (NavRail + Secondary)
- Security: CSRF protection, rate limiting, security headers

### In Progress 🔄

- API key management UI
- Search UI connection
- Prompt templates system
- Folder UX polish

### Planned ⏳

- User profile page
- Settings page UI
- Internationalization (i18n)
- E2E testing
- Accessibility audit

**See:** [MVP Phase 1 Detail](./mvp-phase-1.md)

---

## Phase 2: Ecosystem Expansion (Weeks 13-24)

**Target:** v0.2.0 - June 2026

### UI Library Extraction

- Extract `@sambung/ui` as standalone package
- Publish to npm
- Storybook setup

### Plugin System v1

- Plugin architecture
- Webhook system
- Custom function calling
- Plugin marketplace

### SDK Development

- `@sambung/sdk` for Node.js
- `@sambung/sdk` for Python

**See:** [Phase 2 Detail](./phase-2-ecosystem.md)

---

## Phase 3: Advanced Features (Weeks 25-36)

**Target:** v0.3.0 - September 2026

### Conversation Branching

- Alternate conversation paths
- Visual tree representation
- Branch comparison

### RAG Implementation

- File upload (PDF, TXT, MD)
- Document parsing
- Vector embeddings
- Semantic search
- Knowledge base UI

### Analytics Dashboard

- Token usage tracking
- Cost breakdown
- Performance comparison

---

## Phase 4: Enterprise & Scalability (Weeks 37-48)

**Target:** v0.4.0 - December 2026

### Self-Hosting

- One-click Docker deployment
- Kubernetes Helm charts
- Automated backups
- Upgrade tools

### Security Hardening

- Audit logging
- Enhanced rate limiting
- Dependency scanning

### Performance

- Database optimization
- Redis caching
- CDN setup
- Load testing

---

## Phase 5: Platform Expansion (2027+)

**Target:** v1.0.0 - 2027

### Mobile App

- iOS (React Native)
- Android (React Native)
- Offline capability
- Push notifications

### Desktop App

- macOS (Electron/Tauri)
- Windows (Electron/Tauri)
- Linux (Electron/Tauri)
- System tray integration

---

## Success Metrics

### v0.1.0 (MVP)

- 5+ LLM providers supported
- 1,000+ GitHub stars
- 50+ contributors
- 10,000+ Docker pulls

### v0.2.0 (Ecosystem)

- Published `@sambung/ui` package
- Published `@sambung/sdk` packages
- 10+ community plugins
- 5,000+ GitHub stars

### v1.0.0 (Stable)

- 1,000,000+ downloads
- Active community
- Sustainable governance
- Long-term support

---

## Technology Stack

| Layer     | Technology                             |
| --------- | -------------------------------------- |
| Frontend  | Svelte 5 + ShadCN Svelte + TailwindCSS |
| Backend   | Hono (TypeScript) + ORPC               |
| Database  | PostgreSQL + Drizzle ORM               |
| Auth      | Better Auth                            |
| Build     | Vite + Turborepo                       |
| Runtime   | Bun                                    |
| Testing   | Vitest + Playwright                    |
| Container | Docker + Docker Compose                |

---

## Related Documents

- [Current Status](../status/current.md) - Up-to-date development status
- [MVP Phase 1 Detail](./mvp-phase-1.md) - Detailed Phase 1 breakdown
- [Full Roadmap](./full-roadmap.md) - Complete Phase 1-5 roadmap
- [Open Source PRD](../../plan-reference/PRD-OpenSource.md) - Product requirements

---

**"Sambung: Connect any AI model. Self-hosted. Privacy-first. Open-source forever."**
