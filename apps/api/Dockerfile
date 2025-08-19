# syntax=docker/dockerfile:1
FROM node:20-bullseye

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# Install root deps (monorepo)
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .npmrc* ./
RUN pnpm install --ignore-scripts

# Install api deps
COPY apps/api/package.json apps/api/tsconfig*.json apps/api/nest-cli.json ./apps/api/
RUN pnpm install --filter ./apps/api --ignore-scripts

# Copy source for dev
COPY apps/api ./apps/api
COPY packages ./packages

EXPOSE 3001
CMD ["pnpm","--filter","./apps/api","run","start:dev"]