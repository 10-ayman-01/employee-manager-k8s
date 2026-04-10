# Vulnerabilidad existente: imagen sin usuario definido
# CORRECCIÓN: se añade usuario no-root
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY src/ /usr/share/nginx/html/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html

USER appuser

EXPOSE 80