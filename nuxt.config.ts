// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    preset: "netlify",
  },

  srcDir: "src/",
  css: ["@/styles/global.scss"],
  modules: [
    "dayjs-nuxt",
    "@nuxtjs/sitemap",
    "nuxt-jsonld",
    [
      "@storyblok/nuxt",
      {
        accessToken: process.env.STORYBLOK_KEY,
        cacheProvider: "memory",
        apiOptions: { region: "fr" },
      },
    ],
  ],
  build: { transpile: ["pdfmake", "@vuepic/vue-datepicker"] },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/_variables.scss";',
        },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      STORYBLOK_KEY: process.env.STORYBLOK_KEY,
    },
  },
  dayjs: {
    locales: ["fr"],
  },
  site: {
    url: "https://supernotaire.fr",
    name: "Supernotaire",
  },
});
