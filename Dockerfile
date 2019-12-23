FROM strapi/base

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

ENV NODE_ENV production
EXPOSE 1337
CMD ["npm", "run", "start"]