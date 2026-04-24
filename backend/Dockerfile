FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
