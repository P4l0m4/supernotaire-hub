import { _ as __nuxt_component_0 } from './Container-3HYb7yMs.mjs';
import { _ as _export_sfc, b as __nuxt_component_0$3, a as __nuxt_component_0$1, c as colors } from './server.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useHead } from './v3-BRmP28IU.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'dayjs';
import 'dayjs/plugin/updateLocale.js';
import 'dayjs/plugin/utc.js';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Perk",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconComponent = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "perk" }, _attrs))} data-v-02d3b820>`);
      _push(ssrRenderComponent(_component_IconComponent, {
        icon: _ctx.icon,
        size: "2rem"
      }, null, _parent));
      _push(`<h2 class="perk__title" data-v-02d3b820>${ssrInterpolate(_ctx.title)}</h2><p class="paragraphs" data-v-02d3b820>${ssrInterpolate(_ctx.description)}</p></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Perk.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-02d3b820"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SecondaryButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "primary-color" },
    direction: { default: "row" },
    icon: {},
    iconSize: { default: "1.25rem" },
    fontSize: { default: "1rem" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconComponent = __nuxt_component_0$1;
      _push(`<span${ssrRenderAttrs(mergeProps({
        role: "button",
        tabindex: "0",
        class: ["button noselect", _ctx.variant],
        style: { flexDirection: _ctx.direction, fontSize: _ctx.fontSize }
      }, _attrs))} data-v-2f9d0c83>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_IconComponent, {
          icon: _ctx.icon,
          size: _ctx.iconSize || void 0,
          color: _ctx.variant ? unref(colors)[_ctx.variant] : unref(colors)["text-color"]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</span>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SecondaryButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2f9d0c83"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "comment-ca-marche",
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
    const perks = [
      {
        icon: "lightning",
        title: "Automatisation des t\xE2ches r\xE9p\xE9titives",
        description: "Gagnez du temps et r\xE9duisez les erreurs en automatisant les t\xE2ches redondantes. Nous nous occupons de pr\xE9-r\xE9diger vos documents et vous guidons jusqu\u2019au bout du processus."
      },
      {
        icon: "sparkle",
        title: "Formulaires intelligents",
        description: "Ne renseignez jamais les m\xEAmes informations deux fois gr\xE2ce aux formulaires intelligents qui se pr\xE9-remplissent \xE0 partir des documents que vous fournissez."
      },
      {
        icon: "clock_countdown",
        title: "Suivi en temps r\xE9el",
        description: "Ne r\xE9clamez plus des informations. Suivez facilement la progression du mandat de vente en temps r\xE9el et soyez notifi\xE9 lorsque votre intervention est n\xE9cessaire."
      },
      {
        icon: "globe",
        title: "Digital & sans fronti\xE8res",
        description: "De la cr\xE9ation du dossier \xE0 la signature de l\u2019acte de vente, tout se fait en ligne. De quoi vous faire gagner du temps et vous lib\xE9rer des contraintes g\xE9ographiques."
      },
      {
        icon: "lock_key",
        title: "S\xE9curit\xE9 renforc\xE9e",
        description: "Vos documments et vos donn\xE9es sont prot\xE9g\xE9s par des mesures de s\xE9curit\xE9 avanc\xE9es. Supernotaire garantit la confidentialit\xE9 de vos informations personnelles et administratives, conform\xE9ment avec les plus hauts standards de s\xE9curit\xE9 informatique."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_Perk = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_SecondaryButton = __nuxt_component_3;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hero" data-v-747a240b${_scopeId}><h1 class="hero__title" data-v-747a240b${_scopeId}>Supernotaire.fr</h1><p class="paragraphs" data-v-747a240b${_scopeId}> La LegalTech d\u2019int\xE9r\xEAt g\xE9n\xE9ral 100% fran\xE7aise contruite avec les notaires </p></div><div class="perks" data-v-747a240b${_scopeId}><!--[-->`);
            ssrRenderList(perks, (perk) => {
              _push2(ssrRenderComponent(_component_Perk, {
                key: perk.title,
                icon: perk.icon,
                title: perk.title,
                description: perk.description
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "perks__link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_SecondaryButton, {
                    variant: "accent-color",
                    icon: "arrow_right",
                    style: { "height": "100%" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Cr\xE9er mon compte `);
                      } else {
                        return [
                          createTextVNode(" Cr\xE9er mon compte ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_SecondaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right",
                      style: { "height": "100%" }
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er mon compte ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "hero" }, [
                createVNode("h1", { class: "hero__title" }, "Supernotaire.fr"),
                createVNode("p", { class: "paragraphs" }, " La LegalTech d\u2019int\xE9r\xEAt g\xE9n\xE9ral 100% fran\xE7aise contruite avec les notaires ")
              ]),
              createVNode("div", { class: "perks" }, [
                (openBlock(), createBlock(Fragment, null, renderList(perks, (perk) => {
                  return createVNode(_component_Perk, {
                    key: perk.title,
                    icon: perk.icon,
                    title: perk.title,
                    description: perk.description
                  }, null, 8, ["icon", "title", "description"]);
                }), 64)),
                createVNode(_component_NuxtLink, {
                  to: "/",
                  class: "perks__link"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_SecondaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right",
                      style: { "height": "100%" }
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er mon compte ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/comment-ca-marche.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const commentCaMarche = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-747a240b"]]);

export { commentCaMarche as default };
//# sourceMappingURL=comment-ca-marche-CgKIjZbU.mjs.map
