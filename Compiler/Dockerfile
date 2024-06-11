FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN apk add --no-cache g++ python3 py3-pip openjdk11
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "node","index.js" ]