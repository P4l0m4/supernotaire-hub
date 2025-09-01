import { a as _export_sfc, d as colors, e as __nuxt_component_1$1 } from './server.mjs';
import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatusComponent",
  __ssrInlineRender: true,
  props: {
    status: {},
    error: {}
  },
  setup(__props) {
    const props = __props;
    const statusText = computed(() => {
      var _a;
      switch (props.status) {
        case "not started":
          return "";
        case "pending":
          return "R\xE9cup\xE9ration des donn\xE9es";
        case "processing":
          return "Traitement en cours";
        case "completed":
          return "Traitement termin\xE9";
        case "failed":
          return `\xC9chec du traitement: ${(_a = props.error) != null ? _a : "Erreur inconnue"}`;
        default:
          return "Statut inconnu";
      }
    });
    const statusIcon = computed(() => {
      switch (props.status) {
        case "not started":
          return "";
        case "pending":
          return "circle_notch";
        case "processing":
          return "circle_notch";
        case "completed":
          return "check_circle";
        case "failed":
          return "error";
        default:
          return "";
      }
    });
    const statusIconColor = computed(() => {
      switch (props.status) {
        case "not started":
          return colors["text-color"];
        case "processing":
          return colors["accent-color"];
        case "completed":
          return colors["success-color"];
        case "failed":
          return colors["error-color"];
        default:
          return colors["purple-color"];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UIIconComponent = __nuxt_component_1$1;
      if (((_a = statusText.value) == null ? void 0 : _a.length) > 0) {
        _push(`<span${ssrRenderAttrs(mergeProps({ class: "status-component" }, _attrs))} data-v-4c92ad13>${ssrInterpolate(statusText.value)}`);
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: statusIcon.value,
          color: statusIconColor.value,
          size: "1rem"
        }, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4c92ad13"]]);

export { __nuxt_component_1 as _ };
//# sourceMappingURL=StatusComponent-Cvi__m8f.mjs.map
