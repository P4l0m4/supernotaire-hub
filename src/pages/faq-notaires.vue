<script setup lang="ts">
const questions = [
  {
    title: "Comment fonctionne Supernotaire ?",
    answer:
      "Créez facilement votre compte, puis commencez à créer de nouveaux mandats de vente immobilière. Associez un vendeur et un acheteur à chaque mandat pour qu'ils fournissent facilement les documents et infos dont vous avez besoin. Tout se fait en ligne, et vous pouvez suivre l'avancement de chaque mandat en temps réel.",
  },
  {
    title:
      "L’outil centralise-t-il toutes les pièces nécessaires à la signature d’un compromis ou d’un acte authentique ?",
    answer:
      "Oui, Supernotaire centralise toutes les pièces nécessaires à la signature d’un compromis ou d’un acte authentique. Vous pouvez ainsi accéder facilement à tous les documents et informations dont vous avez besoin pour finaliser la vente en gagnant un maximum de temps.",
  },
  {
    title:
      "Les notifications et rappels peuvent-ils s’intégrer dans l’agenda ou messagerie professionnelle ?",
    answer:
      "Oui, Supernotaire permet d’intégrer les notifications et rappels dans votre agenda ou messagerie professionnelle. Vous pouvez ainsi rester informé des échéances importantes et des actions à réaliser pour chaque mandat.",
  },
  {
    title:
      "L’outil s’intègre-t-il avec les services tiers réservés aux notaires comme TéléActes?",
    answer:
      "Ce n'est pas encore le cas, mais les fonctionnalités de Supernotaire vous feront quand même gagner un temps précieux. Nous prévoyons d'ajouter des intégrations avec des services tiers dans une prochaine mise à jour.",
  },
  {
    title:
      "Quel est le délai de réponse du support technique en cas de problème ?",
    answer:
      "Nous nous engageons à répondre aux demandes de support technique dans un délai d'une heure. Le service client est humain, disponible et réactif.",
  },
  {
    title: "L’outil réduit-il le nombre d’allers-retours avec les clients ?",
    answer:
      "Oui, Supernotaire permet d'éliminer au maximum les allers-retours avec les clients et les agences immobilières. Les particuliers peuvent notamment constinuer eux-mêmes leur dossier en ligne tout en étant guidés, ce qui réduit considérablement le nombre d'échanges nécessaires.",
  },
  {
    title: "Peut-on importer/exporter facilement les données et documents ?",
    answer:
      "Oui, Supernotaire permet d'importer et d'exporter facilement tous les éléments liés aux mandats de vente immobilière. Vous pouvez facilement transmettre les éléments des dossiers à un collaborateur, un agent immobilier, une banque, etc. Ou les sauvegarder pour une utilisation ultérieure.",
  },
  {
    title:
      "Y a-t-il une formation initiale pour les collaborateurs de l’étude ?",
    answer:
      "Nous avons conçu Supernotaire pour qu'il soit intuitif et facile à prendre en main. Une formation initiale n'est donc, en général, pas nécessaire. Cependant, nous proposons des ressources d'aide et un support client pour accompagner les utilisateurs en cas de besoin.",
  },
  {
    title: "Le coût est-il justifiable au regard des gains de productivité ?",
    answer:
      "Oui. En automatisant de très nombreuses tâches répétitives et en simplifiant la gestion des mandats de vente immobilière, Supernotaire permet aux notaires de gérer plus de mandats sans augmenter leur charge de travail, ce qui se traduit par une augmentation significative de leur chiffre d'affaires.",
  },
  {
    title:
      "Y a-t-il des frais cachés (installation, mises à jour, maintenance) ?",
    answer:
      "Non, notre politique tarifaire est transparente. Il n'y a pas de frais cachés pour l'installation, les mises à jour ou la maintenance.",
  },
  {
    title: "Existe-t-il une version d’essai pour tester avant engagement ?",
    answer:
      "Oui, vous pouvez tester Supernotaire gratuitement et sans engagement. Vous pouvez également opter pour la version payante si vous souhaitez bénéficier de fonctionnalités supplémentaires, et vous pourrez interrompre votre abonnement à tout moment.",
  },
  {
    title:
      "Supernotaire est-il régulièrement mis à jour pour suivre les évolutions réglementaires ?",
    answer:
      "Oui, nous avons conscience de l'importance de la conformité réglementaire dans le secteur notarial. C'est pourquoi nous veillons à ce que la plateforme reste conforme aux lois et régulations françaises, afin de garantir une utilisation sécurisée et fiable pour les notaires.",
  },
  {
    title:
      "Peut-on ajouter facilement de nouveaux utilisateurs ou fonctionnalités à mesure que l’étude grandit ?",
    answer:
      "Oui, Supernotaire est conçu pour être évolutif. Nous développons régulièrement de nouvelles fonctionnalités et permettons d'ajouter facilement de nouveaux utilisateurs à mesure que votre étude grandit. Les mises-à-jour de l'outil se font sans aucune interruption de votre activité.",
  },
  {
    title: "Supernotaire est-il un outil fiable pour les notaires ?",
    answer:
      "Oui, Supernotaire est une plateforme fiable. Nous nous mettons régulièrement l'outil à jour et veillons à la sécurité des données qui transitent par la plateforme. De plus, nous travaillons en étroite collaboration avec des notaires pour garantir la fiabilité de l'outil.",
  },
  {
    title: "A quoi sert Supernotaire ?",
    answer:
      "Supernotaire est une plateforme qui permet aux notaires de finaliser rapidement les mandats de vente immobilière, ce qui leur permet de gérer plus de mandats sans augmenter leur charge de travail. ",
  },

  {
    title: "Quels types de mandats puis-je gérer ?",
    answer:
      "Vous pouvez gérer les mandats de vente immobilière, qu'il s'agisse de maisons ou d'appartements. En revanche, Supernotaire n'est pas conçu pour les ventes de terrains ou autres types de biens immobiliers pour le moment.",
  },

  {
    title: "A qui s'adresse Supernotaire ?",
    answer:
      "Supernotaire s'adresse à tous les notaires qui souhaitent simplifier et accélérer la finalisation des mandats de vente immobilière. La plateforme bénéficie également aux vendeurs et acheteurs de biens immobiliers.",
  },
  {
    title: "Combien coûte Supernotaire ?",
    answer:
      "Les notaires peuvents commencer à utiliser gratuitement les fonctionnalités de base la plateforme. Des fonctionnalités avancées sont également disponibles pour les utilisateurs Premium (mise en avant sur l'anuaire, collaboration avec les clercs, dossiers illimités, etc).",
  },
  {
    title:
      "Supernotaire permet-t'il une digitalisation complète des dossiers de formalités immobilières ?",
    answer:
      "Oui, absolument tous les documents et informations nécessaires à la constitution des dossiers sont centralisés en ligne, et accessibles à tout moment via un coffre-fort numérique sécurisé.",
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
        <h1 class="titles">Notaires | Questions fréquentes</h1>
        <h2 class="paragraphs">
          Réponses aux questions des notaires sur Supernotaire
        </h2>
      </div>

      <FAQComponent :questions />
    </div>
  </Container>
</template>
