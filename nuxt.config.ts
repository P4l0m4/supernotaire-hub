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
  modules: ["dayjs-nuxt"],
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
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {},
  },
  dayjs: {
    locales: ["fr"],
  },
});
