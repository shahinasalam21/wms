# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
