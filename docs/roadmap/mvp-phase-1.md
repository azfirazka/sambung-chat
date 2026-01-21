# Phase 1: MVP Foundation (Weeks 1-12)

**Target Release:** v0.1.0
**Target Date:** March 31, 2026
**Current Version:** v0.0.18
**Progress:** 55% (37/67 tasks completed)

---

## Overview

Phase 1 focuses on building a functional MVP with core chat features, multi-model AI integration, and team collaboration basics.

---

## Week 1-2: Repository Setup & Infrastructure ✅ 100%

### Completed

- [x] Initialize monorepo structure (Turborepo + Bun)
- [x] Setup SvelteKit 5 + Hono + Drizzle ORM
- [x] Configure Better Auth
- [x] Database setup (PostgreSQL + Docker Compose)
- [x] Add LICENSE file (AGPL-3.0)
- [x] Create .github/ templates (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- [x] Setup CI/CD (GitHub Actions with typecheck, lint, build, test)
- [x] Configure ESLint, Prettier, Husky pre-commit hooks
- [x] Docker configuration (dev & production Dockerfiles)
- [x] Setup shadcn-svelte components
- [x] GitHub templates with YAML format (bug report, feature request, documentation, question)

---

## Week 3-4: Authentication & User Management ✅ 100%

### Completed

- [x] Complete Better Auth integration (backend configured with email/password)
- [x] User registration/login UI components (SignInForm, SignUpForm)
- [x] Session management implementation
- [x] Protected routes implementation
- [x] Create AuthLayout component
- [x] Remove TanStack Query dependency
- [x] Create AppSidebar component (dual sidebar navigation)
- [x] Create NavigationRail component (64px icon-based navigation)
- [x] Create SecondarySidebar component (280px context-aware sidebar)
- [x] Create SecondarySidebarTrigger for consistent toggle

### Pending

- [ ] User profile page UI (backend exists)
- [ ] Write unit tests for auth router

---

## Week 5-6: Multi-Model Chat Interface ✅ 90%

### Completed

- [x] Database schema for chats, messages, apiKeys, folders, models, prompts
- [x] Run database migration (10 tables created)
- [x] Basic API routes (chat, message, folder CRUD via ORPC)
- [x] Add pin/unpin chat endpoints
- [x] Add search chats endpoint with query normalization
- [x] Real-time streaming responses (AI SDK v6)
- [x] Error handling with exponential backoff retry
- [x] Multi-provider LLM integration (OpenAI, Anthropic, Google, Groq, Ollama)
- [x] AI provider factory with error handling
- [x] API key encryption utilities (AES-256)
- [x] API key router (getAll, create, delete)

### Pending

- [ ] Unit tests for chat router (partial - some tests exist)
- [ ] Unit tests for message router
- [ ] Unit tests for folder router

---

## Week 7-8: Chat History Management 🔄 80%

### Completed

- [x] Build ChatInterface component with KaTeX + Mermaid.js support
- [x] Build Message component with markdown rendering and syntax highlighting
- [x] Build ChatInput component with auto-resize and send button
- [x] Build ModelSelector component with provider grouping
- [x] Implement SSE streaming for AI responses
- [x] ChatList sidebar component with search and filtering
- [x] ChatListItem with highlight and actions
- [x] Folder organization UI (FolderList, FolderListItem)
- [x] Export chat utilities (JSON, MD, TXT)
- [x] Dynamic chat route ([id]) with history loading
- [x] Pin/unpin functionality
- [x] Folder assignment UI

### In Progress

- [ ] Search UI connection to backend API

### Pending

- [ ] Pagination & infinite scroll

---

## Week 9: Prompt Templates 🔄 50%

### Completed

- [x] Database schema for prompts
- [x] Export chat functionality (JSON, MD, TXT)
- [x] Search backend with query normalization
- [x] Date range filtering
- [x] Provider/model filtering
- [x] Search in messages functionality
- [x] N+1 query optimization with batch-fetching

### Pending

- [ ] Prompt router (getAll, create, update, delete)
- [ ] Write unit tests for prompt router
- [ ] Build PromptLibrary component
- [ ] Build PromptEditor component
- [ ] Add built-in prompt templates
- [ ] Variable substitution UI
- [ ] Community prompts library

---

## Week 10: Settings & Preferences ✅ 70%

### Completed

- [x] Theme provider implementation
- [x] Theme toggle (light/dark mode with mode-watcher)
- [x] Create deployment documentation
- [x] Settings page with consistent sidebar navigation
- [x] Account settings page (profile, security, danger zone)
- [x] API keys management page
- [x] Models management page
- [x] User initials extraction for avatar fallback
- [x] NavUser menu reorganization

### In Progress

- [ ] Profile page UI (backend exists)

### Pending

- [ ] Sidebar width adjustment
- [ ] Font size adjustment
- [ ] Privacy mode toggle

---

## Week 11: Internationalization & Testing ⏳

### Completed

- [x] Unit test framework configured (Vitest)
- [x] E2E test framework configured (Playwright)
- [x] Some unit tests for chat router
- [x] ChatListItem.test.ts with highlight testing

### Pending

- [ ] Install and configure svelte-i18n
- [ ] Create locale files (en, id)
- [ ] Extract UI strings to translation files
- [ ] Add language selector to settings
- [ ] Store language preference in database
- [ ] Write comprehensive unit tests
- [ ] Write E2E tests
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Security audit

---

## Week 12: v0.1.0 Release 🔄 15%

### Completed

- [x] Add pin favorite chats functionality
- [x] Create deployment documentation
- [x] GitHub templates (YAML format)
- [x] Documentation reorganization
- [x] Security improvements (XSS prevention, CSRF, rate limiting)

### In Progress

- [ ] Final polish and bug fixes

### Pending

- [ ] Complete documentation
- [ ] E2E tests for critical flows
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Performance optimization
- [ ] Prepare v0.1.0 GitHub release
- [ ] Announcement blog post

---

## Quick Stats

| Metric          | Value |
| --------------- | ----- |
| **Total Tasks** | 67    |
| **Completed**   | 37    |
| **In Progress** | 3     |
| **Pending**     | 27    |
| **Blocked**     | 0     |
| **P0 Blockers** | 0     |

---

## Progress by Category

| Category           | Completed | Total | Progress |
| ------------------ | --------- | ----- | -------- |
| **Infrastructure** | 9         | 9     | 100% ✅  |
| **Backend**        | 10        | 16    | 63% 🔄   |
| **Frontend**       | 13        | 19    | 68% 🔄   |
| **Testing**        | 1         | 5     | 20% ⏳   |
| **Security**       | 4         | 2     | 200% ✅+ |
| **Docs**           | 3         | 3     | 100% ✅  |
| **Release**        | 1         | 2     | 50% 🔄   |

---

## Recent Achievements (v0.0.18)

### Security

- ✅ XSS prevention in ChatListItem search highlighting
- ✅ HTML sanitization with DOMPurify
- ✅ CSRF protection middleware
- ✅ Rate limiting middleware
- ✅ Security headers (CSP, HSTS, Permissions-Policy)

### Code Quality

- ✅ Query normalization (trim whitespace)
- ✅ Date validation with Zod coercion
- ✅ Empty array guards for SQL safety
- ✅ Promise.allSettled for resilient error handling
- ✅ N+1 query optimization with batch-fetching
- ✅ Type safety improvements (removed 'as any' casts)
- ✅ Dialog components Svelte 5 compatibility

### Documentation

- ✅ Reorganized roadmap documentation structure
- ✅ Created docs/roadmap/ with overview and MVP phase 1
- ✅ Created docs/status/current.md for real-time status
- ✅ Updated docs/index.md and docs/README.md

---

## Next Steps (Priority Order)

### Immediate (This Week)

1. **[P1]** Connect search UI to backend API
2. **[P1]** Build prompt router and UI
3. **[P1]** Write unit tests for routers

### Short Term (Next 2 Weeks)

4. **[P1]** Build PromptLibrary component
5. **[P1]** Create user profile page UI
6. **[P1]** Add appearance settings (font size, sidebar width)
7. **[P1]** Write E2E tests for critical flows

### Medium Term (Month)

8. **[P2]** Folder drag-and-drop
9. **[P2]** Message edit/undo functionality
10. **[P1]** Setup i18n and create locale files

### Release Preparation

11. **[P1]** Run accessibility audit (WCAG 2.1 AA)
12. **[P1]** Perform security audit
13. **[P1]** Performance optimization
14. **[P0]** Prepare v0.1.0 GitHub release

---

## Database Schema (Completed)

### Core Tables

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts (Keycloak)

### Chat Tables

- `chats` - Chat sessions (title, modelId, folderId, pinned)
- `messages` - Chat messages (role, content, tokens)
- `folders` - Chat folders (name, userId)

### AI Tables

- `models` - AI models (provider, name, apiKeyId)
- `api_keys` - Encrypted API keys (name, provider, encryptedValue)
- `prompts` - Prompt templates (name, content, variables)

### Demo Tables

- `todos` - Todo items (demo)

---

## API Endpoints (Implemented)

### Auth

- POST `/auth/register` - Register new user
- POST `/auth/login` - Login with email/password
- POST `/auth/logout` - Logout user

### Chat

- GET `/chat` - Get all user chats
- GET `/chat/getById` - Get chat by ID with messages
- POST `/chat/create` - Create new chat
- PUT `/chat/update` - Update chat (title, modelId)
- DELETE `/chat/delete` - Delete chat
- POST `/chat/togglePin` - Toggle pin status
- PUT `/chat/updateFolder` - Update chat folder
- POST `/chat/search` - Search chats (with filters)
- GET `/chat/getAllChatsWithMessages` - Export all chats with messages
- GET `/chat/getChatsByFolder` - Export chats grouped by folders

### Message

- POST `/message/stream` - Stream AI response (SSE)

### Folder

- GET `/folder` - Get all folders
- POST `/folder/create` - Create folder
- PUT `/folder/update` - Update folder
- DELETE `/folder/delete` - Delete folder

### API Keys

- GET `/apiKeys` - Get all API keys
- POST `/apiKeys/create` - Create API key (encrypted)
- DELETE `/apiKeys/delete` - Delete API key

### Model

- GET `/model/getActive` - Get active model
- GET `/model/listAll` - List all models

### AI

- POST `/ai/stream` - Stream chat completion

---

## Related Documents

- [Roadmap Overview](../roadmap/overview.md) - High-level roadmap
- [Current Status](../status/current.md) - Real-time status tracking
- [Full Roadmap](../roadmap/full-roadmap.md) - Complete Phase 1-5

---

**"Sambung: Connect any AI model. Self-hosted. Privacy-first. Open-source forever."**
