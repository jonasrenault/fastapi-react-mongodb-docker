FROM node:20-slim as builder

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY ./ /app/

ARG FRONTEND_ENV=production
ARG VITE_BACKEND_API_URL
ARG VITE_PWD_SIGNUP_ENABLED
ARG VITE_GA_TRACKING_ID

ENV VITE_APP_ENV=${FRONTEND_ENV}

# Comment out the next line to disable tests
# RUN npm run test:unit

RUN npm run build


FROM nginx:1.23.1

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/*

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built app and nginx conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d
