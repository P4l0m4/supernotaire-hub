<script setup lang="ts">
import bannerImage from "@/assets/images/accompagnement-vente-immo-mobile.webp";

const questions = [
  {
    title: "Comment fonctionne EasyCase ?",
    answer:
      "Inscrivez vous et commencez à créer votre dossier et attribuez-le rapidement à un notaire. Vous êtes guidé à chaque étape pour fournir les documents et informations nécessaires et nous automatisons au maximum la collecte d'informations pour vous faire gagner du temps. Tout se fait en ligne, et vous pouvez suivre l'avancement de votre dossier en temps réel. La plateforme n'est pas encore ouverte au public, mais vous pouvez déjà bénéficier de certaines de ses fonctionnalités via la boîte à outils à disposition sur le site. Nous vous invitons à essayer gratuitement le générateur de Pré-état daté, ou encore l'outil de préparation de dossier qui vous feront gagner des semaines sur la vente de votre bien.",
  },
  {
    title: "EasyCase est-il fiable ?",
    answer:
      "Oui. EasyCase est une entreprise française gérée localement. Nous nous mettons régulièrement nos outils à jour et veillons à la sécurité des données qui transitent par la plateforme. De plus, nous travaillons en étroite collaboration avec des notaires français pour garantir la fiabilité de l'outil.",
  },
  {
    title: "Est-ce que ça remplace le notaire ?",
    answer:
      "Le notaire reste indispensable pour vérifier le dossier et réaliser le compromis et l’acte de vente. EasyCase vous permet de préparer facilement tous les documents nécessaires à votre dossier, en toute autonomie. La plateforme facilite également la collaboration avec le notaire, de façon à éviter les retards et gagner du temps sur la vente de votre bien. ",
  },
  {
    title: "A quoi sert EasyCase ?",
    answer:
      "EasyCase est une plateforme qui permet aux vendeurs et aux acheteurs de biens de finaliser plus rapidement une vente immobilière, en évitant les retards et les allers-retours inutiles. Les vendeurs de biens peuvent confier rapidement leur dossier à un notaire via l'annuaire et gagnent plusieurs semaines sur la constitution de leur dossier.",
  },

  {
    title: "A qui s'adresse EasyCase ?",
    answer:
      "EasyCase s'adresse aux particuliers et professionnels qui souhaitent simplifier et fluidifier la finalisation d'une vente immobilière. La plateforme bénéficie également aux notaires gérant des mandats de vente immobilière.",
  },
   {
    title: "EasyCase gère-t-il seulement les ventes immobilières simples ?",
    answer:
      "Non. EasyCase gère également de nombreux cas juridiques complexes. Le questionnaire peut adapter la liste de documents et les informations demandées pour des situations telles que : indivision, succession ou héritage, démembrement (usufruit / nue-propriété), SCI, servitudes, vente sous curatelle ou tutelle, vente par mandataire, biens loués ou occupés, et d'autres cas qui nécessitent une analyse juridique poussée. L’outil génère alors une checklist de pièces et d’informations adaptée à la situation juridique déclarée.",
  },
  {
    title: "Combien coûte EasyCase ?",
    answer:
      "EasyCase est totalement gratuit pour les vendeurs et acheteurs de biens, qu'ils soient particuliers ou professionnels. ",
  }, 
  {
    title: "Quels documents EasyCase peut-il aider à préparer ou identifier ?",
    answer:
      "Selon la situation, EasyCase peut demander ou générer des éléments tels que : titre de propriété, diagnostics immobiliers, documents de copropriété, informations cadastrales, documents liés à une succession, statuts de SCI, informations sur les servitudes, bail et informations locatives, etc. Ces éléments sont ensuite transmis au notaire pour la préparation du compromis et de l’acte de vente.",
  }
];

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
  <Container
    ><ImageBanner
      title="Besoin de vendre rapidement ?"
      subtitle="Évitez les retards, les erreurs, et les allers retours qui font trainer la vente."
      link-path="/outils/checklist-dossier-vente-notaire"
      link-label="Je prépare mon dossier en quelques clics"
      :image-path="bannerImage"
      :perks="[
        {
          title: 'Rapide et facile à utiliser',
          icon: 'sparkle',
        },
        {
          title: 'Dossier complet et organisé',
          icon: 'list_checks',
        },
        {
          title: 'Gain de temps immédiat',
          icon: 'clock_countdown',
        },
      ]"
  /></Container>
</template>
