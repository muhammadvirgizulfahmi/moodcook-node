# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# (jika tidak ada step build front-end bisa diabaikan)
# ---------- runtime ----------
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app .
ENV PORT=8080 NODE_ENV=production
EXPOSE 8080
CMD ["node","src/server.js"]
