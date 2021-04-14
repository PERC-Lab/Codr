# Dockerfile

# Base image
FROM node:14

# Set working directory
WORKDIR /usr/src

# Install dependencies.
COPY package*.json .
RUN npm i

# Copy the code into the image.
COPY . .

# Add the environment variable(s).
ARG NODE_ENV="production"
ENV NODE_ENV $NODE_ENV

# Build app.
RUN npm run build

# Expose port and start.
EXPOSE 3000
CMD npm start
