# Use the official Node.js 20 slim
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  libvips-dev \
  libvips-tools

# Copy package.json and package-lock.json (if available)
COPY package*.json ./


RUN npm install --os=linux --cpu=x64 sharp
# Install dependencies
RUN npm install 

# Copy the source code to the container
COPY . .

# Build the TypeScript code
RUN npm run compile

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "-r", "newrelic", "build/server.js"]
