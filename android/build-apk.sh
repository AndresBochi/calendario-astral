#!/usr/bin/env bash
# Builds and signs the Android app: android/dist/calendario-astral.apk
# Run from Git Bash:  bash android/build-apk.sh
#
# Needs Android Studio's Java and SDK (paths below). The signing key and its
# password live outside the repo, in C:\Users\<you>\keys (see README, "Android app").
# The password is read from $KEYSTORE_PASSWORD, or else from the password file there.
set -euo pipefail
cd "$(dirname "$0")"

# Android Studio's Java, unless JAVA_HOME already points at a working one.
if [ ! -x "${JAVA_HOME:-/none}/bin/java" ] && [ ! -x "${JAVA_HOME:-/none}/bin/java.exe" ]; then
  export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
fi
SDK="${ANDROID_HOME:-$LOCALAPPDATA/Android/Sdk}"
KEYS="${KEYS_DIR:-$HOME/keys}"
KEYSTORE="$KEYS/calendario-astral.keystore"
ALIAS="calendario-astral"
if [ -z "${KEYSTORE_PASSWORD:-}" ]; then
  KEYSTORE_PASSWORD="$(sed -n 's/^Password (keystore and key): //p' "$KEYS/calendario-astral-keystore-password.txt")"
fi
[ -f local.properties ] || echo "sdk.dir=$(cygpath -m "$SDK")" > local.properties

./gradlew assembleRelease --no-daemon -q

BT="$SDK/build-tools/$(ls "$SDK/build-tools" | sort -V | tail -1)"
mkdir -p dist
"$BT/zipalign.exe" -f -p 4 app/build/outputs/apk/release/app-release-unsigned.apk dist/aligned.apk
PATH="$JAVA_HOME/bin:$PATH" "$BT/apksigner.bat" sign --ks "$KEYSTORE" --ks-key-alias "$ALIAS" \
  --ks-pass "pass:$KEYSTORE_PASSWORD" --key-pass "pass:$KEYSTORE_PASSWORD" \
  --out dist/calendario-astral.apk dist/aligned.apk
rm -f dist/aligned.apk dist/calendario-astral.apk.idsig
PATH="$JAVA_HOME/bin:$PATH" "$BT/apksigner.bat" verify --print-certs dist/calendario-astral.apk | grep -i "SHA-256"
echo "Built android/dist/calendario-astral.apk"
