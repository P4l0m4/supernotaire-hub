import { a as _export_sfc, e as __nuxt_component_1$1, d as colors } from './server.mjs';
import { defineComponent, mergeModels, useModel, ref, resolveDirective, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderDynamicModel, ssrRenderAttr, ssrIncludeBooleanAttr, ssrGetDirectiveProps, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InputField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: {},
    label: {},
    placeholder: {},
    type: { default: "text" },
    icon: {},
    required: { type: Boolean, default: true },
    autofocus: { type: Boolean, default: false },
    error: {},
    name: {},
    autocomplete: { default: "on" },
    min: {},
    max: {},
    step: {},
    tooltip: {}
  }, {
    "modelValue": { type: [String, Number, Boolean] },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["blur"], ["update:modelValue"]),
  setup(__props) {
    const model = useModel(__props, "modelValue");
    ref(null);
    const showPassword = ref(false);
    function toggleShowPassword() {
      showPassword.value = !showPassword.value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1;
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["input-field", { shake: _ctx.error, "input-field--has-error": _ctx.error }]
      }, _attrs))} data-v-b9b6d715>`);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: _ctx.icon,
          color: unref(colors)["text-color-faded"],
          size: "1rem"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.type === "text" || _ctx.type === "email" || _ctx.type === "password") {
        _push(`<input${ssrRenderDynamicModel(_ctx.type === "password" && showPassword.value ? "text" : _ctx.type, model.value, model.value)}${ssrRenderAttr("id", _ctx.id)} class="input-field__input"${ssrRenderAttr("type", _ctx.type === "password" && showPassword.value ? "text" : _ctx.type)}${ssrRenderAttr("placeholder", _ctx.placeholder)}${ssrRenderAttr("autocomplete", _ctx.autocomplete)}${ssrIncludeBooleanAttr(_ctx.autofocus) ? " autofocus" : ""}${ssrRenderAttr("aria-label", _ctx.label)}${ssrRenderAttr("aria-labelledby", _ctx.id)}${ssrRenderAttr("title", _ctx.label)}${ssrRenderAttr("aria-placeholder", _ctx.placeholder)}${ssrRenderAttr("name", _ctx.name)}${ssrRenderAttr("value", model.value)} data-v-b9b6d715>`);
      } else if (_ctx.type === "number") {
        _push(`<input${ssrRenderDynamicModel(_ctx.type, model.value, model.value)}${ssrRenderAttr("id", _ctx.id)} class="input-field__input"${ssrRenderAttr("type", _ctx.type)}${ssrRenderAttr("placeholder", _ctx.placeholder)}${ssrRenderAttr("autocomplete", _ctx.autocomplete)}${ssrIncludeBooleanAttr(_ctx.autofocus) ? " autofocus" : ""}${ssrRenderAttr("aria-label", _ctx.label)}${ssrRenderAttr("aria-labelledby", _ctx.id)}${ssrRenderAttr("title", _ctx.label)}${ssrRenderAttr("aria-placeholder", _ctx.placeholder)}${ssrRenderAttr("name", _ctx.name)}${ssrRenderAttr("value", model.value)}${ssrRenderAttr("min", _ctx.min ? _ctx.min : void 0)}${ssrRenderAttr("max", _ctx.max ? _ctx.max : void 0)}${ssrRenderAttr("step", _ctx.step ? _ctx.step : void 0)} data-v-b9b6d715>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.type === "password" && showPassword.value) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: "eye",
          class: "input-field__icon",
          style: { "cursor": "pointer" },
          onClick: toggleShowPassword,
          onKeydown: [toggleShowPassword, toggleShowPassword]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.type === "password" && !showPassword.value) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: "eye_off",
          class: "input-field__icon",
          style: { "cursor": "pointer" },
          onClick: toggleShowPassword,
          onKeydown: [toggleShowPassword, toggleShowPassword]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.tooltip) {
        _push(ssrRenderComponent(_component_UIIconComponent, mergeProps({
          icon: "question",
          class: "input-field__icon",
          style: { "cursor": "pointer" },
          color: unref(colors)["text-color-faded"],
          size: "1.5rem",
          tabindex: "0"
        }, ssrGetDirectiveProps(_ctx, _directive_tooltip, _ctx.tooltip)), null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.error) {
        _push(`<span class="input-field__error" data-v-b9b6d715>${ssrInterpolate(_ctx.error)}</span>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/InputField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b9b6d715"]]);

export { __nuxt_component_1 as _ };
//# sourceMappingURL=InputField-CzMR3qml.mjs.map
