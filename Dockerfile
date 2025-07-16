FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --prefer-offline --frozen-lockfile
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"] 