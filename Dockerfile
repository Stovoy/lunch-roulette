FROM ubuntu:16.04

RUN apt-get update
RUN apt-get -y install curl nodejs nginx
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN apt-get -y install ca-certificates

ADD src /app/src
ADD frontend /app/frontend
ADD resources /app/resources
ADD node_modules /app/node_modules
RUN mkdir -p /app/logs

EXPOSE 80 443

ENV MODE dev
ENTRYPOINT /bin/bash /app/resources/entrypoint.sh
