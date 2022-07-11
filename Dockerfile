FROM node:12

RUN ["npm", "install", "-g", "@angular/cli"]

RUN mkdir /home/sources

COPY src /home/sources/src
COPY e2e /home/sources/e2e
COPY package.json /home/sources/package.json
COPY tsconfig.json /home/sources/tsconfig.json
COPY tsconfig.app.json /home/sources/tsconfig.app.json
COPY angular.json /home/sources/angular.json
COPY karma.conf.js /home/sources/karma.conf.js
COPY .browserslistrc /home/sources/.browserslistrc

WORKDIR /home/sources

RUN ["npm", "install"]

RUN ["ng", "build", "--configuration", "production"]

FROM nginx:1.17.9-alpine
COPY --from=0 /home/sources/dist/oai-ui /usr/share/nginx/html
COPY nginx.config /etc/nginx/conf.d/default.conf
COPY env-replace.sh /usr/local/bin/
EXPOSE 80
RUN chmod +x /usr/local/bin/env-replace.sh
ENTRYPOINT [ "env-replace.sh" ]
CMD ["nginx", "-g", "daemon off;"]
