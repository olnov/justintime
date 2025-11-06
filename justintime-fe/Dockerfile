FROM node:22-alpine3.21 as builder

# Set working directory
WORKDIR /justintime-fe

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Env vars
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the React app
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /justintime-fe/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80