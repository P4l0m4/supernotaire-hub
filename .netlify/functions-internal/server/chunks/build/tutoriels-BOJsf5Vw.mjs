import { b as __nuxt_component_0, J as Je, u as useState, _ as __nuxt_component_0$3 } from './server.mjs';
import { _ as __nuxt_component_6 } from './SecondaryButton-Bz5oS0xB.mjs';
import { defineComponent, withAsyncContext, withCtx, unref, createBlock, openBlock, Fragment, renderList, createTextVNode, createVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "HowTo",
  __ssrInlineRender: true,
  props: {
    tutorialTitle: {},
    tutorialDescription: {},
    tutorialPreviewImage: {},
    tutorialTotalTime: {},
    tutorialCost: {},
    tutorialPrerequisites: {},
    tutorialOptions: {},
    tutorialReferences: {},
    tutorialLastUpdate: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UISecondaryButton = __nuxt_component_6;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="how-to"${_scopeId}><img class="how-to__preview-image"${ssrRenderAttr("src", _ctx.tutorialPreviewImage)}${ssrRenderAttr("alt", _ctx.tutorialTitle)}${_scopeId}><h1 class="how-to__title"${_scopeId}>${ssrInterpolate(_ctx.tutorialTitle)}</h1><p class="how-to__description"${_scopeId}>${ssrInterpolate(_ctx.tutorialDescription)}</p><span class="how-to__last-update"${_scopeId}> Last updated: ${ssrInterpolate(props.tutorialLastUpdate)}</span><div class="how-to__details"${_scopeId}><p class="how-to__details__time"${_scopeId}>Total Time: ${ssrInterpolate(_ctx.tutorialTotalTime)}</p><p class="how-to__details__cost"${_scopeId}>Cost: ${ssrInterpolate(_ctx.tutorialCost)}</p></div><div class="how-to__prerequisites"${_scopeId}><h2 class="how-to__prerequisites__title"${_scopeId}>Prerequisites</h2><ul class="how-to__prerequisites__list"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.tutorialPrerequisites, (prerequisite) => {
              _push2(`<li class="how-to__prerequisites__list__element"${_scopeId}>${ssrInterpolate(prerequisite.name)} `);
              if (prerequisite.internalLink) {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  class: "how-to__prerequisites__list__element__link",
                  to: prerequisite.internalLink,
                  "aria-label": "aide"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UISecondaryButton, { variant: "accent-color" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`Aide`);
                          } else {
                            return [
                              createTextVNode("Aide")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UISecondaryButton, { variant: "accent-color" }, {
                          default: withCtx(() => [
                            createTextVNode("Aide")
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div><div class="how-to__options"${_scopeId}><h2 class="how-to__options__title"${_scopeId}>Options</h2><ul class="how-to__options__list"${_scopeId}><!--[-->`);
            ssrRenderList(props.tutorialOptions, (option) => {
              _push2(`<li class="how-to__options__list__element"${_scopeId}><h3 class="how-to__options__list__element__title"${_scopeId}>${ssrInterpolate(option.name)}</h3><ul class="how-to__options__list__element__steps"${_scopeId}><!--[-->`);
              ssrRenderList(option.steps, (step) => {
                _push2(`<li class="how-to__options__list__element__steps__step"${_scopeId}><p class="how-to__options__list__element__steps__step__text"${_scopeId}></p> ${ssrInterpolate(step.text)} (Tip: ${ssrInterpolate(step.tip)}) `);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: step.link
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`More info`);
                    } else {
                      return [
                        createTextVNode("More info")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></li>`);
            });
            _push2(`<!--]--></ul></div><div class="how-to__references"${_scopeId}><h2${_scopeId}>References</h2><ul${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.tutorialReferences, (reference) => {
              _push2(`<li${_scopeId}><a${ssrRenderAttr("href", reference)}${_scopeId}>${ssrInterpolate(reference)}</a></li>`);
            });
            _push2(`<!--]--></ul></div></div>`);
          } else {
            return [
              createVNode("div", { class: "how-to" }, [
                createVNode("img", {
                  class: "how-to__preview-image",
                  src: _ctx.tutorialPreviewImage,
                  alt: _ctx.tutorialTitle
                }, null, 8, ["src", "alt"]),
                createVNode("h1", { class: "how-to__title" }, toDisplayString(_ctx.tutorialTitle), 1),
                createVNode("p", { class: "how-to__description" }, toDisplayString(_ctx.tutorialDescription), 1),
                createVNode("span", { class: "how-to__last-update" }, " Last updated: " + toDisplayString(props.tutorialLastUpdate), 1),
                createVNode("div", { class: "how-to__details" }, [
                  createVNode("p", { class: "how-to__details__time" }, "Total Time: " + toDisplayString(_ctx.tutorialTotalTime), 1),
                  createVNode("p", { class: "how-to__details__cost" }, "Cost: " + toDisplayString(_ctx.tutorialCost), 1)
                ]),
                createVNode("div", { class: "how-to__prerequisites" }, [
                  createVNode("h2", { class: "how-to__prerequisites__title" }, "Prerequisites"),
                  createVNode("ul", { class: "how-to__prerequisites__list" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.tutorialPrerequisites, (prerequisite) => {
                      return openBlock(), createBlock("li", {
                        class: "how-to__prerequisites__list__element",
                        key: prerequisite.name
                      }, [
                        createTextVNode(toDisplayString(prerequisite.name) + " ", 1),
                        prerequisite.internalLink ? (openBlock(), createBlock(_component_NuxtLink, {
                          key: 0,
                          class: "how-to__prerequisites__list__element__link",
                          to: prerequisite.internalLink,
                          "aria-label": "aide"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UISecondaryButton, { variant: "accent-color" }, {
                              default: withCtx(() => [
                                createTextVNode("Aide")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 2
                        }, 1032, ["to"])) : createCommentVNode("", true)
                      ]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "how-to__options" }, [
                  createVNode("h2", { class: "how-to__options__title" }, "Options"),
                  createVNode("ul", { class: "how-to__options__list" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(props.tutorialOptions, (option) => {
                      return openBlock(), createBlock("li", {
                        class: "how-to__options__list__element",
                        key: option.name
                      }, [
                        createVNode("h3", { class: "how-to__options__list__element__title" }, toDisplayString(option.name), 1),
                        createVNode("ul", { class: "how-to__options__list__element__steps" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(option.steps, (step) => {
                            return openBlock(), createBlock("li", {
                              class: "how-to__options__list__element__steps__step",
                              key: step.name
                            }, [
                              createVNode("p", { class: "how-to__options__list__element__steps__step__text" }),
                              createTextVNode(" " + toDisplayString(step.text) + " (Tip: " + toDisplayString(step.tip) + ") ", 1),
                              createVNode(_component_NuxtLink, {
                                to: step.link
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("More info")
                                ]),
                                _: 2
                              }, 1032, ["to"])
                            ]);
                          }), 128))
                        ])
                      ]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "how-to__references" }, [
                  createVNode("h2", null, "References"),
                  createVNode("ul", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.tutorialReferences, (reference) => {
                      return openBlock(), createBlock("li", { key: reference }, [
                        createVNode("a", { href: reference }, toDisplayString(reference), 9, ["href"])
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jsonLD/HowTo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function stringToSlug(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]+/g, "").replace(/\s+/g, "-").toLowerCase();
}
const useAsyncStoryblok = async (url, apiOptions = {}, bridgeOptions = {}) => {
  var _a;
  const storyblokApiInstance = Je();
  const uniqueKey = `${JSON.stringify(apiOptions)}${url}`;
  const story = useState(`${uniqueKey}-state`);
  if (!story.value) {
    const { data } = await useAsyncData(uniqueKey, () => {
      return storyblokApiInstance.get(
        `cdn/stories/${url}`,
        apiOptions
      );
    }, "$UWpoAmqTPy");
    if (data) {
      story.value = (_a = data.value) == null ? void 0 : _a.data.story;
    }
  }
  return story;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tutoriels",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const story = ([__temp, __restore] = withAsyncContext(() => useAsyncStoryblok("tutoriels", {
      version: "published"
    })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_JsonLDHowTo = _sfc_main$1;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(story).content.tutorials, (tutorial) => {
              _push2(ssrRenderComponent(_component_JsonLDHowTo, {
                "tutorial-title": tutorial.title,
                "tutorial-description": tutorial.description,
                "tutorial-preview-image": tutorial.previewImage.filename,
                "tutorial-total-time": tutorial.totalTime,
                "tutorial-cost": tutorial.estimatedCost,
                "tutorial-prerequisites": tutorial.prerequisites,
                "tutorial-options": tutorial.options,
                "tutorial-references": tutorial.references,
                "tutorial-last-update": tutorial.lastUpdate,
                key: unref(stringToSlug)(tutorial.title)
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(story).content.tutorials, (tutorial) => {
                return openBlock(), createBlock(_component_JsonLDHowTo, {
                  "tutorial-title": tutorial.title,
                  "tutorial-description": tutorial.description,
                  "tutorial-preview-image": tutorial.previewImage.filename,
                  "tutorial-total-time": tutorial.totalTime,
                  "tutorial-cost": tutorial.estimatedCost,
                  "tutorial-prerequisites": tutorial.prerequisites,
                  "tutorial-options": tutorial.options,
                  "tutorial-references": tutorial.references,
                  "tutorial-last-update": tutorial.lastUpdate,
                  key: unref(stringToSlug)(tutorial.title)
                }, null, 8, ["tutorial-title", "tutorial-description", "tutorial-preview-image", "tutorial-total-time", "tutorial-cost", "tutorial-prerequisites", "tutorial-options", "tutorial-references", "tutorial-last-update"]);
              }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tutoriels.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tutoriels-BOJsf5Vw.mjs.map
