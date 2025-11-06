# Stage 1: Build the application
FROM node:22-alpine3.21 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine3.21
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
ENV INVITE_BASE_URL=$INVITE_BASE_URL
ENV JWT_SECRET=$JWT_SECRET

# Start the application
CMD ["node", "dist/main.js"]
