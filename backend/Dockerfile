# Dockerfile para backend
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g wait-port
COPY . .
RUN cp src/config/.env.example src/config/.env
EXPOSE 3000
CMD ["npm", "run", "dev"]