# 🛒 eCommerce Checkout Flow Simulation

This project simulates a mini eCommerce checkout flow using **Next.js 15** and **Stripe**, with backend logic handled in the same application. It includes a landing page, checkout form with dynamic order summary, transaction simulation (success/failure/error), and a thank you page. Email notifications are sent via **Mailtrap.io**.

## 🚀 Features

- Landing Page with Product Info
- Checkout Page with Validation
- Stripe Payment Simulation
- Order Summary & Inventory Update
- Transaction Status (Approved / Declined / Gateway Failure)
- Thank You Page with Order Details
- Confirmation Email via Mailtrap (Success & Failure)

---

## 🧰 Tech Stack

- **Frontend**: Next.js 15 (App Router, Server Actions)
- **Backend**: API routes within Next.js
- **Database**: MongoDB
- **Payments**: Stripe (mocked/simulated)
- **Emails**: Mailtrap.io (sandbox mode)

---

## 📄 Pages & Flow

### 1. Landing Page

- Product image, title, description, price
- Variant and quantity selectors
- "Buy Now" button → navigates to checkout with product data

### 2. Checkout Page

- Customer Info (name, email, phone, address)
- Credit card inputs with validation (format, future expiry, etc.)
- Real-time order summary with variant & quantity
- On submission:
  - Data saved to DB
  - Inventory updated
  - Stripe simulation
  - Confirmation email sent via Mailtrap
  - Redirect to Thank You page

### 3. Thank You Page

- Displays order number, order details, customer info
- Fetches from DB (not browser storage)

---

## ✉️ Email Integration (Mailtrap)

Emails are sent using **Mailtrap.io** (SMTP sandbox):

- **Approved Email**: includes order summary and thank-you message
- **Failed/Declined Email**: includes failure notice and retry suggestion

Set up your `.env.local`:

```env
NEXT_MONGO_URI="your-mongodb-connection-url"
NEXT_MAILTRAP_USER="your-mailtrap-username"
NEXT_MAILTRAP_PASS="your-mailtrap-password"
NEXT_STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-public-key"
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_EMAIL_FROM='"Shop Support" <add-your-email>'
```

## ⚙️ Setup

```bash
git clone https://github.com/sachinjain45/ecommerce-checkout-flow.git
cd ecommerce-checkout-flow
npm install
npm run dev && npm run seed
```
