version: "2.5"
services:
  backend:
    image: "shaishulman/roboguide-b"
    build:
      context: ./backend
    ports:
      - "8000:8000"
  frontend:
    image: "shaishulman/roboguide-f"
    build:
      context: ./
      dockerfile: ./frontend/dockerfile
    restart: unless-stopped
    volumes:
      - ./nginx:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    ports:
      - "80:80"
      - "443:443"
  certbot:
    image: certbot/certbot
    restart: unless-stopped
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
