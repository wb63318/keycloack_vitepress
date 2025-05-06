# Use an official Node.js runtime as the base image
FROM node:23-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the VitePress site
RUN npm run build

# Expose the port VitePress uses (default is 5173 for dev, but static files are served differently)
EXPOSE 3000

# Command to serve the built site (using a simple static server like `serve`)
RUN npm install -g serve
CMD ["serve", "-s", "docs/.vitepress/dist", "-l", "3000"]