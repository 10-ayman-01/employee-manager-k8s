#!/bin/bash
set -e

echo "Instalando k3d si no está disponible..."
if ! command -v k3d &> /dev/null; then
  curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
fi

echo "Instalando kubectl si no está disponible..."
if ! command -v kubectl &> /dev/null; then
  curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  mv kubectl /usr/local/bin/
fi

echo "Creando clúster k3d..."
k3d cluster delete employee-cluster 2>/dev/null || true
k3d cluster create employee-cluster --port "30080:30080@server:0"

echo "Construyendo imágenes Docker..."
docker build -t employee-backend:latest ./backend
docker build -t employee-frontend:latest ./frontend

echo "Importando imágenes al clúster..."
k3d image import employee-backend:latest -c employee-cluster
k3d image import employee-frontend:latest -c employee-cluster

echo "Instalando metrics-server para HPA..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl patch deployment metrics-server -n kube-system \
  --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

echo "Aplicando manifiestos de Kubernetes..."
kubectl apply -f k8s/db-pvc.yaml
kubectl apply -f k8s/db-deployment.yaml
kubectl apply -f k8s/db-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/backend-hpa.yaml

echo "Esperando a que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=db --timeout=120s
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s

echo ""
echo "Aplicacion desplegada correctamente en Kubernetes"
echo "Pods en ejecucion:"
kubectl get pods
echo ""
echo "HPA configurado:"
kubectl get hpa