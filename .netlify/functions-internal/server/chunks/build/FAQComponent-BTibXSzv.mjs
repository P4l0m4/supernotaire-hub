import { a as _export_sfc, e as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FAQComponent",
  __ssrInlineRender: true,
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const questionOpened = ref();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "faq-component" }, _attrs))} data-v-ae6bf06f><!--[-->`);
      ssrRenderList(__props.questions, (question, index) => {
        _push(`<div class="${ssrRenderClass([{ "faq-component__card--opened": unref(questionOpened) === index }, "faq-component__card"])}" data-v-ae6bf06f><h5 class="faq-component__card__question" data-v-ae6bf06f>${ssrInterpolate(question.title)} `);
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: unref(questionOpened) === index ? "caret_down_bold" : "caret_right_bold",
          size: "1.5rem"
        }, null, _parent));
        _push(`</h5>`);
        if (unref(questionOpened) === index) {
          _push(`<p class="faq-component__card__answer" data-v-ae6bf06f>${ssrInterpolate(question.answer)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FAQComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ae6bf06f"]]);

export { __nuxt_component_2 as _ };
//# sourceMappingURL=FAQComponent-BTibXSzv.mjs.map
