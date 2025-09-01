import { a as _export_sfc, d as colors, e as __nuxt_component_1 } from './server.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TagComponent",
  __ssrInlineRender: true,
  props: {
    color: { default: colors["accent-color"] },
    icon: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1;
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: "tag",
        style: {
          backgroundColor: `${_ctx.color}10`,
          color: _ctx.color,
          border: `1px solid ${_ctx.color}10`
        }
      }, _attrs))} data-v-4987e679>`);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: _ctx.icon,
          size: "0.75rem",
          color: _ctx.color,
          style: { "margin-right": "0.25rem" }
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/TagComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4987e679"]]);

export { __nuxt_component_3 as _ };
//# sourceMappingURL=TagComponent-DzyrMhAj.mjs.map
