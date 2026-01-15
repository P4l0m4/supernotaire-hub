<script setup lang="ts">
import { onMounted, ref } from "vue";
import { colors } from "@/utils/colors";
import { useExportAccess } from "@/composables/useExportAccess";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://supernotaire.fr";
const route = useRoute();

const notifyVisible = ref(false);
const notifyMessage = ref<string | null>(null);
const notifyColor = ref(colors["error-color"]);

const { refresh: refreshAccess } = useExportAccess();

const breadcrumbs = ref([
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Outils",
    url: "/outils",
  },
  {
    name: "Checklists par rubrique",
    url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
  },
]);

const showToast = (message: string, color: string) => {
  notifyMessage.value = message;
  notifyColor.value = color;
  notifyVisible.value = true;
};

const handlePaymentStatus = async () => {
  const payment = typeof route.query.payment === "string" ? route.query.payment : null;
  if (!payment) return;

  if (payment === "success") {
    const sessionId =
      typeof route.query.session_id === "string" ? route.query.session_id : undefined;
    const isValid = await refreshAccess(sessionId);
    if (isValid) {
      showToast("Paiement validé, export débloqué.", colors["success-color"]);
    } else {
      showToast(
        "Impossible de valider le paiement. Réessayez ou contactez le support.",
        colors["error-color"]
      );
    }
  } else if (payment === "cancel") {
    showToast("Paiement annulé. Vous pouvez réessayer.", colors["error-color"]);
  }
};

onMounted(() => {
  handlePaymentStatus();
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Supernotaire | Checklist dossier de vente",
  description:
    "Créez une checklist personnalisée des informations et documents à fournir au notaire pour votre dossier de vente.",
  url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
}));

useHead({
  title: "Supernotaire | Checklist dossier de vente",
  meta: [
    {
      name: "description",
      content:
        "Créez une checklist personnalisée des informations et documents à fournir au notaire pour votre dossier de vente.",
    },
  ],
});
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div id="checklist-dossier-vente-notaire" class="checklist-tool">
      <div class="checklist-tool__headlines">
        <h1 class="checklist-tool__headlines__title titles">
          Constituez votre dossier de vente immobilière
        </h1>
        <span class="checklist-tool__headlines__subtitle subtitles">
          Générez une liste personnalisée des informations et documents à
          fournir à votre notaire pour la vente de votre bien.
        </span>
      </div>
      <div class="checklist-tool__content">
        <DossierListeRubriques />
        <DossierExportMenu />
      </div>
    </div>
    <UINotificationModal
      v-if="notifyVisible && notifyMessage"
      :progress-color="notifyColor"
      @close="notifyVisible = false"
    >
      <UIActionToast :color="notifyColor" icon="alert_circle" direction="row">
        {{ notifyMessage }}
      </UIActionToast>
    </UINotificationModal>
  </Container>
</template>

<style scoped lang="scss">
.checklist-tool {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    gap: 3rem;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: $desktop-screen) {
      flex-direction: row;
      max-height: calc(100vh - 17rem);
      overflow-y: hidden;
    }
  }
}
</style>
