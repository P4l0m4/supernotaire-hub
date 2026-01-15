<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import diagnosticsTravauxInterieursFormDefinition from "@/utils/formDefinition/checklist-diagnostics-travaux-interieurs.json";
import { buildDocDefinition as buildDiagnosticsTravauxInterieursDocDefinition } from "@/utils/docDefinitions/checklist-diagnostics-travaux-interieurs";
</script>

<template>
  <RubriqueBase
    sectionId="diagnostics-travaux-interieurs"
    title="Diagnostics & Travaux intérieurs"
    storageKey="sn-checklist-diagnostics-travaux-interieurs"
    pdfPrefix="diagnostics-travaux-interieurs"
    :formDefinition="diagnosticsTravauxInterieursFormDefinition"
    :docBuilder="buildDiagnosticsTravauxInterieursDocDefinition"
  />
</template>
