# --- Stage 1: Build Stage ---
# Use an official Node.js image as a builder.
# Alpine versions are lightweight.
FROM node:16-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's layer caching.
# This step only re-runs if these files change.
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of your application's source code
COPY . .


# --- Stage 2: Production Stage ---
# Start from a fresh, lightweight Node.js image
FROM node:16-alpine

WORKDIR /app

# Copy only the installed node_modules from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the application code from the 'builder' stage
COPY --from=builder /app .

# Expose the port your app runs on
EXPOSE 3000

# The command to run your application
CMD ["node", "server.js"]