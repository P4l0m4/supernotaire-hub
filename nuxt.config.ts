import {
  getNotariesPages,
  getTutorialPages,
  getRubriquesPages,
  getPreEtatDatePages,
  getArticlesPages,
} from "./src/utils/sitemap";

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
    "nuxt-driver.js",
    "@zadigetvoltaire/nuxt-gtm",
    [
      "@storyblok/nuxt",
      {
        accessToken: process.env.STORYBLOK_KEY,
        cacheProvider: "memory",
        apiOptions: { region: "fr" },
      },
    ],
    "@sentry/nuxt/module",
  ],

  gtm: {
    id: "GTM-TZXGHJDZ",
  },

  build: {
    transpile: ["pdfmake", "@vuepic/vue-datepicker", "vue-echarts", "echarts"],
  },

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
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_WEBHOOK_SECRET_TEST: process.env.STRIPE_WEBHOOK_SECRET_TEST || "",
    STRIPE_PRICE_EXPORT: process.env.STRIPE_PRICE_EXPORT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    GEMINI_KEY: process.env.GEMINI_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    public: {
      STORYBLOK_KEY: process.env.STORYBLOK_KEY,
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      STRIPE_PUBLIC_KEY: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY,
      SENTRY_DSN: process.env.NUXT_PUBLIC_SENTRY_DSN,
    },
  },

  dayjs: {
    locales: ["fr"],
  },

  sitemap: {
    urls: async () => {
      const tutorialPages = await getTutorialPages();
      const notariesPages = getNotariesPages();
      const rubriquePages = await getRubriquesPages();
      const preEtatDatePages = await getPreEtatDatePages();
      const articlesPages = await getArticlesPages();
      return [
        ...tutorialPages,
        ...notariesPages,
        ...rubriquePages,
        ...preEtatDatePages,
        ...articlesPages,
      ];
    },
  },

  site: {
    url: "https://easycase.fr",
    name: "EasyCase",
  },

  sentry: {
    org: "tekila-web-factory",
    project: "javascript-nuxt",
    autoInjectServerSentry: "top-level-import",
  },

  sourcemap: {
    client: "hidden",
  },
});
