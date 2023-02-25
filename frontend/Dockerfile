FROM node:19-slim as builder

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY ./ /app/

ARG FRONTEND_ENV=production

ENV VITE_APP_ENV=${FRONTEND_ENV}

# Comment out the next line to disable tests
# RUN npm run test:unit

RUN npm run build


FROM nginx:1.23.1
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d
