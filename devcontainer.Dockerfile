# Use the base image provided by devcontainers
FROM mcr.microsoft.com/devcontainers/base:ubuntu

WORKDIR /workspaces/1movementglobal
# Install curl
RUN apt-get update && apt-get install -y curl

# Install npm
RUN curl -fsSL https://npmjs.org/install | bash

# Set npm environment variables
ENV NPM_INSTALL="/root/.npm"
ENV PATH="$NPM_INSTALL/bin:$PATH"

# Set the working directory

COPY . .

RUN ls -al ../1movementglobal

# Run bun install in the /server directory
RUN cd /workspaces/1movementglobal/server && npm install

# Ensure node_modules is not overridden

# Set the default command to sleep infinity
CMD ["sleep", "infinity"]
