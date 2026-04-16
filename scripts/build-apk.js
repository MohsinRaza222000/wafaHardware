const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Get Local IP Address automatically
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '192.168.1.21'; // fallback
}

const currentIP = getLocalIP();
console.log(`\n🚀 [1/3] Detected Local IP: ${currentIP}`);

// 2. Automatically update src/config/api.js with the correct IP
const apiConfigPath = path.join(__dirname, '../src/config/api.js');
if (fs.existsSync(apiConfigPath)) {
    let apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
    // Finds any BASE_URL containing an IP or localhost and replaces it with the new IP
    apiConfig = apiConfig.replace(/(?<=BASE_URL\s*=\s*['"`])http:\/\/(localhost|[\d.]+):5000(?=['"`])/g, `http://${currentIP}:5000`);
    fs.writeFileSync(apiConfigPath, apiConfig, 'utf8');
    console.log(`✅ [2/3] Updated src/config/api.js with BASE_URL = http://${currentIP}:5000`);
} else {
    console.warn(`⚠️ src/config/api.js not found! Skipped IP injection.`);
}

// 3. Clean and Rebuild APK properly
console.log('\n🧹 [3/3] Cleaning Old Android Build to clear React Native JS Bundle Cache...');
try {
    execSync('cd android && gradlew clean', { stdio: 'inherit', shell: true });
    
    console.log('\n📦 Building New Release APK. Please wait...\n');
    execSync('cd android && gradlew assembleRelease', { stdio: 'inherit', shell: true });
    
    console.log('\n🎉 SUCCESS! Your new APK is ready at:');
    console.log('   android/app/build/outputs/apk/release/app-release.apk\n');
} catch (e) {
    console.error('\n❌ Build Failed!', e.message);
    process.exit(1);
}
