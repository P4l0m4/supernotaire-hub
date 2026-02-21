import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "app.vue",
    "src/app.vue",
    "src/error.vue",
    "src/pages/**/*.{vue,ts,js}",
    "src/layouts/**/*.{vue,ts,js}",
    "src/plugins/**/*.{ts,js}",
    "src/middleware/**/*.{ts,js}",
    "src/app/**/*.{ts,js,vue}",
    "src/server/**/*.{ts,js}",
    "server/**/*.{ts,js}",
    "src/components/**/*.{vue,ts,js}",
    "src/composables/**/*.{ts,js}",
    "src/utils/**/*.{ts,js}",
    "src/types/**/*.ts",
    "tests/**/*.{ts,js}"
  ],
  project: [
    "nuxt.config.ts",
    "sentry.*.config.ts",
    "vitest.config.ts",
    "playwright.config.ts",
    "src/**/*.{ts,js,vue}",
    "server/**/*.{ts,js}",
    "tests/**/*.{ts,js}"
  ],
  ignore: [
    "src/components/CalculateurValeurFonciere.vue",
    "src/components/jsonLD/HowTo.vue",
    "src/components/UI/DidYouKnow.vue"
  ],
  ignoreDependencies: [
    "sass",
    "@vitejs/plugin-vue",
    "storyblok-js-client",
    "json-schema",
    "@storyblok/js",
    "h3",
    "dayjs",
    "@storyblok/vue"
  ]
};

export default config;
