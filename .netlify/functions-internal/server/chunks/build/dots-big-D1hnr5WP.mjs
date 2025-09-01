import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { useSSRContext } from 'vue';

const _sfc_main = {
  __name: "HotjarTracking",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HotjarTracking.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dots = "" + buildAssetsURL("dots-big.D9GGyfLn.svg");

export { _sfc_main as _, dots as d };
//# sourceMappingURL=dots-big-D1hnr5WP.mjs.map
