#!/bin/bash
set -e

echo "=== Step 1: Installing JDK 17 headless and tools ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y openjdk-17-jdk-headless wget unzip

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

echo "Java version:"
java -version

echo "=== Step 2: Setting up Android SDK ==="
export ANDROID_HOME=/opt/android-sdk
mkdir -p $ANDROID_HOME/cmdline-tools

if [ ! -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "Downloading Android Commandline Tools..."
    cd $ANDROID_HOME
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip
    unzip -q cmdline-tools.zip
    rm -rf $ANDROID_HOME/cmdline-tools/latest
    mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest
    rm -f cmdline-tools.zip
fi

export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

echo "Accepting licenses..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true

echo "Installing platforms and build-tools..."
sdkmanager "platforms;android-36" "build-tools;36.0.0" "platforms;android-34" "build-tools;34.0.0"

echo "=== Step 3: Verifying Keystore ==="
if [ ! -f "/app/applet/android/app/nexora-release-key.jks" ]; then
    echo "Generating release keystore..."
    keytool -genkeypair -v -keystore /app/applet/android/app/nexora-release-key.jks -alias nexora -keyalg RSA -keysize 2048 -validity 10000 -storepass nexora2026 -keypass nexora2026 -dname "CN=Nexora Production, OU=Mobile, O=Nexora Inc, L=San Francisco, ST=CA, C=US"
fi

echo "=== Step 4: Running Gradle Release Bundle Build ==="
cd /app/applet/android
chmod +x ./gradlew
./gradlew :app:bundleRelease :app:copyReleaseBundle

echo "=== Step 5: Verifying Output AAB ==="
if [ -f "/app/applet/android/release-bundle/app-release.aab" ]; then
    ls -lh /app/applet/android/release-bundle/app-release.aab
    echo "Verifying signature..."
    jarsigner -verify -verbose -certs /app/applet/android/release-bundle/app-release.aab | tail -n 12
    echo "BUILD_COMPLETE_SUCCESS"
else
    echo "BUILD_FAILED_AAB_MISSING"
    exit 1
fi
