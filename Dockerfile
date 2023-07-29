FROM node:18.17-bookworm-slim
EXPOSE 1337
ENV NODE_ENV production

# Install Chrome, to have all dependencies for Puppeteer
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy files to the app directory
RUN mkdir /app && mkdir /app/.cache && chown -R node:node /app
COPY . /app
WORKDIR /app

# Install dependencies
RUN yarn install && yarn build && chown -R node:node /app

# Run time!
ENV PUPPETEER_DOWNLOAD_PATH /app/.cache/puppeteer
USER node
RUN node node_modules/puppeteer/install.js
CMD yarn start
