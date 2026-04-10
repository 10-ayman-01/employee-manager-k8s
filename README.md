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
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   └── routes/
│   │       └── employees.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── css/style.css
│   │   └── js/app.js
│   ├── nginx.conf
│   └── Dockerfile
├── k8s/
│   ├── db-pvc.yaml
│   ├── db-deployment.yaml
│   ├── db-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── backend-hpa.yaml
└── start.sh

## Escalado

El HPA escala automáticamente el backend:
- **Mínimo**: 2 réplicas
- **Máximo**: 5 réplicas
- **Métrica**: uso de CPU por encima del 50%