FROM strapi/base

WORKDIR /app

COPY . .
RUN npm ci
RUN NODE_ENV=production npm run build

ENV NODE_ENV production
EXPOSE 1337
CMD ["npm", "run", "start"]
