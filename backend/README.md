# Haya Toolings — Backend API

Node.js + Express + MongoDB API powering the Haya Toolings storefront and admin panel.

## Features

- **Orders** — create / view / update orders (`/api/orders`)
- **Payments** — PayGlocal Simple-Pay button id resolver, return URL handler, and signed webhook receiver (`/api/payments/payglocal/...`)
- **Enquiries** — capture *Quote Request* and *Contact* form submissions (`/api/enquiries`)
- **Admin Panel APIs** — JWT-protected endpoints for orders, transactions, enquiries (`/api/admin/...`)
- **Meta** — country list and runtime config (currencies, exchange rates, PayGlocal button ids)

## Quick start

```bash
cd backend
npm install
cp .env.example .env       # then edit values
npm run seed               # creates the admin user from .env
npm run dev                # starts on http://localhost:5000
```

### MongoDB

Either:
- **Local** — install MongoDB Community and use `mongodb://127.0.0.1:27017/hayatoolings`, **or**
- **Atlas** — create a free cluster at https://cloud.mongodb.com and paste the connection string into `MONGO_URI`.

### Default admin credentials

After running `npm run seed` the credentials from `.env` are used:

```
email: admin@hayatoolings.com
password: Admin@12345
```

Change them in `.env` before re-running the seed in production.

## PayGlocal integration

The frontend embeds the **Simple-Pay button** for the customer's selected
currency:

```html
<form>
  <script src="https://oneclick.payglocal.in/simple.js" data-pb-id="pb_91zEg1FlHbzd"></script>
</form>
```

`pb_91zEg1FlHbzd` (USD) and `pb_F8ErdVORsXTK` (EUR) are configured via the
`PAYGLOCAL_USD_PB_ID` / `PAYGLOCAL_EUR_PB_ID` env vars and exposed to the
frontend via `GET /api/meta/config`.

### Flow

1. `POST /api/orders` creates a `pending` order and a `pending` transaction.
2. The frontend renders the PayGlocal button — clicking it opens the PayGlocal
   hosted page where the customer pays.
3. PayGlocal redirects the customer back. There are three supported paths:
   - **GET return URL** (configure on the PayGlocal dashboard):
     `https://<your-backend>/api/payments/payglocal/return?orderId=...&status=...&gid=...`
     — backend updates the order and 302-redirects to
     `${FRONTEND_URL}/order/<orderId>?status=...`.
   - **JWS token return**: if PayGlocal redirects with `?token=<JWS>` we verify
     the signature with PayGlocal's RSA public key
     (`backend/keys/payglocal_public.pem`) before applying the status.
   - **Soft signal**: if no GET redirect is configured, the storefront's
     `/order/:orderId` page calls `POST /api/payments/payglocal/return` to mark
     the order as `pending` (until manually reconciled).
4. **Webhook** (optional, recommended once available):
   `POST /api/payments/payglocal/webhook` accepts server-to-server
   notifications. Signature validation is automatic:
   - HMAC if `PAYGLOCAL_WEBHOOK_SECRET` is set, header
     `x-payglocal-signature`.
   - RSA-SHA256 against PayGlocal's public key if header
     `x-payglocal-rsa-signature` is present.
   - If neither is configured, the body is accepted as-is (dev mode).

### Reconciliation when no webhook is available

If you don't yet have a webhook secret or API key (your current setup), the
admin panel's **Transactions** page is the source of truth:

1. Place a test order on the storefront (USD or EUR).
2. The transaction appears as **pending** in `/admin/transactions`.
3. After confirming the payment in your PayGlocal dashboard, mark the
   transaction **success** (or **failed**) from the admin panel — the order's
   `paymentStatus` is synced automatically.

### Server-to-server payment initiation (future)

For full PayCollect / PayDirect server-side initiation, populate
`PAYGLOCAL_API_KEY` / `PAYGLOCAL_MERCHANT_ID` and extend `routes/payments.js`
using PayGlocal's docs:
https://developer.payglocal.in/reference/payment-initiation-guide

## API surface

| Method | Path                                  | Auth   | Purpose                              |
| ------ | ------------------------------------- | ------ | ------------------------------------ |
| GET    | `/api/health`                         | public | health check                         |
| GET    | `/api/meta/countries`                 | public | full ISO-3166 country list           |
| GET    | `/api/meta/config`                    | public | currencies, rates, payglocal pb ids  |
| POST   | `/api/orders`                         | public | create order                         |
| GET    | `/api/orders/:orderId`                | public | track order (lightweight)            |
| GET    | `/api/payments/payglocal/button`      | public | resolve button id by currency        |
| GET    | `/api/payments/payglocal/return`      | public | redirect target from PayGlocal hosted page |
| POST   | `/api/payments/payglocal/return`      | public | post-redirect status update          |
| POST   | `/api/payments/payglocal/webhook`     | public + HMAC | server-to-server status update |
| POST   | `/api/enquiries`                      | public | submit quote / contact form          |
| POST   | `/api/admin/login`                    | public | admin login → JWT                    |
| GET    | `/api/admin/me`                       | admin  | current admin                        |
| GET    | `/api/admin/stats`                    | admin  | dashboard counters                   |
| GET    | `/api/admin/orders`                   | admin  | list orders                          |
| GET    | `/api/admin/orders/:orderId`          | admin  | order + linked transactions          |
| PATCH  | `/api/admin/orders/:orderId`          | admin  | update orderStatus/paymentStatus     |
| GET    | `/api/admin/transactions`             | admin  | list transactions                    |
| PATCH  | `/api/admin/transactions/:txnId`      | admin  | update txn status (also syncs order) |
| GET    | `/api/admin/enquiries`                | admin  | list enquiries                       |
| PATCH  | `/api/admin/enquiries/:id`            | admin  | update enquiry status                |

## Testing the payment flow without a real PayGlocal account

1. Start the backend and frontend.
2. Add items to cart → checkout → choose USD/EUR → place the order.
3. The order appears in the admin panel as **pending**.
4. From the admin **Transactions** page, mark the transaction as **success**
   or **failed** — the order's payment status is synced automatically. This
   replicates what the webhook will eventually do.
