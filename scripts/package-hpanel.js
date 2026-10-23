import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Preparing Next.js Web package for Hostinger hPanel deployment...");

const standaloneDir = path.join(projectRoot, ".next", "standalone");
const standaloneNextDir = path.join(standaloneDir, ".next");
const standalonePublicDir = path.join(standaloneDir, "public");
const standaloneStaticDir = path.join(standaloneNextDir, "static");
const sourcePublicDir = path.join(projectRoot, "public");
const sourceStaticDir = path.join(projectRoot, ".next", "static");

// 1. Build if standalone does not exist
if (!fs.existsSync(standaloneDir)) {
  console.log("📦 Standalone build not found. Running Next.js build (npx next build)...");
  const nodeBin = path.join(projectRoot, "node_modules", ".bin");
  const execEnv = {
    ...process.env,
    PATH: `${nodeBin}:${process.env.PATH || "/usr/local/bin:/usr/bin:/bin"}`,
  };
  execSync("npx next build", { cwd: projectRoot, stdio: "inherit", env: execEnv });
} else {
  console.log("✅ Using existing production build in .next/standalone...");
}

// 2. Sync public assets and static files
console.log("📂 Copying public assets and static files into standalone bundle...");
if (fs.existsSync(sourcePublicDir)) {
  fs.cpSync(sourcePublicDir, standalonePublicDir, { recursive: true });
}
if (fs.existsSync(sourceStaticDir)) {
  fs.mkdirSync(standaloneNextDir, { recursive: true });
  fs.cpSync(sourceStaticDir, standaloneStaticDir, { recursive: true });
}

// 3. Create index.js wrapper for Hostinger hPanel
const indexJs = `// Hostinger hPanel Node.js Application Startup File
// You can select either "server.js" or "index.js" as the startup file in hPanel
require('./server.js');
`;
fs.writeFileSync(path.join(standaloneDir, "index.js"), indexJs);

// 4. Create .htaccess for LiteSpeed / Apache reverse proxy
const htaccessContent = `# Hostinger hPanel Next.js Deployment Config
DirectoryIndex disabled
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_URI} ^/\\.well-known/ [NC]
  RewriteRule ^ - [L]

  RewriteCond %{HTTP:Upgrade} =websocket [NC]
  RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>
`;
fs.writeFileSync(path.join(standaloneDir, ".htaccess"), htaccessContent);

// 5. Copy .env.local as .env and .env.production
const envLocal = path.join(projectRoot, ".env.local");
if (fs.existsSync(envLocal)) {
  fs.copyFileSync(envLocal, path.join(standaloneDir, ".env"));
  fs.copyFileSync(envLocal, path.join(standaloneDir, ".env.production"));
}

// 6. Create README-HPANEL.md inside bundle
const readmeHpanel = `# ServerEmbassy Web - Hostinger hPanel Deployment Guide

This package contains the complete, pre-compiled Next.js production standalone bundle for **Hostinger hPanel**.

---

## 1. Upload to Hostinger

1. Log in to your **Hostinger hPanel**.
2. Go to **Files** -> **File Manager**.
3. Navigate to your target website folder (e.g. \`public_html\` or your subdomain folder).
4. Upload \`serverembassy-web-hpanel.zip\`.
5. Right-click and choose **Extract** directly in that folder.

---

## 2. Configure Node.js Application in hPanel

1. In hPanel, navigate to **Advanced** -> **Node.js** (or search "Node.js").
2. Click **Create Application**.
3. Fill in the following details:
   - **Node.js Version**: 20.x or 22.x (Recommended)
   - **Application Root**: \`public_html\` (or your extracted folder path)
   - **Application URL**: Select your domain or subdomain (e.g. \`powerlinedevices.com\`)
   - **Application Startup File**: \`server.js\` (or \`index.js\`)
4. Click **Create** / **Save**.

---

## 3. Environment Variables

Open the extracted \`.env\` file in File Manager or add Environment Variables in hPanel:
\`\`\`env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://beige-stinkbug-901950.hostingersite.com
NEXT_PUBLIC_SITE_URL=https://powerlinedevices.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
\`\`\`

---

## 4. Start the Application

1. In the Node.js application section, click **Restart Application**.
2. Visit your domain: \`https://powerlinedevices.com\`

---

All dependencies and static files are pre-packaged into this bundle, so no heavy build commands or node-gyp compilation are required on Hostinger.
`;

fs.writeFileSync(path.join(standaloneDir, "README-HPANEL.md"), readmeHpanel);
fs.writeFileSync(path.join(projectRoot, "README-HPANEL.md"), readmeHpanel);

// 7. Create output zip
const hpanelZip = path.join(projectRoot, "serverembassy-web-hpanel.zip");
if (fs.existsSync(hpanelZip)) {
  fs.unlinkSync(hpanelZip);
}

console.log("🤐 Archiving standalone bundle into serverembassy-web-hpanel.zip...");
try {
  execSync(`zip -r "${hpanelZip}" .`, {
    cwd: standaloneDir,
    stdio: "inherit",
  });
  const stats = fs.statSync(hpanelZip);
  console.log("\n✅ SUCCESS: Hostinger hPanel Web package created successfully!");
  console.log(`📁 Zip Package: ${hpanelZip}`);
  console.log(`📏 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} catch (error) {
  console.error("❌ Failed to create hPanel zip:", error);
  process.exit(1);
}
