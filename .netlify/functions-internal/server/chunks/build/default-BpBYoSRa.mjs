import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as _export_sfc, e as __nuxt_component_0$1, b as __nuxt_component_0$3, d as __nuxt_component_1$1 } from './server.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
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

const _imports_0 = "" + buildAssetsURL("logo-light.BYrUeBhQ.svg");
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$3;
  const _component_PrimaryButton = __nuxt_component_1$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-53861568><div class="footer__links-container" data-v-53861568><div class="footer__links-container__special-box" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "footer__links-container__special-box__title-section",
    to: "/"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img class="footer__links-container__special-box__title-section__logo"${ssrRenderAttr("src", _imports_0)} alt="logo martinimmo" data-v-53861568${_scopeId}>`);
      } else {
        return [
          createVNode("img", {
            class: "footer__links-container__special-box__title-section__logo",
            src: _imports_0,
            alt: "logo martinimmo"
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<p class="paragraphs" data-v-53861568> Finalisez vos ventes immobili\xE8res \xE0 la vitesse de l\u2019\xE9clair </p></div><ul class="footer__links-container__links" data-v-53861568><h5 class="footer__links-container__links__title" data-v-53861568>Notaires</h5><li class="footer__links-container__links__li" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/faq-notaires" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`F.A.Q.`);
      } else {
        return [
          createTextVNode("F.A.Q.")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="footer__links-container__links__li" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    style: { "text-decoration": "underline" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Espace notaires`);
      } else {
        return [
          createTextVNode("Espace notaires")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><ul class="footer__links-container__links" data-v-53861568><h5 class="footer__links-container__links__title" data-v-53861568>Vendeurs</h5><li class="footer__links-container__links__li" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/faq-vendeurs" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`F.A.Q.`);
      } else {
        return [
          createTextVNode("F.A.Q.")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="footer__links-container__links__li" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    style: { "text-decoration": "underline" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Espace vendeurs`);
      } else {
        return [
          createTextVNode("Espace vendeurs")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><ul class="footer__links-container__links" data-v-53861568><h5 class="footer__links-container__links__title" data-v-53861568>Autres</h5><li class="footer__links-container__links__li" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/faq" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Comment \xE7a marche ?`);
      } else {
        return [
          createTextVNode("Comment \xE7a marche ?")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><div class="footer__links-container__special-box" data-v-53861568><div class="footer__links-container__special-box__title-section" data-v-53861568><h4 class="footer__links-container__special-box__title-section__title" data-v-53861568> Gagnez du temps </h4></div><p class="paragraphs" data-v-53861568> Cr\xE9ez votre dossier de vente immobili\xE8re sans effort et confiez-le rapidement \xE0 un notaire. </p>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_PrimaryButton, {
          variant: "accent-color",
          icon: "arrow_right"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Cr\xE9er mon compte`);
            } else {
              return [
                createTextVNode("Cr\xE9er mon compte")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_PrimaryButton, {
            variant: "accent-color",
            icon: "arrow_right"
          }, {
            default: withCtx(() => [
              createTextVNode("Cr\xE9er mon compte")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><div class="footer__bottom-links" data-v-53861568>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "https://docs.google.com/document/d/e/2PACX-1vQW80YJ6C8B_FY9LEPW6j4pEz3IfThZ-StWlcqUTakTnIUuAxn7CcheVopddu5dpgjlal_Amibhh2GF/pub",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`CGV`);
      } else {
        return [
          createTextVNode("CGV")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "https://docs.google.com/document/d/e/2PACX-1vTOGTdv866qLzIX4H8alMu0WlN-CeYjKNgtsEIJiimH1npT3ypGF3KCcu3eN0h9zmYpVWgK8wzcQqyi/pub",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`CGU`);
      } else {
        return [
          createTextVNode("CGU")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "https://docs.google.com/document/d/e/2PACX-1vRl0b5T5OmciZCyENe13NQgpoZH2g7YlzJUzgwiQwjbwLoOAvtbgrQDE-xVRqncwj8pHzeM8XxDEvMF/pub",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`RGPD`);
      } else {
        return [
          createTextVNode("RGPD")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "https://tekilawebfactory.com",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Mentions l\xE9gales`);
      } else {
        return [
          createTextVNode("Mentions l\xE9gales")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "https://tekilawebfactory.com",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\xA9Supernotaire 2025`);
      } else {
        return [
          createTextVNode("\xA9Supernotaire 2025")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FooterComponent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-53861568"]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_HeaderComponent = __nuxt_component_0$1;
  const _component_FooterComponent = __nuxt_component_1;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_HeaderComponent, null, null, _parent));
  _push(`<main>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_FooterComponent, null, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-BpBYoSRa.mjs.map
