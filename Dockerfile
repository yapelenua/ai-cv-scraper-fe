FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]