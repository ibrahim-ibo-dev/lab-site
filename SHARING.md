# Page-specific link previews

The Lab homepage and all eight experiment URLs each declare their own Open Graph and Twitter preview, including title, description, absolute HTTPS URL, image alt text and a 1200 × 630 JPEG. The original trailing-slash canonical URLs are preserved.

The deployable images are in `public/images/social/`. Each comes from a capture of that actual page. They are separate from the legacy portfolio `og-image.png`; new metadata does not use that generic cover. The production build copies all images to the static `out/images/social/` export.

To refresh an image after a visual change, capture the actual page with browser tooling, then run:

```
node scripts/generate-social-images.mjs <capture-directory>
npm run build
npm run test:seo
```

Use filenames `lab-social-home.png`, `lab-social-illusion.png`, and the equivalent route slug for the other experiments. Capture at a real 1200 × 630 browser viewport, and wait for the canvas to paint before saving. The generator only encodes the complete page capture as JPEG; it adds no frames, labels, artwork or decorative composition. Images are generated before deployment, so they require no server functions or external rendering service.

Social crawlers need the published public HTTPS URLs. They cannot reach localhost or a private preview. Messaging apps may cache a previously shared page; updating metadata and redeploying does not force every app to refresh an existing message instantly.

When changing a published preview later, give the new asset a new versioned filename and update its matching metadata URL. This avoids reusing the old image cache key; the page preview itself may still need the sharing platform's normal cache refresh.
