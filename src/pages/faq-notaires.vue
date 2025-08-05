<script setup lang="ts">
const questions = [
  {
    title: "Comment fonctionne Supernotaire ?",
    answer:
      "Créez facilement votre compte, puis commencez à créer de nouveaux mandats de vente immobilière. Associez un vendeur et un acheteur à chaque mandat pour qu'ils fournissent facilement les documents et infos dont vous avez besoin. Tout se fait en ligne, et vous pouvez suivre l'avancement de chaque mandat en temps réel.",
  },
  {
    title: "Supernotaire est-il fiable ?",
    answer:
      "Oui, Supernotaire est une plateforme fiable. Nous nous mettons régulièrement l'outil à jour et veillons à la sécurité des données qui transitent par la plateforme. De plus, nous travaillons en étroite collaboration avec des notaires pour garantir la fiabilité de l'outil.",
  },
  {
    title: "A quoi sert Supernotaire ?",
    answer:
      "Supernotaire est une plateforme qui permet aux notaires de finaliser rapidement les mandats de vente immobilière, ce qui leur permet de gérer plus de mandats sans augmenter leur charge de travail. ",
  },

  {
    title: "Quels types de mandats puis-je accélérer ?",
    answer:
      "Vous pouvez accélérer les mandats de vente immobilière, qu'il s'agisse de maisons ou d'appartements. En revanche, Supernotaire n'est pas conçu pour les ventes de terrains ou autres types de biens immobiliers.",
  },

  {
    title: "A qui s'adresse Supernotaire ?",
    answer:
      "Supernotaire s'adresse à tous les notaires qui souhaitent simplifier et accélérer la finalisation des mandats de vente immobilière. La plateforme bénéficie également aux vendeurs et acheteurs de biens immobiliers.",
  },
  {
    title: "Combien coûte Supernotaire ?",
    answer:
      "Supernotaire est gratuit pour les notaires et pour les vendeurs de biens. Une option payante de mise en avant sur l'anuaire est disponible, tout comme des sièges supplémentaires permettant à des collaborateurs d'intervenir sur les mandats.",
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
  title: "Supernotaire | Questions fréquentes des notaires",
  meta: [
    {
      name: "description",
      content:
        "Retrouvez les réponses aux questions les plus fréquentes des notaires sur Supernotaire.",
    },
  ],
});
</script>
<template>
  <Container>
    <div class="faq">
      <div class="faq__headlines">
        <h1 class="titles">Foire aux questions</h1>
        <h2 class="subtitles">On répond aux questions des notaires</h2>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.faq {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 1rem);
  gap: 2rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    justify-content: center;
    align-items: center;
    gap: 4rem;
    padding: 2rem 0;
    min-height: initial;
  }

  @media (min-width: $desktop-screen) {
    gap: 8rem;
    padding: 4rem 0;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;

    .titles,
    .subtitles {
      color: $text-color;
    }
  }
}
</style>
