#!/bin/bash
set -e

# Cloner le dépôt
echo "Clonage du dépôt..."
git clone https://benoit73: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@github.com/benoit73/ftb-back.git /app

# Lancer l'application (exemple avec npm)
cd /app
npm install && npm run prod
