#!/usr/bin/env bash
# Installa l'Android SDK necessario per compilare l'APK (piattaforma 36, build-tools, platform-tools).
# Uso: scripts/setup-android-sdk.sh [cartella]   (predefinita: $ANDROID_HOME o ~/android-sdk)
# Richiede Java 21 e accesso a dl.google.com. Idempotente: se l'SDK c'è già non riscarica nulla.
set -euo pipefail
SDK="${1:-${ANDROID_HOME:-$HOME/android-sdk}}"
TOOLS="$SDK/cmdline-tools/latest/bin"
if [ ! -x "$TOOLS/android" ]; then
  zip=$(curl -fsSL https://dl.google.com/android/repository/repository2-3.xml \
    | grep -o 'commandlinetools-linux-[0-9]*_latest.zip' | sort -t- -k3 -n | tail -1)
  tmp=$(mktemp -d)
  curl -fsSL "https://dl.google.com/android/repository/$zip" -o "$tmp/tools.zip"
  mkdir -p "$SDK/cmdline-tools"
  unzip -q "$tmp/tools.zip" -d "$tmp"
  rm -rf "$SDK/cmdline-tools/latest" && mv "$tmp/cmdline-tools" "$SDK/cmdline-tools/latest"
  rm -rf "$tmp"
fi
# Gli strumenti recenti usano la Android CLI ("android sdk install"); le licenze non vanno più accettate a parte.
if [ ! -d "$SDK/platforms/android-36" ] || [ ! -d "$SDK/build-tools/36.0.0" ] || [ ! -d "$SDK/platform-tools" ]; then
  "$TOOLS/android" --sdk="$SDK" sdk install platform-tools platforms/android-36 build-tools/36.0.0
fi
echo "sdk.dir=$SDK" > "$(dirname "$0")/../android/local.properties"
echo "Android SDK pronto in $SDK"
