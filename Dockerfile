# Build container
FROM node:20-slim AS builder

# 1. Install OpenSSL (Required by Prisma for the build step)
RUN apt-get update -y && apt-get install -y openssl

COPY . ./
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
ENV PRISMA_DB_URL="file:./dev.db"
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm i -g pnpm
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

# Copy stuff from build container to ensure we have prisma and everything it needs
COPY --from=builder /.output /
COPY --from=builder /package.json /
COPY --from=builder /pnpm-lock.yaml /
COPY --from=builder /prisma /prisma
COPY --from=builder /node_modules /node_modules
COPY --from=builder /algorithms /algorithms
RUN npm i -g pnpm
COPY ./entrypoint.sh /entrypoint.sh

# Ensure we can actually run the entrypoint script
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./server/index.mjs"]
