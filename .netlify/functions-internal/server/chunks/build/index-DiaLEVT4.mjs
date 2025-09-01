import { a as _export_sfc, b as __nuxt_component_0, _ as __nuxt_component_0$4, e as __nuxt_component_1$1, d as colors } from './server.mjs';
import { defineComponent, ref, watch, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { u as useAsyncData } from './asyncData-Dm5ojLGe.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SearchBar",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: {},
    delay: {}
  },
  emits: ["update:modelValue", "search"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const local = computed({
      get: () => props.modelValue,
      set: (v) => emit("update:modelValue", v)
    });
    const debouncedSearch = useDebounceFn(
      () => emit("search", props.modelValue),
      (_a = props.delay) != null ? _a : 350
    );
    watch(
      () => props.modelValue,
      () => debouncedSearch()
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIIconComponent = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "search-bar",
        tabindex: "0"
      }, _attrs))} data-v-433e3dcc>`);
      _push(ssrRenderComponent(_component_UIIconComponent, {
        icon: "search",
        color: unref(colors)["text-color-faded"]
      }, null, _parent));
      _push(`<input type="search"${ssrRenderAttr("value", local.value)}${ssrRenderAttr("placeholder", _ctx.placeholder)} class="search-bar__input" data-v-433e3dcc></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/SearchBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-433e3dcc"]]);
const API_BASE = "https://supernotaire-kiro-production.up.railway.app";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const query = ref("");
    const notaries = ref();
    const pending = ref(false);
    const error = ref();
    async function handleSearch() {
      const {
        data,
        pending: searchPending,
        error: searchError
      } = await useAsyncData(
        "notaries",
        () => $fetch(`${API_BASE}/api/notaries`, {
          query: {
            query: query.value,
            page: 1,
            limit: 20,
            sortBy: "relevance",
            sortOrder: "desc"
          },
          parseResponse: (resp) => JSON.parse(resp)
        })
      );
      notaries.value = data.value;
      pending.value = searchPending.value;
      error.value = searchError.value;
      console.log("search results \u279C", notaries.value.data);
    }
    watch(query, (newQuery) => {
      if (newQuery.length >= 3) {
        handleSearch();
      } else {
        notaries.value = [];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_FormElementsSearchBar = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          var _a, _b;
          if (_push2) {
            _push2(`<div class="annuaire" data-v-15e7ff08${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormElementsSearchBar, {
              modelValue: query.value,
              "onUpdate:modelValue": ($event) => query.value = $event,
              placeholder: "Chercher par nom",
              onSearch: (q) => console.log("debounced query \u279C", q)
            }, null, _parent2, _scopeId));
            if (pending.value) {
              _push2(`<p data-v-15e7ff08${_scopeId}>Chargement\u2026</p>`);
            } else if (error.value) {
              _push2(`<p data-v-15e7ff08${_scopeId}> Impossible de r\xE9cup\xE9rer la liste\xA0: ${ssrInterpolate(error.value.statusCode)}\xA0\u2013\xA0${ssrInterpolate(error.value.statusMessage)}</p>`);
            } else {
              _push2(`<ul class="annuaire__list" data-v-15e7ff08${_scopeId}><!--[-->`);
              ssrRenderList((_a2 = (_a = notaries.value) == null ? void 0 : _a.data) != null ? _a2 : [], (n) => {
                _push2(`<li class="annuaire__list__card" data-v-15e7ff08${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/annuaire/${n.id}`,
                  class: "annuaire__list__card__link-wrapper"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="annuaire__list__card__link-wrapper__image" data-v-15e7ff08${_scopeId2}></span><h3 class="annuaire__list__card__link-wrapper__name" data-v-15e7ff08${_scopeId2}> M\u1D49 ${ssrInterpolate(n.name)}</h3><span class="annuaire__list__card__link-wrapper__city" data-v-15e7ff08${_scopeId2}>${ssrInterpolate(n.office.city)}</span>\xA0`);
                    } else {
                      return [
                        createVNode("span", { class: "annuaire__list__card__link-wrapper__image" }),
                        createVNode("h3", { class: "annuaire__list__card__link-wrapper__name" }, " M\u1D49 " + toDisplayString(n.name), 1),
                        createVNode("span", { class: "annuaire__list__card__link-wrapper__city" }, toDisplayString(n.office.city), 1),
                        createTextVNode("\xA0")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "annuaire" }, [
                createVNode(_component_FormElementsSearchBar, {
                  modelValue: query.value,
                  "onUpdate:modelValue": ($event) => query.value = $event,
                  placeholder: "Chercher par nom",
                  onSearch: (q) => console.log("debounced query \u279C", q)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onSearch"]),
                pending.value ? (openBlock(), createBlock("p", { key: 0 }, "Chargement\u2026")) : error.value ? (openBlock(), createBlock("p", { key: 1 }, " Impossible de r\xE9cup\xE9rer la liste\xA0: " + toDisplayString(error.value.statusCode) + "\xA0\u2013\xA0" + toDisplayString(error.value.statusMessage), 1)) : (openBlock(), createBlock("ul", {
                  key: 2,
                  class: "annuaire__list"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList((_b2 = (_b = notaries.value) == null ? void 0 : _b.data) != null ? _b2 : [], (n) => {
                    return openBlock(), createBlock("li", {
                      key: n.id,
                      class: "annuaire__list__card"
                    }, [
                      createVNode(_component_NuxtLink, {
                        to: `/annuaire/${n.id}`,
                        class: "annuaire__list__card__link-wrapper"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "annuaire__list__card__link-wrapper__image" }),
                          createVNode("h3", { class: "annuaire__list__card__link-wrapper__name" }, " M\u1D49 " + toDisplayString(n.name), 1),
                          createVNode("span", { class: "annuaire__list__card__link-wrapper__city" }, toDisplayString(n.office.city), 1),
                          createTextVNode("\xA0")
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]);
                  }), 128))
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/annuaire/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15e7ff08"]]);

export { index as default };
//# sourceMappingURL=index-DiaLEVT4.mjs.map
