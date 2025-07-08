import { _ as _export_sfc, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, mergeProps, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
      const _component_IconComponent = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "faq-component" }, _attrs))} data-v-98e2a98b><!--[-->`);
      ssrRenderList(__props.questions, (question, index) => {
        _push(`<div class="faq-component__card" data-v-98e2a98b><h5 class="faq-component__card__question" data-v-98e2a98b>${ssrInterpolate(question.title)} `);
        _push(ssrRenderComponent(_component_IconComponent, {
          icon: unref(questionOpened) === index ? "caret_down_bold" : "caret_right_bold",
          size: "1.5rem"
        }, null, _parent));
        _push(`</h5>`);
        if (unref(questionOpened) === index) {
          _push(`<p class="faq-component__card__answer" data-v-98e2a98b>${ssrInterpolate(question.answer)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FAQComponent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-98e2a98b"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "faq-notaires",
  __ssrInlineRender: true,
  setup(__props) {
    const questions = [
      {
        title: "Comment fonctionne le simulateur ?",
        answer: "Nous nous basons sur les donn\xE9es DVF (Demandes de Valeurs Fonci\xE8res) pour estimer la valeur des biens immobiliers. Le simulateur fait ensuite une estimation bas\xE9e sur les transactions r\xE9centes dans la r\xE9gion. Il applique une d\xE9cote ou une surcote en fonction de l'\xE9tat du bien, de sa localisation et d'autres facteurs."
      },
      {
        title: "Le simulateur est-il fiable ?",
        answer: "Oui, le simulateur utilise des donn\xE9es officielles r\xE9guli\xE8rement actualis\xE9es et prend en compte un maximum de crit\xE8res pour fournir une estimation la plus pr\xE9cise possible."
      },
      {
        title: "L'offre obtenue est-elle d\xE9finitive ?",
        answer: "Aucune offre n'est d\xE9finitive tant que le bien n'a pas \xE9t\xE9 visit\xE9 par un professionnel. L'estimation est indicative et peut varier en fonction de l'\xE9tat et la situation r\xE9els du bien."
      },
      {
        title: "A quoi sert Martinimmo ?",
        answer: "Nous avons con\xE7u Martinimmo pour simplifier la vente de biens immobiliers. C'est une solution digitale qui fluidifie au maximum le processus de vente pour que vous r\xE9cup\xE9riez votre argent ultra rapidement."
      },
      {
        title: "Quels types de biens puis-je estimer ?",
        answer: "Vous pouvez estimer tout type d'appartements ou de maisons. Le simulateur n'est en revanche pas adapt\xE9 pour les terrains, les locaux commerciaux, les garages et les lots."
      },
      {
        title: "J'ai un probl\xE8me sur le site, que faire ?",
        answer: "Vous pouvez nous contacter par mail \xE0 l'adresse tekilawebfactory@gmail.com."
      },
      {
        title: "Comment \xE7a marche ?",
        answer: "Vous pouvez estimer votre bien en ligne, obtenir une offre d'achat instantan\xE9ment et finaliser la vente en toute simplicit\xE9 et tr\xE8s rapidement."
      },
      {
        title: "A qui s'adresse Martinimmo ?",
        answer: "Martinimmo s'adresse \xE0 tous les propri\xE9taires de biens immobiliers qui souhaitent vendre rapidement et facilement, sans les tracas des m\xE9thodes traditionnelles."
      }
    ];
    useHead({
      title: "Foire aux questions - Vente acc\xE9l\xE9r\xE9e de biens immobiliers",
      meta: [
        {
          name: "description",
          content: "D\xE9couvrez les r\xE9ponses aux questions fr\xE9quentes sur la vente de biens immobiliers avec Martinimmo. Estimez votre bien, obtenez une offre d'achat et vendez rapidement."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FAQComponent = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "faq" }, _attrs))} data-v-305fdcba><h1 class="titles" data-v-305fdcba>Foire aux questions</h1>`);
      _push(ssrRenderComponent(_component_FAQComponent, { questions }, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faq-notaires.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const faqNotaires = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-305fdcba"]]);

export { faqNotaires as default };
//# sourceMappingURL=faq-notaires-C-exTVWW.mjs.map
