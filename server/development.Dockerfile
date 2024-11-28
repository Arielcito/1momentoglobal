# Use the official Node.js 20 slim
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

RUN npm install --os=linux --cpu=x64 sharp
# Install dependencies
RUN npm install

# Copy the source code to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 8080

# Define the command to run the app
CMD [ "npm", "run", "start:dev" ]