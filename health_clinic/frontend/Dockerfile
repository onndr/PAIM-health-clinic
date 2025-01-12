# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Leverage caching by installing dependencies first
RUN npm install yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code and build for production
COPY . ./
RUN yarn run build

# Stage 2: Development environment
FROM node:20-alpine AS development
WORKDIR /app

# Install dependencies again for development
RUN npm install yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the full source code
COPY . .

# Expose port for the development server
EXPOSE 3000
CMD ["yarn", "start"]

# Stage 3: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]