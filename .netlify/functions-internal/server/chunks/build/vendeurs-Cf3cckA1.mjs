import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { d as colors, b as __nuxt_component_0, _ as __nuxt_component_0$3, c as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './FeatureComponent-BHnURqOK.mjs';
import { d as dots, _ as _sfc_main$1 } from './dots-big-D1hnr5WP.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, unref, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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

const annuaire = "" + buildAssetsURL("time-39.DubmkANr.svg");
const dossier = "" + buildAssetsURL("files-and-folder-78.Bx7aqLT5.svg");
const progress = "" + buildAssetsURL("checklist-71.CVOBphwG.svg");
const hero = "" + buildAssetsURL("pool.JtDEkVPz.svg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "vendeurs",
  __ssrInlineRender: true,
  setup(__props) {
    const url = ref();
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
    const features = ref([
      {
        title: "D\xE9marches all\xE9g\xE9es",
        subtitle: "Trouvez et envoyez vos documents facilement",
        description: "Gr\xE2ce \xE0 nos formulaires intelligents, vous \xEAtes s\xFBr(e) de d\xE9poser le bon document au bon endroit et ne fournissez jamais les m\xEAmes informations deux fois.",
        image: dossier,
        color: colors["accent-color"]
      },
      {
        title: "Acc\xE8s facilit\xE9 aux notaires",
        subtitle: "N\u2019attendez plus pour confier votre dossier \xE0 un notaire",
        description: "Pas de contraintes g\xE9ographiques ! Confiez votre dossier \xE0 un notaire disponible n\u2019importe o\xF9 en France en quelques jours, pas en quelques semaines.",
        image: annuaire,
        color: colors["purple-color"],
        reverse: true
      },
      {
        title: "Suivi en temps r\xE9el",
        subtitle: "Suivez la progression de votre dossier en temps r\xE9el",
        description: "Visualisez votre propre progression ainsi que celle de votre notaire et de votre acheteur. D\xE8s que la collecte des informations avance, vous \xEAtes pr\xE9venu(e) de la prochaine action \xE0 r\xE9aliser.",
        image: progress,
        color: colors["success-color"]
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
      const _component_HotjarTracking = _sfc_main$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hero"${_scopeId}><div class="hero__text"${_scopeId}><h1 class="hero__text__title"${_scopeId}> Acc\xE9l\xE9rez la finalisation de vos ventes immobili\xE8res </h1><p class="hero__text__subtitle"${_scopeId}> Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez. </p>`);
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
                    createVNode(_component_UIPrimaryButton, {
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
            _push2(`</div><div class="hero__image"${_scopeId}><img${ssrRenderAttr("src", unref(hero))} alt="Supernotaire, la plateforme qui acc\xE9l\xE8re la finalisation des ventes immobili\xE8res"${_scopeId}><img class="hero__image__dots"${ssrRenderAttr("src", unref(dots))} alt="dots"${_scopeId}></div></div>`);
            _push2(ssrRenderComponent(_component_Benefits, {
              title: "Vendeurs de biens immobiliers",
              subtitle: "+ 80% d\u2019efficacit\xE9 dans vos d\xE9marches",
              text: "Trouvez vos documents et informations sans prise de t\xEAte, d\xE9posez vos\n        papiers et laissez l\u2019IA remplir les formalit\xE9s \xE0 votre place."
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
          } else {
            return [
              createVNode("div", { class: "hero" }, [
                createVNode("div", { class: "hero__text" }, [
                  createVNode("h1", { class: "hero__text__title" }, " Acc\xE9l\xE9rez la finalisation de vos ventes immobili\xE8res "),
                  createVNode("p", { class: "hero__text__subtitle" }, " Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez. "),
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
                          createTextVNode(" Cr\xE9er mon dossier ")
                        ]),
                        _: 1
                      }),
                      createTextVNode(" C'est totalement gratuit ! ")
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
                title: "Vendeurs de biens immobiliers",
                subtitle: "+ 80% d\u2019efficacit\xE9 dans vos d\xE9marches",
                text: "Trouvez vos documents et informations sans prise de t\xEAte, d\xE9posez vos\n        papiers et laissez l\u2019IA remplir les formalit\xE9s \xE0 votre place."
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
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/vendeurs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=vendeurs-Cf3cckA1.mjs.map
