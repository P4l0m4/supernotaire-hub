import { a as _export_sfc, b as __nuxt_component_0, c as __nuxt_component_1$1, e as __nuxt_component_1$1$1 } from './server.mjs';
import { _ as __nuxt_component_1 } from './StatusComponent-Cvi__m8f.mjs';
import { _ as __nuxt_component_3 } from './TagComponent-DzyrMhAj.mjs';
import { defineComponent, ref, withCtx, createTextVNode, toDisplayString, unref, createBlock, createCommentVNode, createVNode, openBlock, withModifiers, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { c as copyToClipboard } from './otherFunctions-DTo9wMMj.mjs';
import { p as processDocument } from './textFromDocument-Dh1G48l-.mjs';
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
  __name: "text-from-document",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const status = ref("not started");
    const statusResponse = ref();
    const results = ref();
    const isProcessing = ref(false);
    const progress = ref(0);
    const error = ref("");
    async function handleDocumentTextExtraction(file) {
      var _a2;
      isProcessing.value = true;
      progress.value = 5;
      status.value = "processing";
      try {
        const resp = await processDocument(file);
        status.value = (_a2 = resp.status) != null ? _a2 : "failed";
        progress.value = resp.progress;
        error.value = resp.error;
        results.value = resp.results;
      } finally {
        isProcessing.value = false;
      }
    }
    const dropContainerRef = ref(null);
    const fileInputRef = ref(null);
    const onDragEnter = () => {
      var _a2;
      return (_a2 = dropContainerRef.value) == null ? void 0 : _a2.classList.add("drag-active");
    };
    const onDragLeave = () => {
      var _a2;
      return (_a2 = dropContainerRef.value) == null ? void 0 : _a2.classList.remove("drag-active");
    };
    const onDrop = (e) => {
      var _a2, _b;
      (_a2 = dropContainerRef.value) == null ? void 0 : _a2.classList.remove("drag-active");
      const files = (_b = e.dataTransfer) == null ? void 0 : _b.files;
      if (files == null ? void 0 : files[0]) {
        processDocument(files[0]);
      }
    };
    const simulateClick = () => {
      var _a2;
      (_a2 = fileInputRef.value) == null ? void 0 : _a2.click();
    };
    (_a = dropContainerRef.value) == null ? void 0 : _a.addEventListener("drop", (e) => {
      var _a2;
      e.preventDefault();
      (_a2 = dropContainerRef.value) == null ? void 0 : _a2.classList.remove("drag-active");
      if (fileInputRef.value) {
        fileInputRef.value.files = e.dataTransfer.files;
      }
    });
    function reset() {
      status.value = "not started";
      statusResponse.value = null;
      results.value = null;
      isProcessing.value = false;
      progress.value = 0;
      error.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_StatusComponent = __nuxt_component_1;
      const _component_UIPrimaryButton = __nuxt_component_1$1;
      const _component_UITagComponent = __nuxt_component_3;
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d;
          if (_push2) {
            if (!progress.value && !isProcessing.value) {
              _push2(`<label for="images" id="text-from-document" class="drop-zone" data-v-643e2cef${_scopeId}><h1 class="drop-zone__title" data-v-643e2cef${_scopeId}>D\xE9posez un document</h1><span class="drop-zone__subtitle" data-v-643e2cef${_scopeId}>Pour extraire le texte qu&#39;il contient</span><input type="file" class="drop-zone__input" accept=".pdf,.jpg,.jpeg,.png" data-v-643e2cef${_scopeId}><span class="drop-zone__formats" data-v-643e2cef${_scopeId}>.pdf, .jpg, .png</span></label>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="wrapper" data-v-643e2cef${_scopeId}>`);
            if (status.value) {
              _push2(ssrRenderComponent(_component_StatusComponent, { status: status.value }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (progress.value === 100 || error.value.length > 0) {
              _push2(ssrRenderComponent(_component_UIPrimaryButton, {
                variant: "accent-color",
                onClick: reset
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` R\xE9essayer`);
                  } else {
                    return [
                      createTextVNode(" R\xE9essayer")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if ((_b = (_a2 = results.value) == null ? void 0 : _a2.result) == null ? void 0 : _b.summary) {
              _push2(`<div class="summary" data-v-643e2cef${_scopeId}><!--[-->`);
              ssrRenderList(results.value.result.summary, (page) => {
                _push2(`<div class="summary__page" data-v-643e2cef${_scopeId}><div class="summary__page__header" data-v-643e2cef${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UITagComponent, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Page ${ssrInterpolate(page.pageNumber)}`);
                    } else {
                      return [
                        createTextVNode("Page " + toDisplayString(page.pageNumber), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<span class="summary__page__header__copy" data-v-643e2cef${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIIconComponent, {
                  icon: "copy",
                  size: "1.5rem",
                  onClick: () => unref(copyToClipboard)(page.pageText)
                }, null, _parent2, _scopeId));
                _push2(`</span></div><p class="summary__page__text paragraphs" data-v-643e2cef${_scopeId}>${ssrInterpolate(page.pageText)}</p></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !progress.value && !isProcessing.value ? (openBlock(), createBlock("label", {
                key: 0,
                for: "images",
                id: "text-from-document",
                ref: "dropcontainerRef",
                class: "drop-zone",
                onDragover: withModifiers(() => {
                }, ["prevent"]),
                onDragenter: withModifiers(onDragEnter, ["prevent"]),
                onDragleave: withModifiers(onDragLeave, ["prevent"]),
                onDrop: withModifiers(onDrop, ["prevent"]),
                onClick: simulateClick
              }, [
                createVNode("h1", { class: "drop-zone__title" }, "D\xE9posez un document"),
                createVNode("span", { class: "drop-zone__subtitle" }, "Pour extraire le texte qu'il contient"),
                createVNode("input", {
                  type: "file",
                  ref_key: "fileInputRef",
                  ref: fileInputRef,
                  class: "drop-zone__input",
                  accept: ".pdf,.jpg,.jpeg,.png",
                  onClick: (e) => e.stopPropagation(),
                  onChange: (e) => handleDocumentTextExtraction(e.target.files[0])
                }, null, 40, ["onClick", "onChange"]),
                createVNode("span", { class: "drop-zone__formats" }, ".pdf, .jpg, .png")
              ], 40, ["onDragover"])) : createCommentVNode("", true),
              createVNode("div", { class: "wrapper" }, [
                status.value ? (openBlock(), createBlock(_component_StatusComponent, {
                  key: 0,
                  status: status.value
                }, null, 8, ["status"])) : createCommentVNode("", true),
                progress.value === 100 || error.value.length > 0 ? (openBlock(), createBlock(_component_UIPrimaryButton, {
                  key: 1,
                  variant: "accent-color",
                  onClick: reset
                }, {
                  default: withCtx(() => [
                    createTextVNode(" R\xE9essayer")
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ]),
              ((_d = (_c = results.value) == null ? void 0 : _c.result) == null ? void 0 : _d.summary) ? (openBlock(), createBlock("div", {
                key: 1,
                class: "summary"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(results.value.result.summary, (page) => {
                  return openBlock(), createBlock("div", {
                    class: "summary__page",
                    key: page.number
                  }, [
                    createVNode("div", { class: "summary__page__header" }, [
                      createVNode(_component_UITagComponent, null, {
                        default: withCtx(() => [
                          createTextVNode("Page " + toDisplayString(page.pageNumber), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("span", { class: "summary__page__header__copy" }, [
                        createVNode(_component_UIIconComponent, {
                          icon: "copy",
                          size: "1.5rem",
                          onClick: () => unref(copyToClipboard)(page.pageText)
                        }, null, 8, ["onClick"])
                      ])
                    ]),
                    createVNode("p", { class: "summary__page__text paragraphs" }, toDisplayString(page.pageText), 1)
                  ]);
                }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/outils/text-from-document.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const textFromDocument = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-643e2cef"]]);

export { textFromDocument as default };
//# sourceMappingURL=text-from-document-CmZ9o6h5.mjs.map
