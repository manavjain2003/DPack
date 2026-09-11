# Dpack — Redesigned Website (Next.js)

A multi-page redesign of dpackshop.com with real content extracted from the
live site (homepage, /collections/all, /pages/contact) and real product
photos (several sourced directly from dpackshop.com).

## Pages

| Route         | Content                                                        |
| ------------- | -------------------------------------------------------------- |
| `/`           | Hero (real headline), marquee, featured products, why-us, stats, CTA |
| `/products`   | Full catalogue with animated category filter (9 products, real specs & sizes) |
| `/about`      | Real "official online store of Dpack" story, values, gallery   |
| `/contact`    | Real email (info@dpacksolutions.com), same-day dispatch + 7–10 day delivery info, enquiry form |

## Design system

- `ink` `#0D1B2A` · `rust` `#E2591B` · `kraft` `#C99049` · `cream` `#FAF6EF`
- Sora (display) + Inter (body) via `next/font`

## Animations

Staggered hero entrance + SVG underline draw, mouse-parallax hero panel,
floating chips, infinite marquee, scroll-triggered reveals everywhere,
product-card hover lift, animated category filter pill (shared layout
animation), stat counters, blur-on-scroll navbar, animated mobile menu.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy

```bash
npx vercel    # no env vars needed
```

or push to GitHub → import at vercel.com/new.

## Notes

- The contact form opens the visitor's email client via `mailto:` — connect
  Formspree/Resend later for direct submissions.
- Product photos live in `public/images/` — replace with your own CDN or
  Shopify image URLs anytime.
- Extend the catalogue in `lib/products.js` (air pump, e-commerce pouches,
  ratchet belts etc. can be added the same way).
