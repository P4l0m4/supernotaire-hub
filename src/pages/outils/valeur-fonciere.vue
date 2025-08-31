<script setup lang="ts">
const questions = [
  {
    title: "Combient coûte le service de calcul de valeur foncière ?",
    answer:
      "Vous pouvez utiliser Supernotaire.fr pour estimer gratuitement la valeur foncière de votre bien immobilier.",
  },
  {
    title: "L'estimation de la valeur foncière est-elle fiable ?",
    answer:
      "Oui, l'estimation de la valeur foncière sur Supernotaire est basée sur les données DVF fournies par le gouvernement français et des algorithmes de calcul précis tenant compte de nombreux facteurs et de leur impact réel sur le prix d'un bien. ",
  },
  {
    title: "Le service de calcul de valeur foncière est-il sécurisé ?",
    answer:
      "Nous prenons la sécurité de vos données très au sérieux, c'est pourquoi aucune des informations et que vous fournissez ne sont stockés ni partagés à des tiers. Les données renseignées ne sont pas conservées après le traitement",
  },
  {
    title: "À qui s'adresse ce service de calcul de valeur foncière ?",
    answer:
      "Ce service est destiné aux vendeurs et acheteurs de biens, notaires, syndics de copropriété, et autres professionnels de l'immobilier qui ont besoin de calculer et estimer rapidement la valeur foncière d'un bien.",
  },
  {
    title: "Puis-je utiliser ce service pour plusieurs biens immobiliers ?",
    answer:
      "Oui, vous pouvez utiliser Supernotaire pour estimer la valeur foncière de plusieurs biens immobiliers. Il vous suffit de remplir un nouveau formulaire pour chaque bien.",
  },
  {
    title:
      "Combien de temps faut-il pour estimer la valeur foncière d'un appartement ?",
    answer:
      "L'estimation de la valeur foncière d'un appartement peut généralement être complétée en moins de 30 secondes, à condition que vous ayez les informations nécessaires à portée de main.",
  },
  {
    title:
      "Combien de temps faut-il pour estimer la valeur foncière d'une maison ?",
    answer:
      "L'estimation de la valeur foncière d'une maison peut généralement être complétée en moins de 30 secondes, à condition que vous ayez les informations nécessaires à portée de main.",
  },
  {
    title: "Quels types de biens puis-je évaluer avec ce service ?",
    answer:
      "Vous pouvez utiliser Supernotaire pour estimer la valeur foncière des appartements et maisons, avec ou sans terrain. En revanche, les immeubles, terrains nus et autres types de biens ne sont pas pris en charge.",
  },
  {
    title:
      "Comment puis-je utiliser l'estimation de la valeur foncière obtenue ?",
    answer:
      "L'estimation de la valeur foncière peut être utilisée comme référence lors de la fixation du prix de vente ou d'achat d'un bien immobilier. Cependant, il est recommandé de consulter un professionnel de l'immobilier pour une évaluation plus complète et précise.",
  },
  {
    title: "Pourquoi ai-je besoin d'une estimation de valeur foncière ?",
    answer:
      "L'estimation de valeur foncière est essentielle pour déterminer le prix de vente ou d'achat d'un bien immobilier. Elle permet d'avoir une idée précise de la valeur du bien sur le marché, ce qui est crucial pour prendre des décisions éclairées et permet également au vendeur de justifier son prix et au notaire de s'assurer de la conformité de la transaction.",
  },
];

const jsonLDFAQ = questions.map((question) => {
  return {
    "@type": "Question" as const,
    name: question.title,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: question.answer,
    },
  };
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage" as const,
  mainEntity: jsonLDFAQ,
}));

useHead({
  title: "Supernotaire | Calculateur de valeur foncière",
  meta: [
    {
      name: "description",
      content:
        "Calculez la valeur foncière de votre bien immobilier (appartement ou maison) en quelques secondes grâce à notre calculateur en ligne gratuit.",
    },
  ],
});
</script>
<template>
  <Container>
    <div id="valeur-fonciere" class="valeur-fonciere">
      <div class="valeur-fonciere__headlines">
        <h1 class="valeur-fonciere__headlines__title titles">
          Calculateur de valeur foncière
        </h1>
        <span class="valeur-fonciere__headlines__subtitle subtitles"
          >Remplissez le formulaire pour calculer la valeur foncière de votre
          appartement ou maison.
        </span>
      </div>
    </div>
    <CalculateurValeurFonciere />
  </Container>
  <Container>
    <div class="faq">
      <div class="faq__headlines">
        <h2 class="titles">
          Questions fréquentes sur le calcul de valeur foncière
        </h2>
        <h3 class="subtitles">
          Tarif, délais, validité, informations à fournir, etc.
        </h3>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
  <Container>
    <UIDidYouKnow title="Servez-vous, c'est gratuit !">
      <template #text>
        Depuis quelques années, les bases de données de l'administration fiscale
        relatives aux transactions immobilières sont en accès libre sur
        internet. Les données sont issues des actes notariés et des informations
        cadastrales. Nous les utilisons pour vous fournir une estimation fiable
        de la valeur foncière des biens.
      </template>
      <template #cta>
        <NuxtLink
          to="/outils/valeur-fonciere#valeur-fonciere"
          aria-label="Estimer un bien immobilier"
        >
          <UIPrimaryButton variant="accent-color"
            >Estimer un bien immobilier</UIPrimaryButton
          >
        </NuxtLink>
      </template>
    </UIDidYouKnow></Container
  >
</template>
<style scoped lang="scss">
.valeur-fonciere {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    margin-top: 2rem;
    gap: 4rem;
    height: 100%;
    align-items: center;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      text-align: center;
      text-wrap: balance;
    }

    &__subtitle {
      text-align: center;
      text-wrap: balance;
    }
  }
}
</style>
