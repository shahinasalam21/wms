# frontend/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Don't build for dev mode
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
