FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY index.html server.js ./
COPY src ./src

RUN mkdir -p /app/uploads && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=4173
ENV PUBLIC_URL=""

USER node

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:4173/ || exit 1

CMD ["node", "server.js"]
