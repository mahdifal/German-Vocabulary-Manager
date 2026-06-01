FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY src ./src

EXPOSE 3001
CMD ["bun", "src/index.ts"]
