FROM ubuntu:16.04

RUN apt-get update
RUN apt-get -y install nodejs nginx
RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD src /app/src
ADD resources/ /app/resources
ADD node_modules /app/node_modules
RUN mkdir -p /app/logs

EXPOSE 8000
ENTRYPOINT /bin/bash /app/resources/entrypoint.sh
