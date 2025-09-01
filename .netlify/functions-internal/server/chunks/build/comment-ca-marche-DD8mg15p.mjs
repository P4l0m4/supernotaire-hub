import { a as _export_sfc, b as __nuxt_component_0, _ as __nuxt_component_0$4 } from './server.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_5 } from './SecondaryButton-BxF-bgRN.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Perk",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "perk" }, _attrs))} data-v-9ae87b1b><span class="perk__icon" aria-label="Illustration anim\xE9e" role="img" data-v-9ae87b1b>${(_a = _ctx.icon) != null ? _a : ""}</span><h2 class="perk__title" data-v-9ae87b1b>${ssrInterpolate(_ctx.title)}</h2><p class="paragraphs" data-v-9ae87b1b>${ssrInterpolate(_ctx.description)}</p></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Perk.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9ae87b1b"]]);
const lightning = '<?xml version="1.0" standalone="no"?>\r\n<svg id="Vector" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; max-height: 100%;">\n<path d="M15 1L13 11L21 14L7 29L9 19L1 16L15 1Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,78.5206527709961"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.6944444444444444s" values="0,0,0,78.5206527709961; \n          0,39.26032638549805,39.26032638549805,0; \n          78.5206527709961,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n</svg>';
const sparkle = '<?xml version="1.0" standalone="no"?>\r\n<svg id="Sparkle" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; max-height: 100%;">\n<g clip-path="url(#clip0_1218_4886)">\n<path d="M10.5339 21.4659L3.64767 18.9284C3.45779 18.8583 3.29396 18.7317 3.17824 18.5657C3.06253 18.3996 3.00049 18.2021 3.00049 17.9997C3.00049 17.7973 3.06253 17.5997 3.17824 17.4337C3.29396 17.2676 3.45779 17.141 3.64767 17.0709L10.5339 14.5334L13.0714 7.64718C13.1415 7.4573 13.2681 7.29347 13.4342 7.17775C13.6002 7.06204 13.7978 7 14.0002 7C14.2026 7 14.4001 7.06204 14.5662 7.17775C14.7322 7.29347 14.8588 7.4573 14.9289 7.64718L17.4664 14.5334L24.3527 17.0709C24.5426 17.141 24.7064 17.2676 24.8221 17.4337C24.9378 17.5997 24.9999 17.7973 24.9999 17.9997C24.9999 18.2021 24.9378 18.3996 24.8221 18.5657C24.7064 18.7317 24.5426 18.8583 24.3527 18.9284L17.4664 21.4659L14.9289 28.3522C14.8588 28.5421 14.7322 28.7059 14.5662 28.8216C14.4001 28.9373 14.2026 28.9994 14.0002 28.9994C13.7978 28.9994 13.6002 28.9373 13.4342 28.8216C13.2681 28.7059 13.1415 28.5421 13.0714 28.3522L10.5339 21.4659Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,68.35139465332031"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,68.35139465332031; \n          0,34.175697326660156,34.175697326660156,0; \n          68.35139465332031,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M22 2V8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,6"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,6; \n          0,3,3,0; \n          6,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M28 9V13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,4"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,4; \n          0,2,2,0; \n          4,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M19 5H25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,6"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,6; \n          0,3,3,0; \n          6,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M26 11H30" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,4"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,4; \n          0,2,2,0; \n          4,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n</g>\n<defs>\n<clipPath id="clip0_1218_4886">\n<rect width="32" height="32" fill="white" stroke-dasharray="0,0,0,128"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,128; \n          0,64,64,0; \n          128,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></rect>\n</clipPath>\n</defs>\n</svg>';
const clock = '<?xml version="1.0" standalone="no"?>\r\n<svg id="ClockCountdown" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; max-height: 100%;">\n<g clip-path="url(#clip0_1218_4899)">\n<path d="M28 17C27.4912 23.16 22.2913 28 16 28C12.8174 28 9.76516 26.7357 7.51472 24.4853C5.26428 22.2348 4 19.1826 4 16C4 9.70875 8.84 4.50875 15 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,54.60907745361328"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,54.60907745361328; \n          0,27.30453872680664,27.30453872680664,0; \n          54.60907745361328,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M16 9V16H23" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,14"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,14; \n          0,7,7,0; \n          14,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M20 6C20.8284 6 21.5 5.32843 21.5 4.5C21.5 3.67157 20.8284 3 20 3C19.1716 3 18.5 3.67157 18.5 4.5C18.5 5.32843 19.1716 6 20 6Z" fill="black" stroke-dasharray="0,0,0,9.426094055175781"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,9.426094055175781; \n          0,4.713047027587891,4.713047027587891,0; \n          9.426094055175781,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M24.5 9C25.3284 9 26 8.32843 26 7.5C26 6.67157 25.3284 6 24.5 6C23.6716 6 23 6.67157 23 7.5C23 8.32843 23.6716 9 24.5 9Z" fill="black" stroke-dasharray="0,0,0,9.426093101501465"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,9.426093101501465; \n          0,4.713046550750732,4.713046550750732,0; \n          9.426093101501465,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M27.5 13.5C28.3284 13.5 29 12.8284 29 12C29 11.1716 28.3284 10.5 27.5 10.5C26.6716 10.5 26 11.1716 26 12C26 12.8284 26.6716 13.5 27.5 13.5Z" fill="black" stroke-dasharray="0,0,0,9.426066398620605"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,9.426066398620605; \n          0,4.713033199310303,4.713033199310303,0; \n          9.426066398620605,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n</g>\n<defs>\n<clipPath id="clip0_1218_4899">\n<rect width="32" height="32" fill="white" stroke-dasharray="0,0,0,128"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,128; \n          0,64,64,0; \n          128,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></rect>\n</clipPath>\n</defs>\n</svg>';
const globe = '<?xml version="1.0" standalone="no"?>\r\n<svg id="Globe" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; max-height: 100%;">\n<g clip-path="url(#clip0_1218_4893)">\n<path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,75.40877532958984"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,75.40877532958984; \n          0,37.70438766479492,37.70438766479492,0; \n          75.40877532958984,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M21 16C21 24 16 28 16 28C16 28 11 24 11 16C11 8 16 4 16 4C16 4 21 8 21 16Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,53.536094665527344"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,53.536094665527344; \n          0,26.768047332763672,26.768047332763672,0; \n          53.536094665527344,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M4.68262 12H27.3176" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,22.634979248046875"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,22.634979248046875; \n          0,11.317489624023438,11.317489624023438,0; \n          22.634979248046875,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M4.68262 20H27.3176" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,22.634979248046875"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,22.634979248046875; \n          0,11.317489624023438,11.317489624023438,0; \n          22.634979248046875,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n</g>\n<defs>\n<clipPath id="clip0_1218_4893">\n<rect width="32" height="32" fill="white" stroke-dasharray="0,0,0,128"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,128; \n          0,64,64,0; \n          128,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></rect>\n</clipPath>\n</defs>\n</svg>';
const lock = '<?xml version="1.0" standalone="no"?>\r\n<svg id="LockKey" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; max-height: 100%;">\n<g clip-path="url(#clip0_1218_4906)">\n<path d="M16 20C17.3807 20 18.5 18.8807 18.5 17.5C18.5 16.1193 17.3807 15 16 15C14.6193 15 13.5 16.1193 13.5 17.5C13.5 18.8807 14.6193 20 16 20Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,15.71017074584961"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,15.71017074584961; \n          0,7.855085372924805,7.855085372924805,0; \n          15.71017074584961,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M16 20V23" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,3"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,3; \n          0,1.5,1.5,0; \n          3,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M26 11H6C5.44772 11 5 11.4477 5 12V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V12C27 11.4477 26.5523 11 26 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,74.28410339355469"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,74.28410339355469; \n          0,37.142051696777344,37.142051696777344,0; \n          74.28410339355469,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n<path d="M11 11V7C11 5.67392 11.5268 4.40215 12.4645 3.46447C13.4021 2.52678 14.6739 2 16 2C17.3261 2 18.5979 2.52678 19.5355 3.46447C20.4732 4.40215 21 5.67392 21 7V11" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0,0,0,23.707990646362305"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,23.707990646362305; \n          0,11.853995323181152,11.853995323181152,0; \n          23.707990646362305,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></path>\n</g>\n<defs>\n<clipPath id="clip0_1218_4906">\n<rect width="32" height="32" fill="white" stroke-dasharray="0,0,0,128"><animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="1" dur="0.684931506849315s" values="0,0,0,128; \n          0,64,64,0; \n          128,0,0,0" keyTimes="0; 0.5; 1" fill="freeze"></animate></rect>\n</clipPath>\n</defs>\n</svg>';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "comment-ca-marche",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Avancez plus rapidement sur votre dossier de vente immobili\xE8re | Supernotaire",
      meta: [
        {
          name: "description",
          content: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:title",
          content: "Avancez plus rapidement sur votre dossier de vente immobili\xE8re | Supernotaire"
        },
        {
          property: "og:url",
          content: "https://opengraph.b-cdn.net/production/images/0d54207b-5b60-4086-9160-a5b7df6bf2c6.jpg?token=iHNWoqdZlZfJaFO_MRtDAX6VyogK9vW0tj-ShcS9QsQ&height=982&width=968&expires=33284606311"
        },
        {
          property: "og:image",
          content: "https://martinimmo.n/og-image.jpg"
        },
        {
          property: "og:description",
          content: "Cr\xE9ez facilement votre dossier de vente immobili\xE8re et confiez-le rapidement \xE0 un notaire, o\xF9 que vous soyez."
        }
      ]
    });
    const perks = [
      {
        icon: lightning,
        title: "Automatisation des t\xE2ches r\xE9p\xE9titives",
        description: "Gagnez du temps et r\xE9duisez les erreurs en automatisant les t\xE2ches redondantes. Pr\xE9-remplissage des documents, analyse des fichiers, parcours ultra-optimis\xE9s; nous nous vous guidons jusqu\u2019au bout du processus pour une efficacit\xE9 maximale."
      },
      {
        icon: sparkle,
        title: "Formulaires intelligents",
        description: "Ne renseignez jamais les m\xEAmes informations deux fois gr\xE2ce aux formulaires intelligents qui se pr\xE9-remplissent \xE0 partir des documents et informations que vous fournissez."
      },
      {
        icon: clock,
        title: "Suivi en temps r\xE9el",
        description: "Ne r\xE9clamez plus des informations. Suivez facilement la progression de vos dossiers de vente en temps r\xE9el et soyez notifi\xE9 lorsque votre intervention est n\xE9cessaire. "
      },
      {
        icon: globe,
        title: "Digital & Sans fronti\xE8res",
        description: "De la cr\xE9ation du dossier \xE0 la signature de l\u2019acte de vente, tout se fait en ligne. De quoi vous faire gagner du temps et vous lib\xE9rer des contraintes g\xE9ographiques."
      },
      {
        icon: lock,
        title: "S\xE9curit\xE9 renforc\xE9e",
        description: "Vos documents et vos donn\xE9es sont prot\xE9g\xE9s par des mesures de s\xE9curit\xE9 avanc\xE9es. Supernotaire garantit la confidentialit\xE9 de vos informations personnelles et administratives, conform\xE9ment avec les plus hauts standards de s\xE9curit\xE9 informatique."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_UIPerk = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UISecondaryButton = __nuxt_component_5;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="headlines" data-v-02e45158${_scopeId}><h1 class="headlines__title" data-v-02e45158${_scopeId}>Supernotaire.fr</h1><p class="headlines__subtitle paragraphs" data-v-02e45158${_scopeId}> Gagner du temps sans compromettre la s\xE9curit\xE9 ni la d\xE9ontologie notariale </p></div><div class="perks" data-v-02e45158${_scopeId}><!--[-->`);
            ssrRenderList(perks, (perk) => {
              _push2(ssrRenderComponent(_component_UIPerk, {
                key: perk.title,
                icon: perk.icon,
                title: perk.title,
                description: perk.description
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/inscription",
              class: "perks__link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UISecondaryButton, {
                    variant: "accent-color",
                    icon: "arrow_right",
                    style: { "height": "100%", "max-width": "none" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Cr\xE9er mon compte `);
                      } else {
                        return [
                          createTextVNode(" Cr\xE9er mon compte ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UISecondaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right",
                      style: { "height": "100%", "max-width": "none" }
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er mon compte ")
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
              createVNode("div", { class: "headlines" }, [
                createVNode("h1", { class: "headlines__title" }, "Supernotaire.fr"),
                createVNode("p", { class: "headlines__subtitle paragraphs" }, " Gagner du temps sans compromettre la s\xE9curit\xE9 ni la d\xE9ontologie notariale ")
              ]),
              createVNode("div", { class: "perks" }, [
                (openBlock(), createBlock(Fragment, null, renderList(perks, (perk) => {
                  return createVNode(_component_UIPerk, {
                    key: perk.title,
                    icon: perk.icon,
                    title: perk.title,
                    description: perk.description
                  }, null, 8, ["icon", "title", "description"]);
                }), 64)),
                createVNode(_component_NuxtLink, {
                  to: "/inscription",
                  class: "perks__link"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UISecondaryButton, {
                      variant: "accent-color",
                      icon: "arrow_right",
                      style: { "height": "100%", "max-width": "none" }
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cr\xE9er mon compte ")
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
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/comment-ca-marche.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const commentCaMarche = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-02e45158"]]);

export { commentCaMarche as default };
//# sourceMappingURL=comment-ca-marche-DD8mg15p.mjs.map
