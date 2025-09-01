import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { a as _export_sfc, b as __nuxt_component_0, _ as __nuxt_component_0$3, c as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_7 } from './TertiaryButton-B2pqK--O.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, unref, createBlock, openBlock, Fragment, renderList, mergeProps, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_3$1 } from './DidYouKnow-D3KAcN22.mjs';
import { d as dots, _ as _sfc_main$2 } from './dots-big-D1hnr5WP.mjs';
import { u as useHead } from './v3-BRmP28IU.mjs';
import { u as useJsonld } from './composable-ChyRw7se.mjs';
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
import 'floating-vue';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  props: {
    image: {},
    title: {},
    subtitle: {},
    link: {},
    linkText: {},
    decoration: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UITertiaryButton = __nuxt_component_7;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        class: ["profile", {
          "profile--left": _ctx.decoration === "left",
          "profile--right": _ctx.decoration === "right"
        }],
        to: _ctx.link,
        "aria-label": "montrez-moi comment"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="profile__illustration" data-v-8c31344c${_scopeId}><img class="profile__illustration__image"${ssrRenderAttr("src", _ctx.image)}${ssrRenderAttr("alt", `image de ${_ctx.title}`)} data-v-8c31344c${_scopeId}></div><h2 class="profile__title" data-v-8c31344c${_scopeId}>${ssrInterpolate(_ctx.title)}</h2><p class="profile__subtitle" data-v-8c31344c${_scopeId}>${ssrInterpolate(_ctx.subtitle)}</p>`);
            _push2(ssrRenderComponent(_component_UITertiaryButton, {
              class: "profile__link",
              variant: "text-color",
              icon: "arrow_right"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.linkText)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.linkText), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "profile__illustration" }, [
                createVNode("img", {
                  class: "profile__illustration__image",
                  src: _ctx.image,
                  alt: `image de ${_ctx.title}`
                }, null, 8, ["src", "alt"])
              ]),
              createVNode("h2", { class: "profile__title" }, toDisplayString(_ctx.title), 1),
              createVNode("p", { class: "profile__subtitle" }, toDisplayString(_ctx.subtitle), 1),
              createVNode(_component_UITertiaryButton, {
                class: "profile__link",
                variant: "text-color",
                icon: "arrow_right"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.linkText), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/profile.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8c31344c"]]);
const notary = "" + buildAssetsURL("accountant-54.BvzJt0iB.svg");
const seller = "" + buildAssetsURL("real-estate-agent-76.Bz2QUofJ.svg");
const hero = "" + buildAssetsURL("super-hero.OmcrdAjF.svg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const url = ref();
    const profiles = ref([
      {
        image: notary,
        title: "Notaires d\xE9bord\xE9s",
        subtitle: "Gagnez du temps facturable et \xE9largissez votre client\xE8le.",
        link: "/notaires#features",
        linkText: "Montrez-moi comment",
        decoration: "left"
      },
      {
        image: seller,
        title: "Vendeurs press\xE9s",
        subtitle: "Facilitez vos d\xE9marches et acc\xE9dez plus rapidement \xE0 un notaire.",
        link: "/vendeurs#features",
        linkText: "Montrez-moi comment",
        decoration: "right"
      }
    ]);
    useHead({
      title: "Supernotaire | Finalisation rapide de vente immobili\xE8re",
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
          content: "Supernotaire | Finalisation rapide de vente immobili\xE8re"
        },
        {
          property: "og:url",
          content: "https://supernotaire.fr/"
        },
        {
          property: "og:image",
          content: "https://opengraph.b-cdn.net/production/images/a20c3e90-cc8a-4e2d-9841-b0e973037764.png?token=94GB_JSm5iZfopHGGLQTr5sxi1J4xl9L2EXPVPwg3hE&height=651&width=1200&expires=33287987916"
        },
        {
          property: "og:description",
          content: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."
        }
      ]
    });
    useJsonld(() => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Supernotaire | Finalisation rapide de vente immobili\xE8re",
      description: "La plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res.",
      url: url.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UIPrimaryButton = __nuxt_component_1;
      const _component_UIProfile = __nuxt_component_3;
      const _component_UIDidYouKnow = __nuxt_component_3$1;
      const _component_HotjarTracking = _sfc_main$2;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hero" data-v-ad546b59${_scopeId}><div class="hero__text" data-v-ad546b59${_scopeId}><h1 class="hero__text__title" data-v-ad546b59${_scopeId}> La plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res </h1><p class="hero__text__subtitle" data-v-ad546b59${_scopeId}> Digital, intuitif et sans-fronti\xE8res. Pour les vendeurs press\xE9s et les notaires d\xE9bord\xE9s. </p><div class="hero__text__link" data-v-ad546b59${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "#profiles",
              "aria-label": "D\xE9couvrir notre offre",
              style: { "width": "100%" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` D\xE9couvrir notre offre `);
                      } else {
                        return [
                          createTextVNode(" D\xE9couvrir notre offre ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                      default: withCtx(() => [
                        createTextVNode(" D\xE9couvrir notre offre ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(` Sans frais, de la cr\xE9ation du dossier \xE0 la signature de l\u2019acte de vente. </div></div><div class="hero__image" data-v-ad546b59${_scopeId}><img${ssrRenderAttr("src", unref(hero))} alt="Supernotaire, la plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res" data-v-ad546b59${_scopeId}><img class="hero__image__dots"${ssrRenderAttr("src", unref(dots))} alt="dots" data-v-ad546b59${_scopeId}></div></div><div id="profiles" class="profiles" data-v-ad546b59${_scopeId}><!--[-->`);
            ssrRenderList(profiles.value, (profile) => {
              _push2(ssrRenderComponent(_component_UIProfile, {
                key: profile.title,
                image: profile.image,
                title: profile.title,
                subtitle: profile.subtitle,
                link: profile.link,
                linkText: profile.linkText,
                decoration: profile.decoration
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "hero" }, [
                createVNode("div", { class: "hero__text" }, [
                  createVNode("h1", { class: "hero__text__title" }, " La plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res "),
                  createVNode("p", { class: "hero__text__subtitle" }, " Digital, intuitif et sans-fronti\xE8res. Pour les vendeurs press\xE9s et les notaires d\xE9bord\xE9s. "),
                  createVNode("div", { class: "hero__text__link" }, [
                    createVNode(_component_NuxtLink, {
                      to: "#profiles",
                      "aria-label": "D\xE9couvrir notre offre",
                      style: { "width": "100%" }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx(() => [
                            createTextVNode(" D\xE9couvrir notre offre ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createTextVNode(" Sans frais, de la cr\xE9ation du dossier \xE0 la signature de l\u2019acte de vente. ")
                  ])
                ]),
                createVNode("div", { class: "hero__image" }, [
                  createVNode("img", {
                    src: unref(hero),
                    alt: "Supernotaire, la plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res"
                  }, null, 8, ["src"]),
                  createVNode("img", {
                    class: "hero__image__dots",
                    src: unref(dots),
                    alt: "dots"
                  }, null, 8, ["src"])
                ])
              ]),
              createVNode("div", {
                id: "profiles",
                class: "profiles"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(profiles.value, (profile) => {
                  return openBlock(), createBlock(_component_UIProfile, {
                    key: profile.title,
                    image: profile.image,
                    title: profile.title,
                    subtitle: profile.subtitle,
                    link: profile.link,
                    linkText: profile.linkText,
                    decoration: profile.decoration
                  }, null, 8, ["image", "title", "subtitle", "link", "linkText", "decoration"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIDidYouKnow, { title: "Des outils gratuits sont disponibles pour vous aider." }, {
              text: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Nous avons con\xE7u des outils intuitifs et en acc\xE8s libre pour vous aider \xE0 avancer dans vos d\xE9marches immobili\xE8res: cr\xE9ation de pr\xE9-\xE9tat dat\xE9, estimation de valeur fonci\xE8re, etc. Aucune inscription n&#39;est requise. `);
                } else {
                  return [
                    createTextVNode(" Nous avons con\xE7u des outils intuitifs et en acc\xE8s libre pour vous aider \xE0 avancer dans vos d\xE9marches immobili\xE8res: cr\xE9ation de pr\xE9-\xE9tat dat\xE9, estimation de valeur fonci\xE8re, etc. Aucune inscription n'est requise. ")
                  ];
                }
              }),
              cta: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/outils",
                    "aria-label": "D\xE9couvrir nos outils"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`D\xE9couvrir nos outils`);
                            } else {
                              return [
                                createTextVNode("D\xE9couvrir nos outils")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                            default: withCtx(() => [
                              createTextVNode("D\xE9couvrir nos outils")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      to: "/outils",
                      "aria-label": "D\xE9couvrir nos outils"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx(() => [
                            createTextVNode("D\xE9couvrir nos outils")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIDidYouKnow, { title: "Des outils gratuits sont disponibles pour vous aider." }, {
                text: withCtx(() => [
                  createTextVNode(" Nous avons con\xE7u des outils intuitifs et en acc\xE8s libre pour vous aider \xE0 avancer dans vos d\xE9marches immobili\xE8res: cr\xE9ation de pr\xE9-\xE9tat dat\xE9, estimation de valeur fonci\xE8re, etc. Aucune inscription n'est requise. ")
                ]),
                cta: withCtx(() => [
                  createVNode(_component_NuxtLink, {
                    to: "/outils",
                    "aria-label": "D\xE9couvrir nos outils"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                        default: withCtx(() => [
                          createTextVNode("D\xE9couvrir nos outils")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_HotjarTracking, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ad546b59"]]);

export { index as default };
//# sourceMappingURL=index-DjVkBI7R.mjs.map
