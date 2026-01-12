FROM node:20-alpine

# Create working directory
WORKDIR /home/app

# Copy package files first for better caching
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY app .

# Expose the port your server listens on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]