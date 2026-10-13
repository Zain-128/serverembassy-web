import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Preparing Next.js Web production build for VPS deployment...");

// 1. Run Next.js production build
console.log("📦 Running Next.js build (npm run build)...");
execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });

// 2. Prepare standalone assets inside .next/standalone
const standaloneDir = path.join(projectRoot, ".next", "standalone");
const standaloneNextDir = path.join(standaloneDir, ".next");
const standalonePublicDir = path.join(standaloneDir, "public");
const standaloneStaticDir = path.join(standaloneNextDir, "static");
const sourcePublicDir = path.join(projectRoot, "public");
const sourceStaticDir = path.join(projectRoot, ".next", "static");

if (fs.existsSync(standaloneDir)) {
  console.log("📂 Copying public assets and static files into standalone bundle...");
  if (fs.existsSync(sourcePublicDir)) {
    fs.cpSync(sourcePublicDir, standalonePublicDir, { recursive: true });
  }
  if (fs.existsSync(sourceStaticDir)) {
    fs.mkdirSync(standaloneNextDir, { recursive: true });
    fs.cpSync(sourceStaticDir, standaloneStaticDir, { recursive: true });
  }

  // Create PM2 ecosystem file inside standalone for 1-click start
  const pm2Config = `module.exports = {
  apps: [
    {
      name: "serverembassy-web",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
`;
  fs.writeFileSync(path.join(standaloneDir, "ecosystem.config.js"), pm2Config);
}

// 3. Create Standalone Deployment Zip (Contains server.js, public, .next, ecosystem.config.js)
const standaloneZip = path.join(projectRoot, "serverembassy-web-deploy.zip");
if (fs.existsSync(standaloneZip)) fs.unlinkSync(standaloneZip);

console.log("🤐 Creating Standalone Deployment Package: serverembassy-web-deploy.zip...");
try {
  execSync(`zip -r "${standaloneZip}" .`, {
    cwd: standaloneDir,
    stdio: "inherit",
  });
  console.log(`\n✅ Standalone Package Created: ${standaloneZip}`);
} catch (error) {
  console.error("❌ Failed to create standalone zip:", error);
}

// 4. Create Source Code Zip (Contains src, public, package.json, next.config.ts, tsconfig.json)
const sourceZip = path.join(projectRoot, "serverembassy-web-source.zip");
if (fs.existsSync(sourceZip)) fs.unlinkSync(sourceZip);

console.log("🤐 Creating Source Code Package: serverembassy-web-source.zip...");
try {
  execSync(`zip -r "${sourceZip}" src public package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs`, {
    cwd: projectRoot,
    stdio: "inherit",
  });
  console.log(`\n✅ Source Code Package Created: ${sourceZip}`);
} catch (error) {
  console.error("❌ Failed to create source zip:", error);
}

console.log("\n🎉 ALL VPS PACKAGES CREATED SUCCESSFULLY!");
