import { stringToSlug } from "./slugify";
import { notariesPages } from "./notariesPages";
import { allRubriques } from "./rubriquesDossier";
import { preEtatDateSections } from "./preEtatDateSections";

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

export async function getArticlesPages() {
  const response = await Storyblok.get("cdn/stories/articles", {});
  const articles = response.data.story.content.articles;
  return articles.map((a: any) => ({
    loc: `/articles/${stringToSlug(a.title)}`,
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

export async function getRubriquesPages() {
  return allRubriques.map((r: any) => ({
    loc: `/outils/checklist-dossier-vente-notaire/${stringToSlug(r.id)}`,
    changefreq: "monthly",
    priority: 0.6,
  }));
}

export async function getPreEtatDatePages() {
  return preEtatDateSections.map((section) => ({
    loc: `/outils/pre-etat-date/${section}`,
    changefreq: "monthly",
    priority: 0.5,
  }));
}
