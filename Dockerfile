# Base image
FROM node:14

 

# Set the working directory
WORKDIR /app

 

# Copy package.json and package-lock.json
COPY package*.json ./

 

# Install dependencies
RUN npm install

 

# Copy the rest of the application code
COPY . .

 

# Set the default environment variables, if any
ENV PORT=3000

 

# Expose the port on which your Node.js application will listen
EXPOSE $PORT

 

# Start the Node.js application
CMD ["node", "app.js"]
