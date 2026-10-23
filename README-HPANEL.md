# ServerEmbassy Web - Hostinger hPanel Deployment Guide

This package contains the complete, pre-compiled Next.js production standalone bundle for **Hostinger hPanel**.

---

## 1. Upload to Hostinger

1. Log in to your **Hostinger hPanel**.
2. Go to **Files** -> **File Manager**.
3. Navigate to your target website folder (e.g. `public_html` or your subdomain folder).
4. Upload `serverembassy-web-hpanel.zip`.
5. Right-click and choose **Extract** directly in that folder.

---

## 2. Configure Node.js Application in hPanel

1. In hPanel, navigate to **Advanced** -> **Node.js** (or search "Node.js").
2. Click **Create Application**.
3. Fill in the following details:
   - **Node.js Version**: 20.x or 22.x (Recommended)
   - **Application Root**: `public_html` (or your extracted folder path)
   - **Application URL**: Select your domain or subdomain (e.g. `powerlinedevices.com`)
   - **Application Startup File**: `server.js` (or `index.js`)
4. Click **Create** / **Save**.

---

## 3. Environment Variables

Open the extracted `.env` file in File Manager or add Environment Variables in hPanel:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://beige-stinkbug-901950.hostingersite.com
NEXT_PUBLIC_SITE_URL=https://powerlinedevices.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 4. Start the Application

1. In the Node.js application section, click **Restart Application**.
2. Visit your domain: `https://powerlinedevices.com`

---

All dependencies and static files are pre-packaged into this bundle, so no heavy build commands or node-gyp compilation are required on Hostinger.
