<script setup lang="ts">
import { computed } from "vue";

export type Status =
  | "not started"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

const props = defineProps<{
  status: Status;
  error?: string;
}>();

const statusText = computed(() => {
  switch (props.status) {
    case "not started":
      return "";
    case "pending":
      return "Récupération des données";
    case "processing":
      return "Traitement en cours";
    case "completed":
      return "Traitement terminé";
    case "failed":
      return `Échec du traitement: ${props.error ?? "Erreur inconnue"}`;
    default:
      return "Statut inconnu";
  }
});

const statusIcon = computed(() => {
  switch (props.status) {
    case "not started":
      return "";
    case "pending":
      return "circle_notch";
    case "processing":
      return "circle_notch";
    case "completed":
      return "check_circle";
    case "failed":
      return "error";
    default:
      return "";
  }
});

const statusIconColor = computed(() => {
  switch (props.status) {
    case "not started":
      return colors["text-color"];
    case "processing":
      return colors["accent-color"];
    case "completed":
      return colors["success-color"];
    case "failed":
      return colors["error-color"];
    default:
      return colors["purple-color"];
  }
});
</script>
<template>
  <span class="status-component" v-if="statusText?.length > 0">
    {{ statusText
    }}<UIIconComponent
      :icon="statusIcon"
      :color="statusIconColor"
      size="1rem"
    />
  </span>
</template>
<style lang="scss" scoped>
.status-component {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: $text-color;
}
</style>
