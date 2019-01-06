FROM node:10

# Directory
WORKDIR /change/me

# Install dependencies
COPY ./package*.json ./
RUN npm install

# Bundle
COPY ./ ./

EXPOSE 3003

# Default command
CMD ["npm", "start"]