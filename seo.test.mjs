import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";

const root = new URL("./", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const site = "https://lab.ibrahim-eng.dev";
const slugs = readdirSync(new URL("src/app/", root), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(new URL(`src/app/${entry.name}/page.tsx`, root)))
  .map((entry) => entry.name);
const sitemap = read("out/sitemap.xml");
const home = read("out/index.html");
const titles = new Set([home.match(/<title>(.*?)<\/title>/)?.[1]]);
const descriptions = new Set([home.match(/<meta name="description" content="([^"]*)"/)?.[1]]);
const socialHashes = new Set();

function assertSocialImage(html, slug) {
  const path = `/images/social/lab-${slug}-2026-10.jpg`;
  const expected = `${site}${path}`;
  assert.deepEqual([...html.matchAll(/<meta property="og:image" content="([^"]*)"/g)].map(m => m[1]), [expected]);
  assert.deepEqual([...html.matchAll(/<meta name="twitter:image" content="([^"]*)"/g)].map(m => m[1]), [expected]);
  assert.ok(html.includes('<meta property="og:image:width" content="1200"'));
  assert.ok(html.includes('<meta property="og:image:height" content="630"'));
  assert.ok(html.includes('<meta property="og:image:alt" content="'));
  const exported = new URL(`out${path}`, root);
  assert.ok(existsSync(exported), `Social image must be in the deployable export: ${path}`);
  const data = readFileSync(exported);
  assert.equal(data.readUInt16BE(0), 0xffd8, 'Shared images must be real JPEG files');
  assert.ok(data.length > 10000 && data.length < 1000000, 'Previews should be useful, compressed images');
  let dimensions;
  for (let offset=2; offset+9<data.length;) {
    const marker=data.readUInt16BE(offset);
    if(marker===0xffc0||marker===0xffc2){dimensions={width:data.readUInt16BE(offset+7),height:data.readUInt16BE(offset+5)};break;}
    const length=data.readUInt16BE(offset+2);
    if(length<2)break;
    offset+=length+2;
  }
  assert.deepEqual(dimensions,{width:1200,height:630},'Actual preview dimensions must match the declared OG size');
  const hash = createHash('sha256').update(data).digest('hex');
  assert.ok(!socialHashes.has(hash), 'Each page must have its own preview, not the homepage image');
  socialHashes.add(hash);
}

test('the Lab homepage has its own exported social preview', () => {
  assertSocialImage(home, 'home');
});

for (const slug of slugs) {
  test(`${slug} has unique metadata and consistent trailing-slash URLs`, () => {
    const html = read(`out/${slug}/index.html`);
    const url = `${site}/${slug}/`;
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
    assert.deepEqual(canonicals.map((match) => match[1]), [url]);
    assert.ok(html.includes(`<meta property="og:url" content="${url}"`));
    assert.ok(html.includes('<meta name="robots" content="index, follow"'));
    assert.ok(!html.includes("noindex"));
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    assert.ok(title && !titles.has(title), "Title must be nonempty and unique");
    assert.ok(description && !descriptions.has(description), "Description must be nonempty and unique");
    titles.add(title);
    descriptions.add(description);
    assert.ok(sitemap.includes(`<loc>${url}</loc>`));
    assert.ok(home.includes(`href="/${slug}/"`), "Homepage must link directly to the final URL");
    assertSocialImage(html, slug);
  });
}

test("sitemap contains only final, trailing-slash page URLs", () => {
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(new Set(urls), new Set([`${site}/`, ...slugs.map((slug) => `${site}/${slug}/`)]));
  assert.equal(urls.length, slugs.length + 1);
});
