import { defineComponent, shallowRef, h, resolveComponent, hasInjectionContext, inject, getCurrentInstance, provide, cloneVNode, createElementBlock, toRef, isRef, computed, mergeProps, withCtx, createVNode, createTextVNode, version, defineAsyncComponent, unref, shallowReactive, ref, Suspense, Fragment, useSSRContext, createApp, createBlock, createCommentVNode, toDisplayString, openBlock, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, isReadonly, isShallow, isReactive, toRaw, getCurrentScope, watch, nextTick, watchEffect } from 'vue';
import { p as parseQuery, h as createError$1, k as hasProtocol, l as joinURL, m as getContext, w as withQuery, o as withTrailingSlash, q as withoutTrailingSlash, r as isScriptProtocol, s as sanitizeStatusCode, $ as $fetch, t as createHooks, v as executeAsync, x as toRouteMatcher, y as createRouter$1, z as defu } from '../_/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import utc from 'dayjs/plugin/utc.js';
import FloatingVue from 'floating-vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.17.6";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance || (nuxtAppInstance = getNuxtAppCtx(id).tryUse());
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to || (to = "/");
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value || (error2.value = nuxtError);
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-Cv5JUPZd.mjs')
  },
  {
    name: "contact",
    path: "/contact",
    component: () => import('./contact-Bi7kXfMk.mjs')
  },
  {
    name: "notaires",
    path: "/notaires",
    component: () => import('./notaires-Bz6YZwx3.mjs')
  },
  {
    name: "vendeurs",
    path: "/vendeurs",
    component: () => import('./vendeurs-Du0AQUle.mjs')
  },
  {
    name: "tutoriels",
    path: "/tutoriels",
    component: () => import('./tutoriels-n_CXwPfO.mjs')
  },
  {
    name: "inscription",
    path: "/inscription",
    component: () => import('./inscription-pZpOrxP3.mjs')
  },
  {
    name: "faq-notaires",
    path: "/faq-notaires",
    component: () => import('./faq-notaires-B5mlrl6w.mjs')
  },
  {
    name: "faq-vendeurs",
    path: "/faq-vendeurs",
    component: () => import('./faq-vendeurs-DM42ea-4.mjs')
  },
  {
    name: "outils",
    path: "/outils",
    component: () => import('./index-DaAdaIc7.mjs')
  },
  {
    name: "annuaire",
    path: "/annuaire",
    component: () => import('./index-DiaLEVT4.mjs')
  },
  {
    name: "annuaire-slug",
    path: "/annuaire/:slug()",
    component: () => import('./_slug_-DCl-8X3B.mjs')
  },
  {
    name: "comment-ca-marche",
    path: "/comment-ca-marche",
    component: () => import('./comment-ca-marche-DD8mg15p.mjs')
  },
  {
    name: "outils-pre-etat-date",
    path: "/outils/pre-etat-date",
    component: () => import('./pre-etat-date-BCQaztxp.mjs')
  },
  {
    name: "outils-valeur-fonciere",
    path: "/outils/valeur-fonciere",
    component: () => import('./valeur-fonciere-zF685O5c.mjs')
  },
  {
    name: "outils-text-from-document",
    path: "/outils/text-from-document",
    component: () => import('./text-from-document-BTJO9kCd.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => {
    var _a;
    return (_a = children.default) == null ? void 0 : _a.call(children);
  } };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    let position = savedPosition || void 0;
    if (!position && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, "instant", position));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, "instant", position)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, scrollBehaviorType, position) {
  if (position) {
    return position;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: scrollBehaviorType
    };
  }
  return { left: 0, top: 0, behavior: scrollBehaviorType };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware || (nuxtApp._middleware = {
      global: [],
      named: {}
    });
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_1$2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  var _a;
  nuxtApp || (nuxtApp = useNuxtApp());
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to });
    const href = computed(() => {
      var _a;
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (link == null ? void 0 : link.isActive) ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? computed(() => router.resolve(to.value)),
      async navigate(_e2) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        var _a;
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$4 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _0_siteConfig_tU0SxKrPeVRXWcGu2sOnIfhNDbYiKNfDCvYZhRueG0Q = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b;
    const stack = (_b = (_a = useRequestEvent()) == null ? void 0 : _a.context) == null ? void 0 : _b.siteConfig;
    const state = useState("site-config");
    {
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = stack == null ? void 0 : stack.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
function ge(s, e) {
  if (!e)
    return { src: s, attrs: {} };
  let t = 0, o = 0;
  const r = {}, n = [];
  function a(i, u, f, y, R) {
    typeof i != "number" || i <= u || i >= f ? console.warn(`[StoryblokRichText] - ${y.charAt(0).toUpperCase() + y.slice(1)} value must be a number between ${u} and ${f} (inclusive)`) : R.push(`${y}(${i})`);
  }
  if (typeof e == "object") {
    if (typeof e.width == "number" && e.width > 0 ? (r.width = e.width, t = e.width) : console.warn("[StoryblokRichText] - Width value must be a number greater than 0"), e.height && typeof e.height == "number" && e.height > 0 ? (r.height = e.height, o = e.height) : console.warn("[StoryblokRichText] - Height value must be a number greater than 0"), e.loading && ["lazy", "eager"].includes(e.loading) && (r.loading = e.loading), e.class && (r.class = e.class), e.filters) {
      const { filters: i } = e || {}, { blur: u, brightness: f, fill: y, format: R, grayscale: _, quality: A, rotate: L } = i || {};
      u && a(u, 0, 100, "blur", n), A && a(A, 0, 100, "quality", n), f && a(f, 0, 100, "brightness", n), y && n.push(`fill(${y})`), _ && n.push("grayscale()"), L && [0, 90, 180, 270].includes(e.filters.rotate || 0) && n.push(`rotate(${L})`), R && ["webp", "png", "jpeg"].includes(R) && n.push(`format(${R})`);
    }
    e.srcset && (r.srcset = e.srcset.map((i) => {
      if (typeof i == "number")
        return `${s}/m/${i}x0/${n.length > 0 ? `filters:${n.join(":")}` : ""} ${i}w`;
      if (Array.isArray(i) && i.length === 2) {
        const [u, f] = i;
        return `${s}/m/${u}x${f}/${n.length > 0 ? `filters:${n.join(":")}` : ""} ${u}w`;
      } else {
        console.warn("[StoryblokRichText] - srcset entry must be a number or a tuple of two numbers");
        return;
      }
    }).join(", ")), e.sizes && (r.sizes = e.sizes.join(", "));
  }
  let c = `${s}/m/`;
  return t > 0 && o > 0 && (c = `${c}${t}x${o}/`), n.length > 0 && (c = `${c}filters:${n.join(":")}`), {
    src: c,
    attrs: r
  };
}
var g = /* @__PURE__ */ ((s) => (s.DOCUMENT = "doc", s.HEADING = "heading", s.PARAGRAPH = "paragraph", s.QUOTE = "blockquote", s.OL_LIST = "ordered_list", s.UL_LIST = "bullet_list", s.LIST_ITEM = "list_item", s.CODE_BLOCK = "code_block", s.HR = "horizontal_rule", s.BR = "hard_break", s.IMAGE = "image", s.EMOJI = "emoji", s.COMPONENT = "blok", s.TABLE = "table", s.TABLE_ROW = "tableRow", s.TABLE_CELL = "tableCell", s.TABLE_HEADER = "tableHeader", s))(g || {}), $ = /* @__PURE__ */ ((s) => (s.BOLD = "bold", s.STRONG = "strong", s.STRIKE = "strike", s.UNDERLINE = "underline", s.ITALIC = "italic", s.CODE = "code", s.LINK = "link", s.ANCHOR = "anchor", s.STYLED = "styled", s.SUPERSCRIPT = "superscript", s.SUBSCRIPT = "subscript", s.TEXT_STYLE = "textStyle", s.HIGHLIGHT = "highlight", s))($ || {}), Z = /* @__PURE__ */ ((s) => (s.TEXT = "text", s))(Z || {}), S = /* @__PURE__ */ ((s) => (s.URL = "url", s.STORY = "story", s.ASSET = "asset", s.EMAIL = "email", s))(S || {});
const ve = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
], ke = (s = {}) => Object.keys(s).map((e) => `${e}="${s[e]}"`).join(" "), we = (s = {}) => Object.keys(s).map((e) => `${e}: ${s[e]}`).join("; ");
function _e(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const O = (s) => Object.fromEntries(Object.entries(s).filter(([e, t]) => t !== void 0));
function F(s, e = {}, t) {
  const o = ke(e), r = o ? `${s} ${o}` : s, n = Array.isArray(t) ? t.join("") : t || "";
  if (s) {
    if (ve.includes(s))
      return `<${r}>`;
  } else return n;
  return `<${r}>${n}</${s}>`;
}
function ee(s = {}) {
  const e = /* @__PURE__ */ new Map(), {
    renderFn: t = F,
    textFn: o = _e,
    resolvers: r = {},
    optimizeImages: n = false,
    keyedResolvers: a = false
  } = s, c = t !== F, i = (l) => (h2, d) => {
    const p = h2.attrs || {};
    return d.render(l, p, h2.children || null);
  }, u = (l, h2) => {
    const { src: d, alt: p, title: b, srcset: w, sizes: v } = l.attrs || {};
    let k = d, T = {};
    if (n) {
      const { src: ue, attrs: he } = ge(d, n);
      k = ue, T = he;
    }
    const ce = {
      src: k,
      alt: p,
      title: b,
      srcset: w,
      sizes: v,
      ...T
    };
    return h2.render("img", O(ce));
  }, f = (l, h2) => {
    const { level: d, ...p } = l.attrs || {};
    return h2.render(`h${d}`, p, l.children);
  }, y = (l, h2) => {
    var d, p, b, w;
    const v = h2.render("img", {
      src: (d = l.attrs) == null ? void 0 : d.fallbackImage,
      alt: (p = l.attrs) == null ? void 0 : p.alt,
      style: "width: 1.25em; height: 1.25em; vertical-align: text-top",
      draggable: "false",
      loading: "lazy"
    });
    return h2.render("span", {
      "data-type": "emoji",
      "data-name": (b = l.attrs) == null ? void 0 : b.name,
      "data-emoji": (w = l.attrs) == null ? void 0 : w.emoji
    }, v);
  }, R = (l, h2) => h2.render(
    "pre",
    l.attrs || {},
    h2.render("code", {}, l.children || "")
  ), _ = (l, h2 = false) => ({ text: d, attrs: p }, b) => {
    const { class: w, id: v, ...k } = p || {}, T = h2 ? {
      class: w,
      id: v,
      style: we(k) || void 0
    } : p || {};
    return b.render(l, O(T), d);
  }, A = (l) => x(l), L = (l) => {
    const { marks: h2, ...d } = l;
    if ("text" in l) {
      if (h2)
        return h2.reduce(
          (b, w) => A({ ...w, text: b }),
          A({ ...d, children: d.children })
        );
      const p = l.attrs || {};
      if (a) {
        const b = e.get("txt") || 0;
        e.set("txt", b + 1), p.key = `txt-${b}`;
      }
      return o(d.text, p);
    }
    return "";
  }, D = (l, h2) => {
    const { linktype: d, href: p, anchor: b, ...w } = l.attrs || {};
    let v = "";
    switch (d) {
      case S.ASSET:
      case S.URL:
        v = p;
        break;
      case S.EMAIL:
        v = `mailto:${p}`;
        break;
      case S.STORY:
        v = p, b && (v = `${v}#${b}`);
        break;
      default:
        v = p;
        break;
    }
    const k = { ...w };
    return v && (k.href = v), h2.render("a", k, l.text);
  }, re = (l, h2) => {
    var d, p;
    return console.warn("[StoryblokRichtText] - BLOK resolver is not available for vanilla usage"), h2.render("span", {
      blok: (d = l == null ? void 0 : l.attrs) == null ? void 0 : d.body[0],
      id: (p = l.attrs) == null ? void 0 : p.id,
      style: "display: none"
    });
  }, oe = (l, h2) => {
    const d = {}, p = h2.render("tbody", {}, l.children);
    return h2.render("table", d, p);
  }, ne = (l, h2) => {
    const d = {};
    return h2.render("tr", d, l.children);
  }, ie = (l, h2) => {
    const { colspan: d, rowspan: p, colwidth: b, backgroundColor: w, ...v } = l.attrs || {}, k = {
      ...v
    };
    d > 1 && (k.colspan = d), p > 1 && (k.rowspan = p);
    const T = [];
    return b && T.push(`width: ${b}px;`), w && T.push(`background-color: ${w};`), T.length > 0 && (k.style = T.join(" ")), h2.render("td", O(k), l.children);
  }, ae = (l, h2) => {
    const { colspan: d, rowspan: p, colwidth: b, backgroundColor: w, ...v } = l.attrs || {}, k = {
      ...v
    };
    d > 1 && (k.colspan = d), p > 1 && (k.rowspan = p);
    const T = [];
    return b && T.push(`width: ${b}px;`), w && T.push(`background-color: ${w};`), T.length > 0 && (k.style = T.join(" ")), h2.render("th", O(k), l.children);
  }, B = /* @__PURE__ */ new Map([
    [g.DOCUMENT, i("")],
    [g.HEADING, f],
    [g.PARAGRAPH, i("p")],
    [g.UL_LIST, i("ul")],
    [g.OL_LIST, i("ol")],
    [g.LIST_ITEM, i("li")],
    [g.IMAGE, u],
    [g.EMOJI, y],
    [g.CODE_BLOCK, R],
    [g.HR, i("hr")],
    [g.BR, i("br")],
    [g.QUOTE, i("blockquote")],
    [g.COMPONENT, re],
    [Z.TEXT, L],
    [$.LINK, D],
    [$.ANCHOR, D],
    [$.STYLED, _("span", true)],
    [$.BOLD, _("strong")],
    [$.TEXT_STYLE, _("span", true)],
    [$.ITALIC, _("em")],
    [$.UNDERLINE, _("u")],
    [$.STRIKE, _("s")],
    [$.CODE, _("code")],
    [$.SUPERSCRIPT, _("sup")],
    [$.SUBSCRIPT, _("sub")],
    [$.HIGHLIGHT, _("mark")],
    [g.TABLE, oe],
    [g.TABLE_ROW, ne],
    [g.TABLE_CELL, ie],
    [g.TABLE_HEADER, ae]
  ]), M = new Map([
    ...B,
    ...Object.entries(r).map(([l, h2]) => [l, h2])
  ]), le = () => ({
    render: (l, h2 = {}, d) => {
      if (a && l) {
        const p = e.get(l) || 0;
        e.set(l, p + 1), h2.key = `${l}-${p}`;
      }
      return t(l, h2, d);
    },
    originalResolvers: B,
    mergedResolvers: M
  });
  function C(l) {
    const h2 = M.get(l.type);
    if (!h2)
      return console.error("<Storyblok>", `No resolver found for node type ${l.type}`), "";
    const d = le();
    if (l.type === "text")
      return h2(l, d);
    const p = l.content ? l.content.map(x) : void 0;
    return h2({
      ...l,
      children: p
    }, d);
  }
  function x(l) {
    return l.type === "doc" ? c ? l.content.map(C) : l.content.map(C).join("") : Array.isArray(l) ? l.map(C) : C(l);
  }
  return {
    render: x
  };
}
var Re = Object.defineProperty, $e = (s, e, t) => e in s ? Re(s, e, { enumerable: true, configurable: true, writable: true, value: t }) : s[e] = t, m = (s, e, t) => $e(s, typeof e != "symbol" ? e + "" : e, t);
class Ee extends Error {
  constructor(e) {
    super(e), this.name = "AbortError";
  }
}
function Ae(s, e, t) {
  if (!Number.isFinite(e))
    throw new TypeError("Expected `limit` to be a finite number");
  if (!Number.isFinite(t))
    throw new TypeError("Expected `interval` to be a finite number");
  const o = [];
  let r = [], n = 0, a = false;
  const c = async () => {
    n++;
    const u = o.shift();
    if (u)
      try {
        const y = await s(...u.args);
        u.resolve(y);
      } catch (y) {
        u.reject(y);
      }
    const f = setTimeout(() => {
      n--, o.length > 0 && c(), r = r.filter((y) => y !== f);
    }, t);
    r.includes(f) || r.push(f);
  }, i = (...u) => a ? Promise.reject(
    new Error(
      "Throttled function is already aborted and not accepting new promises"
    )
  ) : new Promise((f, y) => {
    o.push({
      resolve: f,
      reject: y,
      args: u
    }), n < e && c();
  });
  return i.abort = () => {
    a = true, r.forEach(clearTimeout), r = [], o.forEach(
      (u) => u.reject(() => new Ee("Throttle function aborted"))
    ), o.length = 0;
  }, i;
}
const G = (s = "") => s.includes("/cdn/"), Se = (s, e = 25, t = 1) => ({
  ...s,
  per_page: e,
  page: t
}), Ie = (s) => new Promise((e) => setTimeout(e, s)), Le = (s = 0, e) => Array.from({ length: s }, e), Ce = (s = 0, e = s) => {
  const t = Math.abs(e - s) || 0, o = s < e ? 1 : -1;
  return Le(t, (r, n) => n * o + s);
}, Oe = async (s, e) => Promise.all(s.map(e)), je = (s = [], e) => s.map(e).reduce((t, o) => [...t, ...o], []), U = (s, e, t) => {
  const o = [];
  for (const r in s) {
    if (!Object.prototype.hasOwnProperty.call(s, r))
      continue;
    const n = s[r];
    if (n == null)
      continue;
    const a = t ? "" : encodeURIComponent(r);
    let c;
    typeof n == "object" ? c = U(
      n,
      e ? e + encodeURIComponent(`[${a}]`) : a,
      Array.isArray(n)
    ) : c = `${e ? e + encodeURIComponent(`[${a}]`) : a}=${encodeURIComponent(n)}`, o.push(c);
  }
  return o.join("&");
}, q = (s) => {
  const e = {
    eu: "api.storyblok.com",
    us: "api-us.storyblok.com",
    cn: "app.storyblokchina.cn",
    ap: "api-ap.storyblok.com",
    ca: "api-ca.storyblok.com"
  };
  return e[s] ?? e.eu;
};
class Pe {
  constructor(e) {
    m(this, "baseURL"), m(this, "timeout"), m(this, "headers"), m(this, "responseInterceptor"), m(this, "fetch"), m(this, "ejectInterceptor"), m(this, "url"), m(this, "parameters"), m(this, "fetchOptions"), this.baseURL = e.baseURL, this.headers = e.headers || new Headers(), this.timeout = e != null && e.timeout ? e.timeout * 1e3 : 0, this.responseInterceptor = e.responseInterceptor, this.fetch = (...t) => e.fetch ? e.fetch(...t) : fetch(...t), this.ejectInterceptor = false, this.url = "", this.parameters = {}, this.fetchOptions = {};
  }
  /**
   *
   * @param url string
   * @param params ISbStoriesParams
   * @returns Promise<ISbResponse | Error>
   */
  get(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("get");
  }
  post(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("post");
  }
  put(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("put");
  }
  delete(e, t) {
    return this.url = e, this.parameters = t ?? {}, this._methodHandler("delete");
  }
  async _responseHandler(e) {
    const t = [], o = {
      data: {},
      headers: {},
      status: 0,
      statusText: ""
    };
    e.status !== 204 && await e.json().then((r) => {
      o.data = r;
    });
    for (const r of e.headers.entries())
      t[r[0]] = r[1];
    return o.headers = { ...t }, o.status = e.status, o.statusText = e.statusText, o;
  }
  async _methodHandler(e) {
    let t = `${this.baseURL}${this.url}`, o = null;
    e === "get" ? t = `${this.baseURL}${this.url}?${U(this.parameters)}` : o = JSON.stringify(this.parameters);
    const r = new URL(t), n = new AbortController(), { signal: a } = n;
    let c;
    this.timeout && (c = setTimeout(() => n.abort(), this.timeout));
    try {
      const i = await this.fetch(`${r}`, {
        method: e,
        headers: this.headers,
        body: o,
        signal: a,
        ...this.fetchOptions
      });
      this.timeout && clearTimeout(c);
      const u = await this._responseHandler(
        i
      );
      return this.responseInterceptor && !this.ejectInterceptor ? this._statusHandler(this.responseInterceptor(u)) : this._statusHandler(u);
    } catch (i) {
      return {
        message: i
      };
    }
  }
  setFetchOptions(e = {}) {
    Object.keys(e).length > 0 && "method" in e && delete e.method, this.fetchOptions = { ...e };
  }
  eject() {
    this.ejectInterceptor = true;
  }
  /**
   * Normalizes error messages from different response structures
   * @param data The response data that might contain error information
   * @returns A normalized error message string
   */
  _normalizeErrorMessage(e) {
    if (Array.isArray(e))
      return e[0] || "Unknown error";
    if (e && typeof e == "object") {
      if (e.error)
        return e.error;
      for (const t in e) {
        if (Array.isArray(e[t]))
          return `${t}: ${e[t][0]}`;
        if (typeof e[t] == "string")
          return `${t}: ${e[t]}`;
      }
      if (e.slug)
        return e.slug;
    }
    return "Unknown error";
  }
  _statusHandler(e) {
    const t = /20[0-6]/g;
    return new Promise((o, r) => {
      if (t.test(`${e.status}`))
        return o(e);
      const n = {
        message: this._normalizeErrorMessage(e.data),
        status: e.status,
        response: e
      };
      r(n);
    });
  }
}
const J = "SB-Agent", H = {
  defaultAgentName: "SB-JS-CLIENT",
  defaultAgentVersion: "SB-Agent-Version",
  packageVersion: "7.0.0"
}, xe = {
  PUBLISHED: "published"
};
let j = {};
const E = {};
class Ne {
  /**
   *
   * @param config ISbConfig interface
   * @param pEndpoint string, optional
   */
  constructor(e, t) {
    m(this, "client"), m(this, "maxRetries"), m(this, "retriesDelay"), m(this, "throttle"), m(this, "accessToken"), m(this, "cache"), m(this, "resolveCounter"), m(this, "relations"), m(this, "links"), m(this, "version"), m(this, "richTextResolver"), m(this, "resolveNestedRelations"), m(this, "stringifiedStoriesCache"), m(this, "inlineAssets");
    let o = e.endpoint || t;
    if (!o) {
      const a = e.https === false ? "http" : "https";
      e.oauthToken ? o = `${a}://${q(e.region)}/v1` : o = `${a}://${q(e.region)}/v2`;
    }
    const r = new Headers();
    r.set("Content-Type", "application/json"), r.set("Accept", "application/json"), e.headers && (e.headers.constructor.name === "Headers" ? e.headers.entries().toArray() : Object.entries(e.headers)).forEach(([a, c]) => {
      r.set(a, c);
    }), r.has(J) || (r.set(J, H.defaultAgentName), r.set(
      H.defaultAgentVersion,
      H.packageVersion
    ));
    let n = 5;
    e.oauthToken && (r.set("Authorization", e.oauthToken), n = 3), e.rateLimit && (n = e.rateLimit), this.maxRetries = e.maxRetries || 10, this.retriesDelay = 300, this.throttle = Ae(
      this.throttledRequest.bind(this),
      n,
      1e3
    ), this.accessToken = e.accessToken || "", this.relations = {}, this.links = {}, this.cache = e.cache || { clear: "manual" }, this.resolveCounter = 0, this.resolveNestedRelations = e.resolveNestedRelations || true, this.stringifiedStoriesCache = {}, this.version = e.version || xe.PUBLISHED, this.inlineAssets = e.inlineAssets || false, this.client = new Pe({
      baseURL: o,
      timeout: e.timeout || 0,
      headers: r,
      responseInterceptor: e.responseInterceptor,
      fetch: e.fetch
    });
  }
  parseParams(e) {
    return e.token || (e.token = this.getToken()), e.cv || (e.cv = E[e.token]), Array.isArray(e.resolve_relations) && (e.resolve_relations = e.resolve_relations.join(",")), typeof e.resolve_relations < "u" && (e.resolve_level = 2), e;
  }
  factoryParamOptions(e, t) {
    return G(e) ? this.parseParams(t) : t;
  }
  makeRequest(e, t, o, r, n) {
    const a = this.factoryParamOptions(
      e,
      Se(t, o, r)
    );
    return this.cacheResponse(e, a, void 0, n);
  }
  get(e, t = {}, o) {
    t || (t = {});
    const r = `/${e}`;
    G(r) && (t.version = t.version || this.version);
    const n = this.factoryParamOptions(r, t);
    return this.cacheResponse(r, n, void 0, o);
  }
  async getAll(e, t = {}, o, r) {
    const n = (t == null ? void 0 : t.per_page) || 25, a = `/${e}`.replace(/\/$/, ""), c = o ?? a.substring(a.lastIndexOf("/") + 1);
    t.version = t.version || this.version;
    const i = 1, u = await this.makeRequest(
      a,
      t,
      n,
      i,
      r
    ), f = u.total ? Math.ceil(u.total / n) : 1, y = await Oe(
      Ce(i, f),
      (R) => this.makeRequest(a, t, n, R + 1, r)
    );
    return je([u, ...y], (R) => Object.values(R.data[c]));
  }
  post(e, t = {}, o) {
    const r = `/${e}`;
    return this.throttle("post", r, t, o);
  }
  put(e, t = {}, o) {
    const r = `/${e}`;
    return this.throttle("put", r, t, o);
  }
  delete(e, t = {}, o) {
    t || (t = {});
    const r = `/${e}`;
    return this.throttle("delete", r, t, o);
  }
  getStories(e = {}, t) {
    return this._addResolveLevel(e), this.get("cdn/stories", e, t);
  }
  getStory(e, t = {}, o) {
    return this._addResolveLevel(t), this.get(`cdn/stories/${e}`, t, o);
  }
  getToken() {
    return this.accessToken;
  }
  ejectInterceptor() {
    this.client.eject();
  }
  _addResolveLevel(e) {
    typeof e.resolve_relations < "u" && (e.resolve_level = 2);
  }
  _cleanCopy(e) {
    return JSON.parse(JSON.stringify(e));
  }
  _insertLinks(e, t, o) {
    const r = e[t];
    r && r.fieldtype === "multilink" && r.linktype === "story" && typeof r.id == "string" && this.links[o][r.id] ? r.story = this._cleanCopy(this.links[o][r.id]) : r && r.linktype === "story" && typeof r.uuid == "string" && this.links[o][r.uuid] && (r.story = this._cleanCopy(this.links[o][r.uuid]));
  }
  /**
   *
   * @param resolveId A counter number as a string
   * @param uuid The uuid of the story
   * @returns string | object
   */
  getStoryReference(e, t) {
    return this.relations[e][t] ? JSON.parse(this.stringifiedStoriesCache[t] || JSON.stringify(this.relations[e][t])) : t;
  }
  /**
   * Resolves a field's value by replacing UUIDs with their corresponding story references
   * @param jtree - The JSON tree object containing the field to resolve
   * @param treeItem - The key of the field to resolve
   * @param resolveId - The unique identifier for the current resolution context
   *
   * This method handles both single string UUIDs and arrays of UUIDs:
   * - For single strings: directly replaces the UUID with the story reference
   * - For arrays: maps through each UUID and replaces with corresponding story references
   */
  _resolveField(e, t, o) {
    const r = e[t];
    typeof r == "string" ? e[t] = this.getStoryReference(o, r) : Array.isArray(r) && (e[t] = r.map(
      (n) => this.getStoryReference(o, n)
    ).filter(Boolean));
  }
  /**
   * Inserts relations into the JSON tree by resolving references
   * @param jtree - The JSON tree object to process
   * @param treeItem - The current field being processed
   * @param fields - The relation patterns to resolve (string or array of strings)
   * @param resolveId - The unique identifier for the current resolution context
   *
   * This method handles two types of relation patterns:
   * 1. Nested relations: matches fields that end with the current field name
   *    Example: If treeItem is "event_type", it matches patterns like "*.event_type"
   *
   * 2. Direct component relations: matches exact component.field patterns
   *    Example: "event.event_type" for component "event" and field "event_type"
   *
   * The method supports both string and array formats for the fields parameter,
   * allowing flexible specification of relation patterns.
   */
  _insertRelations(e, t, o, r) {
    if (Array.isArray(o) ? o.find((a) => a.endsWith(`.${t}`)) : o.endsWith(`.${t}`)) {
      this._resolveField(e, t, r);
      return;
    }
    const n = e.component ? `${e.component}.${t}` : t;
    (Array.isArray(o) ? o.includes(n) : o === n) && this._resolveField(e, t, r);
  }
  /**
   * Recursively traverses and resolves relations in the story content tree
   * @param story - The story object containing the content to process
   * @param fields - The relation patterns to resolve
   * @param resolveId - The unique identifier for the current resolution context
   */
  iterateTree(e, t, o) {
    const r = (n, a = "") => {
      if (!(!n || n._stopResolving)) {
        if (Array.isArray(n))
          n.forEach((c, i) => r(c, `${a}[${i}]`));
        else if (typeof n == "object")
          for (const c in n) {
            const i = a ? `${a}.${c}` : c;
            (n.component && n._uid || n.type === "link") && (this._insertRelations(n, c, t, o), this._insertLinks(n, c, o)), r(n[c], i);
          }
      }
    };
    r(e.content);
  }
  async resolveLinks(e, t, o) {
    let r = [];
    if (e.link_uuids) {
      const n = e.link_uuids.length, a = [], c = 50;
      for (let i = 0; i < n; i += c) {
        const u = Math.min(n, i + c);
        a.push(e.link_uuids.slice(i, u));
      }
      for (let i = 0; i < a.length; i++)
        (await this.getStories({
          per_page: c,
          language: t.language,
          version: t.version,
          starts_with: t.starts_with,
          by_uuids: a[i].join(",")
        })).data.stories.forEach(
          (u) => {
            r.push(u);
          }
        );
    } else
      r = e.links;
    r.forEach((n) => {
      this.links[o][n.uuid] = {
        ...n,
        _stopResolving: true
      };
    });
  }
  async resolveRelations(e, t, o) {
    let r = [];
    if (e.rel_uuids) {
      const n = e.rel_uuids.length, a = [], c = 50;
      for (let i = 0; i < n; i += c) {
        const u = Math.min(n, i + c);
        a.push(e.rel_uuids.slice(i, u));
      }
      for (let i = 0; i < a.length; i++)
        (await this.getStories({
          per_page: c,
          language: t.language,
          version: t.version,
          starts_with: t.starts_with,
          by_uuids: a[i].join(","),
          excluding_fields: t.excluding_fields
        })).data.stories.forEach((u) => {
          r.push(u);
        });
      r.length > 0 && (e.rels = r, delete e.rel_uuids);
    } else
      r = e.rels;
    r && r.length > 0 && r.forEach((n) => {
      this.relations[o][n.uuid] = {
        ...n,
        _stopResolving: true
      };
    });
  }
  /**
   *
   * @param responseData
   * @param params
   * @param resolveId
   * @description Resolves the relations and links of the stories
   * @returns Promise<void>
   *
   */
  async resolveStories(e, t, o) {
    var r, n;
    let a = [];
    if (this.links[o] = {}, this.relations[o] = {}, typeof t.resolve_relations < "u" && t.resolve_relations.length > 0 && (typeof t.resolve_relations == "string" && (a = t.resolve_relations.split(",")), await this.resolveRelations(e, t, o)), t.resolve_links && ["1", "story", "url", "link"].includes(t.resolve_links) && ((r = e.links) != null && r.length || (n = e.link_uuids) != null && n.length) && await this.resolveLinks(e, t, o), this.resolveNestedRelations)
      for (const c in this.relations[o])
        this.iterateTree(
          this.relations[o][c],
          a,
          o
        );
    e.story ? this.iterateTree(e.story, a, o) : e.stories.forEach((c) => {
      this.iterateTree(c, a, o);
    }), this.stringifiedStoriesCache = {}, delete this.links[o], delete this.relations[o];
  }
  async cacheResponse(e, t, o, r) {
    const n = U({ url: e, params: t }), a = this.cacheProvider();
    if (t.version === "published" && e !== "/cdn/spaces/me") {
      const c = await a.get(n);
      if (c)
        return Promise.resolve(c);
    }
    return new Promise(async (c, i) => {
      var u;
      try {
        const f = await this.throttle(
          "get",
          e,
          t,
          r
        );
        if (f.status !== 200)
          return i(f);
        let y = { data: f.data, headers: f.headers };
        if ((u = f.headers) != null && u["per-page"] && (y = Object.assign({}, y, {
          perPage: f.headers["per-page"] ? Number.parseInt(f.headers["per-page"]) : 0,
          total: f.headers["per-page"] ? Number.parseInt(f.headers.total) : 0
        })), y.data.story || y.data.stories) {
          const _ = this.resolveCounter = ++this.resolveCounter % 1e3;
          await this.resolveStories(y.data, t, `${_}`), y = await this.processInlineAssets(y);
        }
        t.version === "published" && e !== "/cdn/spaces/me" && await a.set(n, y);
        const R = this.cache.clear === "onpreview" && t.version === "draft" || this.cache.clear === "auto";
        return t.token && y.data.cv && (R && E[t.token] && E[t.token] !== y.data.cv && await this.flushCache(), E[t.token] = y.data.cv), c(y);
      } catch (f) {
        if (f.response && f.status === 429 && (o = typeof o > "u" ? 0 : o + 1, o < this.maxRetries))
          return console.log(
            `Hit rate limit. Retrying in ${this.retriesDelay / 1e3} seconds.`
          ), await Ie(this.retriesDelay), this.cacheResponse(e, t, o).then(c).catch(i);
        i(f);
      }
    });
  }
  throttledRequest(e, t, o, r) {
    return this.client.setFetchOptions(r), this.client[e](t, o);
  }
  cacheVersions() {
    return E;
  }
  cacheVersion() {
    return E[this.accessToken];
  }
  setCacheVersion(e) {
    this.accessToken && (E[this.accessToken] = e);
  }
  clearCacheVersion() {
    this.accessToken && (E[this.accessToken] = 0);
  }
  cacheProvider() {
    switch (this.cache.type) {
      case "memory":
        return {
          get(e) {
            return Promise.resolve(j[e]);
          },
          getAll() {
            return Promise.resolve(j);
          },
          set(e, t) {
            return j[e] = t, Promise.resolve(void 0);
          },
          flush() {
            return j = {}, Promise.resolve(void 0);
          }
        };
      case "custom":
        if (this.cache.custom)
          return this.cache.custom;
      // eslint-disable-next-line no-fallthrough
      default:
        return {
          get() {
            return Promise.resolve();
          },
          getAll() {
            return Promise.resolve(void 0);
          },
          set() {
            return Promise.resolve(void 0);
          },
          flush() {
            return Promise.resolve(void 0);
          }
        };
    }
  }
  async flushCache() {
    return await this.cacheProvider().flush(), this.clearCacheVersion(), this;
  }
  async processInlineAssets(e) {
    if (!this.inlineAssets)
      return e;
    const t = (o) => {
      if (!o || typeof o != "object")
        return o;
      if (Array.isArray(o))
        return o.map((n) => t(n));
      let r = { ...o };
      r.fieldtype === "asset" && Array.isArray(e.data.assets) && (r = {
        ...r,
        ...e.data.assets.find((n) => n.id === r.id)
      });
      for (const n in r)
        typeof r[n] == "object" && (r[n] = t(r[n]));
      return r;
    };
    return e.data.story && (e.data.story.content = t(e.data.story.content)), e.data.stories && (e.data.stories = e.data.stories.map((o) => (o.content = t(o.content), o))), e;
  }
}
const Ge = (s = {}) => {
  const { apiOptions: e } = s;
  if (!e || !e.accessToken) {
    console.error(
      "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
    );
    return;
  }
  return { storyblokApi: new Ne(e) };
}, He = (s) => {
  if (typeof s != "object" || typeof s._editable > "u")
    return {};
  try {
    const e = JSON.parse(
      s._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
    );
    return e ? {
      "data-blok-c": JSON.stringify(e),
      "data-blok-uid": `${e.id}-${e.uid}`
    } : {};
  } catch {
    return {};
  }
};
const De = (s = {}) => {
  const {
    bridge: o,
    accessToken: r,
    use: n = [],
    apiOptions: a = {},
    bridgeUrl: c
  } = s;
  a.accessToken = a.accessToken || r;
  const i = { bridge: o, apiOptions: a };
  let u = {};
  n.forEach((y) => {
    u = { ...u, ...y(i) };
  });
  return u;
};
const te = /* @__PURE__ */ defineComponent({
  __name: "StoryblokComponent",
  props: {
    blok: {}
  },
  setup(s, { expose: e }) {
    const t = s, o = ref();
    e({
      value: o
    });
    const r = typeof resolveDynamicComponent(t.blok.component) != "string", n = inject("VueSDKOptions"), a = ref(t.blok.component);
    return !r && n && (n.enableFallbackComponent ? (a.value = n.customFallbackComponent ?? "FallbackComponent", typeof resolveDynamicComponent(a.value) == "string" && console.error(
      `Is the Fallback component "${a.value}" registered properly?`
    )) : console.error(
      `Component could not be found for blok "${t.blok.component}"! Is it defined in main.ts as "app.component("${t.blok.component}", ${t.blok.component});"?`
    )), (c, i) => (openBlock(), createBlock(resolveDynamicComponent(a.value), mergeProps({
      ref_key: "blokRef",
      ref: o
    }, { ...c.$props, ...c.$attrs }), null, 16));
  }
}), Be = (s) => {
  var e, t;
  return h(
    te,
    {
      blok: (e = s == null ? void 0 : s.attrs) == null ? void 0 : e.body[0],
      id: (t = s.attrs) == null ? void 0 : t.id
    },
    s.children
  );
};
function Me(s) {
  const e = {
    renderFn: h,
    // TODO: Check why this changed.
    // @ts-expect-error - createTextVNode types has been recently changed.
    textFn: createTextVNode,
    keyedResolvers: true,
    resolvers: {
      [g.COMPONENT]: Be,
      ...s.resolvers
    }
  };
  return ee(e);
}
const Fe = /* @__PURE__ */ defineComponent({
  __name: "StoryblokRichText",
  props: {
    doc: {},
    resolvers: {}
  },
  setup(s) {
    const e = s, t = ref(), o = () => t.value;
    return watch([() => e.doc, () => e.resolvers], ([r, n]) => {
      const { render: a } = Me({
        resolvers: n ?? {}
      });
      t.value = a(r);
    }, {
      immediate: true,
      deep: true
    }), (r, n) => (openBlock(), createBlock(o));
  }
}), Ve = {
  beforeMount(s, e) {
    if (e.value) {
      const t = He(e.value);
      Object.keys(t).length > 0 && (s.setAttribute("data-blok-c", t["data-blok-c"]), s.setAttribute("data-blok-uid", t["data-blok-uid"]), s.classList.add("storyblok__outline"));
    }
  }
}, se = (s) => {
  console.error(`You can't use ${s} if you're not loading apiPlugin. Please provide it on StoryblokVue initialization.
    `);
};
let I = null;
const Je = () => (I || se("useStoryblokApi"), I), Ye = {
  install(s, e = {}) {
    s.directive("editable", Ve), s.component("StoryblokComponent", te), s.component("StoryblokRichText", Fe), e.enableFallbackComponent && !e.customFallbackComponent && s.component(
      "FallbackComponent",
      defineAsyncComponent(() => import('./FallbackComponent-Dky11gEu-CtYceWkH.mjs'))
    );
    const { storyblokApi: t } = De(e);
    I = t || null, s.provide("VueSDKOptions", e);
  }
};
const plugin_YOxzu2Rgn246XMgfphZEXZjtzJTMGWdPuDf_KLI_O_0 = /* @__PURE__ */ defineNuxtPlugin(({ vueApp }) => {
  let { storyblok } = (/* @__PURE__ */ useRuntimeConfig()).public;
  storyblok = JSON.parse(JSON.stringify(storyblok));
  vueApp.use(Ye, { ...storyblok, use: [Ge] });
});
var activeHead;
function getActiveHead() {
  return activeHead;
}
version[0] === "3";
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref3) {
  if (ref3 instanceof Promise || ref3 instanceof Date || ref3 instanceof RegExp)
    return ref3;
  const root = resolveUnref(ref3);
  if (!ref3 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r));
  if (typeof root === "object") {
    const resolved = {};
    for (const k2 in root) {
      if (!Object.prototype.hasOwnProperty.call(root, k2)) {
        continue;
      }
      if (k2 === "titleTemplate" || k2[0] === "o" && k2[1] === "n") {
        resolved[k2] = unref(root[k2]);
        continue;
      }
      resolved[k2] = resolveUnrefHeadInput(root[k2]);
    }
    return resolved;
  }
  return root;
}
var headSymbol = "usehead";
var _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var globalKey = "__unhead_injection_handler__";
function injectHead() {
  if (globalKey in _global) {
    return _global[globalKey]();
  }
  const head = inject(headSymbol);
  return head || getActiveHead();
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
var vuePlugin = {
  install(Vue) {
    Vue.mixin({
      created() {
        var _a;
        if (typeof ((_a = this.$options) == null ? void 0 : _a.jsonld) !== "function") {
          return;
        }
        const jsonComputed = computed(() => this.$options.jsonld.call(this));
        useHead(() => ({
          script: [
            {
              type: "application/ld+json",
              innerHTML: jsonComputed.value ? JSON.stringify(jsonComputed.value, null, "") : void 0
            }
          ]
        }));
      }
    });
  }
};
var plugin_default = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vuePlugin);
});
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.locale("fr");
const plugin_A_mOOaCOuJWV5Ht8_pCnoQk4Wr7Lby7kkLEtrwvUQ5w = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => nuxtApp.provide("dayjs", dayjs));
const floating_vue_DYtxgD1IQQTog08Eg9fugMY12CnQHyqF_4NdXKbKn74 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue);
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  _0_siteConfig_tU0SxKrPeVRXWcGu2sOnIfhNDbYiKNfDCvYZhRueG0Q,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  plugin_YOxzu2Rgn246XMgfphZEXZjtzJTMGWdPuDf_KLI_O_0,
  plugin_default,
  plugin_A_mOOaCOuJWV5Ht8_pCnoQk4Wr7Lby7kkLEtrwvUQ5w,
  floating_vue_DYtxgD1IQQTog08Eg9fugMY12CnQHyqF_4NdXKbKn74
];
const layouts = {
  default: defineAsyncComponent(() => import('./default-CSCzWfbb.mjs').then((m2) => m2.default || m2))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0$3 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? (route == null ? void 0 : route.meta.layout) ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = (route == null ? void 0 : route.meta.layoutTransition) ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_1$1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$6 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$3;
  const _component_NuxtPage = __nuxt_component_1$1;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "IconComponent",
  __ssrInlineRender: true,
  props: {
    icon: {},
    color: {},
    size: { default: "1rem" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["icon", { spin: _ctx.icon === "circle_notch" || _ctx.icon === "circle_notch_bold" }],
        style: { color: _ctx.color, fontSize: _ctx.size }
      }, _attrs))} data-v-20250a55>${ssrInterpolate(_ctx.icon)}</span>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/IconComponent.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-20250a55"]]);
const colors = {
  "base-color": "#f7f7f7",
  "primary-color": "#FFFDFA",
  "secondary-color": "#00065c",
  "accent-color": "#3185ff",
  "text-color": "#22262e",
  "error-color": "#CB0000",
  "warning-color": "#f0ae00",
  "gold-color": "#FFE492",
  "base-color-faded": "#f7f7f750",
  "secondary-color-faded": "#00065c50",
  "primary-color-faded": "#FFFDFA50",
  "text-color-faded": "#22262e70",
  "accent-color-faded": "#3185ff50",
  "success-color": "#48d664",
  "success-color-faded": "#48d66450",
  "purple-color": "#9035ff",
  "purple-color-faded": "#9035ff50"
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "PrimaryButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "primary-color" },
    direction: { default: "row" },
    icon: {},
    iconSize: { default: "1.25rem" },
    fontSize: { default: "1rem" },
    reverse: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const iconColor = computed(() => {
      switch (props.variant) {
        case "base-color":
          return colors["secondary-color-faded"];
        case "primary-color":
          return colors["accent-color"];
        case "secondary-color":
          return colors["primary-color"];
        case "text-color":
          return colors["primary-color"];
        case "accent-color":
          return colors["primary-color"];
        case "purple-color":
          return colors["primary-color"];
        case "success-color":
          return colors["primary-color"];
        case "error-color":
          return colors["primary-color"];
        default:
          return colors["base-color-faded"];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1;
      _push(`<span${ssrRenderAttrs(mergeProps({
        role: "button",
        tabindex: "0",
        class: ["button noselect", _ctx.variant],
        style: { flexDirection: _ctx.direction, fontSize: _ctx.fontSize }
      }, _attrs))} data-v-5534223a>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          class: ["icon", { "icon--reverse": _ctx.reverse }],
          icon: _ctx.icon,
          size: _ctx.iconSize || void 0,
          color: iconColor.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</span>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/PrimaryButton.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-5534223a"]]);
const _imports_0 = "" + __buildAssetsURL("logo-dark.KgTey4VC.svg");
const _sfc_main$3 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$4;
  const _component_UIPrimaryButton = __nuxt_component_0$2;
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-efe49368><nav class="header__nav" data-v-efe49368><ul class="header__nav__ul" data-v-efe49368><li class="header__nav__ul__li" data-v-efe49368>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img class="logo"${ssrRenderAttr("src", _imports_0)} alt="logo supernotaire" data-v-efe49368${_scopeId}>`);
      } else {
        return [
          createVNode("img", {
            class: "logo",
            src: _imports_0,
            alt: "logo supernotaire"
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="header__nav__ul__li" style="${ssrRenderStyle({ "margin-left": "auto" })}" data-v-efe49368>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/notaires",
    exact: ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Notaires`);
      } else {
        return [
          createTextVNode("Notaires")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="header__nav__ul__li" data-v-efe49368>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/vendeurs",
    exact: ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Vendeurs de biens`);
      } else {
        return [
          createTextVNode("Vendeurs de biens")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="header__nav__ul__li" data-v-efe49368>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/outils",
    exact: ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Outils`);
      } else {
        return [
          createTextVNode("Outils")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="header__nav__ul__li" data-v-efe49368>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/comment-ca-marche",
    exact: ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Comment ça marche ?`);
      } else {
        return [
          createTextVNode("Comment ça marche ?")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><div class="header__nav__buttons" data-v-efe49368>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/inscription" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_UIPrimaryButton, {
          variant: "accent-color",
          icon: "arrow_right"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` Inscription `);
            } else {
              return [
                createTextVNode(" Inscription ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_UIPrimaryButton, {
            variant: "accent-color",
            icon: "arrow_right"
          }, {
            default: withCtx(() => [
              createTextVNode(" Inscription ")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></nav></header>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeaderComponent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-efe49368"]]);
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-16614633>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</section>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Container.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-16614633"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: ["error"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HeaderComponent = __nuxt_component_0$1;
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIPrimaryButton = __nuxt_component_0$2;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_HeaderComponent, null, null, _parent));
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="error" data-v-75e849ee${_scopeId}><div class="error__message" data-v-75e849ee${_scopeId}><h1 class="subtitles" data-v-75e849ee${_scopeId}>Oooops... erreur ${ssrInterpolate(__props.error.statusCode)}</h1>`);
            if (__props.error === 404) {
              _push2(`<h2 class="paragraphs" data-v-75e849ee${_scopeId}>Cette page n&#39;existe pas.</h2>`);
            } else if (__props.error === 403) {
              _push2(`<h2 class="paragraphs" data-v-75e849ee${_scopeId}> Le lien de confirmation de votre email a expiré. </h2>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Retour à la page d&#39;accueil`);
                      } else {
                        return [
                          createTextVNode("Retour à la page d'accueil")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                      default: withCtx(() => [
                        createTextVNode("Retour à la page d'accueil")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "error" }, [
                createVNode("div", { class: "error__message" }, [
                  createVNode("h1", { class: "subtitles" }, "Oooops... erreur " + toDisplayString(__props.error.statusCode), 1),
                  __props.error === 404 ? (openBlock(), createBlock("h2", {
                    key: 0,
                    class: "paragraphs"
                  }, "Cette page n'existe pas.")) : __props.error === 403 ? (openBlock(), createBlock("h2", {
                    key: 1,
                    class: "paragraphs"
                  }, " Le lien de confirmation de votre email a expiré. ")) : createCommentVNode("", true),
                  createVNode(_component_NuxtLink, { to: "/" }, {
                    default: withCtx(() => [
                      createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                        default: withCtx(() => [
                          createTextVNode("Retour à la page d'accueil")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-75e849ee"]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { Je as J, __nuxt_component_0$4 as _, _export_sfc as a, __nuxt_component_0 as b, __nuxt_component_0$2 as c, colors as d, entry$1 as default, __nuxt_component_1 as e, useNuxtApp as f, asyncDataDefaults as g, createError as h, useRoute as i, __nuxt_component_1$2 as j, _imports_0 as k, __nuxt_component_0$1 as l, tryUseNuxtApp as t, useState as u };
//# sourceMappingURL=server.mjs.map
