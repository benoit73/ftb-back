FROM node

RUN apt-get update && apt-get install -y git nano docker.io

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh
RUN git config --global --add safe.directory /app
ENTRYPOINT ["/entrypoint.sh"]