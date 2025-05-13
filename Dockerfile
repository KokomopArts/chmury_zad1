#build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.js ./
COPY ./public ./public

#runtime
FROM node:20-alpine

COPY --from=builder /app /app

WORKDIR /app

EXPOSE 8080
LABEL org.opencontainers.image.authors="Andrzej Kępa"
LABEL org.opencontainers.image.version="1.0"
HEALTHCHECK --interval=7s --timeout=1s \
CMD wget --spider http://localhost:8080/ || exit 1

CMD ["node", "index.js"]