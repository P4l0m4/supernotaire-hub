<script setup lang="ts">
import { onMounted, ref } from "vue";
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import fiscaleFormDefinition from "@/utils/formDefinition/checklist-situation-fiscale.json";
import { buildDocDefinition as buildFiscaleDocDefinition } from "@/utils/docDefinitions/checklist-situation-fiscale";

const suggestions = ref<Array<{ key: string; value: unknown }>>([]);
const prefillEntries = ref<Array<{ path: string; value: unknown }>>([]);

onMounted(() => {
  if (!process.client) return;
  const readAddr = (storageKey: string, path: string) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return path
        .split(".")
        .reduce((acc: any, k: string) => (acc ? acc[k] : undefined), parsed);
    } catch {
      return null;
    }
  };
  const readValue = (storageKey: string, path: string) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return path
        .split(".")
        .reduce((acc: any, k: string) => (acc ? acc[k] : undefined), parsed);
    } catch {
      return null;
    }
  };

  const isAdresse = (val: unknown) => {
    if (!val || typeof val !== "object") return false;
    const anyVal = val as any;
    return (
      Array.isArray(anyVal?.geometry?.coordinates) &&
      anyVal?.geometry?.coordinates.length >= 2 &&
      typeof anyVal?.properties?.label === "string"
    );
  };

  const adresseBien = readAddr("sn-checklist-prealables", "adresse_bien");
  const adresseIdentite = readAddr(
    "sn-checklist-identite",
    "identite.adresse_actuelle",
  );
  const chosen = isAdresse(adresseBien)
    ? adresseBien
    : isAdresse(adresseIdentite)
      ? adresseIdentite
      : null;
  if (chosen) {
    suggestions.value = [{ key: "suggestion_lieu_imposition", value: chosen }];
    prefillEntries.value = [
      { path: "situation_fiscale.lieu_imposition", value: chosen },
    ];
  }

  const statutPartie = readValue("sn-checklist-capacite", "statut_partie");
  if (statutPartie) {
    prefillEntries.value = [
      ...prefillEntries.value,
      {
        path: "situation_fiscale.type_proprietaire",
        value: statutPartie,
      },
    ];
  }

  const typeProprietaireOrigine = readValue(
    "sn-checklist-origine",
    "type_proprietaire",
  );
  if (typeProprietaireOrigine) {
    prefillEntries.value = [
      ...prefillEntries.value,
      {
        path: "situation_fiscale.type_proprietaire",
        value: typeProprietaireOrigine,
      },
    ];
  }

  const typeEntite = readValue(
    "sn-checklist-capacite",
    "type_entite_personne_morale",
  );
  if (typeEntite) {
    prefillEntries.value = [
      ...prefillEntries.value,
      {
        path: "situation_fiscale.type_entite",
        value: typeEntite,
      },
    ];
  }
});
</script>

<template>
  <RubriqueBase
    sectionId="fiscale"
    title="Situation Fiscale"
    storageKey="sn-checklist-fiscale"
    pdfPrefix="situation-fiscale"
    :formDefinition="fiscaleFormDefinition"
    :docBuilder="buildFiscaleDocDefinition"
    :suggestions="suggestions"
    :prefillEntries="prefillEntries"
  />
</template>
