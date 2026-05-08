# Build container
FROM node:20-slim AS builder

# 1. Install OpenSSL (Required by Prisma for the build step)
RUN apt-get update -y && apt-get install -y openssl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm i -g pnpm

WORKDIR /app
COPY . ./
RUN pnpm i --shamefully-hoist
RUN rm -rf .prisma/node_modules/.prisma/node_modules/@prisma/engines || true
RUN rm -rf node_modules/.prisma || true
RUN mv tsconfig.json tsconfig.json.bak
RUN pnpm prisma generate

RUN mv tsconfig.json.bak tsconfig.json
RUN pnpm run build

# Deployment container
FROM node:20-slim AS deployment

# 2. Install OpenSSL in the runner too (Prisma needs it to execute queries at runtime)
# 3. Install Python & OR-Tools (Required for the team generation CP-SAT algorithm)
RUN apt-get update -y && \
    apt-get install -y openssl python3 python3-pip python-is-python3 && \
    pip3 install ortools --break-system-packages

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm

WORKDIR /app

# Copy stuff from build container to ensure we have prisma and everything it needs
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/algorithms ./algorithms
COPY --from=builder /app/.output ./.output

# Re-install prod dependencies fresh so pnpm symlinks are native (not broken copies)
RUN pnpm i --shamefully-hoist

# Copy Prisma generated client from builder (already generated, no need to re-run)
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY ./entrypoint.sh ./entrypoint.sh

# Ensure we can actually run the entrypoint script
RUN chmod +x ./entrypoint.sh
RUN sed -i 's/\r//' ./entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "/app/.output/server/index.mjs"]