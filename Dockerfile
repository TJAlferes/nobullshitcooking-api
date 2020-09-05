FROM node:12.17.0

EXPOSE 3003

#WORKDIR /home/node/app
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm install --production
COPY . .

CMD npm run start