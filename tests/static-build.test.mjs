import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Render static build contains the application entry and assets", async () => {
  const html = await readFile(new URL("dist/index.html", root), "utf8");
  assert.match(html, /<title>蓝飞然｜个人作品集<\/title>/);
  assert.match(html, /\/assets\/index-[^\"]+\.js/);
  assert.match(html, /\/assets\/index-[^\"]+\.css/);
});

test("all project videos are included in the static output", async () => {
  const videos = [
    "dist/hero-background.mp4",
    "dist/works/gunian/final-film.mp4",
    "dist/works/mirror/i-see-me-final-film.mp4",
    "dist/works/bloom/final-film.mp4",
    "dist/works/maya-animation/fight-animation.mp4",
  ];
  await Promise.all(videos.map((path) => access(new URL(path, root))));
  assert.equal(videos.length, 5);
});
