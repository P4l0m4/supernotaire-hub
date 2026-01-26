<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

const reviews = [
  {
    score: 5,
    text: "J’ai utilisé EasyCase pour préparer mon dossier avant une vente immobilière et j’ai trouvé le service vraiment rassurant. Ça m’a permis d’avancer avec beaucoup plus de confiance dans mon projet et ça m'a fait gagner pas mal de temps sur la vente.",
    name: "Claire M.",
  },
  {
    score: 5,
    text: "ça change des syndics qui font payer cher pour un document qu'on peut faire soi-même.",
    name: "Blanche-Marie V.",
  },
  {
    score: 5,
    text: "Pré-état daté créé rapidement et validé par le notaire. Au-delà du gain de temps (et d'argent), c’est rassurant d’avoir une solution qui décode le jargon immobilier.",
    name: "Marie D.",
  },
  {
    score: 5,
    text: "Première vente immobilière, j'étais complètement perdu. EasyCase m'a guidé sur toutes les démarches, j'ai enfin compris ce que je devais faire pour que tout avance bien.",
    name: "Antoine P.",
  },
  {
    score: 5,
    text: "Le notaire m'a demandé un pré-état daté en urgence, mon Syndic me demandais 100 euros pour me le faire. J'ai pu le créer gratuitement en 10 minutes sur le site. Merci beaucoup !",
    name: "Renaud B.",
  },
  {
    score: 5,
    text: "Je viens de vendre un appartement à Orléans, j'étais complètement perdue niveau paperasse et EasyCase m’a vraiment aidé dans mes démarches",
    name: "Sophie L.",
  },
  {
    score: 5,
    text: "Très bonne expérience. Les tutos sont clairs et les tips transmis sont assez faciles à comprendre. Je recommande",
    name: "Julien R.",
  },
  {
    score: 5,
    text: "J’ai testé par curiosité, et heureusement que je l’ai fait. L'outil m'a permis d'anticiper des démarches importantes qui auraient sacrément retardé ma vente si je ne m'en étais pas occupé à temps. Honnêtement, si vous êtes en train de vendre un bien, utilisez-le avant de débarquer chez le notaire. Ça prend quelques minutes et ça peut vraiment vous sauver.",
    name: "Agathe V.",
  },
  {
    score: 5,
    text: "Très pratique pour créer les pré-états datés !",
    name: "Karine T.",
  },
  {
    score: 4,
    text: "",
    name: "Charlotte G.",
  },
  {
    score: 5,
    text: "J'ai préparé mon dossier en 5 min. Très pratique avec mon tel. Site efficace.",
    name: "Éric F.",
  },
  {
    score: 4,
    text: "",
    name: "Fanny M.",
  },
  {
    score: 5,
    text: "Site efficace, le bonheur autant pour les pros que pour les clients !!",
    name: "Maxime S.",
  },
  {
    score: 5,
    text: "Le service est top, le notaire a validé le pré-état daté sans problème.",
    name: "Cécile K.",
  },
  {
    score: 5,
    text: "Le notaire était très content de recevoir un dossier aussi complet et bien fait. Merci",
    name: "Laurent M.",
  },
  {
    score: 5,
    text: "Je m'en sert régulièrement pour mes dossiers de vente (achat-revente), c'est vraiment top !",
    name: "Christian J.",
  },
  {
    score: 5,
    text: "Rapide et efficace. je recommande.",
    name: "Isabelle V.",
  },
  {
    score: 5,
    text: "Mon dossier était prêt avant même que le notaire me le demande, très pratique.",
    name: "Nathalie P.",
  },
  {
    score: 4,
    text: "",
    name: "Alex C.",
  },
  {
    score: 5,
    text: "Service très utile, je recommande vivement !",
    name: "Pascal D.",
  },
  {
    score: 5,
    text: "Facile à utiliser et très complet, rien à redire.",
    name: "Saber L.",
  },
  {
    score: 5,
    text: "J'étais pas sure dutout sur les documents à fournir, mais j'ai suivi les instructions et au final mon dossier était complet.",
    name: "Nicolas R.",
  },

  {
    score: 4,
    text: "",
    name: "Bernard D.",
  },
];

const usersCount = 1250;

const averageScore = computed(() => {
  const total = reviews.reduce((sum, review) => sum + review.score, 0);
  return total / reviews.length;
});
</script>
<template>
  <div class="review-score">
    <span class="review-score__text"
      >+{{ usersCount }} utilisateurs satisfaits</span
    >
    <div class="review-score__stars">
      <UIIconComponent
        icon="star_four_fill"
        v-for="star in 5"
        :key="star"
        :color="colors['warning-color']"
      />
    </div>
    <span class="review-score__text">{{ averageScore.toFixed(1) }}/5</span>
  </div>
</template>
<style lang="scss" scoped>
.review-score {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: $text-color-faded;

  @media (min-width: $big-tablet-screen) {
    font-size: 1rem;
  }
}
</style>
