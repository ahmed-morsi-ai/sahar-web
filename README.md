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

## Images and Videos

Product artwork lives in:

```text
public/images/products/
```

Replace the SVG placeholders with final bottle renders. If you switch to PNG files, update the `image` and `gallery` fields in `src/data/products.ts`.

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
3. Keep the default Next.js settings.
4. Deploy.

No external APIs or paid libraries are required.
