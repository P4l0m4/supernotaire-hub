<script setup lang="ts">
const questions = [
  {
    title: "Comment fonctionne EasyCase ?",
    answer:
      "Inscrivez vous et commencez à créer votre dossier et attribuez-le rapidement à un notaire. Vous êtes guidé à chaque étape pour fournir les documents et informations nécessaires et nous automatisons au maximum la collecte d'informations pour vous faire gagner du temps. Tout se fait en ligne, et vous pouvez suivre l'avancement de votre dossier en temps réel.",
  },
  {
    title: "EasyCase est-il fiable ?",
    answer:
      "Oui, EasyCase est une plateforme fiable. Nous nous mettons régulièrement l'outil à jour et veillons à la sécurité des données qui transitent par la plateforme. De plus, nous travaillons en étroite collaboration avec des notaires pour garantir la fiabilité de l'outil.",
  },
  {
    title: "A quoi sert EasyCase ?",
    answer:
      "EasyCase est une plateforme qui permet aux vendeurs et aux acheteurs de biens de finaliser rapidement une vente immobilière. Ils peuvent confier rapidement leur dossier à un notaire via l'annuaire et gagnent énormément de temps sur le processus de collecte d'informations et de signature.",
  },

  {
    title: "Quels types de ventes de biens puis-je accélérer ?",
    answer:
      "Vous pouvez accélérer la finalisation de vente immobilière de maisons et d'appartements. En revanche, EasyCase n'est pas conçu pour les ventes de terrains ou autres types de biens immobiliers.",
  },

  {
    title: "A qui s'adresse EasyCase ?",
    answer:
      "EasyCase s'adresse aux particuliers et professionnels qui souhaitent simplifier et accélérer la finalisation d'une vente immobilière. La plateforme bénéficie également aux notaires gérant des mandats de vente immobilière.",
  },
  {
    title: "Combien coûte EasyCase ?",
    answer:
      "EasyCase est totalement gratuit pour les vendeurs et acheteurs de biens, qu'ils soient particuliers ou professionnels. ",
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
  title: "EasyCase | Questions fréquentes des vendeurs de biens",
  meta: [
    {
      name: "description",
      content:
        "Retrouvez les réponses aux questions les plus fréquentes des vendeurs de biens et acheteurs de biens sur EasyCase.",
    },
  ],
});
</script>
<template>
  <Container>
    <div class="faq">
      <div class="faq__headlines">
        <h1 class="titles">
          Vendeurs & acheteurs de biens | Questions fréquentes
        </h1>
        <h2 class="paragraphs">
          Réponses aux questions des vendeurs et acheteurs de biens immobiliers
          sur EasyCase
        </h2>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
</template>
