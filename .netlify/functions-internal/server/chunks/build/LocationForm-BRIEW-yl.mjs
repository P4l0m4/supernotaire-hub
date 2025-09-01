import { a as _export_sfc, c as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useDebounceFn, onClickOutside } from '@vueuse/core';
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

const addressError = "S\xE9lectionnez une adresse";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LocationForm",
  __ssrInlineRender: true,
  emits: ["address"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const isMobile = ref(false);
    const target = ref(null);
    const query = ref("");
    const suggestions = ref([]);
    const isOpen = ref(false);
    const loading = ref(false);
    const isAddressSelected = ref(false);
    const addressSelected = ref();
    ref(null);
    const showError = ref(false);
    async function fetchSuggestions() {
      var _a;
      loading.value = true;
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(
          query.value
        )}&limit=3`
      );
      const data = await res.json();
      suggestions.value = ((_a = data.features) != null ? _a : []).filter(
        (f) => f.properties.label !== query.value
      );
      if (isMobile.value) suggestions.value.reverse();
      loading.value = false;
      isOpen.value = !!suggestions.value.length;
    }
    const debouncedFetch = useDebounceFn(fetchSuggestions, 400);
    async function submit() {
      if (!isAddressSelected.value) {
        showError.value = true;
        setTimeout(() => {
          showError.value = false;
        }, 1500);
        return;
      } else {
        emit("address", addressSelected.value);
      }
    }
    watch(query, (newVal) => {
      isAddressSelected.value = false;
      if (!newVal) {
        suggestions.value = [];
        isOpen.value = false;
        return;
      }
      debouncedFetch();
    });
    onClickOutside(target, () => isOpen.value = false, {});
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIPrimaryButton = __nuxt_component_0$2;
      _push(`<form${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: ["location-form", { open: isOpen.value, "location-form--has-error": showError.value }]
      }, _attrs))} data-v-4cfcf703><div class="location-form__input-field" data-v-4cfcf703><input id="location-form-input" class="location-form__input-field__input" type="text" placeholder="10 rue de la tranquillit\xE9, 75140, Paris..."${ssrRenderAttr("value", query.value)} data-v-4cfcf703></div>`);
      if (isOpen.value) {
        _push(`<ul class="autocomplete" data-v-4cfcf703><!--[-->`);
        ssrRenderList(suggestions.value, (suggestion) => {
          _push(`<li class="autocomplete__suggestion" data-v-4cfcf703><button data-v-4cfcf703>${ssrInterpolate(suggestion.properties.label)}</button></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UIPrimaryButton, {
        type: "submit",
        variant: showError.value ? "error-color" : "accent-color",
        class: "button",
        icon: loading.value ? "circle_notch" : void 0,
        onClick: submit,
        onKeydown: [submit, submit]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(showError.value ? addressError : "Confirmer")}`);
          } else {
            return [
              createTextVNode(toDisplayString(showError.value ? addressError : "Confirmer"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/LocationForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LocationForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4cfcf703"]]);

export { LocationForm as default };
//# sourceMappingURL=LocationForm-BRIEW-yl.mjs.map
