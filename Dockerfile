FROM node:10

# Directory
WORKDIR /app

# Install dependencies
COPY ./package*.json ./
RUN npm install --production

# Bundle
COPY . .

# Default command
CMD ["npm", "run", "start"]