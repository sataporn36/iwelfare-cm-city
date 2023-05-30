# Stage 1: Build the Angular app
FROM node:16 as builder

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build 

# Stage 2: Serve the built Angular app
FROM nginx:1.18

# Copy the built app from the previous stage
COPY --from=builder /app/dist/project-iwelfare-cm-city /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default HTTP port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]