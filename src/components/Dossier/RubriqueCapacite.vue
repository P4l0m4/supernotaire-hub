<script setup lang="ts">
import { onMounted, ref } from "vue";
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import capaciteFormDefinition from "@/utils/formDefinition/checklist-capacite-representation.json";
import { buildDocDefinition as buildCapaciteDocDefinition } from "@/utils/docDefinitions/checklist-capacite-representation";

const prefillEntries = ref<Array<{ path: string; value: unknown }>>([]);

onMounted(() => {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem("sn-checklist-fiscale");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const typeProprietaire = parsed?.situation_fiscale?.type_proprietaire;
    if (typeProprietaire) {
      prefillEntries.value = [
        { path: "statut_partie", value: typeProprietaire },
      ];
    }
    const typeEntite = parsed?.situation_fiscale?.type_entite;
    if (typeEntite) {
      prefillEntries.value = [
        ...prefillEntries.value,
        { path: "type_entite_personne_morale", value: typeEntite },
      ];
    }
  } catch {
    // ignore hydration errors
  }
});
</script>

<template>
  <RubriqueBase
    sectionId="capacite"
    title="Capacité & Représentation"
    storageKey="sn-checklist-capacite"
    pdfPrefix="capacite-representation"
    :formDefinition="capaciteFormDefinition"
    :docBuilder="buildCapaciteDocDefinition"
    :prefillEntries="prefillEntries"
    :requireAccess="true"
  />
</template>
