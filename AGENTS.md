# Project verification

- Run `npm run build && npm run test:seo` after changing page metadata, routes, homepage links, or the sitemap. The SEO tests inspect exported HTML and sitemap output in `out`, so build first.
- This project uses Next.js static export with `trailingSlash: true`. Experiment canonical URLs, sitemap entries, and links must end in `/` to avoid redirecting discovery URLs.
- Experiment pages are client components. Their sibling server `layout.tsx` files provide page-specific metadata.
- `out/` is tracked in Git. A production build regenerates those deployment artifacts; review them when preparing a release.
