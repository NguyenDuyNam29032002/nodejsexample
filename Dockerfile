# Stage 1: build dependencies
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: build app
FROM node:18 AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "start"]
