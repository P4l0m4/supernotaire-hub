<script setup lang="ts">
import { onMounted, ref } from "vue";
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import proFiscaleFormDefinition from "@/utils/formDefinition/checklist-situation-professionnelle-fiscale.json";
import { buildDocDefinition as buildProFiscaleDocDefinition } from "@/utils/docDefinitions/checklist-situation-professionnelle-fiscale";

const suggestions = ref<Array<{ key: string; value: unknown }>>([]);

onMounted(() => {
  if (!process.client) return;
  const readAddr = (storageKey: string, path: string) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return path.split(".").reduce((acc: any, k: string) => (acc ? acc[k] : undefined), parsed);
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
  const adresseIdentite = readAddr("sn-checklist-identite", "identite.adresse_actuelle");
  const chosen = isAdresse(adresseBien) ? adresseBien : isAdresse(adresseIdentite) ? adresseIdentite : null;
  if (chosen) {
    suggestions.value = [{ key: "suggestion_lieu_imposition", value: chosen }];
  }
});
</script>

<template>
  <RubriqueBase
    sectionId="pro-fiscale"
    title="Situation professionnelle & Fiscale"
    storageKey="sn-checklist-pro-fiscale"
    pdfPrefix="situation-professionnelle-fiscale"
    :formDefinition="proFiscaleFormDefinition"
    :docBuilder="buildProFiscaleDocDefinition"
    :suggestions="suggestions"
  />
</template>
