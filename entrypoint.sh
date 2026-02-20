#!/bin/sh
# Copy files from mounted volume that don't already exist in assets
if [ -d "/mounted-assets" ]; then
  for f in /mounted-assets/*; do
    basename=$(basename "$f")
    if [ ! -e "/usr/share/nginx/html/assets/$basename" ]; then
      cp -r "$f" /usr/share/nginx/html/assets/
    fi
  done
  echo "Mounted assets merged."
fi

exec nginx -g "daemon off;"
