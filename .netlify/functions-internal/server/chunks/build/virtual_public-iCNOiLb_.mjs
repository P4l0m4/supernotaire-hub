import { a as _export_sfc, c as __nuxt_component_1$1, j as __nuxt_component_2, e as __nuxt_component_1$1$1, d as colors } from './server.mjs';
import { defineComponent, mergeModels, ref, useModel, computed, watch, mergeProps, withCtx, createTextVNode, unref, nextTick, createBlock, openBlock, Fragment, renderList, toDisplayString, useTemplateRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderSlot, ssrLooseContain } from 'vue/server-renderer';
import { _ as __nuxt_component_1$2 } from './InputField-CzMR3qml.mjs';
import { _ as __nuxt_component_3$2 } from './TagComponent-DzyrMhAj.mjs';
import { _ as __nuxt_component_6$1 } from './SecondaryButton-Bz5oS0xB.mjs';
import { onClickOutside } from '@vueuse/core';
import { _ as __nuxt_component_7$1 } from './TertiaryButton-B2pqK--O.mjs';
import { maxLength, minLength, required, helpers, email, maxValue, minValue, numeric } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { p as publicAssetsURL } from '../routes/renderer.mjs';

const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "FormSteps",
  __ssrInlineRender: true,
  props: {
    stepsLabels: {},
    currentStep: {}
  },
  emits: ["changeStep"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    watch(
      () => props.currentStep,
      () => {
        const stepElement = (void 0).querySelector(
          `.form-steps__item--active`
        );
        if (stepElement) {
          stepElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "form-steps" }, _attrs))} data-v-6850c5a1><!--[-->`);
      ssrRenderList(_ctx.stepsLabels, (stepLabel, index) => {
        _push(`<div class="${ssrRenderClass([{
          "form-steps__item--active": index === _ctx.currentStep - 1,
          "form-steps__item--completed": index < _ctx.currentStep - 1
        }, "form-steps__item"])}" style="${ssrRenderStyle({
          paddingLeft: index === 0 ? "0" : "",
          paddingRight: index === _ctx.stepsLabels.length - 1 ? "0" : ""
        })}" data-v-6850c5a1><div class="form-steps__item__circle" data-v-6850c5a1>`);
        if (index + 1 < _ctx.currentStep) {
          _push(ssrRenderComponent(_component_UIIconComponent, {
            icon: "check_fat_fill",
            size: "1rem",
            color: unref(colors)["accent-color"]
          }, null, _parent));
        } else {
          _push(`<span class="form-steps__item__circle__number" data-v-6850c5a1>0${ssrInterpolate(index + 1)}</span>`);
        }
        _push(`</div><span class="form-steps__item__label" data-v-6850c5a1>${ssrInterpolate(stepLabel)}</span></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/FormSteps.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-6850c5a1"]]);
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "SelectField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "" },
    icon: { type: String, default: "" },
    error: { type: String, default: "" }
  }, {
    "modelValue": { default: null },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue", "optionSelected"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const target = ref();
    onClickOutside(target, () => {
      isSelectOpen.value = false;
    });
    const modelValue = useModel(__props, "modelValue");
    const props = __props;
    const isSelectOpen = ref(false);
    const optionSelected = ref("");
    watch(
      () => modelValue.value,
      (v) => {
        optionSelected.value = v != null ? v : "";
      }
    );
    const displayText = computed(
      () => {
        var _a;
        return ((_a = optionSelected.value) == null ? void 0 : _a.length) ? optionSelected.value : props.placeholder;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "select-field",
        ref_key: "target",
        ref: target
      }, _attrs))} data-v-9a0216dd><span role="button" tabindex="0" class="${ssrRenderClass([{
        "select-field__selected--open": isSelectOpen.value,
        shake: __props.error,
        "select-field__selected--has-error": __props.error
      }, "select-field__selected"])}" data-v-9a0216dd>`);
      if ((_a = __props.icon) == null ? void 0 : _a.length) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: __props.icon,
          size: "1rem",
          color: unref(colors)["text-color-faded"]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="select-field__selected__placeholder" data-v-9a0216dd>${ssrInterpolate(displayText.value)}</span><span style="${ssrRenderStyle({ "opacity": "0.8", "margin-left": "auto" })}" data-v-9a0216dd>`);
      _push(ssrRenderComponent(_component_UIIconComponent, {
        icon: isSelectOpen.value ? "caret_up_bold" : "caret_down_bold",
        size: "1rem",
        color: unref(colors)["text-color-faded"]
      }, null, _parent));
      _push(`</span></span>`);
      if (isSelectOpen.value) {
        _push(`<div class="select-field__content" data-v-9a0216dd><!--[-->`);
        ssrRenderList(__props.options, (option) => {
          _push(`<span class="select-field__content__option" role="option" tabindex="0" style="${ssrRenderStyle({
            opacity: optionSelected.value === option ? 0.6 : 1,
            backgroundColor: optionSelected.value === option ? unref(colors)["accent-color-faded"] : ""
          })}" data-v-9a0216dd>${ssrInterpolate(option)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/SelectField.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-9a0216dd"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "SmartSuggestion",
  __ssrInlineRender: true,
  props: {
    suggestion: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "smart-suggestion" }, _attrs))} data-v-6e4b85be>`);
      _push(ssrRenderComponent(_component_UIIconComponent, {
        icon: "lightbulb_fill",
        size: "0.85rem",
        color: unref(colors)["purple-color"]
      }, null, _parent));
      _push(`<span class="smart-suggestion__text" data-v-6e4b85be>${ssrInterpolate(_ctx.suggestion)}</span></div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/SmartSuggestion.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_10 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-6e4b85be"]]);
function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => o ? o[k] : void 0, obj);
}
function clone(x) {
  return JSON.parse(JSON.stringify(x));
}
function labelFor(idx, propsFieldItemLabel) {
  return (propsFieldItemLabel || "\xC9l\xE9ment {{index}}").replace(
    "{{index}}",
    String(idx + 1)
  );
}
function genId() {
  var _a2;
  var _a, _b;
  try {
    return (_a2 = (_b = (_a = globalThis.crypto) == null ? void 0 : _a.randomUUID) == null ? void 0 : _b.call(_a)) != null ? _a2 : "";
  } catch {
  }
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}
const setDeep = (o, p, v) => {
  var _a2, _b;
  var _a;
  let c = o;
  for (let i = 0; i < p.length - 1; i++) c = (_a2 = c[_a = p[i]]) != null ? _a2 : c[_a] = {};
  c[p.at(-1)] = { ...(_b = c[p.at(-1)]) != null ? _b : {}, ...v };
};
const fr = {
  required: helpers.withMessage("Champ obligatoire", required),
  minLength: (n) => helpers.withMessage(
    `Au moins ${n} caract\xE8re${n > 1 ? "s" : ""}`,
    minLength(n)
  ),
  maxLength: (n) => helpers.withMessage(
    `Au plus ${n} caract\xE8re${n > 1 ? "s" : ""}`,
    maxLength(n)
  ),
  numeric: helpers.withMessage("Doit \xEAtre un nombre", numeric),
  minValue: (n) => helpers.withMessage(`Doit \xEAtre \u2265 ${n}`, minValue(n)),
  maxValue: (n) => helpers.withMessage(`Doit \xEAtre \u2264 ${n}`, maxValue(n)),
  email: helpers.withMessage("Email invalide", email),
  isDate: helpers.withMessage(
    "Format de date invalide (JJ-MM-AAAA)",
    (v) => {
      if (v == null || v === "") return true;
      if (typeof v !== "string") return false;
      const m = v.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (!m) return false;
      const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
      const dt = new Date(y, mo - 1, d);
      return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
    }
  ),
  isYear: helpers.withMessage(
    "Format d'ann\xE9e invalide (AAAA)",
    (v) => {
      if (v == null || v === "") return true;
      if (typeof v !== "string") return false;
      const m = v.match(/^(\d{4})$/);
      if (!m) return false;
      const y = Number(m[1]);
      const dt = new Date(y, 0, 1);
      return dt.getFullYear() === y;
    }
  ),
  isMonth: helpers.withMessage("Format de mois invalide (MM)", (v) => {
    if (v == null || v === "") return true;
    if (typeof v !== "string") return false;
    const m = v.match(/^(\d{2})$/);
    if (!m) return false;
    const month = Number(m[1]);
    return month >= 1 && month <= 12;
  }),
  oneOf: (opts) => helpers.withMessage(
    "Valeur non autoris\xE9e",
    (v) => v == null || typeof v === "string" && v.trim() === "" || opts.includes(String(v))
  )
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ArrayFieldRenderer",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    field: {},
    suggestion: {},
    parentError: {}
  }, {
    "modelValue": { default: [] },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = useModel(__props, "modelValue");
    const itemRefs = ref([]);
    const collapsed = ref(/* @__PURE__ */ new Set());
    const isCollapsed = (id) => collapsed.value.has(id);
    const oneOf = (opts) => {
      if (!(opts == null ? void 0 : opts.length)) return null;
      const allowed = new Set(opts.map(normalizeString));
      return helpers.withMessage("Valeur non autoris\xE9e", (v) => {
        if (v == null) return true;
        if (typeof v === "string" && v.trim() === "") return true;
        if (typeof v !== "string") return false;
        return allowed.has(normalizeString(v));
      });
    };
    const stepValidator = (step) => step == null ? null : helpers.withMessage(`Doit respecter le pas ${step}`, (v) => {
      if (v == null || v === "") return true;
      const n = Number(v);
      if (!Number.isFinite(n)) return false;
      const r = n / step;
      return Math.abs(r - Math.round(r)) < 1e-9;
    });
    const rulesForScalar = (f) => {
      const r = {};
      if (f.required) r.required = fr.required;
      if (f.type === "number") {
        r.numeric = numeric;
        if (f.min != null) r.minValue = fr.minValue(f.min);
        if (f.max != null) r.maxValue = fr.maxValue(f.max);
        const st = stepValidator(f.step);
        if (st) r.step = st;
      }
      if (f.type === "select" && f.options) {
        const o = oneOf(f.options);
        if (o) r.oneOf = o;
      }
      if (f.type === "email") r.email = fr.email;
      return Object.keys(r).length ? r : null;
    };
    const itemRuleShape = computed(() => {
      var _a2;
      var _a;
      const r = {};
      for (const f of (_a2 = (_a = props.field.itemSchema) == null ? void 0 : _a.fields) != null ? _a2 : []) {
        const leaf = rulesForScalar(f);
        if (leaf) setDeep(r, f.path.split("."), leaf);
      }
      return r;
    });
    const arrayItemRules = computed(() => {
      const out = {};
      for (let i = 0; i < model.value.length; i++) out[i] = itemRuleShape.value;
      return out;
    });
    const vItems = useVuelidate(arrayItemRules, model, {
      $lazy: false,
      $autoDirty: true
    });
    function setByPath(obj, path, value) {
      const segs = path.split(".");
      const last = segs.pop();
      const target = segs.reduce((o, k) => {
        var _a;
        return (_a = o[k]) != null ? _a : o[k] = {};
      }, obj);
      target[last] = value;
    }
    function itemNode(i) {
      var _a2;
      var _a;
      return (_a2 = (_a = vItems.value) == null ? void 0 : _a[i]) != null ? _a2 : null;
    }
    const fieldNode = (i, sub) => {
      var _a;
      return (_a = sub.split(".").reduce((n, k) => n == null ? void 0 : n[k], itemNode(i))) != null ? _a : void 0;
    };
    const firstItemMsg = (i, sub) => {
      var _a, _b;
      const v = fieldNode(i, sub);
      if (!(v == null ? void 0 : v.$dirty) || !(v == null ? void 0 : v.$invalid)) return;
      const e = (_a = v.$errors) == null ? void 0 : _a[0];
      return (typeof (e == null ? void 0 : e.$message) === "object" ? (_b = e.$message) == null ? void 0 : _b.value : e == null ? void 0 : e.$message) || (e == null ? void 0 : e.$validator) || void 0;
    };
    async function updateItem(idx, path, value) {
      var _a, _b;
      const next = clone(model.value);
      setByPath(next[idx], path, value);
      model.value = next;
      await nextTick();
      const n = fieldNode(idx, path);
      (_a = n == null ? void 0 : n.$touch) == null ? void 0 : _a.call(n);
      await ((_b = n == null ? void 0 : n.$validate) == null ? void 0 : _b.call(n));
    }
    function defaultForType(t) {
      if (t === "number" || t === "date") return null;
      return "";
    }
    function makeEmptyItem() {
      var _a2;
      var _a;
      const obj = { __id: genId() };
      for (const f of (_a2 = (_a = props.field.itemSchema) == null ? void 0 : _a.fields) != null ? _a2 : [])
        setByPath(obj, f.path, defaultForType(f.type));
      return obj;
    }
    async function addItem() {
      var _a;
      const next = [...model.value];
      next.push(makeEmptyItem());
      model.value = next;
      await nextTick();
      (_a = itemRefs.value.at(-1)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function removeItem(idx) {
      var _a2, _b2;
      var _a, _b;
      const min = (_a2 = props.field.minItems) != null ? _a2 : 0;
      if (((_b2 = (_a = model.value) == null ? void 0 : _a.length) != null ? _b2 : 0) < min) return;
      const next = clone(model.value);
      const id = (_b = next[idx]) == null ? void 0 : _b.__id;
      if (id) {
        const s = new Set(collapsed.value);
        s.delete(id);
        collapsed.value = s;
      }
      next.splice(idx, 1);
      model.value = next;
    }
    const childrenErrors = computed(() => {
      var _a;
      const indexOfChildrenWithErrors = [];
      for (let i = 0; i < model.value.length; i++) {
        const item = model.value[i];
        if (item.__id && ((_a = itemNode(i)) == null ? void 0 : _a.$invalid)) {
          indexOfChildrenWithErrors.push(i);
        }
      }
      return indexOfChildrenWithErrors;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      const _component_UITagComponent = __nuxt_component_3$2;
      const _component_UISecondaryButton = __nuxt_component_6$1;
      const _component_FormElementsInputField = __nuxt_component_1$2;
      const _component_FormElementsSelectField = __nuxt_component_4;
      const _component_ClientOnly = __nuxt_component_2;
      const _component_UISmartSuggestion = __nuxt_component_10;
      const _component_UITertiaryButton = __nuxt_component_7$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["array-field", {
          shake: _ctx.parentError,
          "array-field--has-error": _ctx.parentError
        }]
      }, _attrs))} data-v-d2d5f64e>`);
      if (_ctx.parentError) {
        _push(`<span class="array-field__error" data-v-d2d5f64e>${ssrInterpolate(_ctx.parentError)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="array-field__header" data-v-d2d5f64e><h4 class="array-field__label" data-v-d2d5f64e>${ssrInterpolate(_ctx.field.label)} `);
      if (_ctx.field.required) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: "asterisk",
          size: "0.75rem",
          color: unref(colors)["error-color"]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</h4>`);
      if (_ctx.suggestion) {
        _push(ssrRenderComponent(_component_UITagComponent, {
          icon: "lightbulb_fill",
          color: unref(colors)["purple-color"],
          style: { "margin-left": "auto" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.suggestion.length)} \xE9l\xE9ments trouv\xE9s`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.suggestion.length) + " \xE9l\xE9ments trouv\xE9s", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UISecondaryButton, {
        variant: "accent-color",
        icon: "plus_circle",
        onClick: addItem,
        onKeydown: [addItem, addItem]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ajouter `);
          } else {
            return [
              createTextVNode(" Ajouter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--[-->`);
      ssrRenderList(model.value, (item, idx) => {
        var _a2;
        var _a;
        _push(`<div class="${ssrRenderClass([{
          "array-item--children-have-errors": childrenErrors.value.includes(idx)
        }, "array-item"])}" data-v-d2d5f64e><div class="array-item__title" role="button" tabindex="0"${ssrRenderAttr(
          "aria-label",
          isCollapsed(item.__id || String(idx)) ? "D\xE9plier" : "Replier"
        )}${ssrRenderAttr("aria-expanded", !isCollapsed(item.__id || String(idx)))} data-v-d2d5f64e><span data-v-d2d5f64e>${ssrInterpolate(unref(labelFor)(idx, _ctx.field.itemLabel))}</span>`);
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: isCollapsed(item.__id || String(idx)) ? "caret_down_bold" : "caret_up_bold",
          size: "1rem",
          color: unref(colors)["text-color-faded"],
          style: { "opacity": "0.8", "margin-left": "auto" }
        }, null, _parent));
        _push(`</div><div class="array-item__grid" style="${ssrRenderStyle(!isCollapsed(item.__id || String(idx)) ? null : { display: "none" })}" data-v-d2d5f64e><!--[-->`);
        ssrRenderList((_a2 = (_a = _ctx.field.itemSchema) == null ? void 0 : _a.fields) != null ? _a2 : [], (f, index) => {
          _push(`<label class="fi" data-v-d2d5f64e><span class="fi__label" data-v-d2d5f64e>${ssrInterpolate(f.label)}`);
          if (f.required) {
            _push(ssrRenderComponent(_component_UIIconComponent, {
              icon: "asterisk",
              size: "0.75rem",
              color: unref(colors)["error-color"]
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</span>`);
          if (f.type === "text" || f.type === "number" || f.type === "email") {
            _push(ssrRenderComponent(_component_FormElementsInputField, {
              id: f.label,
              label: f.label,
              placeholder: f.placeholder || "",
              type: f.type,
              name: f.path,
              "model-value": unref(getByPath)(item, f.path),
              "onUpdate:modelValue": (val) => {
                updateItem(idx, f.path, val);
              },
              required: f.required,
              icon: f.icon || "",
              error: firstItemMsg(idx, f.path)
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (f.type === "select") {
            _push(ssrRenderComponent(_component_FormElementsSelectField, {
              options: f.options || [],
              "model-value": unref(getByPath)(item, f.path),
              onOptionSelected: (val) => updateItem(idx, f.path, val || defaultForType(f.type)),
              placeholder: f.placeholder || "",
              icon: f.icon || "",
              error: firstItemMsg(idx, f.path)
            }, null, _parent));
          } else if (f.type === "date") {
            _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
          } else {
            _push(`<!---->`);
          }
          if (_ctx.suggestion && (typeof _ctx.suggestion[idx][f.suggestionRef] === "string" || typeof _ctx.suggestion[idx][f.suggestionRef] === "number") && _ctx.suggestion[idx][f.suggestionRef] !== unref(getByPath)(item, f.path)) {
            _push(ssrRenderComponent(_component_UISmartSuggestion, {
              suggestion: _ctx.suggestion[idx][f.suggestionRef].toString(),
              onClick: () => {
                updateItem(idx, f.path, _ctx.suggestion[idx][f.suggestionRef]);
              }
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</label>`);
        });
        _push(`<!--]--></div>`);
        _push(ssrRenderComponent(_component_UITertiaryButton, {
          variant: "error-color",
          type: "button",
          onClick: ($event) => removeItem(idx),
          onKeydown: [($event) => removeItem(idx), ($event) => removeItem(idx)],
          style: { "margin-left": "auto" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Supprimer `);
            } else {
              return [
                createTextVNode(" Supprimer ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/ArrayFieldRenderer.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-d2d5f64e"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SegmentedControl",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: {},
    error: {}
  }, {
    "modelValue": {
      type: String
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = useModel(__props, "modelValue");
    const selectedIndex = computed(() => {
      if (!model.value) return;
      return props.options.indexOf(model.value);
    });
    const indicatorStyle = computed(() => ({
      width: `${100 / props.options.length}%`,
      transform: `translateX(${selectedIndex.value ? selectedIndex.value * 100 : 0}%)`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<fieldset${ssrRenderAttrs(mergeProps({
        class: "segmented-control",
        role: "radiogroup"
      }, _attrs))} data-v-32a969ee><!--[-->`);
      ssrRenderList(props.options, (opt, i) => {
        _push(`<!--[--><input class="segmented-control__input" type="radio"${ssrRenderAttr("id", `seg-${i}`)}${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(ssrLooseEqual(model.value, opt)) ? " checked" : ""} data-v-32a969ee><label class="segmented-control__btn"${ssrRenderAttr("for", `seg-${i}`)} tabindex="0"${ssrRenderAttr("aria-label", opt)} role="button" data-v-32a969ee><span data-v-32a969ee>${ssrInterpolate(opt)}</span></label><!--]-->`);
      });
      _push(`<!--]--><span class="segmented-control__indicator" style="${ssrRenderStyle(indicatorStyle.value)}" data-v-32a969ee></span></fieldset>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/SegmentedControl.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_5$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-32a969ee"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "FileField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: {},
    name: {},
    label: {},
    icon: {},
    required: { type: Boolean, default: true },
    error: {},
    accept: { default: () => [".pdf", ".png", ".jpg", ".jpeg"] },
    multiple: { type: Boolean, default: false }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["file-field", { shake: _ctx.error, "file-field--has-error": _ctx.error }]
      }, _attrs))} data-v-4cc3032a>`);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: _ctx.icon,
          color: unref(colors)["text-color"],
          size: "1.5rem"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<input type="file"${ssrRenderAttr("id", _ctx.id)}${ssrRenderAttr("name", _ctx.name)}${ssrIncludeBooleanAttr(_ctx.multiple) ? " multiple" : ""}${ssrIncludeBooleanAttr(_ctx.required) ? " required" : ""}${ssrRenderAttr("accept", (_a = _ctx.accept) == null ? void 0 : _a.join(","))} class="file-field__input" data-v-4cc3032a>`);
      if (model.value) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: "check_circle",
          color: unref(colors)["success-color"],
          size: "1.5rem"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/FileField.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-4cc3032a"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "RangeInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: {},
    error: {}
  }, {
    "modelValue": { default: "0" },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = useModel(__props, "modelValue");
    const filledPct = computed(() => {
      var _a2;
      var _a, _b, _c;
      const v = Number(model.value);
      if (!props.options) {
        return "0%";
      } else {
        const span = ((_a2 = Number((_a = props.options.at(-1)) == null ? void 0 : _a.value)) != null ? _a2 : 0) - Number((_b = props.options[0]) == null ? void 0 : _b.value) || 1;
        return `${(v - Number((_c = props.options[0]) == null ? void 0 : _c.value)) / span * 100}%`;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "range-input" }, _attrs))} data-v-c1f64f34><input id="range-input-range" type="range"${ssrRenderAttr("min", (_a = _ctx.options[0]) == null ? void 0 : _a.value)}${ssrRenderAttr("max", (_b = _ctx.options[_ctx.options.length - 1]) == null ? void 0 : _b.value)}${ssrRenderAttr("step", Number((_c = _ctx.options[1]) == null ? void 0 : _c.value) - Number((_d = _ctx.options[0]) == null ? void 0 : _d.value))}${ssrRenderAttr("value", model.value)} style="${ssrRenderStyle({ "--filled": filledPct.value })}" data-v-c1f64f34><span class="range-input__legend" data-v-c1f64f34>${ssrInterpolate((_e = _ctx.options[model.value]) == null ? void 0 : _e.label)}</span></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/RangeInput.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-c1f64f34"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "DropDown",
  __ssrInlineRender: true,
  props: {
    label: {},
    number: {},
    icon: {}
  },
  setup(__props) {
    const isDropdownOpen = ref(false);
    const target = useTemplateRef("target");
    const contentEl = ref(null);
    onClickOutside(target, () => isDropdownOpen.value = false, {
      ignore: [contentEl]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: "dropdown"
      }, _attrs))} data-v-15e48f36><span class="dropdown__header" tabindex="0" role="button"${ssrRenderAttr("aria-label", _ctx.label)} data-v-15e48f36>`);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: _ctx.icon,
          color: unref(colors)["text-color-faded"]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`${ssrInterpolate(_ctx.label)} `);
      if (_ctx.number) {
        _push(`<!--[-->(${ssrInterpolate(_ctx.number)})<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UIIconComponent, {
        style: { "margin-left": "auto" },
        icon: isDropdownOpen.value ? "caret_down_bold" : "caret_right_bold",
        color: unref(colors)["text-color-faded"]
      }, null, _parent));
      _push(`</span>`);
      if (isDropdownOpen.value) {
        _push(`<div class="dropdown__content" data-v-15e48f36>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/DropDown.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_8 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-15e48f36"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CheckboxField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: {},
    name: {},
    label: {}
  }, {
    "modelValue": { type: Boolean, ...{
      type: Boolean,
      default: false
    } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({
        for: _ctx.id,
        class: "checkbox"
      }, _attrs))} data-v-31194cd9><input${ssrRenderAttr("id", _ctx.id)}${ssrRenderAttr("name", _ctx.name)} type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, null) : model.value) ? " checked" : ""} class="checkbox__input" data-v-31194cd9><span class="checkbox__custom" tabindex="0"${ssrRenderAttr("aria-label", _ctx.label)} data-v-31194cd9></span><span class="checkbox__label" data-v-31194cd9>${ssrInterpolate(_ctx.label)}</span></label>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/CheckboxField.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-31194cd9"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FormField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    formField: {},
    suggestion: {},
    validation: {}
  }, {
    "modelValue": { default: {} },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = useModel(__props, "modelValue");
    function getByPath2(obj, path) {
      return path.split(".").reduce((o, k) => o ? o[k] : void 0, obj);
    }
    function setByPath(obj, path, val) {
      const segs = path.split(".");
      const last = segs.pop();
      const tgt = segs.reduce((o, k) => {
        var _a;
        return (_a = o[k]) != null ? _a : o[k] = {};
      }, obj);
      tgt[last] = val;
    }
    const valueRef = computed({
      get: () => getByPath2(model.value, props.formField.path),
      set: (v) => setByPath(model.value, props.formField.path, v)
    });
    const arrayRef = computed({
      get: () => {
        const v = getByPath2(model.value, props.formField.path);
        return Array.isArray(v) ? v : [];
      },
      set: (v) => {
        if (props.formField.type === "array") {
          setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []);
        }
      }
    });
    const checkBoxGroupRef = computed({
      get: () => {
        const v = getByPath2(model.value, props.formField.path);
        return Array.isArray(v) ? v : [];
      },
      set: (v) => {
        if (props.formField.type === "checkbox-group") {
          setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []);
        }
      }
    });
    function isChecked(val) {
      return checkBoxGroupRef.value.includes(val);
    }
    function setChecked(val, checked) {
      const s = new Set(checkBoxGroupRef.value);
      checked ? s.add(val) : s.delete(val);
      checkBoxGroupRef.value = Array.from(s);
    }
    const errorMessage = computed(() => {
      var _a;
      if (!props.validation || !props.validation.$dirty || !props.validation.$error)
        return void 0;
      const msg = (_a = props.validation) == null ? void 0 : _a.$errors[0].$message;
      return msg && typeof msg === "object" && "value" in msg ? msg.value : msg;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1$1;
      const _component_FormElementsInputField = __nuxt_component_1$2;
      const _component_ClientOnly = __nuxt_component_2;
      const _component_FormElementsArrayFieldRenderer = __nuxt_component_3$1;
      const _component_FormElementsSelectField = __nuxt_component_4;
      const _component_FormElementsSegmentedControl = __nuxt_component_5$1;
      const _component_FormElementsFileField = __nuxt_component_6;
      const _component_FormElementsRangeInput = __nuxt_component_7;
      const _component_FormElementsDropDown = __nuxt_component_8;
      const _component_FormElementsCheckboxField = __nuxt_component_9;
      const _component_UISmartSuggestion = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "form-field",
        style: { gridColumn: _ctx.formField.type === "array" ? "1 / -1" : "" }
      }, _attrs))} data-v-7609b1bb>`);
      if (!_ctx.formField.itemLabel && _ctx.formField.type !== "checkbox") {
        _push(`<label${ssrRenderAttr("for", _ctx.formField.id)} class="form-field__label" data-v-7609b1bb>${ssrInterpolate(_ctx.formField.label)} `);
        if (_ctx.formField.required) {
          _push(ssrRenderComponent(_component_UIIconComponent, {
            icon: "asterisk",
            size: "0.75rem",
            color: unref(colors)["error-color"]
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.formField.type === "text" || _ctx.formField.type === "number" || _ctx.formField.type === "email") {
        _push(ssrRenderComponent(_component_FormElementsInputField, {
          id: _ctx.formField.id,
          label: _ctx.formField.label,
          placeholder: _ctx.formField.placeholder || "",
          name: _ctx.formField.name,
          modelValue: valueRef.value,
          "onUpdate:modelValue": ($event) => valueRef.value = $event,
          required: _ctx.formField.required,
          icon: _ctx.formField.icon || "",
          error: errorMessage.value,
          tooltip: _ctx.formField.tooltip || ""
        }, null, _parent));
      } else if (_ctx.formField.type === "date") {
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.formField.type === "array") {
        _push(ssrRenderComponent(_component_FormElementsArrayFieldRenderer, {
          modelValue: arrayRef.value,
          "onUpdate:modelValue": ($event) => arrayRef.value = $event,
          field: _ctx.formField,
          suggestion: typeof _ctx.suggestion === "object" ? _ctx.suggestion : void 0,
          parentError: errorMessage.value
        }, null, _parent));
      } else if (_ctx.formField.type === "select") {
        _push(ssrRenderComponent(_component_FormElementsSelectField, {
          options: _ctx.formField.options || [],
          modelValue: valueRef.value,
          "onUpdate:modelValue": ($event) => valueRef.value = $event,
          placeholder: _ctx.formField.placeholder || "",
          icon: _ctx.formField.icon || "",
          error: errorMessage.value
        }, null, _parent));
      } else if (_ctx.formField.type === "segmented-control") {
        _push(ssrRenderComponent(_component_FormElementsSegmentedControl, {
          modelValue: valueRef.value,
          "onUpdate:modelValue": ($event) => valueRef.value = $event,
          options: _ctx.formField.options || [],
          error: errorMessage.value
        }, null, _parent));
      } else if (_ctx.formField.type === "file") {
        _push(ssrRenderComponent(_component_FormElementsFileField, {
          id: _ctx.formField.id,
          name: _ctx.formField.name,
          label: _ctx.formField.label,
          modelValue: valueRef.value,
          "onUpdate:modelValue": ($event) => valueRef.value = $event,
          required: _ctx.formField.required,
          error: errorMessage.value,
          icon: _ctx.formField.icon || "",
          accept: _ctx.formField.accept,
          multiple: _ctx.formField.multiple || false,
          TS_TYPE: _ctx.formField.TS_TYPE || ""
        }, null, _parent));
      } else if (_ctx.formField.type === "range") {
        _push(ssrRenderComponent(_component_FormElementsRangeInput, {
          modelValue: valueRef.value,
          "onUpdate:modelValue": ($event) => valueRef.value = $event,
          options: _ctx.formField.options,
          error: errorMessage.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.formField.type === "checkbox-group") {
        _push(ssrRenderComponent(_component_FormElementsDropDown, {
          label: _ctx.formField.placeholder,
          icon: _ctx.formField.icon
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(_ctx.formField.options, (option, index) => {
                _push2(ssrRenderComponent(_component_FormElementsCheckboxField, {
                  key: index,
                  id: `${_ctx.formField.id}-${index}`,
                  name: _ctx.formField.name,
                  label: option.label,
                  modelValue: isChecked(option.value),
                  "onUpdate:modelValue": (val) => setChecked(option.value, val)
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.formField.options, (option, index) => {
                  return openBlock(), createBlock(_component_FormElementsCheckboxField, {
                    key: index,
                    id: `${_ctx.formField.id}-${index}`,
                    name: _ctx.formField.name,
                    label: option.label,
                    modelValue: isChecked(option.value),
                    "onUpdate:modelValue": (val) => setChecked(option.value, val)
                  }, null, 8, ["id", "name", "label", "modelValue", "onUpdate:modelValue"]);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.formField.type === "checkbox") {
        _push(ssrRenderComponent(_component_FormElementsCheckboxField, {
          label: _ctx.formField.label,
          id: _ctx.formField.id,
          name: _ctx.formField.name,
          modelValue: valueRef.value,
          "onUpdate:modelValue": ($event) => valueRef.value = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.suggestion !== void 0 && _ctx.suggestion !== null && _ctx.suggestion !== "" && (typeof _ctx.suggestion === "string" || typeof _ctx.suggestion === "number") && valueRef.value !== _ctx.suggestion) {
        _push(ssrRenderComponent(_component_UISmartSuggestion, {
          suggestion: _ctx.suggestion.toString(),
          onClick: () => {
            valueRef.value = _ctx.suggestion;
          }
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/FormField.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-7609b1bb"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DynamicForm",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    formDefinition: {},
    suggestions: {}
  }, {
    "modelValue": { default: {} },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["complete"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formRef = ref(null);
    const currentSection = ref(0);
    const stopNextStep = ref(false);
    const model = useModel(__props, "modelValue");
    function ensureArrayPaths(def) {
      var _a2;
      var _a;
      if (!def) return;
      for (const s of def.sections) {
        for (const f of s.fields) {
          if (f.type !== "array") continue;
          const segs = f.path.split(".");
          let cur = model.value;
          for (let i = 0; i < segs.length - 1; i++) cur = (_a2 = cur[_a = segs[i]]) != null ? _a2 : cur[_a] = {};
          const key = segs.at(-1);
          if (!Array.isArray(cur[key])) cur[key] = [];
        }
      }
    }
    ensureArrayPaths(props.formDefinition);
    const regexFrom = (p) => {
      if (!p) return null;
      const re = typeof p === "string" ? new RegExp(p) : p;
      return helpers.withMessage(
        "Format invalide",
        (v) => v == null || v === "" || re.test(String(v))
      );
    };
    const stepValidator = (step) => step == null ? null : helpers.withMessage("Doit respecter le pas " + step, (v) => {
      if (v == null || v === "") return true;
      const n = Number(v);
      if (!Number.isFinite(n)) return false;
      const r = n / step;
      return Math.abs(r - Math.round(r)) < 1e-9;
    });
    function getDeep(obj, path) {
      return path.reduce((o, k) => o ? o[k] : void 0, obj);
    }
    const setDeep2 = (obj, path, val) => {
      var _a2, _b;
      var _a;
      let cur = obj;
      for (let i = 0; i < path.length - 1; i++) cur = (_a2 = cur[_a = path[i]]) != null ? _a2 : cur[_a] = {};
      cur[path[path.length - 1]] = Object.assign(
        (_b = cur[path[path.length - 1]]) != null ? _b : {},
        val
      );
    };
    function buildRules(def) {
      const rules2 = {};
      if (!def) return rules2;
      const rulesForScalar = (f) => {
        const r = {};
        if (f.required) r.required = fr.required;
        if (f.type === "number") {
          r.numeric = fr.numeric;
          if (f.min != null) r.minValue = fr.minValue(f.min);
          if (f.max != null) r.maxValue = fr.maxValue(f.max);
          const st = stepValidator(f.step);
          if (st) r.step = st;
        }
        if ((f.type === "select" || f.type === "segmented-control") && f.options)
          r.oneOf = fr.oneOf(f.options);
        if (f.type === "range" && f.options)
          r.oneOf = fr.oneOf(f.options.map((o) => o.value));
        if (f.type === "checkbox-group" && f.options) {
          if (f.required) r.minLength = fr.minLength(1);
        }
        if (f.type === "date" && f.mode === "year-picker") {
          r.isYear = fr.isYear;
        } else if (f.type === "date" && f.mode === "month-picker") {
          r.isMonth = fr.isMonth;
        } else if (f.type === "date" && f.mode === "date-picker") {
          r.isDate = fr.isDate;
        }
        if (f.type === "email") r.email = fr.email;
        if (f.pattern) {
          const rg = regexFrom(f.pattern);
          if (rg) r.pattern = rg;
        }
        return Object.keys(r).length ? r : null;
      };
      const addFieldRules = (field, basePath = []) => {
        var _a2;
        var _a;
        const p = field.path.split(".");
        const full = [...basePath, ...p];
        if (field.type === "array") {
          setDeep2(rules2, full, {
            ...field.required ? { required } : {},
            ...field.minItems != null ? { minLength: minLength(field.minItems) } : {},
            ...field.maxItems != null ? { maxLength: maxLength(field.maxItems) } : {}
          });
          const itemShape = {};
          for (const sub of (_a2 = (_a = field.itemSchema) == null ? void 0 : _a.fields) != null ? _a2 : []) {
            const leaf2 = rulesForScalar(sub);
            if (leaf2) setDeep2(itemShape, sub.path.split("."), leaf2);
          }
          const arrInModel = getDeep(model.value, full) || [];
          for (let i = 0; i < arrInModel.length; i++) {
            setDeep2(rules2, [...full, String(i)], itemShape);
          }
          return;
        }
        const leaf = rulesForScalar(field);
        if (leaf) setDeep2(rules2, full, leaf);
        if (field.type === "checkbox-group" && field.options) {
          const allowed = field.options.map((o) => o.value);
          const arr = getDeep(model.value, full) || [];
          for (let i = 0; i < arr.length; i++) {
            setDeep2(rules2, [...full, String(i)], { oneOf: fr.oneOf(allowed) });
          }
        }
      };
      for (const s of def.sections) for (const f of s.fields) addFieldRules(f);
      return rules2;
    }
    const rules = computed(() => buildRules(props.formDefinition));
    const v$ = useVuelidate(rules, model, { $autoDirty: false, $lazy: true });
    function nodeFor(path) {
      const segs = path.split(".");
      let n = v$.value;
      for (const k of segs) {
        if (!(n == null ? void 0 : n[k])) return null;
        n = n[k];
      }
      return n;
    }
    function inSectionPath(errPath, sectionPaths) {
      const norm = (s) => s.replace(/\[(\d+)\]/g, ".$1");
      const p = norm(errPath);
      return sectionPaths.some((sp) => p.startsWith(norm(sp)));
    }
    const sections = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = props.formDefinition) == null ? void 0 : _a.sections) != null ? _a2 : [];
    });
    async function validateCurrentSection() {
      await nextTick();
      await v$.value.$validate();
      const s = sections.value[currentSection.value];
      if (!s) return true;
      const paths = s.fields.map((f) => f.path);
      return !v$.value.$errors.some(
        (e) => {
          var _a, _b;
          return inSectionPath((_b = (_a = e.$propertyPath) != null ? _a : e.$property) != null ? _b : "", paths);
        }
      );
    }
    const isCurrentStepInvalid = computed(() => {
      const s = sections.value[currentSection.value];
      if (!s) return false;
      const paths = s.fields.map((f) => f.path);
      return v$.value.$errors.some(
        (e) => {
          var _a, _b;
          return inSectionPath((_b = (_a = e.$propertyPath) != null ? _a : e.$property) != null ? _b : "", paths);
        }
      );
    });
    async function next() {
      var _a;
      try {
        if (!await validateCurrentSection()) return;
        const nextIdx = currentSection.value + 1;
        if (nextIdx >= sections.value.length) {
          emit("complete");
          return;
        }
        currentSection.value = nextIdx;
        (_a = formRef.value) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        console.error("[DynamicForm/next]", e);
      }
    }
    watch(sections, (list) => {
      if (!list.length) {
        currentSection.value = 0;
        return;
      }
      if (currentSection.value > list.length - 1) {
        currentSection.value = list.length - 1;
      }
    });
    function prev() {
      currentSection.value--;
      if (formRef.value) {
        formRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
        console.log("Scrolled to top of form");
      }
    }
    async function changeStep(step) {
      if (step < 0 || step >= props.formDefinition.sections.length) return;
      if (step === currentSection.value) return;
      if (step < currentSection.value) {
        currentSection.value = step;
        return;
      } else if (step > currentSection.value) {
        if (await validateCurrentSection()) {
          currentSection.value = step;
        }
        return;
      }
    }
    const getSuggestion = (k) => {
      var _a;
      if (!k) return "";
      const arr = Array.isArray(props.suggestions) ? props.suggestions : [];
      const hit = arr.find((it) => it && it.key === k);
      return (_a = hit == null ? void 0 : hit.value) != null ? _a : "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_FormElementsFormSteps = __nuxt_component_0;
      const _component_FormElementsFormField = __nuxt_component_1;
      const _component_UIPrimaryButton = __nuxt_component_1$1;
      const _component_UISecondaryButton = __nuxt_component_6$1;
      if (_ctx.formDefinition) {
        _push(`<form${ssrRenderAttrs(mergeProps({
          ref_key: "formRef",
          ref: formRef,
          class: "dynamic-form"
        }, _attrs))} data-v-c2b725da><span class="dynamic-form__title sr-only" data-v-c2b725da>${ssrInterpolate((_a = _ctx.formDefinition) == null ? void 0 : _a.title)}</span>`);
        if (((_b = _ctx.formDefinition) == null ? void 0 : _b.sections.length) > 1) {
          _push(ssrRenderComponent(_component_FormElementsFormSteps, {
            "steps-labels": _ctx.formDefinition.sections.map((s) => s.label),
            currentStep: currentSection.value + 1,
            onChangeStep: changeStep
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(((_c = _ctx.formDefinition) == null ? void 0 : _c.sections) || [], (section, index) => {
          _push(`<div${ssrRenderAttr("id", section.id)} class="dynamic-form__section" style="${ssrRenderStyle(currentSection.value === index ? null : { display: "none" })}" data-v-c2b725da><div class="dynamic-form__section__fields" data-v-c2b725da><!--[-->`);
          ssrRenderList(section.fields, (field) => {
            _push(ssrRenderComponent(_component_FormElementsFormField, {
              key: field.path,
              formField: field,
              suggestion: getSuggestion(field.suggestionRef),
              modelValue: model.value,
              "onUpdate:modelValue": ($event) => model.value = $event,
              validation: nodeFor(field.path),
              onHasErrors: ($event) => stopNextStep.value = $event.hasErrors
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--><div class="dynamic-form__buttons" data-v-c2b725da>`);
        _push(ssrRenderComponent(_component_UIPrimaryButton, {
          variant: isCurrentStepInvalid.value ? "error-color" : "accent-color",
          icon: "arrow_right",
          onClick: next,
          onKeydown: [next, next]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivant `);
            } else {
              return [
                createTextVNode(" Suivant ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (currentSection.value > 0) {
          _push(ssrRenderComponent(_component_UISecondaryButton, {
            variant: "accent-color",
            icon: "arrow_left",
            reverse: true,
            onClick: prev,
            onKeydown: [prev, prev]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Pr\xE9c\xE9dent `);
              } else {
                return [
                  createTextVNode(" Pr\xE9c\xE9dent ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></form>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/DynamicForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c2b725da"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TrustPilot",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_2;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrustPilot.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-42144c52"]]);
const achievement = publicAssetsURL("/achievement-45.svg?url");

export { __nuxt_component_3 as _, achievement as a, __nuxt_component_5 as b };
//# sourceMappingURL=virtual_public-iCNOiLb_.mjs.map
