
# Deployment

## Deploying to Heroku

To get this running on Heroku, you will need to do two adjustments.

### Buildpack
In addition to the node.js buildpack, you will need to add `jontewks/puppeteer`.

### No sandbox mode
When running on Heroku, you need to run Puppeteer with `--no-sandbox`.
```
PUPPETEER_NOSANDBOX=true
```

Check the Puppeteer documentation for information on running [Puppeteer on Heroku](https://developers.google.com/web/tools/puppeteer/troubleshooting#running_puppeteer_on_heroku).
