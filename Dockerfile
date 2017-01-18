FROM alpine:latest

RUN apk update && apk upgrade && \
	apk --no-cache add curl ca-certificates nginx nodejs

ADD node_modules /app/node_modules
ADD resources /app/resources
ADD src /app/src
RUN mkdir -p /app/logs

EXPOSE 80

ENV MODE dev

ENTRYPOINT /bin/sh /app/resources/entrypoint.sh
