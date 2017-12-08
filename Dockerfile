FROM node:latest

ENV PORT 8080

COPY src /app
WORKDIR /app

ENTRYPOINT [ "./startup.sh" ]