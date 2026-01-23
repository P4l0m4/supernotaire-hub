<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import justificatifsDefinition from "@/utils/formDefinition/pre-etat-date/justificatifs.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="documents"
    title="Justificatifs"
    subtitle="Déposez vos documents clés pour activer les suggestions."
    :form-definition="justificatifsDefinition as FormDefinition"
  />
</template>
