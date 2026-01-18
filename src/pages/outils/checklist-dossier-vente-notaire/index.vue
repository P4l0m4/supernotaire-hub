<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { colors } from "@/utils/colors";
import { useExportAccess } from "@/composables/useExportAccess";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";
const route = useRoute();

const notifyVisible = ref(false);
const notifyMessage = ref<string | null>(null);
const notifyColor = ref(colors["error-color"]);

const { access: exportUnlocked, refresh: refreshAccess } = useExportAccess();

const breadcrumbs = ref([
  { name: "Accueil", url: "/" },
  { name: "Outils", url: "/outils" },
  {
    name: "Rubriques",
    url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
  },
]);

const LAST_SESSION_KEY = "sn_last_session_id";
const storeSessionId = (sessionId: string) => {
  if (process.client && sessionId) {
    sessionStorage.setItem(LAST_SESSION_KEY, sessionId);
  }
};
const getStoredSessionId = () => {
  if (!process.client) return undefined;
  return sessionStorage.getItem(LAST_SESSION_KEY) || undefined;
};

const showToast = (message: string, color: string) => {
  notifyMessage.value = message;
  notifyColor.value = color;
  notifyVisible.value = true;
};

const handlePaymentStatus = async () => {
  const payment =
    typeof route.query.payment === "string" ? route.query.payment : null;
  if (!payment) return;

  if (payment === "success") {
    let sessionId =
      typeof route.query.session_id === "string"
        ? route.query.session_id
        : undefined;
    console.info("[checklist] payment success, session from query:", sessionId);
    if (!sessionId) {
      sessionId = getStoredSessionId();
      console.info(
        "[checklist] payment success, session from storage:",
        sessionId,
      );
    }
    if (!sessionId) return;
    storeSessionId(sessionId);

    const wasUnlocked = exportUnlocked.value;
    const result = await refreshAccess(sessionId);
    const isUnlocked = exportUnlocked.value;

    if (isUnlocked) {
      showToast("Paiement validé, export débloqué.", colors["success-color"]);
    } else if (!wasUnlocked && !result) {
      showToast(
        "Impossible de valider le paiement. Réessayez ou contactez le support.",
        colors["error-color"],
      );
    }
  } else if (payment === "cancel") {
    showToast("Paiement annulé. Vous pouvez réessayer.", colors["error-color"]);
  }
};

onMounted(() => {
  handlePaymentStatus();
});

watch(
  () => route.query.session_id,
  async (sessionId) => {
    if (typeof sessionId !== "string" || !sessionId) return;
    console.info("[checklist] watch session_id:", sessionId);
    storeSessionId(sessionId);
    const wasUnlocked = exportUnlocked.value;
    const result = await refreshAccess(sessionId);
    if (exportUnlocked.value) {
      showToast("Paiement validé, export débloqué.", colors["success-color"]);
    } else if (!wasUnlocked && !result) {
      showToast(
        "Impossible de valider le paiement. Réessayez ou contactez le support.",
        colors["error-color"],
      );
    }
  },
);

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EasyCase | Checklist dossier de vente",
  description:
    "Créez une checklist personnalisée des informations et documents à fournir au notaire pour votre dossier de vente.",
  url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
}));

useHead({
  title: "Gagnez des semaines sur votre vente immobilière",
  meta: [
    {
      name: "description",
      content:
        "Répondez à quelques questions et trouvez en quelques minutes quelles informations et documents fournir à votre notaire en fonction de votre situation.",
    },
  ],
});

const questions = [
  {
    title:
      "Qu'est-ce que les rubriques premium ont de plus que les rubriques gratuites ?",
    answer:
      "Les rubriques premium abordent les aspects juridiques les plus complexes qui génèrent le plus d'erreurs et de retards dans les dossiers de vente immobilière.",
  },
  {
    title: "Combien coûte l'accès complet à l'outil ?",
    answer:
      "L'accès complet est disponible via un paiement unique de 10 euros qui débloque les 6 rubriques premium pour votre dossier. Pas d'abonnement, pas de frais cachés, pas de compte à créer. Vous payez une seule fois et générez votre PDF complet immédiatement.",
  },
  {
    title: "Puis-je remplir les rubriques premium avant d'acheter ?",
    answer:
      "Oui, vous pouvez remplir toutes les rubriques premium gratuitement. Le paiement n'est nécessaire qu'au moment de générer le PDF complet. Ainsi, vous voyez exactement ce que vous obtenez avant de payer.",
  },
  {
    title: "Mes données sont-elles sécurisées ?",
    answer:
      "Vos données sont stockées localement et anonymement dans votre navigateur. Elles ne quittent jamais votre ordinateur et ne sont sont jamais stockées sur nos serveurs. Vous avez le contrôle total de vos informations et pouvez les supprimer à tout moment en cliquant sur le bouton de suppression.",
  },
  {
    title:
      "A quoi sert cet outil et comment m'aide-t-il à constituer mon dossier de vente ?",
    answer:
      "Cet outil vous permet d'anticiper la constitution de votre dossier de vente, avant la rencontre avec votre notaire. Il s'adapte à vos réponses pour ne vous demander que les documents pertinents. Le PDF généré est organisé, prêt à être transmis à votre notaire, vous faisant gagner un temps précieux dans le processus de vente.",
  },
  {
    title:
      "En quoi cette checklist est-elle différente d'une liste fournie par mon notaire ?",
    answer:
      "Lors du premier rendez-vous, le notaire fournit souvent une liste générique limitée, un tronc commun de documents et informations à fournir. Par la suite, il vous demandera de nombreux autres documents spécifiques à votre situation, ce qui allonge considérablement la procédure. Notre outil s'adapte à votre situation spécifique, bien au delà du tronc commun, vous permettant de préparer un dossier complet et personnalisé avant ce rendez-vous. ",
  },
  {
    title: "Combien de temps vais-je gagner avec cet outil ?",
    answer:
      "Un dossier bien préparé réduit les délais de contractualisation de la vente de plusieurs semaines dans la plupart des cas.",
  },
  {
    title: "Le document généré est-il accepté par les notaires ?",
    answer:
      "Oui, le document généré suit le format standard des dossiers de vente immobilière en France. Il inclut toutes les sections requises avec des titres clairs et des listes de documents organisées, facilitant le travail de votre notaire. ",
  },
  {
    title: "Que se passe-t-il si je ne finalise pas une rubrique ?",
    answer:
      "Vos données sont automatiquement sauvegardées à chaque étape. Vous pourrez reprendre votre progression là où vous vous êtes arrêté, même après avoir fermé votre navigateur.",
  },
  {
    title:
      "Comment savoir si j'ai rempli correctement toutes les informations ?",
    answer:
      "Chaque rubrique inclut des indications et des exemples pour vous guider. Certaines questions renvoient également à des tutoriels très faciles pour que vous soyez sûr de fournir les bonnes informations et vous aider à trouver les documents à fournir à votre notaire.",
  },
  {
    title: "Comment restaurer mon achat ?",
    answer:
      "Si vous avez déjà effectué l'achat mais que l'accès complet n'est pas débloqué, assurez-vous d'utiliser le même navigateur et appareil que lors de l'achat initial. Suite à votre achat, vous avez reçu un email de confirmation contenant un code unique. Rendez-vous sur la page de paiement et entrez l'adresse mail utilisée lors de l'achat précédent ainsi que votre code unique pour restaurer votre accès complet.",
  },
  {
    title: "Puis-je utiliser l'outil pour plusieurs biens ?",
    answer:
      "Absolument. Vous pouvez modifier les informations renseignées à tout momment et générer le document récapitulatif autant de fois que nécessaire et pour autant de biens que vous le souhaitez.",
  },
  {
    title: "Quels biens immobiliers sont compatibles avec cet outil ?",
    answer:
      "Cet outil est conçu pour la vente de biens immobiliers résidentiels situés en France, tels que les maisons (avec ou sans terrain), et les appartements. Il couvre la plupart des situations rencontrées lors de la vente de ces types de biens.",
  },
  {
    title:
      "Je suis un représentant/mandataire immobilier, puis-je utiliser cet outil pour mes clients ?",
    answer:
      "Oui, mais il vous faudra veiller à bien remplir la rubrique 'Identité & État civil' avec vos informations, pas celles du vendeur que vous représentez, et à définir le contexte du mandat dans la rubrique 'Capacité & Représentation'.",
  },
];
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div id="checklist-dossier-vente-notaire" class="checklist-tool">
      <div class="checklist-tool__headlines">
        <h1 class="checklist-tool__headlines__title titles">
          Préparez votre dossier de vente immobilière
        </h1>
        <span class="checklist-tool__headlines__subtitle subtitles">
          Ne perdez plus de temps sur la vente, vous saurez exactement quels
          documents fournir à votre notaire en quelques minutes.
        </span>
      </div>

      <div class="checklist-tool__content">
        <DossierListeRubriques />
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
  <Container>
    <div class="faq">
      <div class="faq__headlines">
        <h2 class="titles">
          Questions fréquentes sur l'outil de préparation de dossier
        </h2>
        <h3 class="subtitles">
          Tarif, sécurité des données, validité, fonctionnement, etc.
        </h3>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
  <Container>
    <UIDidYouKnow
      title="Vous pouvez générer un pré-état daté en quelques clics"
    >
      <template #text>
        Besoin d'un pré-état daté pour la vente de votre bien en copropriété ?
        Notre outil vous permet de le générer gratuitement et facilement, avec
        toutes les informations nécessaires pour votre notaire.
      </template>
      <template #cta>
        <NuxtLink
          to="/outils/pre-etat-date"
          aria-label="Créer mon pré-état daté"
        >
          <UIPrimaryButton variant="accent-color"
            >Créer mon pré-état daté</UIPrimaryButton
          >
        </NuxtLink>
      </template>
    </UIDidYouKnow>
  </Container>
  <HotjarTracking />
</template>

<style scoped lang="scss">
.checklist-tool {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

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
