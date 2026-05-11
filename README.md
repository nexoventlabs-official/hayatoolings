# Haya Toolings

A full-stack storefront for Haya Toolings with global checkout (INR / USD / EUR
via PayGlocal), an admin panel for managing orders, transactions and enquiries,
and a Node.js + MongoDB backend.

## Project layout

```
.
├── backend/          # Node.js + Express + MongoDB API (see backend/README.md)
└── src/              # React + Vite storefront and /admin panel
```

## Quick start

In two terminals:

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env       # edit MONGO_URI etc.
npm run seed               # creates the admin user
npm run dev                # http://localhost:5000

# Terminal 2 — frontend
npm install
npm run dev                # http://localhost:5173
```

Optional: copy `.env.example` to `.env` at the repo root if you need to point
the frontend at a non-default backend URL via `VITE_API_BASE`.

## Routes

### Storefront

- `/` — home
- `/products`, `/product/:id`
- `/quote`, `/contact`
- `/checkout` — global shipping form (full ISO-3166 country list) + PayGlocal payment
- `/order/:orderId` — confirmation page (also the return target from PayGlocal)
- `/track?id=ORD-...` — order tracking

### Admin panel

- `/admin/login`
- `/admin` — dashboard (revenue, transaction counters)
- `/admin/orders` & `/admin/orders/:orderId`
- `/admin/transactions` — pending / success / failed / refunded / cancelled
- `/admin/enquiries`

Default admin credentials (from `backend/.env`):
`admin@hayatoolings.com` / `Admin@12345` — change before deploying.

## Currencies

A header switcher lets the user toggle between **INR / USD / EUR**. Product
prices in `src/data/products.json` are stored in INR; conversion rates are
read from the backend (`/api/meta/config`, configurable via
`INR_TO_USD` and `INR_TO_EUR`).

## PayGlocal

USD and EUR checkout uses the PayGlocal Simple-Pay buttons:

```html
<form><script src="https://oneclick.payglocal.in/simple.js" data-pb-id="pb_91zEg1FlHbzd"></script></form>
<form><script src="https://oneclick.payglocal.in/simple.js" data-pb-id="pb_F8ErdVORsXTK"></script></form>
```

See `backend/README.md` for the full payment flow, return-URL handling, and
webhook signature validation.
