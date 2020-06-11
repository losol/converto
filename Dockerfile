FROM node:12
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . .
EXPOSE 1337
CMD npx strapi start