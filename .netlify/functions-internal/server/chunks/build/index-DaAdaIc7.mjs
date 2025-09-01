import { a as _export_sfc, b as __nuxt_component_0, _ as __nuxt_component_0$4 } from './server.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const tools = [
      {
        name: "Cr\xE9er un Pr\xE9-\xE9tat dat\xE9",
        path: "/outils/pre-etat-date",
        description: "Cr\xE9er un pr\xE9-\xE9tat dat\xE9 conforme \xE0 la r\xE9glementation en quelques minutes."
      },
      {
        name: "Estimer une valeur fonci\xE8re",
        path: "/outils/valeur-fonciere",
        description: "Obtenez une estimation rapide et fiable de la valeur fonci\xE8re de votre bien immobilier."
      },
      {
        name: "Signer des documents administratifs",
        path: "https://lex.community/",
        target: "_blank",
        description: "Signatures en ligne gratuites, s\xE9curis\xE9es et illimit\xE9es (signatures simples, AES et QES)."
      },
      {
        name: "Fusionner des PDF",
        path: "https://www.ilovepdf.com/fr/fusionner_pdf",
        description: "Fusionner et combiner des fichiers PDF et les mettre dans l'ordre que vous voulez.",
        target: "_blank"
      },
      {
        name: "Extraire le texte d'un document",
        path: "/outils/text-from-document",
        description: "Extraitre le texte d'un document PDF (scann\xE9 ou \xE0 base de texte) ou d'une image."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="tools" data-v-8230ca82${_scopeId}><!--[-->`);
            ssrRenderList(tools, (tool) => {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                class: "tools__tool",
                key: tool.name,
                to: tool.path,
                target: tool.target ? tool.target : "_self"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(tool.name)} <p class="tools__tool__description paragraphs" data-v-8230ca82${_scopeId2}>${ssrInterpolate(tool.description)}</p>`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(tool.name) + " ", 1),
                      createVNode("p", { class: "tools__tool__description paragraphs" }, toDisplayString(tool.description), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "tools" }, [
                (openBlock(), createBlock(Fragment, null, renderList(tools, (tool) => {
                  return createVNode(_component_NuxtLink, {
                    class: "tools__tool",
                    key: tool.name,
                    to: tool.path,
                    target: tool.target ? tool.target : "_self"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(tool.name) + " ", 1),
                      createVNode("p", { class: "tools__tool__description paragraphs" }, toDisplayString(tool.description), 1)
                    ]),
                    _: 2
                  }, 1032, ["to", "target"]);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/outils/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8230ca82"]]);

export { index as default };
//# sourceMappingURL=index-DaAdaIc7.mjs.map
