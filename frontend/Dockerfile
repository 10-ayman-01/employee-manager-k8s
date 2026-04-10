# Vulnerabilidad existente: imagen sin usuario definido
# CORRECCIÓN: se usa imagen nginx no-root oficial con USER explícito
FROM nginxinc/nginx-unprivileged:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY src/ /usr/share/nginx/html/

USER 101

EXPOSE 8080