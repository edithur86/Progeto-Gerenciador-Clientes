#!/bin/sh
set -e
find /usr/share/nginx/html -name *.js -exec sed -i -e s,PLACEHOLDER_DNS_NAME,$DNS_NAME,g -e s,PLACEHOLDER_APP_ENDERECO,$APP_ENDERECO,g -e s,PLACEHOLDER_APP_ENDERECO_PIX,$APP_ENDERECO_PIX,g {} +
exec "$@"