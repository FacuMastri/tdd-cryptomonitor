FROM node:18.2.0

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY . .

# use port from env variable
CMD ["npx", "vite", "--port", "$PORT"]