import { a as _export_sfc, b as __nuxt_component_0, e as __nuxt_component_1, d as colors, _ as __nuxt_component_0$4, c as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, withCtx, unref, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { c as copyToClipboard } from './otherFunctions-DTo9wMMj.mjs';
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
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const options = [
      {
        icon: "phone",
        text: "06 95 15 53 01"
      },
      {
        icon: "phone",
        text: "06 70 50 35 93"
      },
      {
        icon: "mail",
        text: "aurore.sajott@gmail.com"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_UIIconComponent = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIPrimaryButton = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="contact" data-v-5417d342${_scopeId}><div class="contact__headlines" data-v-5417d342${_scopeId}><h1 class="titles" data-v-5417d342${_scopeId}>Nous contacter</h1><p class="subtitles" data-v-5417d342${_scopeId}> Des questions sur la plateforme ? Envie de nous soutenir ou de participer \xE0 la b\xEAta ? </p></div><div class="contact__options" data-v-5417d342${_scopeId}><!--[-->`);
            ssrRenderList(options, (option) => {
              _push2(`<div class="contact__options__option" data-v-5417d342${_scopeId}><span class="contact__options__option__icon" data-v-5417d342${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIIconComponent, {
                icon: option.icon,
                color: unref(colors)["accent-color"],
                size: "1.75rem"
              }, null, _parent2, _scopeId));
              _push2(`</span> ${ssrInterpolate(option.text)} `);
              _push2(ssrRenderComponent(_component_UIIconComponent, {
                icon: "copy",
                color: unref(colors)["text-color-faded"],
                size: "1rem",
                class: "contact__options__option__copy-icon"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/inscription",
              "aria-label": "Tester l\u2019outil en avant-premi\xE8re",
              style: { "width": "100%" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIPrimaryButton, {
                    variant: "accent-color",
                    icon: "lightning_fill",
                    style: { "width": "100%", "margin-left": "auto" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Tester en avant-premi\xE8re `);
                      } else {
                        return [
                          createTextVNode(" Tester en avant-premi\xE8re ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UIPrimaryButton, {
                      variant: "accent-color",
                      icon: "lightning_fill",
                      style: { "width": "100%", "margin-left": "auto" }
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Tester en avant-premi\xE8re ")
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
              createVNode("div", { class: "contact" }, [
                createVNode("div", { class: "contact__headlines" }, [
                  createVNode("h1", { class: "titles" }, "Nous contacter"),
                  createVNode("p", { class: "subtitles" }, " Des questions sur la plateforme ? Envie de nous soutenir ou de participer \xE0 la b\xEAta ? ")
                ]),
                createVNode("div", { class: "contact__options" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(options, (option) => {
                    return createVNode("div", {
                      class: "contact__options__option",
                      key: option.text,
                      onClick: ($event) => unref(copyToClipboard)(option.text)
                    }, [
                      createVNode("span", { class: "contact__options__option__icon" }, [
                        createVNode(_component_UIIconComponent, {
                          icon: option.icon,
                          color: unref(colors)["accent-color"],
                          size: "1.75rem"
                        }, null, 8, ["icon", "color"])
                      ]),
                      createTextVNode(" " + toDisplayString(option.text) + " ", 1),
                      createVNode(_component_UIIconComponent, {
                        icon: "copy",
                        color: unref(colors)["text-color-faded"],
                        size: "1rem",
                        class: "contact__options__option__copy-icon"
                      }, null, 8, ["color"])
                    ], 8, ["onClick"]);
                  }), 64)),
                  createVNode(_component_NuxtLink, {
                    to: "/inscription",
                    "aria-label": "Tester l\u2019outil en avant-premi\xE8re",
                    style: { "width": "100%" }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIPrimaryButton, {
                        variant: "accent-color",
                        icon: "lightning_fill",
                        style: { "width": "100%", "margin-left": "auto" }
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Tester en avant-premi\xE8re ")
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5417d342"]]);

export { contact as default };
//# sourceMappingURL=contact-Bi7kXfMk.mjs.map
