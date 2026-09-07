# Real Beauty Emporium, George – website

Static site, no build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5173 --directory "C:/Users/Max/Downloads/real-beauty-emporium"
```

Then open http://localhost:5173

## Files

```
index.html      the page (copy, sections, team, contact details)
styles.css      all styling
main.js         price-list tabs, reviews, opening-hours status, mobile nav, scroll reveal
data.js         the service menu (RBE_MENU) and reviews (RBE_REVIEWS) – edit prices here
img/            photos (salon shelves, team portraits and nail sets from the salon's Fresha listing; treatment shots from Unsplash)
favicon.svg
_previous-version/   the earlier dark design, kept for reference
```

## Editing prices

Every service lives in `data.js`. Each item looks like:

```js
{"n":"Medium Cut & Blow Dry","d":"1 hr","c":null,"p":{"from":false,"v":300},"o":null,"s":null,"id":"s:14205867","note":null,"desc":null}
```

- `n` name, `d` duration, `c` "3 services" for packages
- `p.v` price in Rand, `p.from` prints "from"
- `o` original price and `s` "Save up to 19%" for packages
- `id` the Fresha service id; the Book link becomes `.../booking?offerItemId=<id>`
- `note` "Female only" etc., `desc` a short factual line under the name

Groups and categories are the outer structure of the same file.

## Where the content came from

- 140 services, prices, durations and package savings: the live Fresha booking menu (September 2026)
- Rating 4.9 from 382 reviews, six review quotes, team names and roles, opening hours, address, coordinates: the Fresha listing
- Tagline "Where beauty meets purpose", Instagram and Facebook links: the salon's Instagram bio and Fresha profile
- Team quote: the salon's own Google Business description

## Things to confirm before going live

1. Email `realearthgeorge@gmail.com` comes from a public listing; confirm it is the one they want shown.
2. The "started out as Real Earth Beauty & Hair Salon" line is inferred from the old listing name, email and Facebook URL. Confirm or remove.
3. Team: Fresha lists Katy, Ahisa, Cara, Gwen and Fallon. Reviews also mention Marcelle (stylist) and Melissa (beauty therapist); add them if they are still on the team.
4. Google reviews: "4,729 Google reviews" in the brief is almost certainly Google's "4,7 ★ · 29 reviews" run together, so the site only quotes the verifiable Fresha figures.
5. Replace the Unsplash treatment photos (hair, barber, facial, massage, makeup) with the salon's own when available. The file names in `img/` say what each one is.
6. Domain and hosting: any static host works (Cloudflare Pages, Netlify, Vercel, Afrihost). Upload the folder as is.

## Deploying to Cloudflare Pages

This repo needs no build step, so the Pages setup is:

1. [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick `saltybagel21/real-beauty-emporium`.
2. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
3. **Save and Deploy.** Cloudflare serves the repo root as-is — `index.html` at the site root, everything else (`styles.css`, `main.js`, `data.js`, `img/`) loaded relative to it.
4. Every push to `main` redeploys automatically. To use a real domain, add it under the Pages project's **Custom domains** tab.
