# Deployment

## Deploying to Azure

This app should be deployed to Azure as a Web App. The app should be deployed as a Web app for conatainers, Linux app, and the following environment variables should be set.

- `ADMIN_JWT_SECRET` - A random string used for signing JWT tokens for the admin panel. Should be a random string.
- `API_TOKEN_SALT` - Salt used to generate API tokens.
- `APP_KEYS` - Declare session keys
- `AUTH_SECRET` - Secret used to encode JWT tokens
- `DATABASE_CLIENT` - Database client. Should be either `sqlite` or `postgres`. If using postgres, please read the security warnings, and consider isolating the postgres server. Take a look at [Strapi database configuration docs](https://docs.strapi.io/dev-docs/configurations/database) for more information.
- `DATABASE_FILENAME` - Path to the database file if using sqlite. Could be `/app/db/converto-prod.db`
- `JWT_SECRET` - Secret used to encode JWT tokens
- `PORT` - Port to run the app on. Should be `1337` for Azure.
- `PUBLIC_URL` - The public URL of the app. Could be `https://<app-name>.azurewebsites.net`
- `PUPPETEER_CACHE_DIR` - Path to the puppeteer cache directory. Should be `/app/.cache/puppeteer`
- `PUPPETEER_DISABLE_SETUID_SANDBOX` - Puppeteer setting. Should be `true`
- `PUPPETEER_NOSANDBOX` - Puppeteer setting. Should be `true`
- `TRANSFER_TOKEN_SALT` - Salt used to generate transfer tokens.
- `WEBSITES_PORT` - Port to run the app on. Should be `1337` for Azure.

Read more about [Strapi configuration docs](https://docs.strapi.io/dev-docs/configurations/server).
