import { defineNuxtPlugin } from "#app";
import posthog from "posthog-js";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) {
    const noop = () => {};
    const noopClient = {
      capture: noop,
      identify: noop,
      reset: noop,
      opt_out_capturing: noop,
      opt_in_capturing: noop,
    };

    return {
      provide: {
        posthog: () => noopClient,
      },
    };
  }

  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    defaults: runtimeConfig.public.posthogDefaults,
    disabled: import.meta.dev,
    loaded: (posthog) => {
      if (import.meta.env.MODE === "development") posthog.debug();
    },
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
