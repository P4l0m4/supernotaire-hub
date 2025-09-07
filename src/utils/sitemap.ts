import { stringToSlug } from "./slugify";

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
