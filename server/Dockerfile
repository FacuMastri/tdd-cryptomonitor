FROM node:18.2.0

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "start-demo"]
