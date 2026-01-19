<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import chargesTaxesFormDefinition from "@/utils/formDefinition/checklist-charges-taxes.json";
import { buildDocDefinition as buildChargesTaxesDocDefinition } from "@/utils/docDefinitions/checklist-charges-taxes";
</script>

<template>
  <RubriqueBase
    sectionId="charges-taxes"
    title="Charges & Taxes"
    storageKey="sn-checklist-charges-taxes"
    pdfPrefix="charges-taxes"
    :formDefinition="chargesTaxesFormDefinition"
    :docBuilder="buildChargesTaxesDocDefinition"
    sharedTypeStorageKey="sn-shared-type-bien"
  />
</template>
