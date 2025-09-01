import { a as _export_sfc, d as colors, e as __nuxt_component_1 } from './server.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TertiaryButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "text-color" },
    direction: { default: "row" },
    icon: {},
    iconSize: { default: "1.25rem" },
    fontSize: { default: "1rem" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1;
      _push(`<span${ssrRenderAttrs(mergeProps({
        role: "button",
        tabindex: "0",
        class: "button noselect",
        style: {
          flexDirection: _ctx.direction,
          fontSize: _ctx.fontSize,
          color: _ctx.variant ? unref(colors)[_ctx.variant] : unref(colors)["text-color"]
        }
      }, _attrs))} data-v-f40cf3d5><span class="button__text" data-v-f40cf3d5>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          class: "icon",
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/TertiaryButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f40cf3d5"]]);

export { __nuxt_component_7 as _ };
//# sourceMappingURL=TertiaryButton-B2pqK--O.mjs.map
