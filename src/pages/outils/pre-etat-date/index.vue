<script setup lang="ts">
const questions = [
  {
    title: "Combien coûte le service de génération de Pré-état daté ?",
    answer:
      "Vous pouvez utiliser easycase.fr pour créer un Pré-état daté gratuitement (pour le moment). Habituellement, un Pré-état daté coûte entre 150 et 300 euros lorsqu'il est réalisé par un professionnel.",
  },
  {
    title: "Le Pré-état daté généré est-il conforme aux exigences légales ?",
    answer:
      "Oui, le Pré-état daté généré sur EasyCase est conforme aux exigences légales en vigueur. Nous nous assurons que toutes les informations nécessaires sont incluses, mais il est toujours recommandé de faire vérifier le document par un professionnel avant de l'utiliser.",
  },
  {
    title: "Quels documents dois-je fournir pour générer un Pré-état daté ?",
    answer:
      "Le Carnet d’entretien de l’immeuble, le dernier procès-verbal d’assemblée générale, l’état des impayés, et d’autres documents listés dans le formulaire sont nécessaires pour générer un Pré-état daté complet et précis.",
  },
  {
    title:
      "Puis-je modifier les informations avant de générer le Pré-état daté ?",
    answer:
      "Oui, vous pouvez revenir en arrière à tout moment pour modifier les informations saisies dans le formulaire avant de générer le Pré-état daté. Assurez-vous que toutes les informations sont correctes et à jour avant de finaliser le document.",
  },
  {
    title: "Le service de création de Pré-état daté est-il sécurisé ?",
    answer:
      "Nous prenons la sécurité de vos données très au sérieux, c'est pourquoi aucune des informations et documents que vous fournissez ne sont stockés ni partagés à des tiers.",
  },
  {
    title: "Comment sont utilisés les documents que je télécharge ?",
    answer:
      "Les documents que vous téléchargez sont utilisés uniquement pour extraire les informations nécessaires pour vous guider lors de la création du Pré-état daté. Ils sont supprimés immédiatement après le traitement.",
  },
  {
    title: "À qui s'adresse ce service de génération de Pré-état daté ?",
    answer:
      "Ce service est destiné aux vendeurs de biens immobiliers, notaires, syndics de copropriété, et autres professionnels de l'immobilier qui ont besoin de générer rapidement et efficacement des Pré-états datés dans le cadre d'une vente immobilière.",
  },
  {
    title: "Puis-je utiliser ce service pour plusieurs biens immobiliers ?",
    answer:
      "Oui, vous pouvez utiliser EasyCase pour générer des Pré-états datés pour plusieurs biens immobiliers. Il vous suffit de remplir un nouveau formulaire pour chaque bien.",
  },
  {
    title: "Combien de temps faut-il pour générer un Pré-état daté ?",
    answer:
      "Le processus de génération du Pré-état daté est généralement rapide et peut être complété en quelques minutes, en fonction de la rapidité avec laquelle vous fournissez les informations et documents nécessaires. Nous avons optimisé le processus pour vous faire gagner du temps grâce à un système de suggestions intelligentes à partir des informations trouvées dans vos documents.",
  },
  {
    title: "Quels documents joindre au Pré-état daté ?",
    answer:
      "Une fois le Pré-état daté généré, vous devez y joindre plusieurs annexes au document : le dernier procès-verbal d’assemblée générale, l’état daté des impayés, le montant du fonds travaux, le carnet d’entretien de l’immeuble, le diagnostic technique global (DTG) s’il existe, le budget prévisionnel voté et les comptes des deux derniers exercices, l’état des procédures en cours contre la copropriété, la copie du règlement de copropriété et état descriptif de division à jour, ainsi que l’attestation d’assurance de l’immeuble.",
  },
  {
    title: "Pourquoi ai-je besoin d'un Pré-état daté ?",
    answer:
      "Le Pré-état daté est un document essentiel dans le cadre de la vente d'un bien en copropriété. Il informe l'acheteur et le notaire sur la situation financière et administrative de la copropriété, ce qui est crucial pour prendre une décision éclairée.",
  },
  {
    title: "Pourquoi utiliser EasyCase pour générer un Pré-état daté ?",
    answer:
      "EasyCase simplifie et accélère le processus de création du Pré-état daté grâce à son interface intuitive et ses fonctionnalités intelligentes. Vous gagnez du temps et réduisez les risques d'erreurs en utilisant notre service.",
  },
];

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const breadcrumbs = ref([
  { name: "Accueil", url: "/" },
  { name: "Outils", url: "/outils" },
  {
    name: "Rubriques",
    url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
  },
]);

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EasyCase | Générateur de Pré-état daté gratuit",
  description:
    "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
  url: `${baseUrl}/outils/pre-etat-date`,
}));

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Créateur de Pré-état daté immobilier gratuit",
  description:
    "Créer un Pré-état daté conforme à la réglementation pour la vente d'un bien en copropriété.",
  applicationCategory: "Tool",
  operatingSystem: "Web",
  url: `${baseUrl}/outils/pre-etat-date`,
}));

useHead({
  title: "EasyCase | Générateur de Pré-état daté gratuit",
  meta: [
    {
      name: "description",
      content:
        "Créez un Pré-état daté conforme à la réglementation en quelques minutes grâce à notre générateur gratuit en ligne.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "Générateur de Pré-état daté gratuit",
    },
    {
      property: "og:url",
      content: `${baseUrl}/outils/pre-etat-date`,
    },
    {
      property: "og:description",
      content:
        "Créez facilement un Pré-état daté conforme, prêt à être transmis à votre notaire.",
    },
  ],
});
</script>

<template>
  <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
  <Container>
    <div class="page-headlines">
      <h1 class="titles">Générateur de Pré-état daté gratuit</h1>
      <p class="subtitles">
        Remplissez chaque rubrique pour créer rapidement un Pré-état daté prêt à
        partager à votre notaire.
      </p>
    </div>

    <PreEtatDateListeRubriques />
  </Container>

  <Container>
    <div class="faq">
      <div class="faq__headlines">
        <h2 class="titles">Questions fréquentes sur le Pré-état daté</h2>
        <h3 class="subtitles">
          Tarif, délais, validité, documents à fournir, etc.
        </h3>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>

  <Container>
    <UIDidYouKnow title="Pas besoin du syndic, faites-le vous-même !">
      <template #text>
        Depuis le 1er janvier 2015, les syndics sont tenus de proposer aux
        copropriétaires un accès en ligne sécurisé aux documents dématérialisés
        relatifs à la gestion de l'immeuble. Vous pouvez ainsi obtenir les
        informations requises pour établir le pré-état daté sans passer par le
        syndic et le créer vous-même.
      </template>
      <template #cta>
        <NuxtLink
          to="/outils/pre-etat-date"
          aria-label="Créer mon pré-état daté"
        >
          <UIPrimaryButton variant="accent-color">
            Créer mon pré-état daté
          </UIPrimaryButton>
        </NuxtLink>
      </template>
    </UIDidYouKnow>
  </Container>
  <HotjarTracking />
</template>

<style scoped lang="scss">
.page-headlines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
  text-wrap: balance;

  @media (min-width: $laptop-screen) {
    margin-bottom: 1.5rem;
  }
}

.faq {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;

  @media (min-width: $laptop-screen) {
    grid-template-columns: 1fr;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-wrap: balance;
  }
}
</style>
