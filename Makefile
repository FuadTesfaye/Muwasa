.PHONY: help dev setup db-up db-down migrate ingest-quran ingest-translations ingest-hadith ingest-all validate seed server web lint test eval clean

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ==========================================
# Development Setup
# ==========================================

setup: ## Initial project setup with Bun
	@echo "🕌 Setting up Muwāsā (100% TypeScript + Bun)..."
	@cp -n .env.example .env 2>/dev/null || true
	@echo "📦 Installing root dependencies..."
	bun install
	@echo "📦 Installing Web dependencies..."
	cd web && bun install
	@echo "✅ Setup complete. Edit .env with your Supabase / OpenAI keys."

dev: ## Start both Server and Web concurrently
	@echo "🚀 Starting Muwāsā full-stack development environment..."
	@bun run server/src/index.ts & \
	cd web && bun run dev

# ==========================================
# Database (PostgreSQL / Supabase)
# ==========================================

db-up: ## Start local PostgreSQL + Redis via Docker
	docker compose up -d

db-down: ## Stop local database containers
	docker compose down

migrate: ## Run database migrations via TypeScript on Supabase/Postgres
	bun run db/migrate.ts

# ==========================================
# Islamic Knowledge Base Ingestion
# ==========================================

ingest-quran: ## Ingest Quran text from Tanzil.net (TypeScript)
	bun run islamic-kb/scripts/ingest-tanzil.ts

ingest-translations: ## Ingest English translations from QuranEnc (TypeScript)
	bun run islamic-kb/scripts/ingest-quranenc.ts

ingest-hadith: ## Ingest authentic Hadith from HadeethEnc.com (TypeScript)
	bun run islamic-kb/scripts/ingest-hadith.ts

ingest-all: ingest-quran ingest-translations ingest-hadith ## Ingest full Islamic knowledge base

validate: ## Validate Islamic knowledge base integrity (TypeScript)
	bun run islamic-kb/scripts/validate-sources.ts

seed: migrate ingest-all validate ## Full seed: migrate + ingest + validate

# ==========================================
# Services
# ==========================================

server: ## Start Bun + Hono WebSocket AI Server
	bun run server/src/index.ts

web: ## Start Next.js 15 frontend
	cd web && bun run dev

# ==========================================
# Testing & Evaluation
# ==========================================

test: ## Run unit test suite via Bun Test (TypeScript)
	bun test

eval: ## Run AI Safety, Citation & Situation evaluation suite (TypeScript)
	bun run evaluation/run-eval.ts

lint: ## Run Next.js linter
	cd web && bun run lint

# ==========================================
# Cleanup
# ==========================================

clean: ## Remove generated files and build caches
	cd web && rm -rf .next
