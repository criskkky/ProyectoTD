# Dockerfile para frontend
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g wait-port
RUN cp .env.example .env
EXPOSE 5173
CMD ["npm", "run", "dev"]
