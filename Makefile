SHELL := /usr/bin/bash
.ONESHELL:

export $(shell sed -n 's/^\([^#][A-Za-z0-9_]*\)=.*/\1/p' .env 2>/dev/null)

.PHONY: dev infra-up infra-down api-migrate api-seed test

dev: infra-up
	pnpm --filter ./apps/api prisma migrate dev --name init || true
	pnpm --filter ./apps/api prisma db seed || true
	docker compose -f ./infra/docker-compose.yml up -d --build

infra-up:
	docker compose -f ./infra/docker-compose.yml up -d postgres redis

infra-down:
	docker compose -f ./infra/docker-compose.yml down -v

api-migrate:
	pnpm --filter ./apps/api prisma migrate dev --name init

api-seed:
	pnpm --filter ./apps/api prisma db seed

test:
	pnpm turbo run test
