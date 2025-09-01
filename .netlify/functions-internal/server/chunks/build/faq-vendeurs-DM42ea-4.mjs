import { b as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_2 } from './FAQComponent-BTibXSzv.mjs';
import { defineComponent, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useJsonld } from './composable-ChyRw7se.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "faq-vendeurs",
  __ssrInlineRender: true,
  setup(__props) {
    const questions = [
      {
        title: "Comment fonctionne Supernotaire ?",
        answer: "Inscrivez vous et commencez \xE0 cr\xE9er votre dossier et attribuez-le rapidement \xE0 un notaire. Vous \xEAtes guid\xE9 \xE0 chaque \xE9tape pour fournir les documents et informations n\xE9cessaires et nous automatisons au maximum la collecte d'informations pour vous faire gagner du temps. Tout se fait en ligne, et vous pouvez suivre l'avancement de votre dossier en temps r\xE9el."
      },
      {
        title: "Supernotaire est-il fiable ?",
        answer: "Oui, Supernotaire est une plateforme fiable. Nous nous mettons r\xE9guli\xE8rement l'outil \xE0 jour et veillons \xE0 la s\xE9curit\xE9 des donn\xE9es qui transitent par la plateforme. De plus, nous travaillons en \xE9troite collaboration avec des notaires pour garantir la fiabilit\xE9 de l'outil."
      },
      {
        title: "A quoi sert Supernotaire ?",
        answer: "Supernotaire est une plateforme qui permet aux vendeurs et aux acheteurs de biens de finaliser rapidement une vente immobili\xE8re. Ils peuvent confier rapidement leur dossier \xE0 un notaire via l'annuaire et gagnent \xE9norm\xE9ment de temps sur le processus de collecte d'informations et de signature."
      },
      {
        title: "Quels types de ventes de biens puis-je acc\xE9l\xE9rer ?",
        answer: "Vous pouvez acc\xE9l\xE9rer la finalisation de vente immobili\xE8re de maisons et d'appartements. En revanche, Supernotaire n'est pas con\xE7u pour les ventes de terrains ou autres types de biens immobiliers."
      },
      {
        title: "A qui s'adresse Supernotaire ?",
        answer: "Supernotaire s'adresse aux particuliers et professionnels qui souhaitent simplifier et acc\xE9l\xE9rer la finalisation d'une vente immobili\xE8re. La plateforme b\xE9n\xE9ficie \xE9galement aux notaires g\xE9rant des mandats de vente immobili\xE8re."
      },
      {
        title: "Combien co\xFBte Supernotaire ?",
        answer: "Supernotaire est totalement gratuit pour les vendeurs et acheteurs de biens, qu'ils soient particuliers ou professionnels. "
      }
    ];
    const jsonLDFAQ = questions.map((question) => {
      return {
        "@type": "Question",
        name: question.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: question.answer
        }
      };
    });
    useJsonld(() => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: jsonLDFAQ
    }));
    useHead({
      title: "Supernotaire | Questions fr\xE9quentes des notaires",
      meta: [
        {
          name: "description",
          content: "Retrouvez les r\xE9ponses aux questions les plus fr\xE9quentes des notaires sur Supernotaire."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_FAQComponent = __nuxt_component_2;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="faq"${_scopeId}><div class="faq__headlines"${_scopeId}><h1 class="titles"${_scopeId}>Foire aux questions</h1><h2 class="paragraphs"${_scopeId}> Des r\xE9ponses aux questions des vendeurs et acheteurs de biens immobiliers sur Supernotaire.fr </h2></div>`);
            _push2(ssrRenderComponent(_component_FAQComponent, { questions }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "faq" }, [
                createVNode("div", { class: "faq__headlines" }, [
                  createVNode("h1", { class: "titles" }, "Foire aux questions"),
                  createVNode("h2", { class: "paragraphs" }, " Des r\xE9ponses aux questions des vendeurs et acheteurs de biens immobiliers sur Supernotaire.fr ")
                ]),
                createVNode(_component_FAQComponent, { questions })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faq-vendeurs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=faq-vendeurs-DM42ea-4.mjs.map
