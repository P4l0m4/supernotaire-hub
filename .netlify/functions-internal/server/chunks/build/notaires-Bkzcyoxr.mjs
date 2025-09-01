import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { d as colors, b as __nuxt_component_0, _ as __nuxt_component_0$3, c as __nuxt_component_1, a as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './FeatureComponent-BHnURqOK.mjs';
import { _ as __nuxt_component_6 } from './SecondaryButton-Bz5oS0xB.mjs';
import { _ as __nuxt_component_7 } from './TertiaryButton-B2pqK--O.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, unref, createBlock, openBlock, Fragment, renderList, resolveComponent, mergeProps, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
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

const question = "" + buildAssetsURL("question-100.CiQRkA5K.svg");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Tarifs",
  __ssrInlineRender: true,
  setup(__props) {
    const plans = ref([
      {
        name: "Essentiel",
        price: "0\u20AC",
        frequency: "/mois",
        features: [
          {
            included: true,
            text: "10 dossiers intelligents par mois"
          },
          {
            included: true,
            text: "Pr\xE9-r\xE9daction de documents illimit\xE9e"
          },
          {
            included: true,
            text: "Visioconf\xE9rences s\xE9curis\xE9es illimit\xE9es"
          },
          {
            included: true,
            text: "Visibilit\xE9 et demandes d\u2019ouverture depuis l\u2019annuaire"
          },
          {
            included: false,
            text: "Espaces collaborateurs suppl\xE9mentaires (clercs, etc)"
          },
          {
            included: false,
            text: "Mise en avant dans l\u2019annuaire"
          }
        ],
        link: "/inscription",
        buttonType: "secondary"
      },
      {
        name: "Premium",
        price: "280\u20AC",
        frequency: "/mois",
        features: [
          {
            included: true,
            text: "Tout ce qui est inclus dans le plan essentiel"
          },
          {
            included: true,
            text: "Dossiers intelligents illimit\xE9s"
          },
          {
            included: true,
            text: "Mise en avant dans l\u2019annuaire"
          },
          {
            included: true,
            text: "2 espaces collaborateur s\xE9curis\xE9s et si\xE8ges suppl\xE9mentaires d\xE9gr\xE9ssifs"
          },
          {
            included: true,
            text: "Acc\xE8s prioritaire aux nouvelles fonctionnalit\xE9s"
          }
        ],
        link: "/inscription",
        buttonType: "primary"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UIPrimaryButton = __nuxt_component_1;
      const _component_UISecondaryButton = __nuxt_component_6;
      const _component_IconComponent = resolveComponent("IconComponent");
      const _component_UITertiaryButton = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tarifs" }, _attrs))} data-v-95be7445><div class="tarifs__headlines" data-v-95be7445><h3 class="tarifs__headlines__title" data-v-95be7445>Nos tarifs</h3><p class="tarifs__headlines__subtitle subtitles" data-v-95be7445> Commencez \xE0 gagner du temps facturable gratuitement ou d\xE9cuplez votre impact gr\xE2ce aux fonctionnalit\xE9s premium. </p></div><div class="tarifs__plans" data-v-95be7445><!--[-->`);
      ssrRenderList(unref(plans), (plan) => {
        _push(`<div class="tarifs__plans__plan" data-v-95be7445><div class="tarifs__plans__plan__header" data-v-95be7445><h4 class="tarifs__plans__plan__header__name" data-v-95be7445>${ssrInterpolate(plan.name)}</h4><div class="tarifs__plans__plan__header__price" data-v-95be7445><span class="tarifs__plans__plan__header__price__amount" data-v-95be7445>${ssrInterpolate(plan.price)}</span><span class="tarifs__plans__plan__header__price__frequency" data-v-95be7445>${ssrInterpolate(plan.frequency)}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: plan.link,
          class: "tarifs__plans__plan__link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (plan.buttonType === "primary") {
                _push2(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Commencer maintenant`);
                    } else {
                      return [
                        createTextVNode("Commencer maintenant")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (plan.buttonType === "secondary") {
                _push2(ssrRenderComponent(_component_UISecondaryButton, { variant: "accent-color" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Commencer maintenant`);
                    } else {
                      return [
                        createTextVNode("Commencer maintenant")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                plan.buttonType === "primary" ? (openBlock(), createBlock(_component_UIPrimaryButton, {
                  key: 0,
                  variant: "accent-color"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Commencer maintenant")
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                plan.buttonType === "secondary" ? (openBlock(), createBlock(_component_UISecondaryButton, {
                  key: 1,
                  variant: "accent-color"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Commencer maintenant")
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><ul class="tarifs__plans__plan__features" data-v-95be7445><!--[-->`);
        ssrRenderList(plan.features, (feature) => {
          _push(`<li class="tarifs__plans__plan__features__feature" data-v-95be7445>`);
          _push(ssrRenderComponent(_component_IconComponent, {
            icon: feature.included ? "check_circle" : "currency_circle_dollar",
            color: feature.included ? unref(colors)["success-color"] : unref(colors)["purple-color"],
            size: "1.21rem"
          }, null, _parent));
          _push(` ${ssrInterpolate(feature.text)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]--></div><div class="tarifs__questions" data-v-95be7445><img class="tarifs__questions__image"${ssrRenderAttr("src", unref(question))} alt="image question" data-v-95be7445><div class="tarifs__questions__text" data-v-95be7445><span class="tarifs__questions__text__title" data-v-95be7445>Une question ?</span><span class="tarifs__questions__text__subtitle" data-v-95be7445>Parlez-nous, nous pouvons vous aider.</span></div><div class="tarifs__questions__buttons" data-v-95be7445>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        "aria-label": "contact",
        style: { "width": "100%" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Nous contacter`);
                } else {
                  return [
                    createTextVNode("Nous contacter")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                default: withCtx(() => [
                  createTextVNode("Nous contacter")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/faq-notaires",
        "aria-label": "Foire aux questions"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UITertiaryButton, { variant: "text-color-faded" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Foire Aux Questions`);
                } else {
                  return [
                    createTextVNode("Foire Aux Questions")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UITertiaryButton, { variant: "text-color-faded" }, {
                default: withCtx(() => [
                  createTextVNode("Foire Aux Questions")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tarifs.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-95be7445"]]);
const coins = "" + buildAssetsURL("money-jar-71.BoOkX7K5.svg");
const relation = "" + buildAssetsURL("marketing-1-30.DV0ka37_.svg");
const contact = "" + buildAssetsURL("note-taking-100.Cpih0uEs.svg");
const hero = "" + buildAssetsURL("fly.Dm0RHv6G.svg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notaires",
  __ssrInlineRender: true,
  setup(__props) {
    const url = ref();
    useHead({
      title: "Supernotaire | Finalisation rapide de mandats de vente immobili\xE8re",
      meta: [
        {
          name: "description",
          content: "Digitalisez la gestion de vos mandats de vente immobili\xE8re, soyez visible \xE0 l\u2019\xE9chelle nationale et gagnez du temps facturable."
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
    const features = ref([
      {
        title: "Solution gratuite",
        subtitle: "Sans frais, de l\u2019ouverture du dossier \xE0 la signature de l\u2019acte de vente",
        description: "Ouverture et constitution autonomes des dossiers, pr\xE9-r\xE9daction des actes, visioconf\xE9rences et signatures s\xE9curis\xE9es gratuites, sans quitter votre navigateur.",
        image: coins,
        color: colors["success-color"]
      },
      {
        title: "Apport d\u2019Affaires",
        subtitle: "Etendez votre visibilit\xE9 \xE0 l\u2019\xE9chelle nationale",
        description: "Notre annuaire en ligne facilite la mise en relation avec vos prospects. Recevez des demandes d\u2019ouverture de dossiers sans effort commercial suppl\xE9mentaire.",
        image: relation,
        color: colors["purple-color"],
        reverse: true
      },
      {
        title: "D\xE9ontologie respect\xE9e",
        subtitle: "Gagnez du temps sur les t\xE2ches \xE0 faible valeur ajout\xE9e",
        description: "Avec Supernotaire, vous vous d\xE9barassez des t\xE2ches r\xE9p\xE9titives \xE0 faible valeur ajout\xE9e tout en pr\xE9servant votre devoir de conseil. Vous gardez toujours le contr\xF4le du temps que vous y consacrez.",
        image: contact,
        color: colors["accent-color"]
      }
    ]);
    useJsonld(() => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Supernotaire | Finalisation rapide de vente immobili\xE8re",
      description: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez.",
      url: url.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UIPrimaryButton = __nuxt_component_1;
      const _component_Benefits = __nuxt_component_3;
      const _component_UIFeatureComponent = __nuxt_component_4;
      const _component_Tarifs = __nuxt_component_5;
      const _component_HotjarTracking = _sfc_main$2;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hero"${_scopeId}><div class="hero__text"${_scopeId}><h1 class="hero__text__title"${_scopeId}> Gagnez du temps sur vos mandats de vente immobili\xE8re </h1><p class="hero__text__subtitle"${_scopeId}> Facilitez la collecte des \xE9l\xE9ments du dossier, d\xE9barassez-vous des t\xE2ches r\xE9p\xE9titives et entrez en relation avec des clients partout en France. </p>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/inscription",
              class: "hero__text__link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIPrimaryButton, {
                    variant: "accent-color",
                    icon: "arrow_right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Cr\xE9er un dossier `);
                      } else {
                        return [
                          createTextVNode(" Cr\xE9er un dossier ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(` Sans frais, de l&#39;ouverture \xE0 la signature. `);
                } else {
                  return [
                    createVNode(_component_UIPrimaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er un dossier ")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" Sans frais, de l'ouverture \xE0 la signature. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="hero__image"${_scopeId}><img${ssrRenderAttr("src", unref(hero))} alt="Supernotaire, la plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res"${_scopeId}><img class="hero__image__dots"${ssrRenderAttr("src", unref(dots))} alt="dots"${_scopeId}></div></div>`);
            _push2(ssrRenderComponent(_component_Benefits, {
              title: "Notaires d\xE9bord\xE9s",
              subtitle: "+ 60% de temps facturable",
              text: "Constituez les dossiers sans avoir courrir apr\xE8s les parties prenantes.\n        et automatisez les t\xE2ches r\xE9p\xE9titives \xE0 faible valeur ajout\xE9e."
            }, null, _parent2, _scopeId));
            _push2(`<div id="features" class="features"${_scopeId}><!--[-->`);
            ssrRenderList(features.value, (feature) => {
              _push2(ssrRenderComponent(_component_UIFeatureComponent, {
                key: feature.title,
                title: feature.title,
                subtitle: feature.subtitle,
                description: feature.description,
                image: feature.image,
                color: feature.color,
                reverse: feature.reverse
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_component_Tarifs, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "hero" }, [
                createVNode("div", { class: "hero__text" }, [
                  createVNode("h1", { class: "hero__text__title" }, " Gagnez du temps sur vos mandats de vente immobili\xE8re "),
                  createVNode("p", { class: "hero__text__subtitle" }, " Facilitez la collecte des \xE9l\xE9ments du dossier, d\xE9barassez-vous des t\xE2ches r\xE9p\xE9titives et entrez en relation avec des clients partout en France. "),
                  createVNode(_component_NuxtLink, {
                    to: "/inscription",
                    class: "hero__text__link"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIPrimaryButton, {
                        variant: "accent-color",
                        icon: "arrow_right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cr\xE9er un dossier ")
                        ]),
                        _: 1
                      }),
                      createTextVNode(" Sans frais, de l'ouverture \xE0 la signature. ")
                    ]),
                    _: 1
                  })
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
              createVNode(_component_Benefits, {
                title: "Notaires d\xE9bord\xE9s",
                subtitle: "+ 60% de temps facturable",
                text: "Constituez les dossiers sans avoir courrir apr\xE8s les parties prenantes.\n        et automatisez les t\xE2ches r\xE9p\xE9titives \xE0 faible valeur ajout\xE9e."
              }),
              createVNode("div", {
                id: "features",
                class: "features"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(features.value, (feature) => {
                  return openBlock(), createBlock(_component_UIFeatureComponent, {
                    key: feature.title,
                    title: feature.title,
                    subtitle: feature.subtitle,
                    description: feature.description,
                    image: feature.image,
                    color: feature.color,
                    reverse: feature.reverse
                  }, null, 8, ["title", "subtitle", "description", "image", "color", "reverse"]);
                }), 128))
              ]),
              createVNode(_component_Tarifs)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notaires.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notaires-Bkzcyoxr.mjs.map
