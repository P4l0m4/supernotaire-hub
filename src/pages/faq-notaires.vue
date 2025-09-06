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
        <h1 class="titles">Notaires | FAQ</h1>
        <h2 class="paragraphs">
          Réponses aux questions des notaires sur Supernotaire.fr
        </h2>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
</template>
