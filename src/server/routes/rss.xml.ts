import StoryblokClient from "storyblok-js-client";
import { stringToSlug } from "@/utils/slugify";

const storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_KEY,
  region: "fr",
});

export default defineEventHandler(async (event) => {
  const siteUrl = "https://easycase.fr"; // ou via runtime config
  const { data } = await storyblok.get("cdn/stories/tutoriels", {});
  const tutorials = data.story.content.tutorials || [];

  const items = tutorials
    .map((t: any) => ({
      title: t.title,
      description: t.description,
      link: `${siteUrl}/tutoriels/${stringToSlug(t.title)}`,
      pubDate: t.lastUpdate || new Date().toISOString(),
    }))
    .map(
      (i: any) => `
    <item>
      <title><![CDATA[${i.title}]]></title>
      <link>${i.link}</link>
      <guid>${i.link}</guid>
      <pubDate>${new Date(i.pubDate).toUTCString()}</pubDate>
      <description><![CDATA[${i.description || ""}]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>EasyCase – Tutoriels</title>
    <link>${siteUrl}</link>
    <description>Tutoriels EasyCase</description>
    ${items}
  </channel>
</rss>`;

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");
  return xml;
});
