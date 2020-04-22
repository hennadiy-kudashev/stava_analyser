FROM node:alpine

ADD ./ /strava_challenger
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

WORKDIR /strava_challenger

#ARG ADMIN_STRAVA_ATHLETE_ID=22381137
ENV MONGOLAB_URI "mongodb://strava:strava@mongodb:27017/strava"
ENV PORT 3000
ENV WAIT_HOSTS mongodb:27017
ENV WAIT_SLEEP_INTERVAL 5
ENV WAIT_HOSTS_TIMEOUT 300

RUN apk add --update-cache \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

RUN chmod +x /wait && rm -rf node_modules &&  npm install &&  npm run build
# RUN && apt update && apt install -y make python-dev g++ && npm audit fix --force

EXPOSE 3000

CMD /wait && npm run start:prod
