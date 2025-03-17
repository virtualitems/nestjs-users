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

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production

COPY --from=build /home/app/dist ./dist

COPY --from=build /home/app/db.sqlite3 .

COPY .env .env

EXPOSE 3000

CMD ["node", "./dist/src/main.js"]