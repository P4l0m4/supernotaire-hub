import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { a as _export_sfc } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "benefits",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    text: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "benefits" }, _attrs))} data-v-fcc5bbb2><h2 class="benefits__title" data-v-fcc5bbb2>${ssrInterpolate(_ctx.title)}</h2><span class="benefits__subtitle" data-v-fcc5bbb2>${ssrInterpolate(_ctx.subtitle)}</span><p class="benefits__text" data-v-fcc5bbb2>${ssrInterpolate(_ctx.text)}</p></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/benefits.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-fcc5bbb2"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FeatureComponent",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    description: {},
    image: {},
    color: {},
    reverse: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["feature", { reverse: _ctx.reverse }],
        style: { backgroundColor: `${_ctx.color}10` }
      }, _attrs))} data-v-0d6b56c4><div class="feature__text" data-v-0d6b56c4><h2 class="feature__text__title" style="${ssrRenderStyle({ backgroundColor: `${_ctx.color}30`, color: _ctx.color })}" data-v-0d6b56c4>${ssrInterpolate(_ctx.title)}</h2><span class="feature__text__subtitle" data-v-0d6b56c4>${ssrInterpolate(_ctx.subtitle)}</span><p class="feature__text__description" data-v-0d6b56c4>${ssrInterpolate(_ctx.description)}</p></div>`);
      if (_ctx.image) {
        _push(`<img class="feature__image"${ssrRenderAttr("src", _ctx.image)} alt="" data-v-0d6b56c4>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/FeatureComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0d6b56c4"]]);

export { __nuxt_component_3 as _, __nuxt_component_4 as a };
//# sourceMappingURL=FeatureComponent-BHnURqOK.mjs.map
