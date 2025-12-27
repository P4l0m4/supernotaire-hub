import { stringToSlug } from "./slugify";
import { notariesPages } from "./notariesPages";

import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_KEY,
  cache: {
    clear: "auto",
    type: "memory",
  },
  region: "fr",
});

export async function getTutorialPages() {
  const response = await Storyblok.get("cdn/stories/tutoriels", {});
  const tutorials = response.data.story.content.tutorials;
  return tutorials.map((t: any) => ({
    loc: `/tutoriels/${stringToSlug(t.title)}`,
    changefreq: "daily",
    priority: 0.9,
  }));
}

export function getNotariesPages() {
  return notariesPages.map((page) => ({
    loc: `/annuaire/departement${page.slug}`,
    changefreq: "weekly",
    priority: 0.7,
  }));
}
