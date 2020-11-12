FROM node:current-slim

# Set working directory
WORKDIR /usr/src/app

# Copy our source files
COPY . ./

# Install dependency packages
RUN npm install

# Expose default port
EXPOSE 3000

# Set working directory and start application
WORKDIR /usr/src/app/src
CMD ["npm", "start"]