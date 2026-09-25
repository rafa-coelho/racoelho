#!/bin/sh
# Cria/atualiza o superuser a partir das variáveis do serviço e sobe o PocketBase.
set -e
DATA_DIR="${PB_DATA_DIR:-/pb/pb_data}"
if [ -n "$PB_ADMIN_EMAIL" ] && [ -n "$PB_ADMIN_PASSWORD" ]; then
  /pb/pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD" --dir "$DATA_DIR"
fi
exec /pb/pocketbase serve --http "0.0.0.0:${PORT:-8080}" --dir "$DATA_DIR"
