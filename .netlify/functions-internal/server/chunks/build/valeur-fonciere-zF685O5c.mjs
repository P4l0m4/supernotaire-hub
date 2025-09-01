import { a as _export_sfc, b as __nuxt_component_0, _ as __nuxt_component_0$4, c as __nuxt_component_0$2, f as useNuxtApp, u as useState, e as __nuxt_component_1$1, d as colors, j as __nuxt_component_1$2 } from './server.mjs';
import { _ as __nuxt_component_2$1, a as achievement, b as __nuxt_component_4 } from './virtual_public-C_k5HplP.mjs';
import { _ as __nuxt_component_1$3 } from './StatusComponent-Cvi__m8f.mjs';
import { _ as __nuxt_component_5 } from './SecondaryButton-BxF-bgRN.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, defineAsyncComponent, reactive, ref, watch, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './FAQComponent-BTibXSzv.mjs';
import { _ as __nuxt_component_3 } from './DidYouKnow-D3KAcN22.mjs';
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
import './InputField-CzMR3qml.mjs';
import './TagComponent-DzyrMhAj.mjs';
import '@vueuse/core';
import './TertiaryButton-B2pqK--O.mjs';
import '@vuelidate/validators';
import '@vuelidate/core';

const DATASET = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/buildingref-france-demande-de-valeurs-foncieres-geolocalisee-millesime/records";
function buildUrl(args) {
  const p = new URLSearchParams();
  p.set("limit", String(args.limit));
  p.append("refine", `code_postal:"${args.postcode}"`);
  if (args.year) p.append("refine", `date_mutation:"${args.year}"`);
  if (args.typeLocal) p.append("refine", `type_local:"${args.typeLocal}"`);
  if (args.rooms) p.append("refine", `nombre_pieces_principales:${args.rooms}`);
  if (args.typeLocal === "Maison" && args.land && args.land > 0)
    p.append("where", "surface_terrain > 0");
  else p.append("where", "surface_terrain IS NULL");
  return `${DATASET}?${p.toString()}`;
}
async function fetchBuildingRecords(form, { year, limit = 60, firstYear = 2014 } = {}) {
  var _a, _b;
  const postcode = (_b = (_a = form.adresse) == null ? void 0 : _a.properties) == null ? void 0 : _b.postcode;
  if (!postcode) return [];
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  let y = Number(year != null ? year : currentYear);
  if (!Number.isFinite(y)) y = currentYear;
  const out = [];
  while (out.length < limit && y >= (firstYear != null ? firstYear : 2014)) {
    const remaining = limit - out.length;
    const url = buildUrl({
      postcode,
      typeLocal: form.configuration.type_local,
      rooms: form.dimensions.pieces,
      land: form.dimensions.terrain,
      year: String(y),
      limit: remaining
    });
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    if (Array.isArray(data == null ? void 0 : data.results))
      out.push(...data.results);
    y--;
  }
  console.log(`Fetched ${out.length} DVF records`);
  return out;
}
function avg(list) {
  if (!list.length) return null;
  return list.reduce((s, v) => s + v, 0) / list.length;
}
function computeAvgPricePerSqm(records) {
  const perSqm = records.map((r) => {
    var _a;
    const price = Number(String((_a = r.valeur_fonciere) != null ? _a : "").replace(/\s+/g, ""));
    const sqm = Number(r.surface_reelle_bati);
    return Number.isFinite(price) && sqm > 0 ? price / sqm : null;
  }).filter((v) => v != null);
  return avg(perSqm);
}
const BONUS = {
  terrasse: { Appartement: 4, Maison: 3 },
  balcon: { Appartement: 3 },
  jardin: { Maison: 6 },
  cave: { Appartement: 1, Maison: 1 },
  garage: { Appartement: 2, Maison: 4 },
  parking: { Appartement: 2, Maison: 4 },
  piscine: { Appartement: 5, Maison: 10 },
  ascenseur: { Appartement: 4 },
  interphone: { Appartement: 1 },
  alarme: { Maison: 1 },
  climatisation: { Appartement: 2, Maison: 2 },
  exposition: { Appartement: 2, Maison: 2 },
  tennis: { Appartement: 3, Maison: 6 },
  vue_exceptionnelle: { Appartement: 5, Maison: 5 }
};
function bonusFactor(equipement, typeLocal) {
  if (!(equipement == null ? void 0 : equipement.length)) return 1;
  const total = equipement.reduce((sum, key) => {
    var _a;
    const b = (_a = BONUS[key]) == null ? void 0 : _a[typeLocal];
    return b ? sum + b : sum;
  }, 0);
  return 1 + total / 100;
}
const MALUS = {
  ESN: { Appartement: -3, Maison: -3 },
  // Espace naturel sensible
  AMH: { Appartement: -3, Maison: -3 },
  // Abords de Monument historique
  monument: { Appartement: -8, Maison: -8 },
  // Monument historique
  ZIBlue: { Appartement: -6, Maison: -8 },
  // Zone inondable bleue
  ZIRed: { Appartement: -12, Maison: -15 }
  // Zone inondable rouge
};
function malusFactor(malus, typeLocal) {
  if (!(malus == null ? void 0 : malus.length)) return 1;
  const total = malus.reduce((sum, key) => {
    var _a;
    const m = (_a = MALUS[key]) == null ? void 0 : _a[typeLocal];
    return m ? sum + m : sum;
  }, 0);
  return 1 + total / 100;
}
function dpePct(dpe) {
  switch (dpe) {
    case "A":
      return 4;
    case "B":
      return 2;
    case "C":
      return 1;
    case "D":
      return -1;
    case "E":
      return -2;
    case "F":
      return -4;
    case "G":
      return -10;
    default:
      return 0;
  }
}
const dpeFactor = (dpe) => 1 + dpePct(dpe) / 100;
function groundFloorFactor(rdc, typeLocal) {
  if (!rdc) return 1;
  return typeLocal === "Appartement" ? 0.92 : 1;
}
const downtownFactor = (is_downtown) => is_downtown ? 1.2 : 1;
function renovationFactor(travaux) {
  const n = Number(travaux != null ? travaux : "0");
  return 1 - (Number.isFinite(n) ? n : 0) / 100;
}
async function estimateFromForm(form, opts) {
  var _a;
  const records = await fetchBuildingRecords(form, opts);
  const avgPricePerSqm = computeAvgPricePerSqm(records);
  const surface = Number((_a = form.dimensions) == null ? void 0 : _a.surface);
  const marketValue = avgPricePerSqm != null && Number.isFinite(surface) ? avgPricePerSqm * surface : null;
  const factors = {
    renovation: renovationFactor(form.etat.travaux),
    dpe: dpeFactor(form.etat.dpe),
    downtown: downtownFactor(form.is_downtown),
    bonus: bonusFactor(form.configuration.bonus, form.configuration.type_local),
    malus: malusFactor(form.configuration.malus, form.configuration.type_local),
    groundFloor: groundFloorFactor(
      form.configuration.rdc,
      form.configuration.type_local
    )
  };
  const estimatedValue = marketValue == null ? null : Math.round(
    marketValue * factors.renovation * factors.dpe * factors.downtown * factors.bonus * factors.malus * factors.groundFloor
  );
  let landComparisonRecords = [];
  let avgPricePerSqmWithoutLand = null;
  let avgLandPricePerSqm = null;
  let landSurface = null;
  let landValue = null;
  if (form.configuration.type_local === "Maison" && form.dimensions.terrain && form.dimensions.terrain > 0) {
    landSurface = Number(form.dimensions.terrain);
    const formWithoutLand = {
      ...form,
      dimensions: { ...form.dimensions, terrain: 0 }
      // deep clone de ce qu’on modifie
    };
    formWithoutLand.dimensions.terrain = 0;
    landComparisonRecords = await fetchBuildingRecords(formWithoutLand, {
      ...opts,
      limit: 60
    });
    avgPricePerSqmWithoutLand = computeAvgPricePerSqm(landComparisonRecords);
    if (avgPricePerSqm != null && avgPricePerSqmWithoutLand != null) {
      const deltaBuiltEurPerSqm = avgPricePerSqm - avgPricePerSqmWithoutLand;
      avgLandPricePerSqm = deltaBuiltEurPerSqm * (surface / landSurface);
      const builtSurface = Number(form.dimensions.surface) || 0;
      landValue = Math.max(0, Math.round(deltaBuiltEurPerSqm * builtSurface));
    }
  }
  return {
    records,
    avgPricePerSqm,
    marketValue,
    factors,
    estimatedValue,
    landValue,
    avgLandPricePerSqm
  };
}
const title = "Valeur fonci\xE8re";
const sections = [{ "id": "dimensions", "label": "Dimensions du bien", "fields": [{ "path": "dimensions.surface", "id": "dimensions-surface", "suggestionRef": "surface_batie_du_bien", "label": "Surface b\xE2tie r\xE9elle en m\xB2", "name": "surface", "type": "number", "min": 9, "required": true, "placeholder": "100", "icon": "scan_fill" }, { "path": "dimensions.surface_habitable", "id": "dimensions-surface-habitable", "suggestionRef": "surface_habitable_du_bien", "label": "Surface habitable Carrez en m\xB2", "name": "surface_habitable", "type": "number", "placeholder": "80", "required": true, "icon": "buildings_fill" }, { "path": "dimensions.pieces", "id": "dimensions-pieces", "suggestionRef": "dimensions_nb_pieces_principales", "label": "Nombre de pi\xE8ces", "name": "pieces", "type": "number", "placeholder": "3", "min": 1, "required": true, "icon": "home_fill" }, { "path": "dimensions.terrain", "id": "dimensions-terrain", "suggestionRef": "dimensions_terrain", "label": "Surface du terrain en m\xB2 (pour les maisons)", "name": "terrain", "type": "number", "placeholder": "300", "min": 10, "required": false, "icon": "farm_fill" }] }, { "id": "configuration", "label": "Configuration du bien", "fields": [{ "path": "configuration.type_local", "id": "configuration-type-local", "suggestionRef": "configuration_type_de_bien", "label": "Type de bien", "name": "type_local", "type": "select", "required": true, "options": ["Appartement", "Maison"], "placeholder": "S\xE9lectionner le type de bien", "icon": "house_line_fill" }, { "path": "configuration.bonus", "id": "configuration-bonus", "suggestionRef": "configuration_bonus", "label": "Bonus \xE9ventuels", "name": "bonus", "type": "checkbox-group", "placeholder": "S\xE9lectionner les bonus", "icon": "arrow_circle_up_fill", "options": [{ "value": "terrasse", "label": "Terrasse", "belongsTo": ["Appartement", "Maison"] }, { "value": "balcon", "label": "Balcon(s)", "belongsTo": ["Appartement"] }, { "value": "jardin", "label": "Jardin", "belongsTo": ["Maison"] }, { "value": "cave", "label": "Cave", "belongsTo": ["Appartement", "Maison"] }, { "value": "garage", "label": "Garage", "belongsTo": ["Appartement", "Maison"] }, { "value": "piscine", "label": "Piscine", "belongsTo": ["Appartement", "Maison"] }, { "value": "ascenseur", "label": "Ascenseur", "belongsTo": ["Appartement"] }, { "value": "interphone", "label": "Interphone", "belongsTo": ["Appartement"] }, { "value": "alarme", "label": "Alarme", "belongsTo": ["Maison"] }, { "value": "climatisation", "label": "Climatisation", "belongsTo": ["Appartement", "Maison"] }, { "value": "exposition", "label": "Exposition Sud", "belongsTo": ["Appartement", "Maison"] }, { "value": "tennis", "label": "Court de tennis", "belongsTo": ["Appartement", "Maison"] }, { "value": "parking", "label": "Parking priv\xE9", "belongsTo": ["Appartement", "Maison"] }, { "value": "vue_exceptionnelle", "label": "Vue exceptionnelle", "belongsTo": ["Appartement", "Maison"] }], "required": false }, { "path": "configuration.malus", "id": "configuration-malus", "suggestionRef": "configuration_malus", "label": "Malus \xE9ventuels", "name": "malus", "placeholder": "S\xE9lectionner les malus", "type": "checkbox-group", "icon": "arrow_circle_down_fill", "options": [{ "value": "ESN", "label": "Espace Naturel Sensible" }, { "value": "AMH", "label": "Abords de Monuments Historiques" }, { "value": "monument", "label": "Monument Historique" }, { "value": "ZIRed", "label": "Zone Inondable (PPRI rouge)" }, { "value": "ZIBlue", "label": "Zone Inondable (PPRI bleu fonc\xE9)" }], "required": false }, { "path": "configuration.rdc", "id": "configuration-rdc", "suggestionRef": "configuration_rez_de_chaussee", "label": "Bien situ\xE9 en rez-de-chauss\xE9e", "name": "rez_de_chaussee", "type": "checkbox", "required": false }] }, { "id": "etat", "label": "\xC9tat du bien", "fields": [{ "path": "etat.travaux", "id": "etat-travaux", "suggestionRef": "etat_travaux", "label": "Travaux", "name": "travaux", "type": "range", "options": [{ "label": "Pas de travaux \xE0 pr\xE9voir", "value": "0" }, { "label": "Rafra\xEEchissement l\xE9ger (peintures, sols\u2026)", "value": "1" }, { "label": "R\xE9novation partielle (cuisine / SDB, \xE9lectricit\xE9 partielle\u2026)", "value": "2" }, { "label": "Grosse r\xE9novation (restructuration, copro travaux\u2026)", "value": "3" }], "required": false, "icon": "crane_tower_fill" }, { "path": "etat.dpe", "id": "etat-dpe", "suggestionRef": "etat_dpe", "label": "DPE", "name": "dpe", "type": "select", "placeholder": "S\xE9lectionner le score DPE", "required": true, "options": ["A", "B", "C", "D", "E", "F", "G"], "icon": "thermometer_simple_bold" }, { "path": "etat.annee_construction", "id": "etat-annee-construction", "suggestionRef": "etat_annee_construction", "label": "Ann\xE9e de construction", "name": "annee_construction", "type": "date", "mode": "year-picker", "placeholder": "1950", "required": true }] }];
const formDefinition = {
  title,
  sections
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CalculateurValeurFonciere",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b;
    defineAsyncComponent({
      loader: () => import('./LocationForm-BRIEW-yl.mjs'),
      onError(err, _retry, fail) {
        console.error("LocationForm load failed", err);
        fail(err);
      }
    });
    const formData = reactive({});
    formData.configuration = (_a = formData.configuration) != null ? _a : {
      rdc: false
    };
    formData.etat = (_b = formData.etat) != null ? _b : {
      travaux: "0"
    };
    const showFirstAction = ref(true);
    const showLastAction = ref(false);
    const valuation = ref({
      records: [],
      avgPricePerSqm: null,
      marketValue: null,
      factors: {
        renovation: 1,
        dpe: 1,
        downtown: 1,
        bonus: 1,
        malus: 1,
        groundFloor: 1
      },
      estimatedValue: null,
      landValue: null,
      avgLandPricePerSqm: null,
      avgPricePerSqmWithoutLand: null
    });
    const dvfLoading = ref(false);
    const dvfError = ref(void 0);
    async function computeValuation() {
      var _a2;
      dvfLoading.value = true;
      dvfError.value = void 0;
      try {
        valuation.value = await estimateFromForm(formData, {
          limit: 60,
          firstYear: 2014
        });
      } catch (e) {
        dvfError.value = (_a2 = e == null ? void 0 : e.message) != null ? _a2 : "Erreur inconnue";
      } finally {
        dvfLoading.value = false;
      }
    }
    function onFormCompletion() {
      showLastAction.value = true;
      computeValuation();
    }
    async function findCityCenter() {
      var _a2, _b2, _c;
      const city = (_b2 = (_a2 = formData.adresse) == null ? void 0 : _a2.properties) == null ? void 0 : _b2.city;
      if (!city) return null;
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
          city
        )}&fields=centre&format=json`
      );
      const data = await res.json();
      if (!((_c = data == null ? void 0 : data[0]) == null ? void 0 : _c.centre)) return null;
      const { coordinates } = data[0].centre;
      return { lng: coordinates[0], lat: coordinates[1] };
    }
    async function checkDowntown() {
      var _a2, _b2;
      if (!((_b2 = (_a2 = formData.adresse) == null ? void 0 : _a2.geometry) == null ? void 0 : _b2.coordinates)) {
        formData.is_downtown = false;
        return;
      }
      const center = await findCityCenter();
      if (!center) {
        formData.is_downtown = false;
        return;
      }
      const R = 6371e3;
      const toRad = (d) => d * Math.PI / 180;
      const dLat = toRad(center.lat - formData.adresse.geometry.coordinates[1]);
      const dLng = toRad(center.lng - formData.adresse.geometry.coordinates[0]);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(formData.adresse.geometry.coordinates[1])) * Math.cos(toRad(center.lat)) * Math.sin(dLng / 2) ** 2;
      const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      formData.is_downtown = distance <= 1500;
    }
    const { $pdfMake } = useNuxtApp();
    useState("pdfmake-ready");
    watch(
      () => formData.adresse,
      async (val) => {
        if (val) await checkDowntown();
        showFirstAction.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a3, _b2, _c, _d, _e, _f, _g, _h;
      var _a2;
      const _component_UIIconComponent = __nuxt_component_1$1;
      const _component_ClientOnly = __nuxt_component_1$2;
      const _component_FormElementsDynamicForm = __nuxt_component_2$1;
      const _component_StatusComponent = __nuxt_component_1$3;
      const _component_TrustPilot = __nuxt_component_4;
      const _component_UISecondaryButton = __nuxt_component_5;
      _push(`<!--[-->`);
      if (showFirstAction.value) {
        _push(`<div class="action" data-v-611b3ec0><div class="location" data-v-611b3ec0><label for="location-form-input" class="location-label" data-v-611b3ec0>Adresse du bien \xE0 estimer`);
        _push(ssrRenderComponent(_component_UIIconComponent, {
          icon: "asterisk",
          size: "0.75rem",
          color: unref(colors)["error-color"]
        }, null, _parent));
        _push(`</label>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!showFirstAction.value && !showLastAction.value) {
        _push(ssrRenderComponent(_component_FormElementsDynamicForm, {
          formDefinition: unref(formDefinition),
          modelValue: unref(formData),
          "onUpdate:modelValue": ($event) => isRef(formData) ? formData.value = $event : null,
          suggestions: [],
          onComplete: onFormCompletion
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showLastAction.value) {
        _push(`<div class="action" data-v-611b3ec0>`);
        if (dvfLoading.value) {
          _push(ssrRenderComponent(_component_StatusComponent, {
            status: dvfLoading.value ? "processing" : dvfError.value ? "failed" : "completed",
            error: dvfError.value
          }, null, _parent));
        } else if (valuation.value) {
          _push(`<!--[--><div class="action__illustration" data-v-611b3ec0><img class="action__illustration__image"${ssrRenderAttr("src", unref(achievement))} alt="Avant de partir" data-v-611b3ec0></div><ul class="action__list" data-v-611b3ec0><span class="action__list__title" data-v-611b3ec0>${ssrInterpolate((_a3 = (_a2 = valuation.value.estimatedValue) == null ? void 0 : _a2.toLocaleString("fr-FR")) != null ? _a3 : "N/A")} \u20AC</span><span class="action__list__subtitle" data-v-611b3ec0>D\xE9tails de l&#39;estimation :</span><li class="action__list__item" data-v-611b3ec0> Valeur de base (hors d\xE9cote/surcote): ${ssrInterpolate((_c = Math.round((_b2 = valuation.value.marketValue) != null ? _b2 : 0).toLocaleString("fr-FR")) != null ? _c : "N/A")} \u20AC </li><li class="action__list__item" data-v-611b3ec0> Prix moyen/m\xB2: ${ssrInterpolate((_e = Math.round((_d = valuation.value.avgPricePerSqm) != null ? _d : 0).toLocaleString("fr-FR")) != null ? _e : "N/A")} \u20AC </li>`);
          if (valuation.value.landValue && valuation.value.landValue > 0) {
            _push(`<!--[--><li class="action__list__item" data-v-611b3ec0> Valeur du terrain seul: ${ssrInterpolate(Math.round(valuation.value.landValue).toLocaleString("fr-FR"))} \u20AC </li><li class="action__list__item" data-v-611b3ec0> Valeur du bien + terrain: <strong data-v-611b3ec0>${ssrInterpolate((_h = Math.round(
              ((_f = valuation.value.estimatedValue) != null ? _f : 0) + ((_g = valuation.value.landValue) != null ? _g : 0)
            ).toLocaleString("fr-FR")) != null ? _h : "N/A")} \u20AC</strong></li><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_TrustPilot, { style: { "margin-top": "auto" } }, null, _parent));
          _push(`<div class="action__list__buttons" data-v-611b3ec0>`);
          _push(ssrRenderComponent(_component_UISecondaryButton, {
            variant: "accent-color",
            icon: "arrow_left",
            reverse: true,
            onClick: ($event) => showLastAction.value = false,
            onKeydown: [($event) => showLastAction.value = false, ($event) => showLastAction.value = false]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Revenir au formulaire `);
              } else {
                return [
                  createTextVNode(" Revenir au formulaire ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
          _push(`</div></ul><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CalculateurValeurFonciere.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-611b3ec0"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "valeur-fonciere",
  __ssrInlineRender: true,
  setup(__props) {
    const questions = [
      {
        title: "Combient co\xFBte le service de calcul de valeur fonci\xE8re ?",
        answer: "Vous pouvez utiliser Supernotaire.fr pour estimer gratuitement la valeur fonci\xE8re de votre bien immobilier."
      },
      {
        title: "L'estimation de la valeur fonci\xE8re est-elle fiable ?",
        answer: "Oui, l'estimation de la valeur fonci\xE8re sur Supernotaire est bas\xE9e sur les donn\xE9es DVF fournies par le gouvernement fran\xE7ais et des algorithmes de calcul pr\xE9cis tenant compte de nombreux facteurs et de leur impact r\xE9el sur le prix d'un bien. "
      },
      {
        title: "Le service de calcul de valeur fonci\xE8re est-il s\xE9curis\xE9 ?",
        answer: "Nous prenons la s\xE9curit\xE9 de vos donn\xE9es tr\xE8s au s\xE9rieux, c'est pourquoi aucune des informations et que vous fournissez ne sont stock\xE9s ni partag\xE9s \xE0 des tiers. Les donn\xE9es renseign\xE9es ne sont pas conserv\xE9es apr\xE8s le traitement"
      },
      {
        title: "\xC0 qui s'adresse ce service de calcul de valeur fonci\xE8re ?",
        answer: "Ce service est destin\xE9 aux vendeurs et acheteurs de biens, notaires, syndics de copropri\xE9t\xE9, et autres professionnels de l'immobilier qui ont besoin de calculer et estimer rapidement la valeur fonci\xE8re d'un bien."
      },
      {
        title: "Puis-je utiliser ce service pour plusieurs biens immobiliers ?",
        answer: "Oui, vous pouvez utiliser Supernotaire pour estimer la valeur fonci\xE8re de plusieurs biens immobiliers. Il vous suffit de remplir un nouveau formulaire pour chaque bien."
      },
      {
        title: "Combien de temps faut-il pour estimer la valeur fonci\xE8re d'un appartement ?",
        answer: "L'estimation de la valeur fonci\xE8re d'un appartement peut g\xE9n\xE9ralement \xEAtre compl\xE9t\xE9e en moins de 30 secondes, \xE0 condition que vous ayez les informations n\xE9cessaires \xE0 port\xE9e de main."
      },
      {
        title: "Combien de temps faut-il pour estimer la valeur fonci\xE8re d'une maison ?",
        answer: "L'estimation de la valeur fonci\xE8re d'une maison peut g\xE9n\xE9ralement \xEAtre compl\xE9t\xE9e en moins de 30 secondes, \xE0 condition que vous ayez les informations n\xE9cessaires \xE0 port\xE9e de main."
      },
      {
        title: "Quels types de biens puis-je \xE9valuer avec ce service ?",
        answer: "Vous pouvez utiliser Supernotaire pour estimer la valeur fonci\xE8re des appartements et maisons, avec ou sans terrain. En revanche, les immeubles, terrains nus et autres types de biens ne sont pas pris en charge."
      },
      {
        title: "Comment puis-je utiliser l'estimation de la valeur fonci\xE8re obtenue ?",
        answer: "L'estimation de la valeur fonci\xE8re peut \xEAtre utilis\xE9e comme r\xE9f\xE9rence lors de la fixation du prix de vente ou d'achat d'un bien immobilier. Cependant, il est recommand\xE9 de consulter un professionnel de l'immobilier pour une \xE9valuation plus compl\xE8te et pr\xE9cise."
      },
      {
        title: "Pourquoi ai-je besoin d'une estimation de valeur fonci\xE8re ?",
        answer: "L'estimation de valeur fonci\xE8re est essentielle pour d\xE9terminer le prix de vente ou d'achat d'un bien immobilier. Elle permet d'avoir une id\xE9e pr\xE9cise de la valeur du bien sur le march\xE9, ce qui est crucial pour prendre des d\xE9cisions \xE9clair\xE9es et permet \xE9galement au vendeur de justifier son prix et au notaire de s'assurer de la conformit\xE9 de la transaction."
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
      title: "Supernotaire | Calculateur de valeur fonci\xE8re",
      meta: [
        {
          name: "description",
          content: "Calculez la valeur fonci\xE8re de votre bien immobilier (appartement ou maison) en quelques secondes gr\xE2ce \xE0 notre calculateur en ligne gratuit."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_CalculateurValeurFonciere = __nuxt_component_1;
      const _component_FAQComponent = __nuxt_component_2;
      const _component_UIDidYouKnow = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_UIPrimaryButton = __nuxt_component_0$2;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="valeur-fonciere" class="valeur-fonciere" data-v-14f14e94${_scopeId}><div class="valeur-fonciere__headlines" data-v-14f14e94${_scopeId}><h1 class="valeur-fonciere__headlines__title titles" data-v-14f14e94${_scopeId}> Calculateur de valeur fonci\xE8re </h1><span class="valeur-fonciere__headlines__subtitle subtitles" data-v-14f14e94${_scopeId}>Remplissez le formulaire pour calculer la valeur fonci\xE8re de votre appartement ou maison. </span></div></div>`);
            _push2(ssrRenderComponent(_component_CalculateurValeurFonciere, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                id: "valeur-fonciere",
                class: "valeur-fonciere"
              }, [
                createVNode("div", { class: "valeur-fonciere__headlines" }, [
                  createVNode("h1", { class: "valeur-fonciere__headlines__title titles" }, " Calculateur de valeur fonci\xE8re "),
                  createVNode("span", { class: "valeur-fonciere__headlines__subtitle subtitles" }, "Remplissez le formulaire pour calculer la valeur fonci\xE8re de votre appartement ou maison. ")
                ])
              ]),
              createVNode(_component_CalculateurValeurFonciere)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="faq" data-v-14f14e94${_scopeId}><div class="faq__headlines" data-v-14f14e94${_scopeId}><h2 class="titles" data-v-14f14e94${_scopeId}> Questions fr\xE9quentes sur le calcul de valeur fonci\xE8re </h2><h3 class="subtitles" data-v-14f14e94${_scopeId}> Tarif, d\xE9lais, validit\xE9, informations \xE0 fournir, etc. </h3></div>`);
            _push2(ssrRenderComponent(_component_FAQComponent, { questions }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "faq" }, [
                createVNode("div", { class: "faq__headlines" }, [
                  createVNode("h2", { class: "titles" }, " Questions fr\xE9quentes sur le calcul de valeur fonci\xE8re "),
                  createVNode("h3", { class: "subtitles" }, " Tarif, d\xE9lais, validit\xE9, informations \xE0 fournir, etc. ")
                ]),
                createVNode(_component_FAQComponent, { questions })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIDidYouKnow, { title: "Servez-vous, c'est gratuit !" }, {
              text: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Depuis quelques ann\xE9es, les bases de donn\xE9es de l&#39;administration fiscale relatives aux transactions immobili\xE8res sont en acc\xE8s libre sur internet. Les donn\xE9es sont issues des actes notari\xE9s et des informations cadastrales. Nous les utilisons pour vous fournir une estimation fiable de la valeur fonci\xE8re des biens. `);
                } else {
                  return [
                    createTextVNode(" Depuis quelques ann\xE9es, les bases de donn\xE9es de l'administration fiscale relatives aux transactions immobili\xE8res sont en acc\xE8s libre sur internet. Les donn\xE9es sont issues des actes notari\xE9s et des informations cadastrales. Nous les utilisons pour vous fournir une estimation fiable de la valeur fonci\xE8re des biens. ")
                  ];
                }
              }),
              cta: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/outils/valeur-fonciere#valeur-fonciere",
                    "aria-label": "Estimer un bien immobilier"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Estimer un bien immobilier`);
                            } else {
                              return [
                                createTextVNode("Estimer un bien immobilier")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                            default: withCtx(() => [
                              createTextVNode("Estimer un bien immobilier")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      to: "/outils/valeur-fonciere#valeur-fonciere",
                      "aria-label": "Estimer un bien immobilier"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx(() => [
                            createTextVNode("Estimer un bien immobilier")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIDidYouKnow, { title: "Servez-vous, c'est gratuit !" }, {
                text: withCtx(() => [
                  createTextVNode(" Depuis quelques ann\xE9es, les bases de donn\xE9es de l'administration fiscale relatives aux transactions immobili\xE8res sont en acc\xE8s libre sur internet. Les donn\xE9es sont issues des actes notari\xE9s et des informations cadastrales. Nous les utilisons pour vous fournir une estimation fiable de la valeur fonci\xE8re des biens. ")
                ]),
                cta: withCtx(() => [
                  createVNode(_component_NuxtLink, {
                    to: "/outils/valeur-fonciere#valeur-fonciere",
                    "aria-label": "Estimer un bien immobilier"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                        default: withCtx(() => [
                          createTextVNode("Estimer un bien immobilier")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/outils/valeur-fonciere.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const valeurFonciere = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-14f14e94"]]);

export { valeurFonciere as default };
//# sourceMappingURL=valeur-fonciere-zF685O5c.mjs.map
