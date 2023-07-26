# Update Docker image

This document describes how to update the Docker image for the [Docker image](https://hub.docker.com/r/losolio/converto).

**Apple silicon** users should use the `--platform linux/amd64` flag when building the image. However there is some issues with running this image on Apple silicon.

## Build the image

```bash
docker build --platform linux/amd64 --progress=plain . --tag losolio/converto
```

Test the image by running

```bash
docker run --rm -it --env-file .env -v ./.tmp/:/home/node/app/.tmp/ -p 1337:1337/tcp losolio/converto:latest
```

## Push the image

After logging in with `docker login`, push the image to the Docker Hub:

```bash
docker push losolio/converto:latest
```
