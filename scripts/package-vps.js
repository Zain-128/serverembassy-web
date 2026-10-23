import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Preparing Next.js Web production build for VPS deployment...");

// 1. Run Next.js production build
console.log("📦 Running Next.js build (npx next build)...");
const nodeBin = path.join(projectRoot, "node_modules", ".bin");
const execEnv = {
  ...process.env,
  PATH: `${nodeBin}:${process.env.PATH || "/usr/local/bin:/usr/bin:/bin"}`,
};
execSync("npx next build", { cwd: projectRoot, stdio: "inherit", env: execEnv });

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
  // Copy .env.local to standalone bundle as .env and .env.production
  const envLocal = path.join(projectRoot, ".env.local");
  if (fs.existsSync(envLocal)) {
    fs.copyFileSync(envLocal, path.join(standaloneDir, ".env"));
    fs.copyFileSync(envLocal, path.join(standaloneDir, ".env.production"));
  }

  // Include .htaccess for Apache / LiteSpeed / cPanel proxy to port 3000
  const htaccessContent = `# Next.js Proxy for Apache / LiteSpeed / cPanel
DirectoryIndex disabled
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP:Upgrade} =websocket [NC]
  RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>
`;
  fs.writeFileSync(path.join(standaloneDir, ".htaccess"), htaccessContent);
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
