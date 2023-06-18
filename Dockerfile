# Stage 1: Build Angular Application
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Create NGINX server to serve the built app
FROM nginx:latest AS final

# Copy the build output from Stage 1 to the NGINX HTML directory
COPY --from=build /app/dist/project-iwelfare-cm-city /usr/share/nginx/html

# Copy custom nginx.conf file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 5000

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]