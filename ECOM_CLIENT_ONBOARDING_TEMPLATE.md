# E-Commerce Project Onboarding & Requirements Specification

> **Instructions for the Client:**  
> Please fill out this document as thoroughly as possible. The information you provide will be directly used to set up your store's branding, product catalog, payment processing, tax rules, shipping workflows, legal policies, and hosting environment.  
> *If a section does not apply to your business, simply write "N/A" (Not Applicable).*

---

## 1. General Business & Store Identity

| Field | Client Response |
| :--- | :--- |
| **Official Business / Legal Name** | *[ e.g. Power Line Devices LLC ]* |
| **Store / Brand Display Name (DBA)** | *[ e.g. Power Line Devices ]* |
| **Company Registration State & Country** | *[ e.g. Florida, United States ]* |
| **Primary Website Domain(s)** | *[ e.g. https://powerlinedevices.com ]* |
| **Store Tagline / Slogan** | *[ e.g. Enterprise IT Hardware — Tested & Certified ]* |
| **Year Established / Founded** | *[ e.g. 2024 ]* |
| **Physical / Registered Address** | *[ e.g. 1317 Edgewater Dr Suite #6089, Orlando, FL 32804 ]* |
| **Customer Support Phone Number** | *[ e.g. (321) 788-5899 ]* |
| **Customer Support Email** | *[ e.g. info@powerlinedevices.com / support@... ]* |
| **Orders / Sales Inquiries Email** | *[ e.g. sales@powerlinedevices.com ]* |
| **Business Hours & Timezone** | *[ e.g. Mon–Fri: 9:00 AM – 6:00 PM EST ]* |

---

## 2. Branding, Design & Social Media

### 2.1 Brand Assets
- [ ] **Logo Files Provided:** (Please share Google Drive / Dropbox link with SVG / PNG / Vector formats)
  - Primary Logo (Transparent background): `[ Link / Attached ]`
  - Dark Theme / Inverted Logo: `[ Link / Attached ]`
  - Favicon (Square icon for browser tabs, 32x32 or 512x512): `[ Link / Attached ]`
- [ ] **Brand Colors:**
  - Primary Brand Color (HEX): `[ e.g. #0066FF ]`
  - Secondary / Accent Color (HEX): `[ e.g. #0B1220 ]`
  - Background Preference: `[ ] Dark Mode by default` / `[ ] Light Mode by default` / `[ ] User toggleable switch`
- [ ] **Typography / Font preference:** `[ e.g. Inter, Plus Jakarta Sans, Custom font ]`

### 2.2 Social Media Profiles
| Platform | Profile URL |
| :--- | :--- |
| **Facebook** | `[ e.g. https://www.facebook.com/YourBrand/ ]` |
| **Instagram** | `[ e.g. https://www.instagram.com/YourBrand/ ]` |
| **LinkedIn** | `[ e.g. https://www.linkedin.com/company/YourBrand/ ]` |
| **X / Twitter** | `[ URL or N/A ]` |
| **YouTube / TikTok** | `[ URL or N/A ]` |

---

## 3. Product Catalog & Inventory Setup

### 3.1 Product Types & Scale
- **Primary Product Type:**
  - [ ] Physical Products (Hardware, Electronics, Apparel, etc.)
  - [ ] Digital / Downloadable Goods
  - [ ] Services / Subscriptions
- **Initial Catalog Size:** `[ e.g. 50 products / 500 products / 10,000+ SKUs ]`
- **Product Condition Types Sold:**
  - [ ] Brand New Factory Sealed
  - [ ] Certified Refurbished
  - [ ] Used / Tested / Open Box
- **Warranty Offerings:** `[ e.g. Standard 30-day replacement, 1-year OEM, 90-day extended ]`

### 3.2 Product Data & Media
- **How will product data be provided?**
  - [ ] CSV / Excel Spreadsheet (Columns: SKU, Title, Price, Description, Stock, Images, Category)
  - [ ] Migration from existing platform (Shopify, WooCommerce, Magento)
  - [ ] Direct API / ERP Sync
- **Product Images:**
  - [ ] Cloud storage link (Drive / S3 / Dropbox)
  - [ ] Direct image URLs inside CSV
- **Price Range:** Lowest item: `$ [       ]` | Highest ticket item: `$ [       ]`

---

## 4. Payment Gateways & Checkout Configuration

### 4.1 Payment Methods Accepted
- [ ] **Stripe (Credit / Debit Cards):**
  - Supported: Visa, MasterCard, American Express, Discover
  - *Stripe Publishable Key:* `[ pk_live_... or provide via secure channel ]`
  - *Stripe Secret Key:* `[ sk_live_... or provide via secure channel ]`
  - *Stripe Webhook Secret:* `[ whsec_... ]`
  - Payment Capture: `[ ] Immediate Charge (Capture)` / `[ ] Authorize only (Manual capture on fulfillment)`
- [ ] **B2B Bank Wire / ACH Transfer:**
  - Instructions displayed on checkout / invoice:
    - Bank Name: `[                             ]`
    - Account Name: `[                             ]`
    - Routing / ABA Number: `[                             ]`
    - Account Number: `[                             ]`
    - SWIFT / BIC Code (for International Wire): `[                             ]`
- [ ] **Alternative Payment Methods (Optional):**
  - [ ] PayPal Express
  - [ ] Apple Pay / Google Pay (via Stripe Elements)
  - [ ] Purchase Orders (PO) / Net 30 Terms
  - [ ] Cash on Delivery (COD) — *[ Recommended: NO for high-ticket IT/hardware ]*

### 4.2 Currency & Sales Tax
- **Primary Store Currency:** `[ e.g. USD ($) ]`
- **Sales Tax Strategy:**
  - [ ] Automated Tax calculation via Stripe Tax / TaxJar / Avalara
  - [ ] Flat percentage for specific state: `[ State:        | Rate:        % ]`
  - [ ] Prices displayed inclusive of tax / exclusive of tax
- **B2B Tax Exemption:**
  - Do you offer tax-exempt status for registered resellers/enterprises? `[ Yes / No ]`
  - *Requirement:* Customers must upload a valid State Resale Certificate.

---

## 5. Shipping, Fulfillment & Delivery

### 5.1 Shipping Strategy
- **Warehouse / Shipping Origin Location:**
  - City, State, ZIP: `[ e.g. Orlando, FL 32804, USA ]`
- **Order Cutoff Time for Same-Day Handling:** `[ e.g. 2:00 PM EST ]`
- **Standard Order Processing Time:** `[ e.g. 1–2 Business Days ]`

### 5.2 Shipping Methods & Pricing
| Shipping Tier | Carrier | Typical Delivery Window | Customer Cost |
| :--- | :--- | :--- | :--- |
| **Standard Ground** | *[ FedEx / UPS / USPS ]* | *[ 3–5 Business Days ]* | *[ $ e.g. $14.99 or Free ]* |
| **Expedited Air** | *[ 2-Day Air ]* | *[ 2 Business Days ]* | *[ $ e.g. $39.00 ]* |
| **Overnight Next-Day** | *[ Priority Overnight ]* | *[ 1 Business Day ]* | *[ $ e.g. $75.00 ]* |
| **Freight / LTL Pallet** | *[ Freight Carrier ]* | *[ 3–7 Days ]* | *[ Quoted at checkout / Custom ]* |

- **Free Shipping Threshold:** `[ e.g. Free Ground Shipping on orders over $199 ]`
- **International Shipping:**
  - Do you ship internationally? `[ Yes / No ]`
  - Customs Terms: `[ ] DAP (Customer pays duties/taxes) ` / `[ ] DDP (Taxes prepaid at checkout)`

---

## 6. Enterprise / B2B Features & RFQ (Quotes)

- [ ] **Request for Quote (RFQ) / Bulk Inquiry Form:**
  - Enabled on Product Details pages for bulk enterprise buyers? `[ Yes / No ]`
  - Quote response commitment time: `[ e.g. Within 1–2 business hours during Mon–Fri ]`
  - Where should quote requests be routed? `[ Email:                              ]`
- [ ] **Minimum Order Quantities (MOQ):** `[ e.g. No MOQ / MOQ of 5 units on specific servers ]`
- [ ] **Tiered Volume Pricing:** `[ e.g. 5–10 units: 5% off | 10+ units: 10% off ]`

---

## 7. Legal Policies & Compliance Content

*Please provide your official policy wording or specify if you want us to draft standard compliance policies under your governing jurisdiction:*

1. **Governing Law Jurisdiction:**
   - State & Country: `[ e.g. State of Florida, United States ]`
2. **Return & Refund Policy:**
   - Return Window: `[ e.g. 30 calendar days from delivery date ]`
   - RMA Required before returning? `[ Yes / No ]`
   - Restocking Fee on remorse/non-defective returns: `[ e.g. 15% / Zero ]`
   - Return shipping paid by: `[ Customer (for buyer remorse) / Merchant (for defective items) ]`
3. **Warranty Terms:**
   - `[ e.g. 30-Day Hardware Replacement Warranty by Merchant + OEM Warranty where applicable ]`
4. **Privacy Policy (Data Protection):**
   - Compliance required: `[ ] US State Laws (CCPA, etc.)` / `[ ] GDPR (Europe)` / `[ ] Standard US`
5. **Account Deletion:**
   - Under privacy rights, do you permit customers to delete their profile and personal data? `[ Yes / No ]`

---

## 8. Customer Accounts, Communications & Marketing

- **Checkout Accessibility:**
  - [ ] Guest Checkout Allowed (No account required)
  - [ ] Account Creation Required
  - [ ] Optional account creation during checkout
- **Transactional Emails Required:**
  - [x] Order Confirmation Receipt
  - [x] Payment Succeeded / Failed notification
  - [x] Shipping Confirmation with Tracking Number
  - [x] Quote Request Confirmation
- **Email Service Provider (ESP) Preference:**
  - [ ] Built-in SMTP (Hostinger / cPanel / SendGrid / Postmark / Amazon SES)
  - *SMTP Host:* `[                             ]`
  - *SMTP Port:* `[ 465 / 587 ]`
  - *SMTP Username:* `[                             ]`
  - *SMTP Password:* `[ Provide securely ]`
- **Newsletter / Marketing Integration:**
  - [ ] Klaviyo / Mailchimp / Brevo / Internal database

---

## 9. Hosting, Domain & Technical Infrastructure

### 9.1 Domain & DNS
- **Domain Registrar:** `[ e.g. GoDaddy, Namecheap, Cloudflare, Google Domains ]`
- **DNS Managed by:** `[ e.g. Cloudflare / Registrar default ]`
- **SSL / HTTPS Certificate:** `[ e.g. Auto Let's Encrypt / Cloudflare SSL ]`

### 9.2 Hosting Platform Preference
- [ ] **Hostinger hPanel (LiteSpeed / Node.js Application Manager)**
- [ ] **Vercel (Frontend) + Cloud VPS / Hostinger (Backend API)**
- [ ] **Dedicated Cloud VPS (DigitalOcean / AWS / Ubuntu + PM2 + Nginx)**
- [ ] **cPanel with Node.js Selector**

### 9.3 Database & Storage
- **MongoDB Database:**
  - [ ] MongoDB Atlas Cloud (Recommended for high availability)
  - [ ] Self-hosted MongoDB on VPS
  - *Connection URI:* `[ mongodb+srv://... or to be created by dev team ]`

### 9.4 Admin Panel & Staff Access
- **Primary Super Admin Email:** `[ e.g. admin@yourdomain.com ]`
- **Number of Staff Members requiring admin access:** `[        ]`
- **Admin Permission Tiers needed:**
  - [x] Order Management & Tracking Update
  - [x] Product Catalog & Inventory Editing
  - [x] Quote Approvals
  - [x] Coupon Code Management
  - [x] Customer Tax-Exempt Verification

---

## 10. Analytics, SEO & Third-Party Integrations

| Service | Account ID / Measurement ID |
| :--- | :--- |
| **Google Analytics 4 (GA4)** | `[ e.g. G-XXXXXXXXXX ]` |
| **Google Tag Manager (GTM)** | `[ e.g. GTM-XXXXXXX or N/A ]` |
| **Google Search Console** | `[ Domain verification method or N/A ]` |
| **Google Merchant Center (Shopping Feed)**| `[ ID or N/A ]` |
| **Meta / Facebook Pixel** | `[ ID or N/A ]` |
| **Live Chat / Customer Desk Widget** | `[ e.g. Tidio, Crisp, Intercom, Zendesk, WhatsApp ]` |

---

## 11. Additional Special Requirements or Notes

> Please list any custom requirements, third-party ERP integrations, specific checkout questions, or design preferences below:

```text
[ Write your additional notes here... ]
```

---

### Acceptance & Submission
- **Prepared By / Client Representative:** `[ Name & Title ]`
- **Date Submitted:** `[ DD / MM / YYYY ]`
- **Target Launch Date:** `[ DD / MM / YYYY ]`
