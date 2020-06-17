FROM node:12.17.0

# Directory
WORKDIR /usr/app
#WORKDIR /home/node/app

# Install dependencies
COPY ./package*.json ./
RUN npm install --production

# Bundle
COPY . .

# Expose (why?)
EXPOSE 3003

# Default command
CMD ["npm", "run", "start"]