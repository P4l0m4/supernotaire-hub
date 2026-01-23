<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import sommesChargeAcquereurDefinition from "@/utils/formDefinition/pre-etat-date/sommes-charge-acquereur.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="financier_lot_sommes_a_la_charge_acquereur_post_vente"
    title="Sommes à la charge acquéreur"
    subtitle="Provisions non exigibles et fonds travaux."
    :form-definition="sommesChargeAcquereurDefinition as FormDefinition"
  />
</template>
