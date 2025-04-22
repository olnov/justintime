# Stage 1: Build the application
FROM node:current-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV DATABASE_URL=$DATABASE_URL
ENV MAILGUN_API_KEY=$MAILGUN_API_KEY

# Start the application
CMD ["node", "dist/main.js"]
