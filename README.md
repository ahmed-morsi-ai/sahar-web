# Sahar Luxury Perfume E-commerce

Complete Next.js App Router storefront for `Sahar | سهر | Essence of Night`.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Database

This project uses Prisma with PostgreSQL for local, preview, and production consistency.

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

For Vercel production, set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, then run:

```bash
npm run db:deploy
npm run db:seed
```

## Images and Videos

Product artwork lives in:

```text
public/images/products/
```

The storefront uses a safe media resolver: product images fall back through optimized variants and then `/images/products/product-placeholder.svg`.

Campaign videos should go in:

```text
public/videos/
```

Then pass paths such as `/videos/first-spray.mp4` to `VideoCard` in `src/app/page.tsx`.

## Customize Products

Edit:

```text
src/data/products.ts
```

Each product includes slug, price, notes, category filters, sizes, gallery, rating, longevity, projection, occasion, gender, and product copy.

## Change WhatsApp Number

Edit:

```text
src/lib/whatsapp.ts
```

Set `whatsappNumber` in international format without `+`. The current value is `201017082286`.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the production environment variables in Vercel.
4. Run `npm run db:deploy` against production before the first live deploy.
5. Deploy.
