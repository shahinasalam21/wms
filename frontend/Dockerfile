# frontend/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm config set cache /tmp/npm-cache --global && npm install


# Don't build for dev mode
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
