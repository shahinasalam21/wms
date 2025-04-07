# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy app files
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend with nodemon
CMD ["nodemon", "server.js"]
