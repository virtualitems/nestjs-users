# Build stage

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./

COPY ./src ./src

RUN npm install

RUN npm run build

RUN npm run db:migration:create
RUN npm run db:migration:up

# Production stage

FROM node:22-alpine AS production

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

COPY --from=build /app/db.sqlite3 .

COPY .env .env

EXPOSE 3000

CMD ["node", "./dist/main.js"]
