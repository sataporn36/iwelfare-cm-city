# # Stage 1: Build the Angular app
# FROM node:16 as builder

# WORKDIR /app

# # Copy the package.json and package-lock.json files
# COPY package*.json ./

# # Install the dependencies
# RUN npm ci

# # Copy the rest of the application code
# COPY . .

# # Build the Angular app
# RUN npm run build 

# # Stage 2: Serve the built Angular app
# FROM nginx:1.18

# # Copy the built app from the previous stage
# COPY --from=builder /app/dist/project-iwelfare-cm-city /usr/share/nginx/html

# # Copy the nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose the default HTTP port
# EXPOSE 3000

# # Start the nginx server
# CMD ["nginx", "-g", "daemon off;"]

#Use an official Node.js runtime as the base image
FROM node:16-alpine

#Set the working directory inside the container
WORKDIR /app

#Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

#Install project dependencies
RUN npm install

#Copy the entire Angular application to the working directory
COPY . .

#Build the Angular application
RUN npm run build

#Expose the port on which the Angular application will run (default is 80)
EXPOSE 5000

#Start the Angular application
CMD ["npx", "serve", "dist/project-iwelfare-cm-city"]

# Stage 1: Build Angular app
# FROM node:16 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Serve app with Nginx
# FROM nginx:latest
# COPY --from=build ./dist/project-iwelfare-cm-city /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 5000

# # Stage 1: Base image
# FROM node:16 AS base
# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# # Stage 2: Build Angular app
# FROM base AS build
# COPY . .
# RUN npm run build

# # Stage 3: Serve app with Nginx
# FROM nginx:latest AS final
# COPY --from=build /app/dist/project-iwelfare-cm-city /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 5000
# CMD ["nginx", "-g", "daemon off;"]

# # Stage 1: Base image
# FROM node:16 AS base
# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# # Stage 2: Build Angular app
# FROM base AS build
# COPY . .
# RUN npm run build

# # Stage 3: Serve app with Nginx
# FROM nginx:latest AS final
# COPY --from=build /app/dist/project-iwelfare-cm-city /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 5000
# CMD ["nginx", "-g", "daemon off;"]
