FROM python:3.11-slim

# Instala dependências para o driver do Postgres e wait-for-it
RUN apt-get update && apt-get install -y libpq-dev gcc netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /code

# Instala as libs dentro da imagem
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Permissão para o script de entrada
RUN chmod +x /code/entrypoint.sh

ENTRYPOINT ["/code/entrypoint.sh"]
