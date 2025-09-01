import { a as _export_sfc, i as useRoute, b as __nuxt_component_0, _ as __nuxt_component_0$4 } from './server.mjs';
import { defineComponent, withAsyncContext, withCtx, unref, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-Dm5ojLGe.mjs';
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
import 'floating-vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const notarySlug = route.params.slug;
    const {
      data: notary,
      pending,
      error
    } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "notary",
      () => $fetch(
        `https://supernotaire-kiro-production.up.railway.app/api/notaries/${notarySlug}`,
        {
          parseResponse: (resp) => JSON.parse(resp)
        }
      )
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pending)) {
              _push2(`<div data-v-dd8e3165${_scopeId}>Chargement\u2026</div>`);
            } else if (unref(error)) {
              _push2(`<div data-v-dd8e3165${_scopeId}> Notaire\xA0introuvable: ${ssrInterpolate(unref(error).statusCode)}\xA0\u2013\xA0${ssrInterpolate(unref(error).statusMessage)}</div>`);
            } else if (unref(notary)) {
              _push2(`<div class="notary-page" data-v-dd8e3165${_scopeId}><h1 class="notary-page__title" data-v-dd8e3165${_scopeId}>M\u1D49 ${ssrInterpolate(unref(notary).name)}</h1><div class="notary-page__office" data-v-dd8e3165${_scopeId}><span data-v-dd8e3165${_scopeId}>${ssrInterpolate(unref(notary).office.addressLine1)}</span><span data-v-dd8e3165${_scopeId}>${ssrInterpolate(unref(notary).office.city)}</span><span data-v-dd8e3165${_scopeId}>${ssrInterpolate(unref(notary).office.postalCode)}, ${ssrInterpolate(unref(notary).office.region)}</span></div><div class="notary-page__contact" data-v-dd8e3165${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `tel:${unref(notary).contact.phone}`,
                class: "notary-page__contact__phone"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(notary).contact.phone)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(notary).contact.phone), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `mailto:${unref(notary).contact.email}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(notary).contact.email)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(notary).contact.email), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (unref(notary).contact.website) {
                _push2(`<span data-v-dd8e3165${_scopeId}>${ssrInterpolate(unref(notary).contact.website)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(pending) ? (openBlock(), createBlock("div", { key: 0 }, "Chargement\u2026")) : unref(error) ? (openBlock(), createBlock("div", { key: 1 }, " Notaire\xA0introuvable: " + toDisplayString(unref(error).statusCode) + "\xA0\u2013\xA0" + toDisplayString(unref(error).statusMessage), 1)) : unref(notary) ? (openBlock(), createBlock("div", {
                key: 2,
                class: "notary-page"
              }, [
                createVNode("h1", { class: "notary-page__title" }, "M\u1D49 " + toDisplayString(unref(notary).name), 1),
                createVNode("div", { class: "notary-page__office" }, [
                  createVNode("span", null, toDisplayString(unref(notary).office.addressLine1), 1),
                  createVNode("span", null, toDisplayString(unref(notary).office.city), 1),
                  createVNode("span", null, toDisplayString(unref(notary).office.postalCode) + ", " + toDisplayString(unref(notary).office.region), 1)
                ]),
                createVNode("div", { class: "notary-page__contact" }, [
                  createVNode(_component_NuxtLink, {
                    to: `tel:${unref(notary).contact.phone}`,
                    class: "notary-page__contact__phone"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(notary).contact.phone), 1)
                    ]),
                    _: 1
                  }, 8, ["to"]),
                  createVNode(_component_NuxtLink, {
                    to: `mailto:${unref(notary).contact.email}`
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(notary).contact.email), 1)
                    ]),
                    _: 1
                  }, 8, ["to"]),
                  unref(notary).contact.website ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(unref(notary).contact.website), 1)) : createCommentVNode("", true)
                ])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/annuaire/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dd8e3165"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-DCl-8X3B.mjs.map
