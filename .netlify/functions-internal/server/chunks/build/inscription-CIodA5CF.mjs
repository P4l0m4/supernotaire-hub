import { a as _export_sfc, b as __nuxt_component_0$1, c as __nuxt_component_1$1, _ as __nuxt_component_0$3 } from './server.mjs';
import { defineComponent, withCtx, createVNode, ref, computed, mergeProps, createTextVNode, unref, withModifiers, createBlock, createCommentVNode, openBlock, withKeys, mergeModels, useModel, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_1$2 } from './InputField-CzMR3qml.mjs';
import { _ as __nuxt_component_6 } from './SecondaryButton-Bz5oS0xB.mjs';
import { useVuelidate } from '@vuelidate/core';
import emailjs from '@emailjs/browser';
import { email, required } from '@vuelidate/validators';
import { u as useHead } from './v3-BRmP28IU.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "RadioOption",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: {},
    name: {},
    value: {},
    label: {},
    description: {},
    checked: { type: Boolean }
  }, {
    "modelValue": { type: [String, Number, Boolean] },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    ref(null);
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({
        for: _ctx.id,
        class: "radio-option",
        tabindex: "0"
      }, _attrs))} data-v-8571f790><input class="radio-option__input" type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(model.value, null)) ? " checked" : ""}${ssrRenderAttr("id", _ctx.id)}${ssrRenderAttr("name", _ctx.name)}${ssrRenderAttr("value", _ctx.value)} data-v-8571f790><div class="radio-option__text" data-v-8571f790><span class="radio-option__text__fake-label" data-v-8571f790>${ssrInterpolate(_ctx.label)}</span>`);
      if (_ctx.description) {
        _push(`<p class="radio-option__text__description" data-v-8571f790>${ssrInterpolate(_ctx.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></label>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormElements/RadioOption.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-8571f790"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ConfirmationPopUp",
  __ssrInlineRender: true,
  emits: ["closeConfirmation"],
  setup(__props, { emit: __emit }) {
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "pop-up",
        tabindex: "0",
        "aria-label": "fermer la pop up"
      }, _attrs))} data-v-69f92839><div class="pop-up__content" tabindex="0" data-v-69f92839><h2 class="subtitles" data-v-69f92839>`);
      ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
      _push(`</h2><span class="paragraphs" data-v-69f92839>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
      ssrRenderSlot(_ctx.$slots, "button", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmationPopUp.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-69f92839"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InscriptionComponent",
  __ssrInlineRender: true,
  setup(__props) {
    const isPopupOpen = ref(false);
    const selectedOption = ref("vendeur");
    const radioOptions = [
      {
        id: "option1",
        name: "options",
        value: "vendeur",
        label: "J'ai un bien \xE0 vendre",
        description: "Je veux finaliser la vente rapidement, sans difficult\xE9s"
      },
      {
        id: "option2",
        name: "options",
        value: "notaire",
        label: "Je suis notaire",
        description: "Je veux g\xE9rer plus de mandats sans augmenter ma charge de travail"
      }
    ];
    const emailAdress = ref("");
    const isSubmitting = ref(false);
    const wasSent = ref(false);
    const templateParams = computed(() => ({
      email: emailAdress.value,
      option: selectedOption.value
    }));
    function confirmSubmission() {
      isSubmitting.value = false;
      wasSent.value = true;
      vContact$.value.$reset();
      emailAdress.value = "";
      setTimeout(() => {
        wasSent.value = false;
      }, 3e3);
    }
    const rules = {
      email: {
        required,
        email
      }
    };
    const vContact$ = useVuelidate(rules, { email: emailAdress });
    const form = ref(null);
    const emailErrors = computed(() => {
      const errors = [];
      if (!vContact$.value.email.$dirty) return errors;
      vContact$.value.email.required.$invalid && errors.push("Ajoutez une adresse mail");
      vContact$.value.email.email.$invalid && errors.push("Adresse mail invalide");
      return errors;
    });
    async function submitForm() {
      isSubmitting.value = true;
      await emailjs.send(
        "service_am6r8vv",
        "template_v8vtsgd",
        templateParams.value,
        "ZGkiwrxxdhrgjjnRC"
      );
      confirmSubmission();
    }
    async function validContactState() {
      const valid = await vContact$.value.$validate();
      if (valid) {
        submitForm();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormElementsRadioOption = __nuxt_component_0;
      const _component_UIPrimaryButton = __nuxt_component_1$1;
      const _component_ConfirmationPopUp = __nuxt_component_2;
      const _component_FormElementsInputField = __nuxt_component_1$2;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UISecondaryButton = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inscription-component" }, _attrs))} data-v-72732bcd><!--[-->`);
      ssrRenderList(radioOptions, (opt) => {
        _push(ssrRenderComponent(_component_FormElementsRadioOption, {
          key: opt.id,
          id: opt.id,
          name: opt.name,
          value: opt.value,
          label: opt.label,
          description: opt.description,
          modelValue: selectedOption.value,
          "onUpdate:modelValue": ($event) => selectedOption.value = $event
        }, null, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_UIPrimaryButton, {
        variant: "accent-color",
        icon: "arrow_right",
        style: { "margin-top": "0.5rem" },
        onClick: ($event) => isPopupOpen.value = true,
        onKeydown: [($event) => isPopupOpen.value = true, ($event) => isPopupOpen.value = true],
        tabindex: "0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Continuer`);
          } else {
            return [
              createTextVNode("Continuer")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (isPopupOpen.value) {
        _push(ssrRenderComponent(_component_ConfirmationPopUp, {
          onCloseConfirmation: ($event) => isPopupOpen.value = false
        }, {
          title: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Merci de votre int\xE9r\xEAt pour Supernotaire !`);
            } else {
              return [
                createTextVNode("Merci de votre int\xE9r\xEAt pour Supernotaire !")
              ];
            }
          }),
          button: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="buttons" data-v-72732bcd${_scopeId}><form class="form-beta" data-v-72732bcd${_scopeId}>`);
              if (!wasSent.value) {
                _push2(ssrRenderComponent(_component_FormElementsInputField, {
                  id: "beta-email",
                  name: "beta-email",
                  modelValue: emailAdress.value,
                  "onUpdate:modelValue": ($event) => emailAdress.value = $event,
                  type: "email",
                  autocomplete: "on",
                  autofocus: true,
                  label: "Votre adresse mail",
                  placeholder: "Votre adresse mail",
                  icon: "mail",
                  error: unref(emailErrors)[0],
                  style: { "width": "100%" }
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (!wasSent.value) {
                _push2(ssrRenderComponent(_component_UIPrimaryButton, {
                  variant: "accent-color",
                  icon: isSubmitting.value ? "circle_notch_bold" : "hands_clapping_fill",
                  style: { "width": "fit-content" },
                  onClick: validContactState,
                  onKeydown: [validContactState, validContactState]
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Rejoindre`);
                    } else {
                      return [
                        createTextVNode("Rejoindre")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (wasSent.value) {
                _push2(`<span class="form-beta__success-message" data-v-72732bcd${_scopeId}>Demande bien re\xE7ue \u{1F44C}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</form>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "https://www.linkedin.com/in/aurore-sajot/",
                target: "_blank",
                style: { "width": "100%" }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UISecondaryButton, {
                      variant: "secondary-color",
                      icon: "linkedin_logo"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Suivre le projet`);
                        } else {
                          return [
                            createTextVNode("Suivre le projet")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UISecondaryButton, {
                        variant: "secondary-color",
                        icon: "linkedin_logo"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Suivre le projet")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "buttons" }, [
                  createVNode("form", {
                    class: "form-beta",
                    ref_key: "form",
                    ref: form,
                    onSubmit: withModifiers(_ctx.submit, ["prevent"]),
                    onClick: ($event) => $event.stopPropagation()
                  }, [
                    !wasSent.value ? (openBlock(), createBlock(_component_FormElementsInputField, {
                      key: 0,
                      id: "beta-email",
                      name: "beta-email",
                      modelValue: emailAdress.value,
                      "onUpdate:modelValue": ($event) => emailAdress.value = $event,
                      type: "email",
                      autocomplete: "on",
                      autofocus: true,
                      label: "Votre adresse mail",
                      placeholder: "Votre adresse mail",
                      icon: "mail",
                      error: unref(emailErrors)[0],
                      style: { "width": "100%" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error"])) : createCommentVNode("", true),
                    !wasSent.value ? (openBlock(), createBlock(_component_UIPrimaryButton, {
                      key: 1,
                      variant: "accent-color",
                      icon: isSubmitting.value ? "circle_notch_bold" : "hands_clapping_fill",
                      style: { "width": "fit-content" },
                      onClick: validContactState,
                      onKeydown: [
                        withKeys(validContactState, ["enter"]),
                        withKeys(validContactState, ["space"])
                      ]
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Rejoindre")
                      ]),
                      _: 1
                    }, 8, ["icon"])) : createCommentVNode("", true),
                    wasSent.value ? (openBlock(), createBlock("span", {
                      key: 2,
                      class: "form-beta__success-message"
                    }, "Demande bien re\xE7ue \u{1F44C}")) : createCommentVNode("", true)
                  ], 40, ["onSubmit", "onClick"]),
                  createVNode(_component_NuxtLink, {
                    to: "https://www.linkedin.com/in/aurore-sajot/",
                    target: "_blank",
                    style: { "width": "100%" }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UISecondaryButton, {
                        variant: "secondary-color",
                        icon: "linkedin_logo"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Suivre le projet")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` La plateforme est encore en d\xE9veloppement, mais vous pouvez rejoindre la b\xEAta et nous suivre sur les r\xE9seaux sociaux \u26A1 `);
            } else {
              return [
                createTextVNode(" La plateforme est encore en d\xE9veloppement, mais vous pouvez rejoindre la b\xEAta et nous suivre sur les r\xE9seaux sociaux \u26A1 ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InscriptionComponent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-72732bcd"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "inscription",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Supernotaire | Inscrivez-vous pour avancer rapidement sur votre dossier de vente immobili\xE8re",
      meta: [
        {
          name: "description",
          content: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0$1;
      const _component_InscriptionComponent = __nuxt_component_1;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="inscription" data-v-02f41b6a${_scopeId}><h1 class="titles" data-v-02f41b6a${_scopeId}>Cr\xE9ez votre compte</h1></div>`);
            _push2(ssrRenderComponent(_component_InscriptionComponent, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "inscription" }, [
                createVNode("h1", { class: "titles" }, "Cr\xE9ez votre compte")
              ]),
              createVNode(_component_InscriptionComponent)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inscription.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const inscription = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-02f41b6a"]]);

export { inscription as default };
//# sourceMappingURL=inscription-CIodA5CF.mjs.map
