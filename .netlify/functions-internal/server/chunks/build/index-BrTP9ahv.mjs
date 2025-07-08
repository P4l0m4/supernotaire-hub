import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0 } from './Container-3HYb7yMs.mjs';
import { _ as _export_sfc, b as __nuxt_component_0$3, d as __nuxt_component_1$1, c as colors, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, mergeProps, toDisplayString, computed, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { u as useHead } from './v3-BRmP28IU.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'dayjs';
import 'dayjs/plugin/updateLocale.js';
import 'dayjs/plugin/utc.js';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TertiaryButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "text-color" },
    direction: { default: "row" },
    icon: {},
    iconSize: { default: "1.25rem" },
    fontSize: { default: "1rem" }
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
        case "error-color":
          return colors["primary-color"];
        default:
          return colors["base-color-faded"];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconComponent = __nuxt_component_0$1;
      _push(`<span${ssrRenderAttrs(mergeProps({
        role: "button",
        tabindex: "0",
        class: "button noselect",
        style: {
          flexDirection: _ctx.direction,
          fontSize: _ctx.fontSize,
          color: _ctx.variant ? unref(colors)[_ctx.variant] : unref(colors)["text-color"]
        }
      }, _attrs))} data-v-1cab6c93>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_IconComponent, {
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TertiaryButton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-1cab6c93"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ArticlePreview",
  __ssrInlineRender: true,
  props: {
    image: {},
    title: {},
    description: {},
    link: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_TertiaryButton = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        class: "article-preview",
        to: _ctx.link
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="article-preview__image"${ssrRenderAttr("src", _ctx.image)}${ssrRenderAttr("alt", _ctx.title)} data-v-166df3b1${_scopeId}><h2 class="article-preview__title" data-v-166df3b1${_scopeId}>${ssrInterpolate(_ctx.title)}</h2><p class="paragraphs" data-v-166df3b1${_scopeId}>${ssrInterpolate(_ctx.description)}</p>`);
            _push2(ssrRenderComponent(_component_TertiaryButton, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`En savoir plus`);
                } else {
                  return [
                    createTextVNode("En savoir plus")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("img", {
                class: "article-preview__image",
                src: _ctx.image,
                alt: _ctx.title
              }, null, 8, ["src", "alt"]),
              createVNode("h2", { class: "article-preview__title" }, toDisplayString(_ctx.title), 1),
              createVNode("p", { class: "paragraphs" }, toDisplayString(_ctx.description), 1),
              createVNode(_component_TertiaryButton, null, {
                default: withCtx(() => [
                  createTextVNode("En savoir plus")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticlePreview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-166df3b1"]]);
const signature = "" + buildAssetsURL("signature.B8FrT2ao.jpg");
const vespa = "" + buildAssetsURL("vespa.BZytfWen.jpg");
const securite = "" + buildAssetsURL("securite.BNEkwmXP.jpg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Finalisation rapide de vente immobili\xE8re | Supernotaire",
      meta: [
        {
          name: "description",
          content: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:title",
          content: "Finalisation rapide de vente immobili\xE8re | Supernotaire"
        },
        {
          property: "og:url",
          content: "https://opengraph.b-cdn.net/production/images/0d54207b-5b60-4086-9160-a5b7df6bf2c6.jpg?token=iHNWoqdZlZfJaFO_MRtDAX6VyogK9vW0tj-ShcS9QsQ&height=982&width=968&expires=33284606311"
        },
        {
          property: "og:image",
          content: "https://martinimmo.n/og-image.jpg"
        },
        {
          property: "og:description",
          content: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."
        }
      ]
    });
    const articles = [
      {
        image: signature,
        title: "Acc\xE8s facilit\xE9 aux notaires",
        description: "D\xE9couvrez comment cr\xE9er un dossier de vente immobili\xE8re en quelques \xE9tapes simples.",
        link: "/comment-ca-marche"
      },
      {
        image: vespa,
        title: "D\xE9marches all\xE9g\xE9es",
        description: "Apprenez les avantages de la digitalisation dans le processus de vente immobili\xE8re.",
        link: "/comment-ca-marche"
      },
      {
        image: securite,
        title: "S\xE9curit\xE9 et confidentialit\xE9",
        description: "Vos documents et vos donn\xE9es sont prot\xE9g\xE9s par des mesures de s\xE9curit\xE9 avanc\xE9es. Supernotaire garantit la confidentialit\xE9 de vos informations personnelles et administratives.",
        link: "/comment-ca-marche"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_PrimaryButton = __nuxt_component_1$1;
      const _component_ArticlePreview = __nuxt_component_3;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hero" data-v-9f36329a${_scopeId}><h1 class="hero__title" data-v-9f36329a${_scopeId}> Finalisez vos ventes immobili\xE8res \xE0 la vitesse de l\u2019\xE9clair </h1><p class="paragraphs" data-v-9f36329a${_scopeId}> Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez.<br data-v-9f36329a${_scopeId}>Suivez en direct la progression de votre dossier et ne fournissez jamais les m\xEAmes informations deux fois. </p>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "hero__link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_PrimaryButton, {
                    variant: "accent-color",
                    icon: "arrow_right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Cr\xE9er mon dossier `);
                      } else {
                        return [
                          createTextVNode(" Cr\xE9er mon dossier ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(` C&#39;est totalement gratuit ! `);
                } else {
                  return [
                    createVNode(_component_PrimaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er mon dossier ")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" C'est totalement gratuit ! ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="perks" data-v-9f36329a${_scopeId}><!--[-->`);
            ssrRenderList(articles, (article) => {
              _push2(ssrRenderComponent(_component_ArticlePreview, {
                key: article.title,
                image: article.image,
                title: article.title,
                description: article.description,
                link: article.link
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "hero" }, [
                createVNode("h1", { class: "hero__title" }, " Finalisez vos ventes immobili\xE8res \xE0 la vitesse de l\u2019\xE9clair "),
                createVNode("p", { class: "paragraphs" }, [
                  createTextVNode(" Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."),
                  createVNode("br"),
                  createTextVNode("Suivez en direct la progression de votre dossier et ne fournissez jamais les m\xEAmes informations deux fois. ")
                ]),
                createVNode(_component_NuxtLink, {
                  to: "/",
                  class: "hero__link"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_PrimaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er mon dossier ")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" C'est totalement gratuit ! ")
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "perks" }, [
                (openBlock(), createBlock(Fragment, null, renderList(articles, (article) => {
                  return createVNode(_component_ArticlePreview, {
                    key: article.title,
                    image: article.image,
                    title: article.title,
                    description: article.description,
                    link: article.link
                  }, null, 8, ["image", "title", "description", "link"]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9f36329a"]]);

export { index as default };
//# sourceMappingURL=index-BrTP9ahv.mjs.map
