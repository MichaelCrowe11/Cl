# syntax=docker/dockerfile:1
FROM node:20-bullseye

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# Install root deps
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .npmrc* ./
RUN pnpm install --ignore-scripts

# Install web deps
COPY apps/web/package.json ./apps/web/
RUN pnpm install --filter ./apps/web --ignore-scripts

# Copy source for dev
COPY apps/web ./apps/web
COPY packages ./packages

EXPOSE 3000
CMD ["pnpm","--filter","./apps/web","run","dev","--","-p","3000","-H","0.0.0.0"]