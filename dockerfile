# Build stage

FROM node:22-alpine AS build

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./

COPY ./src ./src
COPY ./db ./db

RUN npm install

RUN npm run build

RUN npm run db:migration:up

# Production stage

FROM node:22-alpine AS production

LABEL maintainer="Alejandro CR <contacto@alejandrocr.co>"
LABEL version="1.0"
LABEL name="nestjs-users-api"
LABEL description="API REST for users management"

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production

COPY --from=build /home/app/dist ./dist

COPY .env .env

EXPOSE 80

CMD ["node", "./dist/src/main.js"]