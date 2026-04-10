# Vulnerabilidad introducida: imagen con usuario root y versión no fijada
# CORRECCIÓN: se añade usuario no-root para evitar ejecución como root
FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Crear usuario no-root y asignar permisos
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]