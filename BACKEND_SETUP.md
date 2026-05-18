# Sahar Backend Setup

## Install

```bash
npm install
npm install prisma@6 @prisma/client@6 next-auth bcrypt zod
npm install -D @types/bcrypt tsx
```

## Environment

Create `.env` from `.env.example` and set real values:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-with-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@sahar.com"
ADMIN_PASSWORD="change-this-password"
NEXT_PUBLIC_WHATSAPP_NUMBER="201017082286"
```

Generate a strong auth secret:

```bash
openssl rand -base64 32
```

## Local SQLite

No PostgreSQL install is required for local development. Prisma creates `prisma/dev.db` automatically from:

```env
DATABASE_URL="file:./dev.db"
```

## Prisma

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run db:studio
```

The seed reads `ADMIN_EMAIL` and `ADMIN_PASSWORD`, hashes the password with bcrypt, creates or updates the admin user, and seeds the current product data.

## Run

```bash
npm run dev
```

Open:

- Store: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Orders: `http://localhost:3000/admin/orders`

If Next.js starts on another port, update `NEXTAUTH_URL` in `.env` to that exact origin and restart `npm run dev`.

## Test Order Flow

1. Add a product to the cart.
2. Open checkout.
3. Fill name, phone, city, address, and payment method.
4. Submit the order.
5. Confirm that the app redirects to `/order-success?orderNumber=...`.
6. Confirm that WhatsApp opens with the saved order number and order details.
7. Login to `/admin/login`.
8. Confirm the new order appears in dashboard and orders.
9. Open the order detail page and update status.
10. Cancel the order if needed.

## Change Admin Credentials

Update `.env`:

```env
ADMIN_EMAIL="new-admin@sahar.com"
ADMIN_PASSWORD="new-secure-password"
```

Then run:

```bash
npm run db:seed
```

## Change WhatsApp Number

Update:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER="201017082286"
```

Use international format without `+`.

## Deploy To Vercel

1. For the simplest deployment, use a managed SQLite-compatible provider or switch the Prisma datasource back to PostgreSQL before deploying to a PostgreSQL host.
2. Add the production `DATABASE_URL` in Vercel Project Settings.
3. Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel Project Settings.
4. Set `NEXTAUTH_URL` to the production domain, for example `https://sahar.com`.
5. Run migrations against production:

```bash
npx prisma migrate deploy
```

6. Seed the admin user against production:

```bash
npm run db:seed
```

7. Deploy:

```bash
vercel --prod
```

For Vercel build settings, keep the build command as:

```bash
npm run build
```

## Backend Files

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/prisma.ts`
- `src/lib/auth.ts`
- `src/lib/actions/orders.ts`
- `src/lib/actions/admin.ts`
- `src/lib/validations/order.ts`
- `src/lib/order-number.ts`
- `src/lib/money.ts`
- `src/lib/whatsapp.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/orders/route.ts`
- `src/app/api/admin/orders/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/api/admin/dashboard/route.ts`
- `src/app/admin/*`
- `src/components/admin/*`
- `middleware.ts`
