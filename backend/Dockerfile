# Vulnerabilidad introducida: imagen con usuario root y versión no fijada
FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]