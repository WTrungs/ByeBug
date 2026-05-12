FROM node:25-bookworm-slim AS build
WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]