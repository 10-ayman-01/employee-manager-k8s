# Employee Manager — Kubernetes

Aplicación web de gestión de empleados desplegada en Kubernetes con escalado automático mediante HPA.

## Tecnologías

- **Frontend**: HTML + CSS + JavaScript, servido por Nginx
- **Backend**: Node.js + Express (API REST)
- **Base de datos**: PostgreSQL 15 (persistente con PersistentVolumeClaim)
- **Orquestación**: Kubernetes con k3d
- **Escalado**: HorizontalPodAutoscaler (HPA)

## Funcionalidades

- Crear, editar y eliminar empleados
- Campos: nombre, email, departamento, cargo y salario
- Panel de estadísticas en tiempo real
- Escalado automático del backend entre 2 y 5 réplicas según uso de CPU

## Requisitos

- Docker
- k3d
- kubectl

## Arranque

```bash
./start.sh
```

La aplicación estará disponible en `http://localhost:30080`.

## Estructura

- backend/src/index.js — Entrada de la aplicación
- backend/src/db.js — Conexión y configuración de la DB
- backend/src/routes/employees.js — Rutas CRUD
- backend/Dockerfile
- frontend/src/index.html
- frontend/src/css/style.css
- frontend/src/js/app.js
- frontend/nginx.conf
- frontend/Dockerfile
- k8s/db-pvc.yaml — Volumen persistente para PostgreSQL
- k8s/db-deployment.yaml — Deployment de la base de datos
- k8s/db-service.yaml — Servicio interno de la DB
- k8s/backend-deployment.yaml — Deployment del backend
- k8s/backend-service.yaml — Servicio interno del backend
- k8s/frontend-deployment.yaml — Deployment del frontend
- k8s/frontend-service.yaml — Servicio NodePort del frontend
- k8s/backend-hpa.yaml — HorizontalPodAutoscaler
- start.sh — Script de arranque

## Escalado

El HPA escala automáticamente el backend:
- **Mínimo**: 2 réplicas
- **Máximo**: 5 réplicas
- **Métrica**: uso de CPU por encima del 50%