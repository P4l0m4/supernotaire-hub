<script setup lang="ts">
const questions = [
  {
    title: "Comment fonctionne Supernotaire ?",
    answer:
      "Inscrivez vous et commencez à créer votre dossier et attribuez-le rapidement à un notaire. Vous êtes guidé à chaque étape pour fournir les documents et informations nécessaires et nous automatisons au maximum la collecte d'informations pour vous faire gagner du temps. Tout se fait en ligne, et vous pouvez suivre l'avancement de votre dossier en temps réel.",
  },
  {
    title: "Supernotaire est-il fiable ?",
    answer:
      "Oui, Supernotaire est une plateforme fiable. Nous nous mettons régulièrement l'outil à jour et veillons à la sécurité des données qui transitent par la plateforme. De plus, nous travaillons en étroite collaboration avec des notaires pour garantir la fiabilité de l'outil.",
  },
  {
    title: "A quoi sert Supernotaire ?",
    answer:
      "Supernotaire est une plateforme qui permet aux vendeurs et aux acheteurs de biens de finaliser rapidement une vente immobilière. Ils peuvent confier rapidement leur dossier à un notaire via l'annuaire et gagnent énormément de temps sur le processus de collecte d'informations et de signature.",
  },

  {
    title: "Quels types de ventes de biens puis-je accélérer ?",
    answer:
      "Vous pouvez accélérer la finalisation de vente immobilière de maisons et d'appartements. En revanche, Supernotaire n'est pas conçu pour les ventes de terrains ou autres types de biens immobiliers.",
  },

  {
    title: "A qui s'adresse Supernotaire ?",
    answer:
      "Supernotaire s'adresse aux particuliers et professionnels qui souhaitent simplifier et accélérer la finalisation d'une vente immobilière. La plateforme bénéficie également aux notaires gérant des mandats de vente immobilière.",
  },
  {
    title: "Combien coûte Supernotaire ?",
    answer:
      "Supernotaire est totalement gratuit pour les vendeurs et acheteurs de biens, qu'ils soient particuliers ou professionnels. ",
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
        <h1 class="titles">Vendeurs & acheteurs de biens | FAQ</h1>
        <h2 class="paragraphs">
          Réponses aux questions des vendeurs et acheteurs de biens immobiliers
          sur Supernotaire.fr
        </h2>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
</template>
