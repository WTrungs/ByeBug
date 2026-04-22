FROM node:25-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]