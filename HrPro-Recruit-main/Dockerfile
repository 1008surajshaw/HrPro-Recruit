# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js project
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
