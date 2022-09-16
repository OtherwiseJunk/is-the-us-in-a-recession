FROM node:alpine as dependency
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm i

FROM dependency as build
WORKDIR /app
COPY ./ ./
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]