#!/usr/bin/env bash
# Günlük yedek: PostgreSQL dökümü + admin panelinden yüklenen görseller. 14 gün saklanır.
#
# Kurulum (sunucuda, bir kez):
#   echo '15 3 * * * root /opt/personal-portfolio/deploy/backup.sh >> /var/log/personal-portfolio-backup.log 2>&1' \
#     > /etc/cron.d/personal-portfolio-backup
#
# Geri yükleme:
#   docker compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' < db-<tarih>.dump
#   docker compose exec -T api tar -C /data/uploads -xzf - < uploads-<tarih>.tar.gz
#
# Not: yedekler aynı diskte durur. Disk kaybına karşı ara sıra başka bir yere kopyalanmalı.
set -euo pipefail

cd "$(dirname "$0")/.."
DEST=/var/backups/personal-portfolio
KEEP_DAYS=14
STAMP=$(date +%Y%m%d-%H%M%S)

# Yedekler veritabanı içeriği barındırır: yalnızca root okuyabilir
umask 077
mkdir -p "$DEST"

docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' \
  < /dev/null > "$DEST/db-$STAMP.dump"
docker compose exec -T api tar -C /data/uploads -czf - . \
  < /dev/null > "$DEST/uploads-$STAMP.tar.gz"

# Boş döküm başarısız bir yedektir; sessizce eskileri silmeden önce dur
if [ ! -s "$DEST/db-$STAMP.dump" ]; then
  echo "$(date -Is) HATA: veritabanı dökümü boş" >&2
  exit 1
fi

find "$DEST" -type f \( -name 'db-*.dump' -o -name 'uploads-*.tar.gz' \) -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) tamam: db-$STAMP.dump ($(du -h "$DEST/db-$STAMP.dump" | cut -f1)), uploads-$STAMP.tar.gz"
