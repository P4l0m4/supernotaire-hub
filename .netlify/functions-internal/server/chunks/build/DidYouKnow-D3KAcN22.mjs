import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { a as _export_sfc } from './server.mjs';

const image = publicAssetsURL("/creative-process-11.svg?url");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DidYouKnow",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "did-you-know" }, _attrs))} data-v-de62a798><div class="did-you-know__content" data-v-de62a798><h2 class="did-you-know__content__title titles" data-v-de62a798>Le saviez-vous ?</h2><h3 class="did-you-know__content__subtitle subtitles" data-v-de62a798>${ssrInterpolate(_ctx.title)}</h3><p class="did-you-know__content__text paragraphs" data-v-de62a798>`);
      ssrRenderSlot(_ctx.$slots, "text", {}, null, _push, _parent);
      _push(`</p><div class="did-you-know__content__cta" data-v-de62a798>`);
      ssrRenderSlot(_ctx.$slots, "cta", {}, null, _push, _parent);
      _push(`</div></div><div class="did-you-know__illustration" data-v-de62a798><img class="did-you-know__illustration__image"${ssrRenderAttr("src", unref(image))} alt="Le saviez-vous ?" data-v-de62a798></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/DidYouKnow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-de62a798"]]);

export { __nuxt_component_3 as _ };
//# sourceMappingURL=DidYouKnow-D3KAcN22.mjs.map
