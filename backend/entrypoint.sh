#!/bin/bash

echo "Aguardando o banco de dados no host db:5432..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Banco de dados online!"

# Se o diretório alembic existir, roda as migrações
if [ -d "/code/alembic" ]; then
  echo "Rodando migrações..."
  alembic upgrade head
fi

echo "Iniciando FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
